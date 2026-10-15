// Módulos que este produto oferece. O Hub lê esta lista pela função tenant-modules
// ("Sincronizar do produto") e usa as chaves nos planos. Gerado pelo Hub no "Novo produto".
export interface Modulo {
  chave: string
  label: string
  descricao?: string
  dependencias?: string[]
}

export const MODULOS: Modulo[] = [
  { chave: 'admin', label: 'Painel Admin', descricao: 'Gestão do ambiente e dos usuários.' },
]

/** Módulos ativados para quem se cadastra direto no app, sem passar pelo Hub. */
export const MODULOS_PADRAO: string[] = ['admin']
