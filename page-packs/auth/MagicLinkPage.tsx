// ✏️ Balde 3 (Customizável): copiar para src/pages/ antes de usar.
// Ativar: ver page-packs/auth/README.md
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/core/ui/card'

export function MagicLinkPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })

    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Link enviado!</CardTitle>
            <CardDescription>
              Verifique seu email e clique no link para entrar. O link expira em 1 hora.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/login" className="text-sm text-primary underline underline-offset-4">
              Voltar ao login
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Acesso sem senha</CardTitle>
          <CardDescription>Enviaremos um link de acesso para seu email.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando…' : 'Enviar link de acesso'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Prefere usar senha?{' '}
              <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                Entrar com senha
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
