// Gere os tipos reais com: supabase gen types typescript --project-id <id> > src/types/database.ts
// Até lá, este arquivo descreve só o core do template saas.
export interface Database {
  public: {
    Tables: {
      contas: {
        Row: { user_id: string; nome: string; plano: string | null; status: 'ativa' | 'suspensa' | 'cancelada'; hub_assinatura_id: string | null; created_at: string; updated_at: string }
        Insert: { user_id: string; nome: string; plano?: string | null; status?: 'ativa' | 'suspensa' | 'cancelada'; hub_assinatura_id?: string | null }
        Update: Partial<Database['public']['Tables']['contas']['Insert']>
      }
      conta_modulos: {
        Row: { user_id: string; module: string; active: boolean; expires_at: string | null }
        Insert: { user_id: string; module: string; active?: boolean; expires_at?: string | null }
        Update: Partial<Database['public']['Tables']['conta_modulos']['Insert']>
      }
    }
  }
}
