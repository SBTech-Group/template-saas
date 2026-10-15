// ⚠️ Core do template. Não editar por produto.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/core/auth/AuthProvider'
import { ContaProvider } from '@/core/conta/ContaProvider'
import { Toaster } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ContaProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ContaProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
