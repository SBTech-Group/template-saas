# {{PRODUTO_NOME}} — instruções para agentes

- Tipo: `{{MODALIDADE}}`
- Segue: SBAGENTS v{{SBAGENTS_VERSAO}} (padrões em `../SBAGENTS/standards/00-index.md`, somente leitura)
- Branches: `staging` (homologação, recebe os PRs) · `main` (produção, só recebe PR de `staging`). Agentes trabalham em `agente/<nome>/<assunto>`.
- Repo: `SBTech-Group/{{PRODUTO_SLUG}}`. Criado pelo Admin Hub a partir de `template-{{TEMPLATE}}`.

## O que este sistema faz

{{PRODUTO_DESCRICAO}}

Clientes entram de dois jeitos: pelo Admin Hub (venda, o Hub chama `tenant-provision`) ou pelo cadastro no próprio app (`/cadastro`, que cria a conta e avisa o Hub por `hub-register-account`).

## Como rodar e testar

```bash
cp .env.example .env    # preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm install
npm run dev
npm run typecheck && npm run build && npm test
deno test --allow-env --no-lock supabase/functions/_shared
```

Todo PR roda esses passos no CI (`.github/workflows/ci.yml`).

## Módulos

A lista que o Hub lê está em `supabase/functions/_shared/modules.ts`. Cada módulo do frontend fica em `src/modules/<chave>/index.ts` e é registrado em `src/app/menu.tsx`.

{{MODULOS_TABELA}}

## Integrações ativas

Cada uma segue o guia em `../SBAGENTS/integracoes/`.

{{INTEGRACOES}}

## Isolamento

Saas: um app compartilhado, cada cliente é uma conta (o usuário dono), endereço único.

- Toda tabela de domínio tem `user_id` e policy `user_id = auth.uid()` (MT-03).
- `contas` e `conta_modulos` são o core: a conta do usuário e os módulos ativos dela. Escrita só pela service role ou pelo superadmin.
- Superadmin da SB Tech: `app_metadata.is_system_admin`, função `is_system_admin()` (MT-05).

## Edge Functions

| Função | Quem chama | Autenticação |
|---|---|---|
| `tenant-provision` | Admin Hub (`"modelo": "saas"`) | Bearer `HUB_PROVISIONING_TOKEN` (`_shared/hub.ts > isHub`) |
| `tenant-modules` | Admin Hub | Bearer `HUB_PROVISIONING_TOKEN` |
| `conta-registrar` | O próprio app, no primeiro acesso de quem se cadastrou | JWT do usuário + `auth.getUser` |

Toda função nova que usa a service role autentica quem chama dentro da função (SEC-06).

## Secrets (só nomes)

| Nome | Onde |
|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Build no Coolify |
| `HUB_PROVISIONING_TOKEN` | Supabase do produto. Mesmo valor de `{{TOKEN_REF}}` no Supabase do Hub |
| `HUB_URL` (`https://zzhkigjadsfultoynmha.supabase.co/functions/v1`), `HUB_PRODUCT_SLUG` (`{{PRODUTO_SLUG}}`) | Supabase do produto |
| `APP_URL`, `SYSTEM_ADMIN_EMAIL` | Supabase do produto |

## Ambientes

Projeto no Coolify com dois environments: `homologação` (servidor Homologação, branch `staging`, `<slug>-hlg.sbtech-group.com`) e `produção` (servidor Produção, branch `main`, `<slug>.sbtech-group.com`). `VITE_SUPABASE_*` são manuais por ambiente e o deploy só roda depois delas. Detalhes em `../SBAGENTS/standards/arquitetura.md > Ambientes`. Erros de log e deploy falho chegam como cards em Tarefas do Hub (Sentinela).

Workflows: `ci.yml` (job `verify`), `branch-policy.yml` (sinaliza push direto e PR para `main` fora de `staging`/`hotfix/*`), `functions.yml` e `database.yml` (Edge Functions e migrations novas de `staging` no Supabase de HML; precisam do secret `SUPABASE_ACCESS_TOKEN` e da variável `SUPABASE_PROJECT_REF`). Banco e funções não mudam por fora desses workflows.

## Pontos sensíveis

| Área | Por que é sensível |
|---|---|
| `tenant-provision` | Idempotência; erro duplica conta ou perde módulos |
| `supabase/migrations/0001_core.sql` | Base do isolamento; correção é migration nova |

## Contratos externos

| Função | Consumidor |
|---|---|
| `tenant-provision`, `tenant-modules` | Admin Hub (`../SBAGENTS/integracoes/hub.md`) |
| Chamada a `hub-register-account` | Admin Hub |

## Desvios aceitos do padrão

Nenhum.

## Não tocar

- `.env*`, chaves e certificados
- Migrations já aplicadas
- `src/styles/sb-tech-base.css` (identidade da casa, FE-02)
- `.github/workflows/`
