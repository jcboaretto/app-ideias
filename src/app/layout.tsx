import type { Metadata, Viewport } from "next";
import { Rubik, Nunito_Sans } from "next/font/google";
import Link from "next/link";
import { CarrinhoProvider } from "@/components/carrinho-provider";
import { BotaoCarrinho } from "@/components/botao-carrinho";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  weight: ["400", "500", "700"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Peça na Cidade",
  description: "Cardápios e delivery das lojas da nossa cidade.",
};

export const viewport: Viewport = {
  themeColor: "#EA580C",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${rubik.variable} ${nunitoSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-orange-50 text-slate-900">
        <CarrinhoProvider>
          <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-screen-lg items-center justify-between px-4 py-3">
              <Link
                href="/"
                className="font-heading text-lg font-bold text-orange-600"
              >
                Peça na Cidade
              </Link>
              <BotaoCarrinho />
            </div>
          </header>

          <main className="mx-auto w-full max-w-screen-lg flex-1 px-4 py-6 pb-24 sm:pb-6">
            {children}
          </main>

          <BottomNav />
        </CarrinhoProvider>
      </body>
    </html>
  );
}
