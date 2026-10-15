import type { ModuleDefinition } from '@/types/tenant'

/** Módulos que o tenant contratou, na ordem em que foram registrados. */
export function modulosAtivos(todos: ModuleDefinition[], ativos: string[]): ModuleDefinition[] {
  const set = new Set(ativos)
  return todos.filter((m) => set.has(m.id))
}
