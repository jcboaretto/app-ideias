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
