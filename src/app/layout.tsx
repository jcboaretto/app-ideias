import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { CarrinhoProvider } from "@/components/carrinho-provider";
import { BotaoCarrinho } from "@/components/botao-carrinho";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Peça na Cidade",
  description: "Cardápios e delivery das lojas da nossa cidade.",
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <CarrinhoProvider>
          <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
              <Link href="/" className="text-lg font-bold text-orange-600">
                Peça na Cidade
              </Link>
              <BotaoCarrinho />
            </div>
          </header>
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>
          <footer className="py-6 text-center text-xs text-stone-500">
            Feito com carinho para o comércio local.
          </footer>
        </CarrinhoProvider>
      </body>
    </html>
  );
}
