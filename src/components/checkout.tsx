"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { finalizarPedido } from "@/app/actions";
import { useCarrinho } from "@/components/carrinho-provider";
import { buscarLoja } from "@/data/lojas";
import { calcularPedido, formatarPreco } from "@/lib/pedido";
import type { FormaPagamento } from "@/lib/types";

const campo =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-orange-500 focus:outline-none";

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
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
        <Link href="/" className="inline-block text-orange-700 underline">
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Seu pedido</h1>
        <p className="text-stone-600">
          em{" "}
          <Link href={`/loja/${loja.slug}`} className="text-orange-700 underline">
            {loja.nome}
          </Link>
        </p>
      </div>

      <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
        {calculo.itens.map((item) => (
          <li key={item.produto.id} className="space-y-2 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{item.produto.nome}</span>
              <span className="font-semibold">{formatarPreco(item.subtotal)}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={`Diminuir ${item.produto.nome}`}
                onClick={() => carrinho.alterarQuantidade(item.produto.id, item.quantidade - 1)}
                className="h-8 w-8 rounded-full border border-stone-300"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantidade}</span>
              <button
                type="button"
                aria-label={`Aumentar ${item.produto.nome}`}
                onClick={() => carrinho.alterarQuantidade(item.produto.id, item.quantidade + 1)}
                className="h-8 w-8 rounded-full border border-stone-300"
              >
                +
              </button>
              <input
                type="text"
                placeholder="Observação (ex.: sem cebola)"
                defaultValue={item.observacao ?? ""}
                onBlur={(e) => carrinho.alterarObservacao(item.produto.id, e.target.value)}
                maxLength={200}
                className={`${campo} flex-1 py-1 text-sm`}
              />
            </div>
          </li>
        ))}
      </ul>

      <form action={enviar} className="space-y-5">
        <fieldset className="space-y-3">
          <legend className="mb-2 font-semibold">Seus dados</legend>
          <input name="nome" required placeholder="Nome" autoComplete="name" className={campo} />
          <input
            name="telefone"
            required
            type="tel"
            placeholder="Telefone com DDD"
            autoComplete="tel"
            className={campo}
          />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-2 font-semibold">Entrega</legend>
          {loja.aceitaRetirada && (
            <div className="flex gap-2">
              {(["entrega", "retirada"] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setTipoEntrega(tipo)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                    tipoEntrega === tipo
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-stone-300 bg-white"
                  }`}
                >
                  {tipo === "entrega" ? "Entregar em casa" : "Retirar no local"}
                </button>
              ))}
            </div>
          )}
          {tipoEntrega === "entrega" && (
            <>
              <select
                required
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className={campo}
              >
                <option value="">Escolha o bairro</option>
                {loja.bairros.map((b) => (
                  <option key={b.nome} value={b.nome}>
                    {b.nome} ({formatarPreco(b.taxa)})
                  </option>
                ))}
              </select>
              <input
                name="endereco"
                required
                placeholder="Rua e número"
                autoComplete="street-address"
                className={campo}
              />
              <input name="referencia" placeholder="Ponto de referência" className={campo} />
            </>
          )}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-2 font-semibold">Pagamento</legend>
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
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  pagamento === valor
                    ? "border-orange-600 bg-orange-50 text-orange-700"
                    : "border-stone-300 bg-white"
                }`}
              >
                {rotulo}
              </button>
            ))}
          </div>
          {pagamento === "dinheiro" && (
            <input
              name="troco"
              inputMode="decimal"
              placeholder="Troco para quanto? (opcional)"
              className={campo}
            />
          )}
        </fieldset>

        <div className="space-y-1 rounded-xl border border-stone-200 bg-white p-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatarPreco(calculo.subtotal)}</span>
          </div>
          {tipoEntrega === "entrega" && (
            <div className="flex justify-between">
              <span>Entrega</span>
              <span>{bairro ? formatarPreco(calculo.taxaEntrega) : "escolha o bairro"}</span>
            </div>
          )}
          <div className="flex justify-between pt-1 text-base font-bold">
            <span>Total</span>
            <span>{formatarPreco(calculo.total)}</span>
          </div>
        </div>

        {faltaMinimo && (
          <p className="text-sm text-amber-700">
            Pedido mínimo de {formatarPreco(loja.pedidoMinimo)}. Faltam{" "}
            {formatarPreco(loja.pedidoMinimo - calculo.subtotal)}.
          </p>
        )}
        {erro && (
          <p role="alert" className="text-sm text-red-700">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando || faltaMinimo}
          className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {enviando ? "Enviando..." : "Enviar pedido pelo WhatsApp"}
        </button>
      </form>
    </div>
  );
}
