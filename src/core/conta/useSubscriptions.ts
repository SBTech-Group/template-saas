// Core do template saas. Mesma assinatura do template multi-tenant, para os módulos funcionarem igual.
import { useConta } from './ContaProvider'

export function useSubscriptions() {
  const { activeModules, loading } = useConta()
  return { activeModules, loading }
}
