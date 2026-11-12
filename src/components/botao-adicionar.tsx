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
        className="flex h-12 w-12 items-center justify-center rounded-full bg-(--accent) text-white shadow-sm transition-transform active:scale-95 hover:bg-(--accent-hover)"
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
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-(--accent) text-(--accent) transition-transform active:scale-95 hover:bg-(--accent-light)"
      >
        <Minus size={16} weight="bold" aria-hidden />
      </button>
      <span className="min-w-[1.25rem] text-center text-sm font-semibold text-(--text-primary)">
        {quantidade}
      </span>
      <button
        type="button"
        aria-label="Adicionar mais um ao carrinho"
        onClick={() => adicionar(lojaSlug, produtoId)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-(--accent) text-white shadow-sm transition-transform active:scale-95 hover:bg-(--accent-hover)"
      >
        <Plus size={20} weight="bold" aria-hidden />
      </button>
    </div>
  );
}
