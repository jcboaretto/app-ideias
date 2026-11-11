import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { buscarLoja } from "@/data/lojas";
import { formatarPreco } from "@/lib/pedido";
import { supabaseServidor } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Painel | Peça na Cidade",
  robots: { index: false },
};

type PedidoSalvo = {
  numero: number;
  criado_em: string;
  loja_slug: string;
  cliente_nome: string;
  cliente_telefone: string;
  entrega: { tipo: "retirada" } | { tipo: "entrega"; bairro: string; endereco: string };
  pagamento: string;
  itens: { nome: string; quantidade: number; observacao: string | null }[];
  total: number;
};

export default function Painel() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pedidos recentes</h1>
      <Suspense fallback={<p className="text-stone-500">Carregando pedidos...</p>}>
        <ListaPedidos />
      </Suspense>
    </div>
  );
}

async function ListaPedidos() {
  await connection();
  const supabase = supabaseServidor();
  if (!supabase) {
    return (
      <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
        O Supabase ainda não está configurado. Por enquanto os pedidos chegam só pelo WhatsApp.
        Veja o README para conectar o banco.
      </p>
    );
  }

  const { data, error } = await supabase
    .from("pedidos")
    .select(
      "numero, criado_em, loja_slug, cliente_nome, cliente_telefone, entrega, pagamento, itens, total",
    )
    .order("criado_em", { ascending: false })
    .limit(50);

  if (error) {
    return <p className="text-red-700">Erro ao carregar pedidos: {error.message}</p>;
  }
  const pedidos = (data ?? []) as PedidoSalvo[];
  if (pedidos.length === 0) return <p className="text-stone-500">Nenhum pedido ainda.</p>;

  return (
    <ul className="space-y-3">
      {pedidos.map((p) => (
        <li key={p.numero} className="rounded-xl border border-stone-200 bg-white p-4 text-sm">
          <div className="flex justify-between font-semibold">
            <span>
              #{p.numero} · {buscarLoja(p.loja_slug)?.nome ?? p.loja_slug}
            </span>
            <span>{formatarPreco(p.total)}</span>
          </div>
          <p className="text-stone-500">
            {new Date(p.criado_em).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
          </p>
          <p className="mt-2">
            {p.cliente_nome} · {p.cliente_telefone}
          </p>
          <p>
            {p.entrega.tipo === "entrega"
              ? `${p.entrega.endereco} - ${p.entrega.bairro}`
              : "Retirada no local"}{" "}
            · {p.pagamento}
          </p>
          <ul className="mt-2 list-inside list-disc text-stone-700">
            {p.itens.map((i, idx) => (
              <li key={idx}>
                {i.quantidade}x {i.nome}
                {i.observacao ? ` (${i.observacao})` : ""}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
