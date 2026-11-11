"use client";

import Link from "next/link";
import { useCarrinho } from "@/components/carrinho-provider";

export function BotaoCarrinho() {
  const { quantidadeTotal } = useCarrinho();
  return (
    <Link
      href="/carrinho"
      className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
    >
      Carrinho{quantidadeTotal > 0 ? ` (${quantidadeTotal})` : ""}
    </Link>
  );
}
