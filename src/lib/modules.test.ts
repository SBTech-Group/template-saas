import { describe, expect, it } from 'vitest'
import { modulosAtivos } from './modules'

const mod = (id: string) => ({ id, routes: [], menuItems: [{ label: id, path: `/${id}` }] })

describe('modulosAtivos', () => {
  it('mantém só os módulos contratados, na ordem do registro', () => {
    const todos = [mod('agenda'), mod('financeiro'), mod('relatorios')]
    expect(modulosAtivos(todos, ['relatorios', 'agenda']).map((m) => m.id)).toEqual(['agenda', 'relatorios'])
  })

  it('não mostra nada quando nenhum módulo está ativo', () => {
    expect(modulosAtivos([mod('agenda')], [])).toEqual([])
  })
})
