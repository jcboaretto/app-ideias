/* src/app/(app)/painel/page.tsx */
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { CreditCard, MapPin, Motorcycle } from "@phosphor-icons/react/dist/ssr";
import { buscarLoja } from "@/data/lojas";
import { formatarPreco } from "@/lib/pedido";
import { supabaseServidor } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Painel",
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
  status: string;
};

const corStatus: Record<string, string> = {
  novo: "bg-(--accent-light) text-(--accent)",
  preparando: "bg-amber-100 text-amber-700",
  saiu_para_entrega: "bg-blue-100 text-blue-700",
  entregue: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

const rotuloStatus: Record<string, string> = {
  novo: "Novo",
  preparando: "Preparando",
  saiu_para_entrega: "Saiu p/ entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export default function Painel() {
  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold text-(--text-primary)">Pedidos recentes</h1>
      <Suspense fallback={<p className="text-sm text-(--text-muted)">Carregando pedidos...</p>}>
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
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        O Supabase ainda não está configurado. Por enquanto os pedidos chegam só pelo WhatsApp.
      </div>
    );
  }

  const { data, error } = await supabase
    .from("pedidos")
    .select(
      "numero, criado_em, loja_slug, cliente_nome, cliente_telefone, entrega, pagamento, itens, total, status",
    )
    .order("criado_em", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Erro ao carregar pedidos: {error.message}
      </p>
    );
  }

  const pedidos = (data ?? []) as PedidoSalvo[];

  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-4xl">📋</span>
        <p className="text-sm text-(--text-muted)">Nenhum pedido ainda.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {pedidos.map((p) => (
        <li
          key={p.numero}
          className="rounded-2xl border border-(--border) bg-white p-4 space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-heading font-semibold text-(--text-primary)">
                #{p.numero} · {buscarLoja(p.loja_slug)?.nome ?? p.loja_slug}
              </p>
              <p className="text-xs text-(--text-muted)">
                {new Date(p.criado_em).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  corStatus[p.status] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {rotuloStatus[p.status] ?? p.status}
              </span>
              <span className="font-heading font-bold text-(--price)">
                {formatarPreco(p.total)}
              </span>
            </div>
          </div>

          <div className="text-sm text-(--text-primary) space-y-1">
            <p className="font-medium">
              {p.cliente_nome} · {p.cliente_telefone}
            </p>
            <p className="flex items-center gap-1 text-(--text-muted)">
              {p.entrega.tipo === "entrega" ? (
                <>
                  <MapPin size={13} aria-hidden />
                  {p.entrega.endereco} — {p.entrega.bairro}
                </>
              ) : (
                <>
                  <Motorcycle size={13} aria-hidden />
                  Retirada no local
                </>
              )}
            </p>
            <p className="flex items-center gap-1 text-(--text-muted)">
              <CreditCard size={13} aria-hidden />
              {p.pagamento}
            </p>
          </div>

          <ul className="border-t border-(--border) pt-3 space-y-1">
            {p.itens.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <span className="text-(--text-primary)">
                  {item.quantidade}× {item.nome}
                  {item.observacao && (
                    <span className="text-(--text-muted)"> ({item.observacao})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
