-- Execute no SQL Editor do Supabase (supabase.com > seu projeto > SQL Editor).

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero bigint generated always as identity unique,
  criado_em timestamptz not null default now(),
  loja_slug text not null,
  cliente_nome text not null,
  cliente_telefone text not null,
  entrega jsonb not null,
  pagamento text not null check (pagamento in ('pix', 'dinheiro', 'cartao')),
  troco_para integer,
  itens jsonb not null,
  subtotal integer not null,
  taxa_entrega integer not null default 0,
  total integer not null,
  status text not null default 'novo'
    check (status in ('novo', 'preparando', 'saiu_para_entrega', 'entregue', 'cancelado'))
);

create index if not exists pedidos_loja_criado_em on public.pedidos (loja_slug, criado_em desc);

-- RLS ligado e sem políticas: só o servidor do app (chave service role) lê e grava.
-- Os dados dos clientes não ficam expostos pela chave pública.
alter table public.pedidos enable row level security;
