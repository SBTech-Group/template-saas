// POST /functions/v1/conta-registrar — chamada pelo próprio app quando o usuário logado ainda não tem conta
// (cadastro direto, sem passar pelo Hub). Cria a conta com os módulos padrão e avisa o Hub
// (hub-register-account, SBAGENTS integracoes/hub.md). Idempotente.
// Autenticação: JWT do usuário (verify_jwt = true) + auth.getUser dentro da função (SEC-06).
// Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (injetados), HUB_URL, HUB_PRODUCT_SLUG,
//          HUB_PROVISIONING_TOKEN, APP_URL. Sem os do Hub, a conta é criada e o aviso é pulado.
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { cors, json } from '../_shared/hub.ts'
import { MODULOS_PADRAO } from '../_shared/modules.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Método não permitido.' }, 405)

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  const { data: { user }, error } = await db.auth.getUser(token)
  if (error || !user) return json({ error: 'Não autenticado.' }, 401)

  const { data: existente } = await db.from('contas').select('user_id').eq('user_id', user.id).maybeSingle()
  if (existente) return json({ created: false })

  const nome = (user.user_metadata?.nome as string | undefined) ?? user.email ?? 'Conta'
  const { error: contaErr } = await db.from('contas').insert({ user_id: user.id, nome })
  if (contaErr && contaErr.code !== '23505') return json({ error: `contas: ${contaErr.message}` }, 500)
  if (MODULOS_PADRAO.length) {
    await db.from('conta_modulos').upsert(
      MODULOS_PADRAO.map((module) => ({ user_id: user.id, module, active: true })),
      { onConflict: 'user_id,module', ignoreDuplicates: true },
    )
  }

  // Aviso ao Hub: melhor esforço. Falha aqui não impede o uso do app.
  const hubUrl = Deno.env.get('HUB_URL'), slug = Deno.env.get('HUB_PRODUCT_SLUG'), hubToken = Deno.env.get('HUB_PROVISIONING_TOKEN')
  let hub: string = 'nao_configurado'
  if (hubUrl && slug && hubToken) {
    try {
      const res = await fetch(`${hubUrl.replace(/\/$/, '')}/hub-register-account`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${hubToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produto_slug: slug, nome, email: user.email, conta_ref: user.id,
          conta_url: Deno.env.get('APP_URL') ?? undefined,
        }),
        signal: AbortSignal.timeout(15000),
      })
      hub = res.ok ? 'registrado' : `erro_${res.status}`
    } catch {
      hub = 'falhou'
    }
  }
  return json({ created: true, hub })
})
