// Sem dependência externa: o teste roda offline.
function assertEquals<T>(actual: T, expected: T) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`esperado ${JSON.stringify(expected)}, veio ${JSON.stringify(actual)}`)
}
import { equal, invalidProvision, isHub } from './hub.ts'

Deno.test('equal compara conteúdo', async () => {
  assertEquals(await equal('abc', 'abc'), true)
  assertEquals(await equal('abc', 'abd'), false)
  assertEquals(await equal('', 'x'), false)
})

Deno.test('isHub exige o token configurado', async () => {
  const req = (h?: string) => new Request('https://x', { headers: h ? { authorization: h } : {} })
  assertEquals(await isHub(req('Bearer segredo'), 'segredo'), true)
  assertEquals(await isHub(req('Bearer outro'), 'segredo'), false)
  assertEquals(await isHub(req(), 'segredo'), false)
  assertEquals(await isHub(req('Bearer '), ''), false)
})

Deno.test('invalidProvision exige modelo saas, e-mail e módulos', () => {
  assertEquals(invalidProvision({ modelo: 'saas', admin_email: 'a@b.com', modulos: ['crm'] }), null)
  assertEquals(invalidProvision({ admin_email: 'a@b.com', modulos: [] }) !== null, true)
  assertEquals(invalidProvision({ modelo: 'saas', modulos: [] }) !== null, true)
  assertEquals(invalidProvision({ modelo: 'saas', admin_email: 'a@b.com', modulos: 'crm' }) !== null, true)
  assertEquals(invalidProvision(null) !== null, true)
})
