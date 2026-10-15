-- Core do template saas (SBAGENTS standards/modalidades.md, MT-03, MT-05).
-- Não editar por produto: correções vão em migration nova.
-- Modalidade saas: um app compartilhado, cada cliente é uma conta (um usuário dono).
-- Toda tabela de domínio tem user_id e policy user_id = auth.uid() (MT-03).

create table public.contas (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  nome              text not null,
  plano             text,
  status            text not null default 'ativa' check (status in ('ativa', 'suspensa', 'cancelada')),
  hub_assinatura_id uuid,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Módulos ativos por conta. O Hub sincroniza pela tenant-provision; o cadastro direto recebe os módulos padrão.
create table public.conta_modulos (
  user_id    uuid not null references public.contas(user_id) on delete cascade,
  module     text not null,
  active     boolean not null default true,
  expires_at timestamptz,
  primary key (user_id, module)
);

create index idx_conta_modulos_user on public.conta_modulos(user_id);

-- Superadmin da SB Tech: só app_metadata.is_system_admin (MT-05).
create or replace function public.is_system_admin()
returns boolean language sql stable as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'is_system_admin')::boolean, false);
$$;

alter table public.contas        enable row level security;
alter table public.conta_modulos enable row level security;

-- A pessoa lê a própria conta e os próprios módulos. Escrita só pela service role
-- (tenant-provision, conta-registrar) ou pelo superadmin.
create policy "conta_propria" on public.contas
  for select using (user_id = auth.uid() or public.is_system_admin());
create policy "system_admin_all" on public.contas
  for all using (public.is_system_admin()) with check (public.is_system_admin());

create policy "conta_propria" on public.conta_modulos
  for select using (user_id = auth.uid() or public.is_system_admin());
create policy "system_admin_all" on public.conta_modulos
  for all using (public.is_system_admin()) with check (public.is_system_admin());
