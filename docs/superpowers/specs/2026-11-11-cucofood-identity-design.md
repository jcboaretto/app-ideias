# CucoFood — Identidade Visual & Landing Page

**Data:** 2026-11-11
**Skills usadas:** anthropics/skills → `frontend-design`, `theme-factory`
**Status:** Aprovado para implementação

---

## Objetivo

Rebrand completo do app "Peça na Cidade" para **CucoFood** com identidade visual moderna tech (referências: Linear.app, Vercel, Luma), landing page de alto impacto B2B+B2C, e app de pedidos rebranded com o novo design system violet/branco.

Metas de negócio:
- Atrair restaurantes parceiros (B2B) com visual profissional e confiável
- Reter e converter clientes finais (B2C) com experiência premium
- Diferenciar da concorrência (todos laranja/vermelho) com paleta inesperada

---

## Escopo

### Rotas

| Rota | Situação | Descrição |
|---|---|---|
| `/` | Nova | Landing page CucoFood (marketing) |
| `/lojas` | Nova | Lista de lojas (conteúdo movido de `/`) |
| `/loja/[slug]` | Rebranded | Cardápio — rota mantida |
| `/carrinho` | Rebranded | Carrinho — rota mantida |
| `/painel` | Rebranded | Painel admin — rota mantida |

### Componentes novos

| Arquivo | Descrição |
|---|---|
| `src/components/landing/nav.tsx` | Header da landing (sticky, blur) |
| `src/components/landing/hero.tsx` | Hero full-viewport, tipografia enorme |
| `src/components/landing/stats-strip.tsx` | Contador de restaurantes/pedidos |
| `src/components/landing/for-restaurants.tsx` | Seção B2B — 3 cards de benefícios |
| `src/components/landing/store-preview.tsx` | Grid preview das lojas |
| `src/components/landing/how-it-works.tsx` | 3 steps numerados |
| `src/components/landing/partner-cta.tsx` | CTA final dark `#0A0A0A` |
| `src/components/landing/footer.tsx` | Footer dark |

### Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `src/app/globals.css` | Novo design system: tokens violet, Plus Jakarta Sans + Inter |
| `src/app/layout.tsx` | Novas fontes, logo "CucoFood", header rebranded |
| `src/app/page.tsx` | Substituído por landing page |
| `src/app/lojas/page.tsx` | Nova rota — conteúdo movido de `page.tsx` anterior |
| `src/app/loja/[slug]/page.tsx` | Accent orange→violet |
| `src/components/checkout.tsx` | Accent orange→violet |
| `src/components/botao-adicionar.tsx` | orange→violet |
| `src/components/botao-carrinho.tsx` | orange→violet |
| `src/components/bottom-nav.tsx` | active state orange→violet |
| `src/components/nav-categorias.tsx` | active pill orange→violet |

### Fora do escopo
- Lógica de negócio (WhatsApp, Supabase, cálculo de pedido)
- Dados (`src/data/lojas.ts`, `src/lib/`)
- Auth do painel (`src/proxy.ts`)

---

## Sistema de Design

### Tokens CSS (`globals.css`)

```css
:root {
  --background:    #FFFFFF;
  --surface:       #F8F9FA;
  --border:        #E5E7EB;
  --text-primary:  #0A0A0A;
  --text-muted:    #6B7280;
  --accent:        #7C3AED;   /* violet — cor da marca */
  --accent-hover:  #6D28D9;
  --accent-light:  #EDE9FE;
  --price:         #F59E0B;   /* âmbar — apenas para preços */
  --dark:          #0A0A0A;   /* footer, seções invertidas */
}
```

Princípio: "Gaste sua ousadia em um lugar." — violet é o único elemento vibrante. Tudo mais é preto, branco e cinza frio.

### Tipografia

```ts
// layout.tsx
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '700', '800'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
})
```

```css
@theme inline {
  --font-heading: var(--font-jakarta);
  --font-sans:    var(--font-inter);
}
```

Escala de display:
- Hero: `text-6xl md:text-8xl font-extrabold leading-none tracking-tight`
- Section title: `text-3xl md:text-4xl font-bold`
- UI label: `text-sm font-medium`

---

## Landing Page `/`

### Nav (`nav.tsx`)
```
[CucoFood•]          Restaurantes   Como funciona   Entrar    [Começar agora →]
```
- `sticky top-0 z-50 border-b border-[--border] bg-white/95 backdrop-blur`
- Logo: "CucoFood" em Plus Jakarta Sans 800 + ponto violet `•` após o "o"
- CTA: `bg-[--accent] text-white px-4 py-2 rounded-lg text-sm font-semibold`
- Mobile: menu hamburger com drawer

### Hero (`hero.tsx`)
```
─────────────────────────────────────────
  min-h-screen flex items-center

  Delivery que
  respeita sua          ← 96–120px, #0A0A0A
  cidade.               leading-none

  CucoFood conecta restaurantes locais
  a clientes que valorizam o local.    ← Inter 18px, muted

  [Fazer pedido →]   [Seja parceiro]
   violet bg           ghost border
─────────────────────────────────────────
```
- Fundo: `#FFFFFF` com `bg-[radial-gradient(ellipse_at_top,_#EDE9FE_0%,_transparent_60%)]` sutil
- CTA primário: `href="/lojas"` — `bg-[--accent] hover:bg-[--accent-hover]`
- CTA secundário: `href="#parceiros"` — `border border-[--border] hover:border-[--accent]`

### Stats Strip (`stats-strip.tsx`)
```
  12 restaurantes · 1 cidade · 847+ pedidos hoje
```
- `bg-[--surface] border-y border-[--border] py-4`
- Números em Plus Jakarta Sans 700, animated via CSS `@keyframes count-up` ou IntersectionObserver + JS
- Dados: hardcoded com possibilidade futura de virem do Supabase

### Para Restaurantes (`for-restaurants.tsx`)
Seção com `id="parceiros"`:
```
  Para quem quer crescer

  [Card 1]              [Card 2]              [Card 3]
  Zero setup            Dashboard ao vivo     Suporte local
  Cadastre-se em        Acompanhe pedidos     Time na sua
  5 minutos, sem        em tempo real,        cidade, pronto
  taxa de entrada.      do celular.           para ajudar.
```
- `grid grid-cols-1 md:grid-cols-3 gap-6`
- Cards: `border border-[--border] rounded-xl p-6 hover:border-[--accent] transition-colors`
- Ícone violet no topo de cada card (Phosphor icons: `RocketLaunch`, `ChartBar`, `Headset`)
- CTA: `"Cadastrar meu restaurante →"` link para email/formulário

### Preview de Lojas (`store-preview.tsx`)
- Título: "O que tem na sua cidade"
- Grid `grid-cols-2 md:grid-cols-3 gap-4` com até 6 cards
- Cards idênticos aos de `/lojas` mas menores (versão compact)
- CTA: `"Ver todas as lojas →"` href="/lojas"

### Como Funciona (`how-it-works.tsx`)
```
  01                    02                    03
  Escolha uma           Monte seu             Receba em
  loja perto            cardápio              casa
  de você.              do zero.              ou retire.
```
- Números `text-7xl font-extrabold text-[--accent-light]` (outline sutil)
- Layout: `grid grid-cols-1 md:grid-cols-3`

### Partner CTA (`partner-cta.tsx`)
```
  bg-[--dark] text-white

  Traga seu restaurante
  para o CucoFood.

  Sem taxa de entrada. Sem contrato.
  Só resultados.

  [Falar com a gente →]   parceiros@cucofood.com.br
```
- Fundo `#0A0A0A`
- CTA: `bg-[--accent]` sobre fundo escuro

### Footer (`footer.tsx`)
```
  bg-[--dark] text-white/60

  CucoFood•    © 2026 CucoFood. Todos os direitos reservados.

  Lojas   Como funciona   Para restaurantes   Contato
```

---

## App de Pedidos — Rebranding

### `/lojas` (antiga `/`)
- Mover conteúdo de `src/app/page.tsx` para `src/app/lojas/page.tsx`
- Hero strip: fundo `#0A0A0A` texto branco (substituindo gradiente orange)
  ```
  bg-[--dark] text-white px-4 py-8
  ```
- Título: "O que você quer pedir hoje?" — Plus Jakarta Sans 700
- Cards de loja: border `border-[--border]`, hover `hover:border-[--accent]`

### Substituições de cor (todos os componentes)

| De | Para | Tailwind |
|---|---|---|
| `bg-orange-600` | `bg-[--accent]` | violet |
| `hover:bg-orange-700` | `hover:bg-[--accent-hover]` | |
| `text-orange-600` | `text-[--accent]` | |
| `border-orange-600` | `border-[--accent]` | |
| `border-orange-100` | `border-[--border]` | |
| `bg-orange-50` | `bg-[--accent-light]` | |
| `bg-orange-100` | `bg-[--accent-light]` | |
| `divide-orange-50` | `divide-[--border]` | |
| `text-amber-500` / preços | mantém `text-[--price]` | âmbar |
| Fonte Rubik | Plus Jakarta Sans | |
| Fonte Nunito | Inter | |
| "Peça na Cidade" | "CucoFood" | texto |

### Layout global
- `bg-orange-50` body → `bg-[--background]`
- Header: logo "CucoFood" com ponto violet
- `BotaoCarrinho`: violet bg
- `BottomNav`: active state violet

---

## Checklist de Qualidade

- [ ] Mobile-first em todas as seções da landing (base mobile, md:/lg: para desktop)
- [ ] `prefers-reduced-motion`: animações do hero/stats desligam com `@media (prefers-reduced-motion: reduce)`
- [ ] Contraste WCAG AA: violet `#7C3AED` sobre branco — ratio 7.3:1 ✓
- [ ] `aria-label` em todos os CTAs icônicos e nav mobile
- [ ] Smooth scroll em links anchor (`scroll-behavior: smooth` no html)
- [ ] Meta tags OG: `og:title`, `og:description`, `og:image` na landing
- [ ] `loading="lazy"` em imagens não-críticas
- [ ] Redirect `/` → `/lojas` para usuários vindos de links diretos ao app (ou breadcrumb claro)
- [ ] TypeScript: sem `any`, sem erros no `tsc --noEmit`
