// Core do template saas. A conta é do usuário logado (user_id = auth.uid()).
// Usuário que se cadastrou direto no app ainda não tem conta: a função
// conta-registrar cria a conta com os módulos padrão e avisa o Hub.
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/core/auth/useAuth'

interface Conta {
  user_id: string
  nome: string
  plano: string | null
  status: 'ativa' | 'suspensa' | 'cancelada'
}

interface ContaContextValue {
  conta: Conta | null
  activeModules: string[]
  loading: boolean
  error: string | null
}

const ContaContext = createContext<ContaContextValue | null>(null)

export function ContaProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [conta, setConta] = useState<Conta | null>(null)
  const [activeModules, setActiveModules] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let vivo = true
    async function carregar() {
      if (!user) {
        setConta(null); setActiveModules([]); setLoading(false)
        return
      }
      setLoading(true)
      let { data } = await supabase.from('contas').select('user_id, nome, plano, status').eq('user_id', user.id).maybeSingle()
      if (!data) {
        const { error: regErr } = await supabase.functions.invoke('conta-registrar', { body: {} })
        if (regErr) {
          if (vivo) { setError('Não foi possível preparar sua conta. Tente entrar de novo.'); setLoading(false) }
          return
        }
        ;({ data } = await supabase.from('contas').select('user_id, nome, plano, status').eq('user_id', user.id).maybeSingle())
      }
      const { data: mods } = await supabase.from('conta_modulos').select('module').eq('user_id', user.id).eq('active', true)
      if (!vivo) return
      setConta((data as Conta | null) ?? null)
      setActiveModules(((mods ?? []) as Array<{ module: string }>).map((m) => m.module))
      setError(null)
      setLoading(false)
    }
    carregar()
    return () => { vivo = false }
  }, [user])

  return (
    <ContaContext.Provider value={{ conta, activeModules, loading, error }}>
      {children}
    </ContaContext.Provider>
  )
}

export function useConta() {
  const ctx = useContext(ContaContext)
  if (!ctx) throw new Error('useConta deve ser usado dentro de ContaProvider')
  return ctx
}
