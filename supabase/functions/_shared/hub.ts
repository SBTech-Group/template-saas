// Autenticação das chamadas do Admin Hub (SBAGENTS integracoes/hub.md).
// O Hub manda "Authorization: Bearer <HUB_PROVISIONING_TOKEN>".

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

/** Comparação em tempo constante (via SHA-256), para não vazar o token por tempo de resposta. */
export async function equal(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder()
  const [x, y] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ])
  const ax = new Uint8Array(x), ay = new Uint8Array(y)
  let diff = 0
  for (let i = 0; i < ax.length; i++) diff |= ax[i] ^ ay[i]
  return diff === 0
}

/** true quando o pedido traz o token do Hub. Sem token configurado, recusa sempre. */
export async function isHub(req: Request, expected = Deno.env.get('HUB_PROVISIONING_TOKEN') ?? ''): Promise<boolean> {
  const received = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  return !!expected && !!received && await equal(expected, received)
}

/** Valida o corpo de tenant-provision (modelo saas). Devolve a mensagem de erro ou null. */
export function invalidProvision(body: Record<string, unknown> | null): string | null {
  if (!body) return 'Corpo JSON inválido.'
  if (body.modelo !== 'saas') return 'Este produto é saas: o Hub deve enviar "modelo": "saas".'
  if (typeof body.admin_email !== 'string' || !body.admin_email.includes('@')) return 'admin_email obrigatório.'
  if (!Array.isArray(body.modulos) || body.modulos.some((m) => typeof m !== 'string')) return 'modulos deve ser uma lista de chaves.'
  return null
}
