import type {
  DadosPedido,
  ItemCarrinho,
  ItemCalculado,
  Loja,
  PedidoCalculado,
  Produto,
} from "@/lib/types";

const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarPreco(centavos: number): string {
  return formatador.format(centavos / 100);
}

export function produtosDaLoja(loja: Loja): Map<string, Produto> {
  return new Map(loja.categorias.flatMap((c) => c.produtos).map((p) => [p.id, p]));
}

/**
 * Calcula os totais sempre a partir do cardápio, nunca a partir de preços
 * enviados pelo navegador.
 */
export function calcularPedido(
  loja: Loja,
  itens: ItemCarrinho[],
  bairro?: string,
): PedidoCalculado {
  const produtos = produtosDaLoja(loja);
  const calculados: ItemCalculado[] = [];

  for (const item of itens) {
    const produto = produtos.get(item.produtoId);
    if (!produto || produto.disponivel === false) continue;
    const quantidade = Math.max(1, Math.min(99, Math.floor(item.quantidade)));
    calculados.push({
      produto,
      quantidade,
      observacao: item.observacao?.trim() || undefined,
      subtotal: produto.preco * quantidade,
    });
  }

  const subtotal = calculados.reduce((soma, i) => soma + i.subtotal, 0);
  const taxaEntrega = bairro
    ? (loja.bairros.find((b) => b.nome === bairro)?.taxa ?? 0)
    : 0;

  return { itens: calculados, subtotal, taxaEntrega, total: subtotal + taxaEntrega };
}

const nomesPagamento = {
  pix: "Pix",
  dinheiro: "Dinheiro",
  cartao: "Cartão na entrega",
} as const;

export function mensagemWhatsApp(
  loja: Loja,
  dados: DadosPedido,
  calculo: PedidoCalculado,
  numeroPedido?: string,
): string {
  const linhas: string[] = [];
  linhas.push(`*Novo pedido${numeroPedido ? ` #${numeroPedido}` : ""} - ${loja.nome}*`);
  linhas.push("");
  for (const item of calculo.itens) {
    linhas.push(`${item.quantidade}x ${item.produto.nome} - ${formatarPreco(item.subtotal)}`);
    if (item.observacao) linhas.push(`   Obs.: ${item.observacao}`);
  }
  linhas.push("");
  linhas.push(`Subtotal: ${formatarPreco(calculo.subtotal)}`);
  if (dados.entrega.tipo === "entrega") {
    linhas.push(`Entrega: ${formatarPreco(calculo.taxaEntrega)}`);
  }
  linhas.push(`*Total: ${formatarPreco(calculo.total)}*`);
  linhas.push("");
  linhas.push(`Cliente: ${dados.cliente.nome}`);
  linhas.push(`Telefone: ${dados.cliente.telefone}`);
  if (dados.entrega.tipo === "entrega") {
    linhas.push(`Endereço: ${dados.entrega.endereco} - ${dados.entrega.bairro}`);
    if (dados.entrega.referencia) linhas.push(`Referência: ${dados.entrega.referencia}`);
  } else {
    linhas.push("Retirada no local");
  }
  linhas.push(`Pagamento: ${nomesPagamento[dados.pagamento]}`);
  if (dados.pagamento === "dinheiro" && dados.trocoPara) {
    linhas.push(`Troco para: ${formatarPreco(dados.trocoPara)}`);
  }
  return linhas.join("\n");
}

export function linkWhatsApp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
