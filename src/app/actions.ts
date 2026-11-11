"use server";

import { buscarLoja } from "@/data/lojas";
import { calcularPedido, linkWhatsApp, mensagemWhatsApp } from "@/lib/pedido";
import { supabaseServidor } from "@/lib/supabase";
import type { DadosPedido, FormaPagamento } from "@/lib/types";

export type ResultadoPedido =
  | { ok: true; linkWhatsApp: string; numero?: string }
  | { ok: false; erro: string };

const pagamentos: FormaPagamento[] = ["pix", "dinheiro", "cartao"];

function texto(valor: unknown, max: number): string {
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}

export async function finalizarPedido(dados: DadosPedido): Promise<ResultadoPedido> {
  const loja = buscarLoja(texto(dados?.lojaSlug, 100));
  if (!loja) return { ok: false, erro: "Loja não encontrada." };

  const nome = texto(dados.cliente?.nome, 80);
  const telefone = texto(dados.cliente?.telefone, 20);
  if (!nome || telefone.replace(/\D/g, "").length < 10) {
    return { ok: false, erro: "Informe seu nome e um telefone com DDD." };
  }
  if (!pagamentos.includes(dados.pagamento)) {
    return { ok: false, erro: "Escolha a forma de pagamento." };
  }

  let entrega: DadosPedido["entrega"];
  if (dados.entrega?.tipo === "retirada") {
    if (!loja.aceitaRetirada) return { ok: false, erro: "Esta loja não aceita retirada." };
    entrega = { tipo: "retirada" };
  } else {
    const bairro = texto(dados.entrega?.bairro, 80);
    const endereco = texto(dados.entrega?.endereco, 200);
    if (!loja.bairros.some((b) => b.nome === bairro)) {
      return { ok: false, erro: "Escolha um bairro atendido." };
    }
    if (!endereco) return { ok: false, erro: "Informe o endereço de entrega." };
    entrega = {
      tipo: "entrega",
      bairro,
      endereco,
      referencia: texto(dados.entrega?.referencia, 200) || undefined,
    };
  }

  const itens = Array.isArray(dados.itens)
    ? dados.itens.slice(0, 50).map((i) => ({
        produtoId: texto(i?.produtoId, 100),
        quantidade: Number(i?.quantidade) || 0,
        observacao: texto(i?.observacao, 200) || undefined,
      }))
    : [];

  const calculo = calcularPedido(
    loja,
    itens,
    entrega.tipo === "entrega" ? entrega.bairro : undefined,
  );
  if (calculo.itens.length === 0) return { ok: false, erro: "Seu carrinho está vazio." };
  if (calculo.subtotal < loja.pedidoMinimo) {
    return { ok: false, erro: "O pedido não atingiu o valor mínimo da loja." };
  }

  const trocoPara =
    dados.pagamento === "dinheiro" && Number(dados.trocoPara) > calculo.total
      ? Math.round(Number(dados.trocoPara))
      : undefined;

  const pedido: DadosPedido = {
    lojaSlug: loja.slug,
    itens,
    cliente: { nome, telefone },
    entrega,
    pagamento: dados.pagamento,
    trocoPara,
  };

  let numero: string | undefined;
  const supabase = supabaseServidor();
  if (supabase) {
    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        loja_slug: loja.slug,
        cliente_nome: nome,
        cliente_telefone: telefone,
        entrega,
        pagamento: pedido.pagamento,
        troco_para: trocoPara ?? null,
        itens: calculo.itens.map((i) => ({
          produto_id: i.produto.id,
          nome: i.produto.nome,
          preco: i.produto.preco,
          quantidade: i.quantidade,
          observacao: i.observacao ?? null,
        })),
        subtotal: calculo.subtotal,
        taxa_entrega: calculo.taxaEntrega,
        total: calculo.total,
      })
      .select("numero")
      .single();
    if (error) {
      console.error("Erro ao salvar pedido no Supabase:", error.message);
      // Mesmo assim o cliente consegue enviar o pedido pelo WhatsApp.
    } else {
      numero = String(data.numero);
    }
  }

  return {
    ok: true,
    numero,
    linkWhatsApp: linkWhatsApp(loja.whatsapp, mensagemWhatsApp(loja, pedido, calculo, numero)),
  };
}
