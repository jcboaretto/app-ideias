"use client";

import { useCarrinho } from "@/components/carrinho-provider";

export function BotaoAdicionar({ lojaSlug, produtoId }: { lojaSlug: string; produtoId: string }) {
  const { adicionar, itens, lojaSlug: lojaAtual } = useCarrinho();
  const quantidade =
    lojaAtual === lojaSlug ? (itens.find((i) => i.produtoId === produtoId)?.quantidade ?? 0) : 0;

  return (
    <button
      type="button"
      onClick={() => adicionar(lojaSlug, produtoId)}
      className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700"
    >
      {quantidade > 0 ? `Adicionar (${quantidade})` : "Adicionar"}
    </button>
  );
}
