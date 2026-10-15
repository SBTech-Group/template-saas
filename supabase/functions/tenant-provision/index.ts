// POST /functions/v1/tenant-provision — o Hub cria ou atualiza uma conta (modelo saas, SBAGENTS integracoes/hub.md).
// Idempotente pelo e-mail: chamar de novo sincroniza os módulos (mudança de plano).
// Autenticação: Bearer HUB_PROVISIONING_TOKEN. Publicada com verify_jwt = false.
// Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (injetados), HUB_PROVISIONING_TOKEN,
//          APP_URL (ex.: https://produto.sbtech-group.com), SYSTEM_ADMIN_EMAIL.
import { createClient, type SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { cors, invalidProvision, isHub, json } from '../_shared/hub.ts'

const APP_URL = (Deno.env.get('APP_URL') ?? '').replace(/\/$/, '')

async function findUserByEmail(db: SupabaseClient, email: string) {
  for (let page = 1; page < 50; page++) {
    const { data } = await db.auth.admin.listUsers({ page, perPage: 1000 })
    const users = data?.users ?? []
    const found = users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (found) return found
    if (users.length < 1000) return null
  }
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Método não permitido.' }, 405)
  if (!await isHub(req)) return json({ error: 'Não autorizado.' }, 401)

  const body = await req.json().catch(() => null) as Record<string, unknown> | null
  const invalid = invalidProvision(body)
  if (invalid) return json({ error: invalid }, 400)
  if (!APP_URL) return json({ error: 'Secret APP_URL não configurado.' }, 500)

  const email = body!.admin_email as string
  const nome = typeof body!.nome === 'string' ? body!.nome : email
  const plano = typeof body!.plano === 'string' ? body!.plano : null
  const modulos = body!.modulos as string[]

  try {
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // Convite: cria o usuário sem enviar e-mail; o Hub envia o link pelo Resend.
    const { data: link, error: linkErr } = await db.auth.admin.generateLink({
      type: 'invite', email, options: { redirectTo: `${APP_URL}/welcome` },
    })
    let user = !linkErr ? link?.user ?? null : null
    const invite_link = !linkErr ? link?.properties?.action_link ?? null : null
    if (!user) user = await findUserByEmail(db, email)
    if (!user) return json({ error: `Não foi possível criar o usuário ${email}` }, 500)

    const { data: existente } = await db.from('contas').select('user_id').eq('user_id', user.id).maybeSingle()
    const { error: contaErr } = await db.from('contas').upsert({
      user_id: user.id, nome, plano, status: 'ativa', hub_assinatura_id: body!.assinatura_id ?? null, updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    if (contaErr) return json({ error: `contas: ${contaErr.message}` }, 500)

    const { error: offErr } = await db.from('conta_modulos').update({ active: false }).eq('user_id', user.id)
    if (offErr) return json({ error: `conta_modulos: ${offErr.message}` }, 500)
    if (modulos.length) {
      const { error } = await db.from('conta_modulos').upsert(
        modulos.map((module) => ({ user_id: user!.id, module, active: true })),
        { onConflict: 'user_id,module' },
      )
      if (error) return json({ error: `conta_modulos: ${error.message}` }, 500)
    }

    return json({
      conta_ref: user.id,
      access_url: `${APP_URL}/login`,
      invite_link,
      status: existente ? 'already_provisioned' : 'provisioned',
    })
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
