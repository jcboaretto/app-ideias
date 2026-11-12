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
      className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-orange-100 flex justify-around py-1"
    >
      <NavItem
        href="/"
        label="Início"
        ativo={pathname === "/"}
        icon={<House size={22} weight={pathname === "/" ? "fill" : "regular"} aria-hidden />}
      />

      <Link
        href="/carrinho"
        className={`relative flex flex-col items-center gap-0.5 px-5 py-2 ${
          pathname === "/carrinho" ? "text-orange-600" : "text-slate-500"
        }`}
      >
        <ShoppingBag
          size={22}
          weight={pathname === "/carrinho" ? "fill" : "regular"}
          aria-hidden
        />
        {quantidadeTotal > 0 && (
          <span className="absolute top-1.5 right-2.5 h-4 w-4 bg-orange-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
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
        ativo ? "text-orange-600" : "text-slate-500"
      }`}
    >
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </Link>
  );
}
