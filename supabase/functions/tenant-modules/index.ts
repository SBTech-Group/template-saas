// GET /functions/v1/tenant-modules — o Hub lê os módulos oferecidos (SBAGENTS integracoes/hub.md).
// Autenticação: Bearer HUB_PROVISIONING_TOKEN. Publicada com verify_jwt = false.
import { cors, isHub, json } from '../_shared/hub.ts'
import { MODULOS } from '../_shared/modules.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'GET') return json({ error: 'Método não permitido.' }, 405)
  if (!await isHub(req)) return json({ error: 'Não autorizado.' }, 401)
  return json(MODULOS)
})
