// 🏗️ Balde 2 (Esqueleto): estrutura igual, conteúdo varia por produto.
import { useSubscriptions } from '@/core/conta/useSubscriptions'
import type { MenuItem, ModuleDefinition } from '@/types/tenant'
import { modulosAtivos } from '@/lib/modules'

// ✏️ Importar módulos do produto aqui e adicionar ao array ALL_MODULES
// Exemplo: import { meuModulo } from '@/modules/meu-modulo'
const ALL_MODULES: ModuleDefinition[] = []

export function useAppMenu(): MenuItem[] {
  const { activeModules } = useSubscriptions()

  return modulosAtivos(ALL_MODULES, activeModules).flatMap((m) => m.menuItems)
}

export { ALL_MODULES }
