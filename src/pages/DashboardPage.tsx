// 🏗️ Balde 2 (Esqueleto): estrutura igual, conteúdo varia por produto.
import { PRODUTO } from '@/config/produto'

export function DashboardPage() {
  const tenantName = PRODUTO.nome

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Bem-vindo a {tenantName}</h1>
      <p className="text-muted-foreground text-sm max-w-lg">
        Este é o dashboard padrão do template. Substitua por conteúdo do produto.
      </p>
    </div>
  )
}
