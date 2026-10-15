// ⚠️ Core do template. Não editar por produto.
// Após gerar tipos reais (supabase gen types typescript), importe Database e passe como generic:
// import type { Database } from '@/types/database'
// export const supabase = createClient<Database>(url, key)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[supabase] VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias. Verifique seu .env.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
