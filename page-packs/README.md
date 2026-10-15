# Page Packs

Cada pasta aqui é um pack auto-contido com páginas, migrations e/ou Edge Functions prontas para um caso de uso específico.

## Modelo: "copy, not install"

**Não importe diretamente de `page-packs/`.** Para usar um pack num produto:

1. Leia o `README.md` dentro da pasta do pack.
2. Copie a pasta do pack para dentro de `src/` (páginas) ou `supabase/` (migrations/functions) conforme indicado.
3. Siga o checklist de ativação do pack.
4. Remova a pasta copiada de `page-packs/` se não for mais necessária como referência.

## Packs disponíveis

| Pack | O que faz | Destinos |
|---|---|---|
| `auth/` | Acesso por link mágico. Login, cadastro, "esqueci a senha" e `/welcome` já vêm ativos em `src/pages/auth/` | `src/pages/auth/` |

## Adicionando um pack novo

Estrutura mínima:

```
page-packs/<nome>/
├── README.md        ← passos de ativação obrigatórios
├── pages/           ← componentes React (se houver)
├── migrations/      ← SQL (se houver schema novo)
└── functions/       ← Edge Functions Deno (se houver)
```
