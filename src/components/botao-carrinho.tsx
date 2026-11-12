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
      className="relative flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white transition-colors hover:bg-orange-700"
    >
      <ShoppingBag size={20} weight="fill" aria-hidden />
      {quantidadeTotal > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-orange-600 text-[10px] font-bold text-white flex items-center justify-center">
          {quantidadeTotal > 9 ? "9+" : quantidadeTotal}
        </span>
      )}
    </Link>
  );
}
