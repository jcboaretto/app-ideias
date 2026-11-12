# CucoFood Identity — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand "Peça na Cidade" → CucoFood with a violet/white design system, a full B2B+B2C landing page at `/`, and all app components swapped from orange to violet.

**Architecture:** Introduce Next.js App Router route groups — `(marketing)` for the landing and `(app)` for the food-ordering app — so each segment gets its own layout (landing uses its own nav/footer; app keeps sticky header + BottomNav). Root layout becomes font-only. Eight new landing components live in `src/components/landing/`.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS 4 (`@import "tailwindcss"`), `@phosphor-icons/react` v2 (SSR via `/dist/ssr`), `next/font/google` (Plus Jakarta Sans + Inter), TypeScript 5.

**Spec:** `docs/superpowers/specs/2026-11-11-cucofood-identity-design.md`

## Global Constraints

- Tailwind 4 syntax: `@import "tailwindcss"` and `@theme inline {}` — no `tailwind.config.js`
- Custom tokens via CSS vars `--accent`, `--background`, `--surface`, `--border`, `--text-primary`, `--text-muted`, `--accent-hover`, `--accent-light`, `--price`, `--dark` — reference as `bg-[--accent]` in JSX
- Accent: `#7C3AED` (violet). Prices only: `#F59E0B` (amber). Everything else black/white/gray
- Fonts: Plus Jakarta Sans (`--font-jakarta`, `font-heading`) + Inter (`--font-inter`, `font-sans`) — Rubik/Nunito removed
- Phosphor icons SSR path: `@phosphor-icons/react/dist/ssr`
- No `any` in TypeScript; no `LayoutProps`/`PageProps` from generated types — use explicit types
- Brand name: **CucoFood** with violet dot: `Cuco<span class="text-[--accent]">•</span>Food`
- Text copy in Brazilian Portuguese as shown in the spec
- Zero changes to `src/data/lojas.ts`, `src/lib/`, `src/app/actions.ts`, `src/app/manifest.ts`

## Review Focus

- Mobile layout: every landing section must be readable and usable at 390 px wide; spec says mobile-first (base styles) with `md:` overrides
- Smooth scroll: `<html>` needs `scroll-behavior: smooth` and `#parceiros` anchor on ForRestaurants must be reachable from the Hero CTA
- BottomNav active state after route-group restructure: `href="/"` changes to `href="/lojas"`; `pathname === "/"` check changes to `pathname === "/lojas"` — missing this means wrong tab highlighted
- Duplicate-route guard: `src/app/page.tsx` must be deleted before `src/app/(marketing)/page.tsx` is created (or simultaneously), or Next.js throws "conflicting routes" at build time
- `prefers-reduced-motion`: any CSS animation added must be wrapped in `@media (prefers-reduced-motion: no-preference)` so it's off by default for motion-sensitive users

---

### Task 1: Design system — globals.css + root layout

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: CSS tokens `--accent`, `--background`, `--surface`, `--border`, `--text-primary`, `--text-muted`, `--accent-hover`, `--accent-light`, `--price`, `--dark`; Tailwind aliases `font-heading` (Plus Jakarta Sans) and `font-sans` (Inter)
- Produces: Root `RootLayout` that wraps `{children}` with font CSS vars injected on `<html>`, no app-level header/footer

---

- [ ] **Step 1: Replace globals.css**

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme inline {
  --font-sans:    var(--font-inter);
  --font-heading: var(--font-jakarta);
}

:root {
  --background:   #FFFFFF;
  --surface:      #F8F9FA;
  --border:       #E5E7EB;
  --text-primary: #0A0A0A;
  --text-muted:   #6B7280;
  --accent:       #7C3AED;
  --accent-hover: #6D28D9;
  --accent-light: #EDE9FE;
  --price:        #F59E0B;
  --dark:         #0A0A0A;
}

html {
  scroll-behavior: smooth;
}

.scrollbar-none {
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 2: Replace root layout.tsx**

This layout provides only fonts + html/body. All app chrome (header, BottomNav, CarrinhoProvider) moves to `(app)/layout.tsx` in Task 2.

```tsx
/* src/app/layout.tsx */
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CucoFood",
    template: "%s | CucoFood",
  },
  description: "Delivery dos restaurantes da sua cidade.",
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[--background] text-[--text-primary]">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

```
npx tsc --noEmit
```

Expected: no errors. The root layout no longer imports CarrinhoProvider, BotaoCarrinho, BottomNav.

- [ ] **Step 4: Commit**

```
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: design system — violet tokens + Plus Jakarta Sans/Inter"
```

---

### Task 2: Route groups + app layout + lojas page

**Files:**
- Create: `src/app/(app)/layout.tsx`
- Create: `src/app/(app)/lojas/page.tsx`
- Create: `src/app/(app)/carrinho/page.tsx`
- Create: `src/app/(app)/loja/[slug]/page.tsx`
- Create: `src/app/(app)/painel/page.tsx`
- Create: `src/app/(marketing)/page.tsx`
- Delete: `src/app/page.tsx`
- Delete: `src/app/carrinho/page.tsx` and `src/app/carrinho/` directory
- Delete: `src/app/loja/[slug]/page.tsx` and `src/app/loja/` directory
- Delete: `src/app/painel/page.tsx` and `src/app/painel/` directory

**Interfaces:**
- Consumes: CSS tokens from Task 1
- Produces: `/lojas` route with store-list page (dark hero strip, violet-accented cards); `/loja/[slug]`, `/carrinho`, `/painel` routes inside `(app)` group; `/` route with temporary placeholder; `(app)/layout.tsx` provides header + BottomNav

---

- [ ] **Step 1: Create `(app)/layout.tsx`**

```tsx
/* src/app/(app)/layout.tsx */
import Link from "next/link";
import { CarrinhoProvider } from "@/components/carrinho-provider";
import { BotaoCarrinho } from "@/components/botao-carrinho";
import { BottomNav } from "@/components/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CarrinhoProvider>
      <header className="sticky top-0 z-50 border-b border-[--border] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-screen-lg items-center justify-between px-4 py-3">
          <Link
            href="/lojas"
            className="font-heading text-lg font-bold text-[--text-primary]"
          >
            Cuco<span className="text-[--accent]">•</span>Food
          </Link>
          <BotaoCarrinho />
        </div>
      </header>

      <main className="mx-auto w-full max-w-screen-lg flex-1 px-4 py-6 pb-24 sm:pb-6">
        {children}
      </main>

      <BottomNav />
    </CarrinhoProvider>
  );
}
```

- [ ] **Step 2: Create `(app)/lojas/page.tsx`**

```tsx
/* src/app/(app)/lojas/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import { lojas } from "@/data/lojas";
import { formatarPreco } from "@/lib/pedido";

export const metadata: Metadata = { title: "Lojas" };

export default function Lojas() {
  return (
    <div className="space-y-6">
      {/* Hero strip */}
      <section className="-mx-4 bg-[--dark] px-4 py-8 text-white">
        <h1 className="font-heading text-2xl font-bold">
          O que você quer pedir hoje?
        </h1>
        <p className="mt-1 text-sm text-white/70">
          Escolha uma loja e monte seu pedido.
        </p>
      </section>

      {/* Grid de lojas */}
      <ul className="grid gap-4 sm:grid-cols-2">
        {lojas.map((loja) => (
          <li key={loja.slug}>
            <Link
              href={`/loja/${loja.slug}`}
              className="block h-full overflow-hidden rounded-2xl border border-[--border] bg-white shadow-sm transition-all hover:border-[--accent] hover:shadow-md focus-visible:outline-[--accent]"
            >
              <div className="flex h-28 items-center justify-center bg-[--accent]">
                <span className="font-heading text-5xl font-bold text-white/90 select-none">
                  {loja.nome[0]}
                </span>
              </div>
              <div className="p-4">
                <h2 className="font-heading text-base font-semibold text-[--text-primary]">
                  {loja.nome}
                </h2>
                <p className="mt-0.5 line-clamp-2 text-sm text-[--text-muted]">
                  {loja.descricao}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-[--text-muted]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} aria-hidden />
                    {loja.horario}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} aria-hidden />
                    Mín. {formatarPreco(loja.pedidoMinimo)}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Create `(app)/carrinho/page.tsx`**

```tsx
/* src/app/(app)/carrinho/page.tsx */
import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Carrinho" };

export default function PaginaCarrinho() {
  return <Checkout />;
}
```

- [ ] **Step 4: Create `(app)/loja/[slug]/page.tsx`**

Exact copy from current `src/app/loja/[slug]/page.tsx` with explicit param types. Colors updated in Task 8.

```tsx
/* src/app/(app)/loja/[slug]/page.tsx */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle, Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import { buscarLoja, lojas } from "@/data/lojas";
import { formatarPreco } from "@/lib/pedido";
import { BotaoAdicionar } from "@/components/botao-adicionar";
import { NavCategorias } from "@/components/nav-categorias";

export function generateStaticParams() {
  return lojas.map((loja) => ({ slug: loja.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loja = buscarLoja(slug);
  return { title: loja ? loja.nome : "Loja não encontrada" };
}

export default async function PaginaLoja({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loja = buscarLoja(slug);
  if (!loja) notFound();

  return (
    <div className="space-y-6">
      <section className="-mx-4 bg-gradient-to-br from-orange-600 to-amber-500 px-4 py-6 text-white">
        <h1 className="font-heading text-2xl font-bold">{loja.nome}</h1>
        <p className="mt-1 text-sm text-orange-100">{loja.descricao}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs">
            <Clock size={12} aria-hidden />
            {loja.horario}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs">
            <MapPin size={12} aria-hidden />
            Mín. {formatarPreco(loja.pedidoMinimo)}
          </span>
          {loja.aceitaRetirada && (
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs">
              <CheckCircle size={12} aria-hidden />
              Aceita retirada
            </span>
          )}
        </div>
      </section>

      <NavCategorias
        categorias={loja.categorias.map((c) => ({ id: c.id, nome: c.nome }))}
      />

      {loja.categorias.map((categoria) => (
        <section key={categoria.id} id={categoria.id} className="scroll-mt-32">
          <h2 className="font-heading mb-3 text-lg font-semibold text-slate-900">
            {categoria.nome}
          </h2>
          <ul className="overflow-hidden overscroll-contain rounded-2xl border border-orange-100 bg-white divide-y divide-orange-50">
            {categoria.produtos.map((produto) => {
              const disponivel = produto.disponivel !== false;
              return (
                <li key={produto.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-semibold ${
                        disponivel ? "text-slate-900" : "text-slate-400 line-through"
                      }`}
                    >
                      {produto.nome}
                    </h3>
                    {produto.descricao && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {produto.descricao}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-orange-600">
                      {formatarPreco(produto.preco)}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {disponivel ? (
                      <BotaoAdicionar lojaSlug={loja.slug} produtoId={produto.id} />
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400">
                        Esgotado
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create `(app)/painel/page.tsx`**

```tsx
/* src/app/(app)/painel/page.tsx */
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { CreditCard, MapPin, Motorcycle } from "@phosphor-icons/react/dist/ssr";
import { buscarLoja } from "@/data/lojas";
import { formatarPreco } from "@/lib/pedido";
import { supabaseServidor } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false },
};

type PedidoSalvo = {
  numero: number;
  criado_em: string;
  loja_slug: string;
  cliente_nome: string;
  cliente_telefone: string;
  entrega: { tipo: "retirada" } | { tipo: "entrega"; bairro: string; endereco: string };
  pagamento: string;
  itens: { nome: string; quantidade: number; observacao: string | null }[];
  total: number;
  status: string;
};

const corStatus: Record<string, string> = {
  novo: "bg-[--accent-light] text-[--accent]",
  preparando: "bg-amber-100 text-amber-700",
  saiu_para_entrega: "bg-blue-100 text-blue-700",
  entregue: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

const rotuloStatus: Record<string, string> = {
  novo: "Novo",
  preparando: "Preparando",
  saiu_para_entrega: "Saiu p/ entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export default function Painel() {
  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold text-[--text-primary]">Pedidos recentes</h1>
      <Suspense fallback={<p className="text-sm text-[--text-muted]">Carregando pedidos...</p>}>
        <ListaPedidos />
      </Suspense>
    </div>
  );
}

async function ListaPedidos() {
  await connection();
  const supabase = supabaseServidor();
  if (!supabase) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        O Supabase ainda não está configurado. Por enquanto os pedidos chegam só pelo WhatsApp.
      </div>
    );
  }

  const { data, error } = await supabase
    .from("pedidos")
    .select(
      "numero, criado_em, loja_slug, cliente_nome, cliente_telefone, entrega, pagamento, itens, total, status",
    )
    .order("criado_em", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Erro ao carregar pedidos: {error.message}
      </p>
    );
  }

  const pedidos = (data ?? []) as PedidoSalvo[];

  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-4xl">📋</span>
        <p className="text-sm text-[--text-muted]">Nenhum pedido ainda.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {pedidos.map((p) => (
        <li
          key={p.numero}
          className="rounded-2xl border border-[--border] bg-white p-4 space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-heading font-semibold text-[--text-primary]">
                #{p.numero} · {buscarLoja(p.loja_slug)?.nome ?? p.loja_slug}
              </p>
              <p className="text-xs text-[--text-muted]">
                {new Date(p.criado_em).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  corStatus[p.status] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {rotuloStatus[p.status] ?? p.status}
              </span>
              <span className="font-heading font-bold text-[--price]">
                {formatarPreco(p.total)}
              </span>
            </div>
          </div>

          <div className="text-sm text-[--text-primary] space-y-1">
            <p className="font-medium">
              {p.cliente_nome} · {p.cliente_telefone}
            </p>
            <p className="flex items-center gap-1 text-[--text-muted]">
              {p.entrega.tipo === "entrega" ? (
                <>
                  <MapPin size={13} aria-hidden />
                  {p.entrega.endereco} — {p.entrega.bairro}
                </>
              ) : (
                <>
                  <Motorcycle size={13} aria-hidden />
                  Retirada no local
                </>
              )}
            </p>
            <p className="flex items-center gap-1 text-[--text-muted]">
              <CreditCard size={13} aria-hidden />
              {p.pagamento}
            </p>
          </div>

          <ul className="border-t border-[--border] pt-3 space-y-1">
            {p.itens.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <span className="text-[--text-primary]">
                  {item.quantidade}× {item.nome}
                  {item.observacao && (
                    <span className="text-[--text-muted]"> ({item.observacao})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 6: Create `(marketing)/page.tsx` placeholder**

```tsx
/* src/app/(marketing)/page.tsx */
import Link from "next/link";

export default function LandingPlaceholder() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="font-heading text-4xl font-extrabold text-[--text-primary]">
        Cuco<span className="text-[--accent]">•</span>Food
      </h1>
      <p className="text-[--text-muted]">Landing page em construção.</p>
      <Link
        href="/lojas"
        className="rounded-lg bg-[--accent] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[--accent-hover]"
      >
        Ver lojas →
      </Link>
    </main>
  );
}
```

- [ ] **Step 7: Delete the old pages**

```powershell
Remove-Item "src\app\page.tsx"
Remove-Item "src\app\carrinho\page.tsx"
Remove-Item "src\app\carrinho" -Recurse -Force
Remove-Item "src\app\loja\[slug]\page.tsx"
Remove-Item "src\app\loja" -Recurse -Force
Remove-Item "src\app\painel\page.tsx"
Remove-Item "src\app\painel" -Recurse -Force
```

- [ ] **Step 8: Verify build**

```
npx tsc --noEmit
npm run build
```

Expected: 0 TypeScript errors, build succeeds. Routes `/`, `/lojas`, `/loja/[slug]`, `/carrinho`, `/painel` all exist in build output.

- [ ] **Step 9: Commit**

```
git add src/app/
git commit -m "feat: route groups (app)/(marketing), app layout, lojas page"
```

---

### Task 3: LandingNav component

**Files:**
- Create: `src/components/landing/nav.tsx`

**Interfaces:**
- Consumes: CSS tokens from Task 1
- Produces: `<LandingNav />` — sticky header with logo, nav links, CTA button, mobile hamburger drawer

---

- [ ] **Step 1: Create `src/components/landing/nav.tsx`**

```tsx
/* src/components/landing/nav.tsx */
"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[--border] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-screen-lg items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading text-lg font-extrabold text-[--text-primary]"
          >
            Cuco<span className="text-[--accent]">•</span>Food
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[--text-muted]">
            <Link href="/lojas" className="hover:text-[--text-primary] transition-colors">
              Restaurantes
            </Link>
            <Link href="#como-funciona" className="hover:text-[--text-primary] transition-colors">
              Como funciona
            </Link>
            <Link href="/lojas" className="hover:text-[--text-primary] transition-colors">
              Entrar
            </Link>
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/lojas"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-[--accent] px-4 py-2 text-sm font-semibold text-white hover:bg-[--accent-hover] transition-colors"
          >
            Começar agora →
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-[--border] text-[--text-muted]"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <nav
        aria-label="Menu mobile"
        className={`md:hidden fixed top-[57px] inset-x-0 z-40 bg-white border-b border-[--border] transition-transform duration-200 ${
          open ? "translate-y-0" : "-translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          <Link
            href="/lojas"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-[--text-primary] hover:bg-[--surface]"
          >
            Restaurantes
          </Link>
          <Link
            href="#como-funciona"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-[--text-primary] hover:bg-[--surface]"
          >
            Como funciona
          </Link>
          <Link
            href="#parceiros"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-[--text-primary] hover:bg-[--surface]"
          >
            Para restaurantes
          </Link>
          <Link
            href="/lojas"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-[--accent] px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-[--accent-hover]"
          >
            Começar agora →
          </Link>
        </div>
      </nav>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```
git add src/components/landing/nav.tsx
git commit -m "feat: landing nav component with hamburger drawer"
```

---

### Task 4: LandingHero component

**Files:**
- Create: `src/components/landing/hero.tsx`

**Interfaces:**
- Produces: `<LandingHero />` — full-viewport section with display-sized headline, subtext, two CTAs, radial violet glow background

---

- [ ] **Step 1: Create `src/components/landing/hero.tsx`**

```tsx
/* src/components/landing/hero.tsx */
export function LandingHero() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, #EDE9FE 0%, transparent 65%), #FFFFFF",
      }}
    >
      <div className="mx-auto w-full max-w-screen-lg px-4 py-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[--border] bg-white px-3 py-1 text-xs font-medium text-[--text-muted]">
            <span className="h-1.5 w-1.5 rounded-full bg-[--accent]" />
            Delivery local · sem taxas de entrada
          </div>

          {/* Headline */}
          <h1 className="font-heading text-6xl font-extrabold leading-none tracking-tight text-[--text-primary] md:text-8xl">
            Delivery que
            <br />
            respeita sua
            <br />
            <span className="text-[--accent]">cidade.</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-xl text-lg text-[--text-muted] md:text-xl">
            CucoFood conecta restaurantes locais a clientes que valorizam o que
            é de verdade.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/lojas"
              className="inline-flex items-center gap-2 rounded-xl bg-[--accent] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[--accent-hover]"
            >
              Fazer pedido →
            </a>
            <a
              href="#parceiros"
              className="inline-flex items-center gap-2 rounded-xl border border-[--border] bg-white px-6 py-3 text-base font-semibold text-[--text-primary] transition-colors hover:border-[--accent]"
            >
              Seja parceiro
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```
git add src/components/landing/hero.tsx
git commit -m "feat: landing hero — display typography, violet glow, dual CTA"
```

---

### Task 5: StatsStrip, HowItWorks, StorePreview

**Files:**
- Create: `src/components/landing/stats-strip.tsx`
- Create: `src/components/landing/how-it-works.tsx`
- Create: `src/components/landing/store-preview.tsx`

**Interfaces:**
- Consumes: `lojas` from `@/data/lojas`, `formatarPreco` from `@/lib/pedido`
- Produces: `<StatsStrip />`, `<HowItWorks />`, `<StorePreview />` — server components

---

- [ ] **Step 1: Create `src/components/landing/stats-strip.tsx`**

```tsx
/* src/components/landing/stats-strip.tsx */
export function StatsStrip() {
  return (
    <section className="bg-[--surface] border-y border-[--border]" aria-label="Estatísticas">
      <div className="mx-auto max-w-screen-lg px-4 py-5">
        <dl className="flex flex-wrap items-center justify-center gap-6 text-center md:gap-12">
          {[
            { value: "12", label: "restaurantes" },
            { value: "1", label: "cidade atendida" },
            { value: "847+", label: "pedidos feitos" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <dt className="font-heading text-2xl font-bold text-[--text-primary] md:text-3xl">
                {value}
              </dt>
              <dd className="text-sm text-[--text-muted]">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/landing/how-it-works.tsx`**

```tsx
/* src/components/landing/how-it-works.tsx */
const steps = [
  {
    num: "01",
    title: "Escolha uma loja",
    desc: "Veja os restaurantes disponíveis perto de você.",
  },
  {
    num: "02",
    title: "Monte seu pedido",
    desc: "Adicione itens ao carrinho com um toque.",
  },
  {
    num: "03",
    title: "Receba em casa",
    desc: "Entrega ou retirada — você escolhe.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="mx-auto w-full max-w-screen-lg px-4 py-20"
    >
      <h2 className="font-heading mb-12 text-center text-3xl font-bold text-[--text-primary] md:text-4xl">
        Como funciona
      </h2>
      <ol className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {steps.map(({ num, title, desc }) => (
          <li key={num} className="flex flex-col gap-3">
            <span
              className="font-heading text-7xl font-extrabold leading-none select-none"
              style={{ color: "#EDE9FE" }}
              aria-hidden
            >
              {num}
            </span>
            <h3 className="font-heading text-xl font-bold text-[--text-primary]">
              {title}
            </h3>
            <p className="text-[--text-muted]">{desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/components/landing/store-preview.tsx`**

```tsx
/* src/components/landing/store-preview.tsx */
import Link from "next/link";
import { Clock } from "@phosphor-icons/react/dist/ssr";
import { lojas } from "@/data/lojas";

export function StorePreview() {
  const preview = lojas.slice(0, 6);

  return (
    <section className="bg-[--surface] border-y border-[--border]">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-heading text-3xl font-bold text-[--text-primary] md:text-4xl">
            O que tem na sua cidade
          </h2>
          <Link
            href="/lojas"
            className="hidden text-sm font-medium text-[--accent] hover:underline sm:block"
          >
            Ver todas →
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {preview.map((loja) => (
            <li key={loja.slug}>
              <Link
                href={`/loja/${loja.slug}`}
                className="block overflow-hidden rounded-2xl border border-[--border] bg-white transition-all hover:border-[--accent] hover:shadow-sm"
              >
                <div className="flex h-20 items-center justify-center bg-[--accent]">
                  <span className="font-heading text-4xl font-bold text-white/90 select-none">
                    {loja.nome[0]}
                  </span>
                </div>
                <div className="p-3">
                  <p className="font-heading text-sm font-semibold text-[--text-primary] truncate">
                    {loja.nome}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-[--text-muted]">
                    <Clock size={11} aria-hidden />
                    {loja.horario}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/lojas"
            className="text-sm font-medium text-[--accent] hover:underline"
          >
            Ver todas as lojas →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify TypeScript**

```
npx tsc --noEmit
```

Expected: no errors across all three new files.

- [ ] **Step 5: Commit**

```
git add src/components/landing/
git commit -m "feat: landing stats strip, how it works, store preview"
```

---

### Task 6: ForRestaurants, PartnerCta, Footer

**Files:**
- Create: `src/components/landing/for-restaurants.tsx`
- Create: `src/components/landing/partner-cta.tsx`
- Create: `src/components/landing/footer.tsx`

**Interfaces:**
- Produces: `<ForRestaurants />` with `id="parceiros"` anchor; `<PartnerCta />`; `<LandingFooter />`

---

- [ ] **Step 1: Create `src/components/landing/for-restaurants.tsx`**

Uses Phosphor icons SSR: `RocketLaunch`, `ChartBar`, `Headset`.

```tsx
/* src/components/landing/for-restaurants.tsx */
import { RocketLaunch, ChartBar, Headset } from "@phosphor-icons/react/dist/ssr";

type CardProps = {
  Icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean; weight?: string }>;
  title: string;
  desc: string;
};

const cards: CardProps[] = [
  {
    Icon: RocketLaunch,
    title: "Zero setup",
    desc: "Cadastre-se em 5 minutos, sem taxa de entrada e sem contrato.",
  },
  {
    Icon: ChartBar,
    title: "Dashboard ao vivo",
    desc: "Acompanhe pedidos em tempo real, direto do celular.",
  },
  {
    Icon: Headset,
    title: "Suporte local",
    desc: "Time na sua cidade, pronto para ajudar quando precisar.",
  },
];

export function ForRestaurants() {
  return (
    <section
      id="parceiros"
      className="mx-auto w-full max-w-screen-lg px-4 py-20"
    >
      <div className="mb-10 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-[--accent]">
          Para restaurantes
        </p>
        <h2 className="font-heading mt-2 text-3xl font-bold text-[--text-primary] md:text-4xl">
          Para quem quer crescer
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map(({ Icon, title, desc }) => (
          <li
            key={title}
            className="rounded-xl border border-[--border] p-6 transition-colors hover:border-[--accent]"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[--accent-light]">
              <Icon size={20} className="text-[--accent]" aria-hidden weight="bold" />
            </div>
            <h3 className="font-heading text-lg font-bold text-[--text-primary]">
              {title}
            </h3>
            <p className="mt-2 text-sm text-[--text-muted]">{desc}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <a
          href="mailto:parceiros@cucofood.com.br"
          className="inline-flex items-center gap-2 rounded-xl bg-[--accent] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[--accent-hover]"
        >
          Cadastrar meu restaurante →
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/landing/partner-cta.tsx`**

```tsx
/* src/components/landing/partner-cta.tsx */
export function PartnerCta() {
  return (
    <section className="bg-[--dark]">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-24 text-center">
        <h2 className="font-heading text-3xl font-extrabold text-white md:text-5xl">
          Traga seu restaurante
          <br />
          para o CucoFood.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/60 md:text-lg">
          Sem taxa de entrada. Sem contrato. Só resultados.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:parceiros@cucofood.com.br"
            className="inline-flex items-center gap-2 rounded-xl bg-[--accent] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[--accent-hover]"
          >
            Falar com a gente →
          </a>
          <span className="text-sm text-white/50">parceiros@cucofood.com.br</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/components/landing/footer.tsx`**

```tsx
/* src/components/landing/footer.tsx */
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-[--dark]">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-heading text-lg font-extrabold text-white">
            Cuco<span className="text-[--accent]">•</span>Food
          </span>

          <nav className="flex flex-wrap gap-4 text-sm text-white/60">
            <Link href="/lojas" className="hover:text-white transition-colors">
              Lojas
            </Link>
            <Link href="#como-funciona" className="hover:text-white transition-colors">
              Como funciona
            </Link>
            <Link href="#parceiros" className="hover:text-white transition-colors">
              Para restaurantes
            </Link>
            <a
              href="mailto:parceiros@cucofood.com.br"
              className="hover:text-white transition-colors"
            >
              Contato
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/40">
          © 2026 CucoFood. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Verify TypeScript**

```
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```
git add src/components/landing/
git commit -m "feat: landing for-restaurants, partner CTA, footer sections"
```

---

### Task 7: Landing page assembly

**Files:**
- Modify: `src/app/(marketing)/page.tsx` (replace placeholder with full landing)

**Interfaces:**
- Consumes: all 8 landing components from Tasks 3-6 — exact import paths:
  - `@/components/landing/nav` → `LandingNav`
  - `@/components/landing/hero` → `LandingHero`
  - `@/components/landing/stats-strip` → `StatsStrip`
  - `@/components/landing/for-restaurants` → `ForRestaurants`
  - `@/components/landing/store-preview` → `StorePreview`
  - `@/components/landing/how-it-works` → `HowItWorks`
  - `@/components/landing/partner-cta` → `PartnerCta`
  - `@/components/landing/footer` → `LandingFooter`
- Produces: `/` route with full landing page and OG metadata

---

- [ ] **Step 1: Replace `(marketing)/page.tsx` with full landing**

```tsx
/* src/app/(marketing)/page.tsx */
import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/nav";
import { LandingHero } from "@/components/landing/hero";
import { StatsStrip } from "@/components/landing/stats-strip";
import { ForRestaurants } from "@/components/landing/for-restaurants";
import { StorePreview } from "@/components/landing/store-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PartnerCta } from "@/components/landing/partner-cta";
import { LandingFooter } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "CucoFood — Delivery dos restaurantes da sua cidade",
  description:
    "Peça nos melhores restaurantes locais. Sem intermediários, com suporte da cidade.",
  openGraph: {
    title: "CucoFood — Delivery dos restaurantes da sua cidade",
    description:
      "Peça nos melhores restaurantes locais. Sem intermediários, com suporte da cidade.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <LandingHero />
      <StatsStrip />
      <ForRestaurants />
      <StorePreview />
      <HowItWorks />
      <PartnerCta />
      <LandingFooter />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript and build**

```
npx tsc --noEmit
npm run build
```

Expected: 0 errors, landing at `/` renders all 8 sections, build succeeds.

- [ ] **Step 3: Commit**

```
git add "src/app/(marketing)/page.tsx"
git commit -m "feat: landing page — full CucoFood marketing assembly"
```

---

### Task 8: App rebranding — orange → violet

**Files:**
- Modify: `src/components/botao-adicionar.tsx`
- Modify: `src/components/botao-carrinho.tsx`
- Modify: `src/components/bottom-nav.tsx`
- Modify: `src/components/nav-categorias.tsx`
- Modify: `src/components/checkout.tsx`
- Modify: `src/app/(app)/loja/[slug]/page.tsx`

**Interfaces:**
- Consumes: CSS tokens `--accent`, `--accent-hover`, `--accent-light`, `--border`, `--price`, `--text-primary`, `--text-muted`, `--surface`, `--background`, `--dark` from Task 1
- Produces: all app components and pages using violet accent; BottomNav "Início" linking to `/lojas`

---

Substitution table (apply to every file in this task):

| Find | Replace |
|------|---------|
| `bg-orange-600` | `bg-[--accent]` |
| `hover:bg-orange-700` | `hover:bg-[--accent-hover]` |
| `text-orange-600` | `text-[--accent]` |
| `border-orange-600` | `border-[--accent]` |
| `border-orange-100` | `border-[--border]` |
| `bg-orange-50` | `bg-[--accent-light]` |
| `bg-orange-100` | `bg-[--accent-light]` |
| `divide-orange-50` | `divide-[--border]` |
| `hover:border-orange-400` | `hover:border-[--accent]` |
| `focus:border-orange-500` | `focus:border-[--accent]` |
| `focus:ring-orange-200` | `focus:ring-[--accent-light]` |
| `hover:bg-orange-50` | `hover:bg-[--accent-light]` |
| `border-orange-200` | `border-[--border]` |
| `text-orange-100` | `text-white/70` |
| `text-orange-700` | `text-[--accent]` |
| `text-slate-900` on headings | `text-[--text-primary]` |
| `text-slate-500` or `text-slate-600` | `text-[--text-muted]` |
| `text-orange-600` on prices | `text-[--price]` |
| Amber/red warning banners | keep as-is |

Additionally in `bottom-nav.tsx`: change `href="/"` → `href="/lojas"` and `pathname === "/"` → `pathname === "/lojas"`.

In `(app)/loja/[slug]/page.tsx`: change orange hero banner to `bg-[--dark]`.

- [ ] **Step 1: Update `botao-adicionar.tsx`**

```tsx
/* src/components/botao-adicionar.tsx */
"use client";

import { Minus, Plus } from "@phosphor-icons/react";
import { useCarrinho } from "@/components/carrinho-provider";

export function BotaoAdicionar({
  lojaSlug,
  produtoId,
}: {
  lojaSlug: string;
  produtoId: string;
}) {
  const { adicionar, alterarQuantidade, itens, lojaSlug: lojaAtual } = useCarrinho();
  const quantidade =
    lojaAtual === lojaSlug
      ? (itens.find((i) => i.produtoId === produtoId)?.quantidade ?? 0)
      : 0;

  if (quantidade === 0) {
    return (
      <button
        type="button"
        aria-label="Adicionar ao carrinho"
        onClick={() => adicionar(lojaSlug, produtoId)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[--accent] text-white shadow-sm transition-transform active:scale-95 hover:bg-[--accent-hover]"
      >
        <Plus size={20} weight="bold" aria-hidden />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Remover um do carrinho"
        onClick={() => alterarQuantidade(produtoId, quantidade - 1)}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[--accent] text-[--accent] transition-transform active:scale-95 hover:bg-[--accent-light]"
      >
        <Minus size={16} weight="bold" aria-hidden />
      </button>
      <span className="min-w-[1.25rem] text-center text-sm font-semibold text-[--text-primary]">
        {quantidade}
      </span>
      <button
        type="button"
        aria-label="Adicionar mais um ao carrinho"
        onClick={() => adicionar(lojaSlug, produtoId)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[--accent] text-white shadow-sm transition-transform active:scale-95 hover:bg-[--accent-hover]"
      >
        <Plus size={20} weight="bold" aria-hidden />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Update `botao-carrinho.tsx`**

```tsx
/* src/components/botao-carrinho.tsx */
"use client";

import Link from "next/link";
import { ShoppingBag } from "@phosphor-icons/react";
import { useCarrinho } from "@/components/carrinho-provider";

export function BotaoCarrinho() {
  const { quantidadeTotal } = useCarrinho();
  return (
    <Link
      href="/carrinho"
      aria-label={
        quantidadeTotal > 0
          ? `Carrinho, ${quantidadeTotal} ${quantidadeTotal === 1 ? "item" : "itens"}`
          : "Carrinho"
      }
      className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[--accent] text-white transition-colors hover:bg-[--accent-hover]"
    >
      <ShoppingBag size={20} weight="fill" aria-hidden />
      {quantidadeTotal > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-[--accent] text-[10px] font-bold text-white flex items-center justify-center">
          {quantidadeTotal > 9 ? "9+" : quantidadeTotal}
        </span>
      )}
    </Link>
  );
}
```

- [ ] **Step 3: Update `bottom-nav.tsx`**

Note: `href="/"` → `href="/lojas"` and active check `pathname === "/"` → `pathname === "/lojas"`.

```tsx
/* src/components/bottom-nav.tsx */
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, ShoppingBag, ClipboardText } from "@phosphor-icons/react";
import { useCarrinho } from "@/components/carrinho-provider";

export function BottomNav() {
  const pathname = usePathname();
  const { quantidadeTotal } = useCarrinho();

  return (
    <nav
      aria-label="Navegação principal"
      className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[--border] flex justify-around py-1"
    >
      <NavItem
        href="/lojas"
        label="Início"
        ativo={pathname === "/lojas"}
        icon={
          <House
            size={22}
            weight={pathname === "/lojas" ? "fill" : "regular"}
            aria-hidden
          />
        }
      />

      <Link
        href="/carrinho"
        className={`relative flex flex-col items-center gap-0.5 px-5 py-2 ${
          pathname === "/carrinho" ? "text-[--accent]" : "text-slate-500"
        }`}
      >
        <ShoppingBag
          size={22}
          weight={pathname === "/carrinho" ? "fill" : "regular"}
          aria-hidden
        />
        {quantidadeTotal > 0 && (
          <span className="absolute top-1.5 right-2.5 h-4 w-4 bg-[--accent] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {quantidadeTotal > 9 ? "9+" : quantidadeTotal}
          </span>
        )}
        <span className="text-[10px] font-semibold">Carrinho</span>
      </Link>

      <NavItem
        href="/painel"
        label="Painel"
        ativo={pathname === "/painel"}
        icon={
          <ClipboardText
            size={22}
            weight={pathname === "/painel" ? "fill" : "regular"}
            aria-hidden
          />
        }
      />
    </nav>
  );
}

function NavItem({
  href,
  label,
  icon,
  ativo,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  ativo: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 px-5 py-2 ${
        ativo ? "text-[--accent]" : "text-slate-500"
      }`}
    >
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </Link>
  );
}
```

- [ ] **Step 4: Update `nav-categorias.tsx`**

```tsx
/* src/components/nav-categorias.tsx */
"use client";

import { useEffect, useState } from "react";

type Categoria = { id: string; nome: string };

export function NavCategorias({ categorias }: { categorias: Categoria[] }) {
  const [ativa, setAtiva] = useState(categorias[0]?.id ?? "");

  useEffect(() => {
    if (categorias.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visivel = entries.find((e) => e.isIntersecting);
        if (visivel) setAtiva(visivel.target.id);
      },
      { threshold: 0.2, rootMargin: "-120px 0px -55% 0px" },
    );
    categorias.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [categorias]);

  return (
    <nav
      aria-label="Categorias do cardápio"
      className="sticky top-14 z-30 -mx-4 border-b border-[--border] bg-[--background]"
    >
      <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-2">
        {categorias.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              ativa === c.id
                ? "bg-[--accent] text-white"
                : "border border-[--border] bg-white text-[--text-muted] hover:border-[--accent]"
            }`}
          >
            {c.nome}
          </a>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 5: Update `checkout.tsx`**

```tsx
/* src/components/checkout.tsx */
"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft, Minus, Plus, Trash } from "@phosphor-icons/react";
import { finalizarPedido } from "@/app/actions";
import { useCarrinho } from "@/components/carrinho-provider";
import { buscarLoja } from "@/data/lojas";
import { calcularPedido, formatarPreco } from "@/lib/pedido";
import type { FormaPagamento } from "@/lib/types";

const campoBase =
  "w-full rounded-xl border border-[--border] bg-white px-4 py-3 text-sm focus:border-[--accent] focus:outline-none focus:ring-2 focus:ring-[--accent-light] transition-colors";

export function Checkout() {
  const carrinho = useCarrinho();
  const loja = carrinho.lojaSlug ? buscarLoja(carrinho.lojaSlug) : undefined;

  const [tipoEntrega, setTipoEntrega] = useState<"entrega" | "retirada">("entrega");
  const [bairro, setBairro] = useState("");
  const [pagamento, setPagamento] = useState<FormaPagamento>("pix");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, iniciar] = useTransition();

  if (!loja || carrinho.itens.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-5xl">🛒</span>
        <h1 className="font-heading text-xl font-bold text-[--text-primary]">
          Seu carrinho está vazio
        </h1>
        <p className="text-sm text-[--text-muted]">Adicione itens de uma loja para fazer seu pedido.</p>
        <Link
          href="/lojas"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[--accent] px-6 py-3 text-sm font-semibold text-white hover:bg-[--accent-hover] transition-colors"
        >
          <ArrowLeft size={16} aria-hidden />
          Ver lojas
        </Link>
      </div>
    );
  }

  const calculo = calcularPedido(
    loja,
    carrinho.itens,
    tipoEntrega === "entrega" ? bairro : undefined,
  );
  const faltaMinimo = calculo.subtotal < loja.pedidoMinimo;

  function enviar(form: FormData) {
    setErro(null);
    const troco = Number(String(form.get("troco") ?? "").replace(",", "."));
    iniciar(async () => {
      const resultado = await finalizarPedido({
        lojaSlug: loja!.slug,
        itens: carrinho.itens,
        cliente: {
          nome: String(form.get("nome") ?? ""),
          telefone: String(form.get("telefone") ?? ""),
        },
        entrega:
          tipoEntrega === "retirada"
            ? { tipo: "retirada" }
            : {
                tipo: "entrega",
                bairro,
                endereco: String(form.get("endereco") ?? ""),
                referencia: String(form.get("referencia") ?? ""),
              },
        pagamento,
        trocoPara: troco > 0 ? Math.round(troco * 100) : undefined,
      });
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      carrinho.limpar();
      window.location.href = resultado.linkWhatsApp;
    });
  }

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[--text-primary]">Seu pedido</h1>
        <p className="text-sm text-[--text-muted]">
          em{" "}
          <Link href={`/loja/${loja.slug}`} className="font-medium text-[--accent] hover:underline">
            {loja.nome}
          </Link>
        </p>
      </div>

      <ul className="space-y-2">
        {calculo.itens.map((item) => (
          <li
            key={item.produto.id}
            className="rounded-2xl border border-[--border] bg-white p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-semibold text-sm text-[--text-primary]">{item.produto.nome}</span>
              <span className="font-semibold text-sm text-[--price] shrink-0">
                {formatarPreco(item.subtotal)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Diminuir ${item.produto.nome}`}
                  onClick={() =>
                    carrinho.alterarQuantidade(item.produto.id, item.quantidade - 1)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[--border] text-[--accent] hover:border-[--accent] transition-colors"
                >
                  {item.quantidade === 1 ? (
                    <Trash size={14} weight="bold" aria-hidden />
                  ) : (
                    <Minus size={14} weight="bold" aria-hidden />
                  )}
                </button>
                <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                  {item.quantidade}
                </span>
                <button
                  type="button"
                  aria-label={`Aumentar ${item.produto.nome}`}
                  onClick={() =>
                    carrinho.alterarQuantidade(item.produto.id, item.quantidade + 1)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[--accent] text-white hover:bg-[--accent-hover] transition-colors"
                >
                  <Plus size={14} weight="bold" aria-hidden />
                </button>
              </div>
              <input
                type="text"
                placeholder="Observação (ex.: sem cebola)"
                defaultValue={item.observacao ?? ""}
                onBlur={(e) => carrinho.alterarObservacao(item.produto.id, e.target.value)}
                maxLength={200}
                className="flex-1 rounded-xl border border-[--border] bg-[--surface] px-3 py-1.5 text-xs focus:border-[--accent] focus:outline-none"
              />
            </div>
          </li>
        ))}
      </ul>

      <form action={enviar} className="space-y-5">
        <section className="rounded-2xl border border-[--border] bg-white p-4 space-y-3">
          <h2 className="font-heading font-semibold text-[--text-primary]">Seus dados</h2>
          <input name="nome" required placeholder="Nome completo" autoComplete="name" className={campoBase} />
          <input name="telefone" required type="tel" inputMode="tel" placeholder="Telefone com DDD" autoComplete="tel" className={campoBase} />
        </section>

        <section className="rounded-2xl border border-[--border] bg-white p-4 space-y-3">
          <h2 className="font-heading font-semibold text-[--text-primary]">Entrega</h2>
          {loja.aceitaRetirada && (
            <div className="flex overflow-hidden rounded-xl border border-[--border]">
              {(["entrega", "retirada"] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setTipoEntrega(tipo)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    tipoEntrega === tipo
                      ? "bg-[--accent] text-white"
                      : "bg-white text-[--text-muted] hover:bg-[--accent-light]"
                  }`}
                >
                  {tipo === "entrega" ? "Entregar" : "Retirar no local"}
                </button>
              ))}
            </div>
          )}
          {tipoEntrega === "entrega" && (
            <>
              <select required value={bairro} onChange={(e) => setBairro(e.target.value)} className={campoBase}>
                <option value="">Escolha o bairro</option>
                {loja.bairros.map((b) => (
                  <option key={b.nome} value={b.nome}>
                    {b.nome} ({formatarPreco(b.taxa)})
                  </option>
                ))}
              </select>
              <input name="endereco" required placeholder="Rua e número" autoComplete="street-address" inputMode="text" className={campoBase} />
              <input name="referencia" placeholder="Ponto de referência (opcional)" className={campoBase} />
            </>
          )}
        </section>

        <section className="rounded-2xl border border-[--border] bg-white p-4 space-y-3">
          <h2 className="font-heading font-semibold text-[--text-primary]">Pagamento</h2>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["pix", "Pix"],
                ["dinheiro", "Dinheiro"],
                ["cartao", "Cartão"],
              ] as const
            ).map(([valor, rotulo]) => (
              <button
                key={valor}
                type="button"
                onClick={() => setPagamento(valor)}
                className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                  pagamento === valor
                    ? "border-[--accent] bg-[--accent-light] text-[--accent]"
                    : "border-[--border] bg-white text-[--text-muted] hover:border-[--accent]"
                }`}
              >
                {rotulo}
              </button>
            ))}
          </div>
          {pagamento === "dinheiro" && (
            <input name="troco" inputMode="numeric" placeholder="Troco para quanto? (opcional)" className={campoBase} />
          )}
        </section>

        <section className="rounded-2xl border border-[--border] bg-white p-4 space-y-2 text-sm">
          <div className="flex justify-between text-[--text-muted]">
            <span>Subtotal</span>
            <span>{formatarPreco(calculo.subtotal)}</span>
          </div>
          {tipoEntrega === "entrega" && (
            <div className="flex justify-between text-[--text-muted]">
              <span>Entrega</span>
              <span>{bairro ? formatarPreco(calculo.taxaEntrega) : "— escolha o bairro"}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-[--border] font-bold text-base text-[--text-primary]">
            <span>Total</span>
            <span className="text-[--price]">{formatarPreco(calculo.total)}</span>
          </div>
        </section>

        {faltaMinimo && (
          <p className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            Pedido mínimo de {formatarPreco(loja.pedidoMinimo)}. Faltam{" "}
            {formatarPreco(loja.pedidoMinimo - calculo.subtotal)}.
          </p>
        )}
        {erro && (
          <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando || faltaMinimo}
          className="w-full rounded-2xl bg-[--accent] px-4 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-[--accent-hover] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? "Enviando..." : "Enviar pelo WhatsApp →"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 6: Update `(app)/loja/[slug]/page.tsx` — hero banner + card colors**

Replace hero section and card list colors. Full file:

```tsx
/* src/app/(app)/loja/[slug]/page.tsx */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle, Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import { buscarLoja, lojas } from "@/data/lojas";
import { formatarPreco } from "@/lib/pedido";
import { BotaoAdicionar } from "@/components/botao-adicionar";
import { NavCategorias } from "@/components/nav-categorias";

export function generateStaticParams() {
  return lojas.map((loja) => ({ slug: loja.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loja = buscarLoja(slug);
  return { title: loja ? loja.nome : "Loja não encontrada" };
}

export default async function PaginaLoja({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loja = buscarLoja(slug);
  if (!loja) notFound();

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <section className="-mx-4 bg-[--dark] px-4 py-6 text-white">
        <h1 className="font-heading text-2xl font-bold">{loja.nome}</h1>
        <p className="mt-1 text-sm text-white/70">{loja.descricao}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs">
            <Clock size={12} aria-hidden />
            {loja.horario}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs">
            <MapPin size={12} aria-hidden />
            Mín. {formatarPreco(loja.pedidoMinimo)}
          </span>
          {loja.aceitaRetirada && (
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs">
              <CheckCircle size={12} aria-hidden />
              Aceita retirada
            </span>
          )}
        </div>
      </section>

      {/* Barra de categorias sticky */}
      <NavCategorias
        categorias={loja.categorias.map((c) => ({ id: c.id, nome: c.nome }))}
      />

      {/* Seções do cardápio */}
      {loja.categorias.map((categoria) => (
        <section key={categoria.id} id={categoria.id} className="scroll-mt-32">
          <h2 className="font-heading mb-3 text-lg font-semibold text-[--text-primary]">
            {categoria.nome}
          </h2>
          <ul className="overflow-hidden overscroll-contain rounded-2xl border border-[--border] bg-white divide-y divide-[--border]">
            {categoria.produtos.map((produto) => {
              const disponivel = produto.disponivel !== false;
              return (
                <li key={produto.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-semibold ${
                        disponivel ? "text-[--text-primary]" : "text-slate-400 line-through"
                      }`}
                    >
                      {produto.nome}
                    </h3>
                    {produto.descricao && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-[--text-muted]">
                        {produto.descricao}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-[--price]">
                      {formatarPreco(produto.preco)}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {disponivel ? (
                      <BotaoAdicionar lojaSlug={loja.slug} produtoId={produto.id} />
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400">
                        Esgotado
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Verify TypeScript, full build, and orange grep**

```
npx tsc --noEmit
npm run build
```

Confirm no orange classes remain in component/page files:
```powershell
Select-String -Path "src\components\*.tsx","src\app\(app)\**\*.tsx" -Pattern "orange" | Where-Object { $_ -notmatch "amber" }
```

Expected: no matches (orange fully replaced).

- [ ] **Step 8: Commit**

```
git add src/components/ "src/app/(app)/"
git commit -m "feat: rebrand app components orange → violet, BottomNav links to /lojas"
```
