// ⚠️ Core do template. Não editar por produto.

export interface TenantConfig {
  cor_primaria?: string
  logo_url?: string
  nome_exibido?: string
  font_sans?: string
  [key: string]: unknown
}

export interface Subscription {
  tenant_id: string
  module: string
  active: boolean
  expires_at: string | null
}

export interface TenantMember {
  tenant_id: string
  user_id: string
  role: 'admin' | 'member' | 'viewer'
}

export interface MenuItem {
  label: string
  path: string
  icon?: string
}

export interface ModuleDefinition {
  id: string
  routes: Array<{ path: string; element: React.ReactNode }>
  menuItems: MenuItem[]
}
