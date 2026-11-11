"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ItemCarrinho } from "@/lib/types";

type Carrinho = { lojaSlug: string | null; itens: ItemCarrinho[] };

type CarrinhoContexto = Carrinho & {
  quantidadeTotal: number;
  adicionar: (lojaSlug: string, produtoId: string) => void;
  alterarQuantidade: (produtoId: string, quantidade: number) => void;
  alterarObservacao: (produtoId: string, observacao: string) => void;
  limpar: () => void;
};

const CHAVE = "carrinho-v1";
const vazio: Carrinho = { lojaSlug: null, itens: [] };

const Contexto = createContext<CarrinhoContexto | null>(null);

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [carrinho, setCarrinho] = useState<Carrinho>(vazio);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do armazenamento local
      if (salvo) setCarrinho(JSON.parse(salvo) as Carrinho);
    } catch {
      // Armazenamento indisponível: segue com carrinho vazio.
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(carrinho));
    } catch {
      // Ignora: o carrinho continua funcionando em memória.
    }
  }, [carrinho, carregado]);

  const adicionar = useCallback(
    (lojaSlug: string, produtoId: string) => {
      const outraLoja =
        carrinho.lojaSlug !== null && carrinho.lojaSlug !== lojaSlug && carrinho.itens.length > 0;
      if (outraLoja) {
        const trocar = window.confirm(
          "Seu carrinho tem itens de outra loja. Deseja esvaziá-lo e começar um novo pedido?",
        );
        if (!trocar) return;
        setCarrinho({ lojaSlug, itens: [{ produtoId, quantidade: 1 }] });
        return;
      }
      setCarrinho((atual) => {
      const existente = atual.itens.find((i) => i.produtoId === produtoId);
      const itens = existente
        ? atual.itens.map((i) =>
            i.produtoId === produtoId ? { ...i, quantidade: i.quantidade + 1 } : i,
          )
        : [...atual.itens, { produtoId, quantidade: 1 }];
      return { lojaSlug, itens };
      });
    },
    [carrinho.lojaSlug, carrinho.itens.length],
  );

  const alterarQuantidade = useCallback((produtoId: string, quantidade: number) => {
    setCarrinho((atual) => {
      const itens =
        quantidade <= 0
          ? atual.itens.filter((i) => i.produtoId !== produtoId)
          : atual.itens.map((i) => (i.produtoId === produtoId ? { ...i, quantidade } : i));
      return itens.length ? { ...atual, itens } : vazio;
    });
  }, []);

  const alterarObservacao = useCallback((produtoId: string, observacao: string) => {
    setCarrinho((atual) => ({
      ...atual,
      itens: atual.itens.map((i) => (i.produtoId === produtoId ? { ...i, observacao } : i)),
    }));
  }, []);

  const limpar = useCallback(() => setCarrinho(vazio), []);

  const valor = useMemo<CarrinhoContexto>(
    () => ({
      ...carrinho,
      quantidadeTotal: carrinho.itens.reduce((s, i) => s + i.quantidade, 0),
      adicionar,
      alterarQuantidade,
      alterarObservacao,
      limpar,
    }),
    [carrinho, adicionar, alterarQuantidade, alterarObservacao, limpar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarrinho(): CarrinhoContexto {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("useCarrinho precisa estar dentro de <CarrinhoProvider>");
  return contexto;
}
