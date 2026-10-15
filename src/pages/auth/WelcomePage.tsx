// Rota pública /welcome: o link de convite do Hub e o de "esqueci a senha" chegam aqui
// com a sessão no endereço. A pessoa define a senha e entra.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/core/ui/card'
import { PRODUTO } from '@/config/produto'

export function WelcomePage() {
  const navigate = useNavigate()
  const [pronto, setPronto] = useState(false)
  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    // O supabase-js lê o token do endereço e abre a sessão sozinho.
    supabase.auth.getSession().then(({ data }) => setPronto(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setPronto(!!session))
    return () => sub.subscription.unsubscribe()
  }, [])

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (senha.length < 8) return toast.error('A senha precisa ter pelo menos 8 caracteres.')
    if (senha !== confirma) return toast.error('As senhas não conferem.')
    setSalvando(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    setSalvando(false)
    if (error) return toast.error('Não foi possível salvar a senha. Peça um novo link.')
    toast.success('Senha definida.')
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Bem-vindo ao {PRODUTO.nome}</CardTitle>
          <CardDescription>
            {pronto ? 'Defina sua senha para entrar.' : 'Abrindo seu convite… Se nada acontecer, o link pode ter expirado.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={salvar}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="senha">Nova senha</Label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="new-password" disabled={!pronto} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirma">Repita a senha</Label>
              <Input id="confirma" type="password" value={confirma} onChange={(e) => setConfirma(e.target.value)} autoComplete="new-password" disabled={!pronto} required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={!pronto || salvando}>
              {salvando ? 'Salvando…' : 'Salvar e entrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
