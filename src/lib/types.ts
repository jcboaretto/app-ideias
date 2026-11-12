export type Produto = {
  id: string;
  nome: string;
  descricao?: string;
  /** Preço em centavos, para evitar erros de arredondamento. */
  preco: number;
  disponivel?: boolean;
  imagem?: string;
};

export type Categoria = {
  id: string;
  nome: string;
  produtos: Produto[];
};

export type Bairro = {
  nome: string;
  /** Taxa de entrega em centavos. */
  taxa: number;
};

export type Loja = {
  slug: string;
  nome: string;
  descricao: string;
  /** Número com DDI e DDD, só dígitos. Ex.: 5517999990000 */
  whatsapp: string;
  horario: string;
  /** Pedido mínimo em centavos. */
  pedidoMinimo: number;
  aceitaRetirada: boolean;
  bairros: Bairro[];
  categorias: Categoria[];
  imagem?: string;
  categoria?: string;
};

export type FormaPagamento = "pix" | "dinheiro" | "cartao";

export type ItemCarrinho = {
  produtoId: string;
  quantidade: number;
  observacao?: string;
};

export type DadosPedido = {
  lojaSlug: string;
  itens: ItemCarrinho[];
  cliente: {
    nome: string;
    telefone: string;
  };
  entrega:
    | { tipo: "retirada" }
    | { tipo: "entrega"; bairro: string; endereco: string; referencia?: string };
  pagamento: FormaPagamento;
  /** Valor em centavos para o qual o cliente precisa de troco. */
  trocoPara?: number;
};

export type ItemCalculado = {
  produto: Produto;
  quantidade: number;
  observacao?: string;
  subtotal: number;
};

export type PedidoCalculado = {
  itens: ItemCalculado[];
  subtotal: number;
  taxaEntrega: number;
  total: number;
};
