# Pack: Auth

Páginas de autenticação prontas consumindo `supabase.auth`.

## Páginas incluídas

| Arquivo | Rota sugerida | O que faz |
|---|---|---|
| `LoginPage.tsx` | `/login` | Login email + senha, link para magic link |
| `SignupPage.tsx` | `/cadastro` | Cadastro email + senha |
| `ForgotPasswordPage.tsx` | `/esqueci-senha` | Envia email de redefinição de senha |
| `MagicLinkPage.tsx` | `/magic-link` | Login sem senha via OTP por email |

## Passos de ativação

1. Copie esta pasta inteira para `src/pages/auth/`:
   ```bash
   cp -r page-packs/auth/ src/pages/auth/
   ```

2. Registre as rotas no `src/app/router.tsx`:
   ```tsx
   import { LoginPage } from '@/pages/auth/LoginPage'
   import { SignupPage } from '@/pages/auth/SignupPage'
   import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
   import { MagicLinkPage } from '@/pages/auth/MagicLinkPage'

   // Dentro de <Routes>:
   <Route path="/login" element={<LoginPage />} />
   <Route path="/cadastro" element={<SignupPage />} />
   <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
   <Route path="/magic-link" element={<MagicLinkPage />} />
   ```

3. No Supabase Dashboard → Auth → URL Configuration:
   - Site URL: `https://seudominio.com.br`
   - Redirect URLs: `https://*.seudominio.com.br`

4. Remova o `LoginPagePlaceholder` do `router.tsx`.

## Dependências

Já presentes no template: `@supabase/supabase-js`, `sonner`, `react-router-dom`, componentes shadcn.
