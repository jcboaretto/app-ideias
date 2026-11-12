"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft, Minus, Plus, Trash } from "@phosphor-icons/react";
import { finalizarPedido } from "@/app/actions";
import { useCarrinho } from "@/components/carrinho-provider";
import { buscarLoja } from "@/data/lojas";
import { calcularPedido, formatarPreco } from "@/lib/pedido";
import type { FormaPagamento } from "@/lib/types";

const campoBase =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent-light) transition-colors";

export function Checkout() {
  const carrinho = useCarrinho();
  const loja = carrinho.lojaSlug ? buscarLoja(carrinho.lojaSlug) : undefined;

  const [tipoEntrega, setTipoEntrega] = useState<"entrega" | "retirada">("entrega");
  const [bairro, setBairro] = useState("");
  const [pagamento, setPagamento] = useState<FormaPagamento>("pix");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, iniciar] = useTransition();

  if (!loja || carrinho.itens.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-5xl">🛒</span>
        <h1 className="font-heading text-xl font-bold text-(--text-primary)">
          Seu carrinho está vazio
        </h1>
        <p className="text-sm text-(--text-muted)">Adicione itens de uma loja para fazer seu pedido.</p>
        <Link
          href="/lojas"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-(--accent) px-6 py-3 text-sm font-semibold text-white hover:bg-(--accent-hover) transition-colors"
        >
          <ArrowLeft size={16} aria-hidden />
          Ver lojas
        </Link>
      </div>
    );
  }

  const calculo = calcularPedido(
    loja,
    carrinho.itens,
    tipoEntrega === "entrega" ? bairro : undefined,
  );
  const faltaMinimo = calculo.subtotal < loja.pedidoMinimo;

  function enviar(form: FormData) {
    setErro(null);
    const troco = Number(String(form.get("troco") ?? "").replace(",", "."));
    iniciar(async () => {
      const resultado = await finalizarPedido({
        lojaSlug: loja!.slug,
        itens: carrinho.itens,
        cliente: {
          nome: String(form.get("nome") ?? ""),
          telefone: String(form.get("telefone") ?? ""),
        },
        entrega:
          tipoEntrega === "retirada"
            ? { tipo: "retirada" }
            : {
                tipo: "entrega",
                bairro,
                endereco: String(form.get("endereco") ?? ""),
                referencia: String(form.get("referencia") ?? ""),
              },
        pagamento,
        trocoPara: troco > 0 ? Math.round(troco * 100) : undefined,
      });
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      carrinho.limpar();
      window.location.href = resultado.linkWhatsApp;
    });
  }

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="font-heading text-2xl font-bold text-(--text-primary)">Seu pedido</h1>
        <p className="text-sm text-(--text-muted)">
          em{" "}
          <Link href={`/loja/${loja.slug}`} className="font-medium text-(--accent) hover:underline">
            {loja.nome}
          </Link>
        </p>
      </div>

      <ul className="space-y-2">
        {calculo.itens.map((item) => (
          <li
            key={item.produto.id}
            className="rounded-2xl border border-(--border) bg-white p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-semibold text-sm text-(--text-primary)">{item.produto.nome}</span>
              <span className="font-semibold text-sm text-(--price) shrink-0">
                {formatarPreco(item.subtotal)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Diminuir ${item.produto.nome}`}
                  onClick={() =>
                    carrinho.alterarQuantidade(item.produto.id, item.quantidade - 1)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-(--border) text-(--accent) hover:border-(--accent) transition-colors"
                >
                  {item.quantidade === 1 ? (
                    <Trash size={14} weight="bold" aria-hidden />
                  ) : (
                    <Minus size={14} weight="bold" aria-hidden />
                  )}
                </button>
                <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                  {item.quantidade}
                </span>
                <button
                  type="button"
                  aria-label={`Aumentar ${item.produto.nome}`}
                  onClick={() =>
                    carrinho.alterarQuantidade(item.produto.id, item.quantidade + 1)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-(--accent) text-white hover:bg-(--accent-hover) transition-colors"
                >
                  <Plus size={14} weight="bold" aria-hidden />
                </button>
              </div>
              <input
                type="text"
                placeholder="Observação (ex.: sem cebola)"
                defaultValue={item.observacao ?? ""}
                onBlur={(e) => carrinho.alterarObservacao(item.produto.id, e.target.value)}
                maxLength={200}
                className="flex-1 rounded-xl border border-(--border) bg-(--surface) px-3 py-1.5 text-xs focus:border-(--accent) focus:outline-none"
              />
            </div>
          </li>
        ))}
      </ul>

      <form action={enviar} className="space-y-5">
        <section className="rounded-2xl border border-(--border) bg-white p-4 space-y-3">
          <h2 className="font-heading font-semibold text-(--text-primary)">Seus dados</h2>
          <input name="nome" required placeholder="Nome completo" autoComplete="name" className={campoBase} />
          <input name="telefone" required type="tel" inputMode="tel" placeholder="Telefone com DDD" autoComplete="tel" className={campoBase} />
        </section>

        <section className="rounded-2xl border border-(--border) bg-white p-4 space-y-3">
          <h2 className="font-heading font-semibold text-(--text-primary)">Entrega</h2>
          {loja.aceitaRetirada && (
            <div className="flex overflow-hidden rounded-xl border border-(--border)">
              {(["entrega", "retirada"] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setTipoEntrega(tipo)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    tipoEntrega === tipo
                      ? "bg-(--accent) text-white"
                      : "bg-white text-(--text-muted) hover:bg-(--accent-light)"
                  }`}
                >
                  {tipo === "entrega" ? "Entregar" : "Retirar no local"}
                </button>
              ))}
            </div>
          )}
          {tipoEntrega === "entrega" && (
            <>
              <select required value={bairro} onChange={(e) => setBairro(e.target.value)} className={campoBase}>
                <option value="">Escolha o bairro</option>
                {loja.bairros.map((b) => (
                  <option key={b.nome} value={b.nome}>
                    {b.nome} ({formatarPreco(b.taxa)})
                  </option>
                ))}
              </select>
              <input name="endereco" required placeholder="Rua e número" autoComplete="street-address" inputMode="text" className={campoBase} />
              <input name="referencia" placeholder="Ponto de referência (opcional)" className={campoBase} />
            </>
          )}
        </section>

        <section className="rounded-2xl border border-(--border) bg-white p-4 space-y-3">
          <h2 className="font-heading font-semibold text-(--text-primary)">Pagamento</h2>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["pix", "Pix"],
                ["dinheiro", "Dinheiro"],
                ["cartao", "Cartão"],
              ] as const
            ).map(([valor, rotulo]) => (
              <button
                key={valor}
                type="button"
                onClick={() => setPagamento(valor)}
                className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                  pagamento === valor
                    ? "border-(--accent) bg-(--accent-light) text-(--accent)"
                    : "border-(--border) bg-white text-(--text-muted) hover:border-(--accent)"
                }`}
              >
                {rotulo}
              </button>
            ))}
          </div>
          {pagamento === "dinheiro" && (
            <input name="troco" inputMode="numeric" placeholder="Troco para quanto? (opcional)" className={campoBase} />
          )}
        </section>

        <section className="rounded-2xl border border-(--border) bg-white p-4 space-y-2 text-sm">
          <div className="flex justify-between text-(--text-muted)">
            <span>Subtotal</span>
            <span>{formatarPreco(calculo.subtotal)}</span>
          </div>
          {tipoEntrega === "entrega" && (
            <div className="flex justify-between text-(--text-muted)">
              <span>Entrega</span>
              <span>{bairro ? formatarPreco(calculo.taxaEntrega) : "— escolha o bairro"}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-(--border) font-bold text-base text-(--text-primary)">
            <span>Total</span>
            <span className="text-(--price)">{formatarPreco(calculo.total)}</span>
          </div>
        </section>

        {faltaMinimo && (
          <p className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            Pedido mínimo de {formatarPreco(loja.pedidoMinimo)}. Faltam{" "}
            {formatarPreco(loja.pedidoMinimo - calculo.subtotal)}.
          </p>
        )}
        {erro && (
          <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando || faltaMinimo}
          className="w-full rounded-2xl bg-(--accent) px-4 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-(--accent-hover) active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? "Enviando..." : "Enviar pelo WhatsApp →"}
        </button>
      </form>
    </div>
  );
}
