import type { Loja } from "@/lib/types";

/**
 * Cardápios de exemplo. Troque pelos dados reais das lojas da cidade.
 * Os preços estão em centavos (R$ 25,00 = 2500).
 */
export const lojas: Loja[] = [
  {
    slug: "lanchonete-da-praca",
    nome: "Lanchonete da Praça",
    descricao: "Lanches, porções e sucos naturais.",
    whatsapp: "5500000000000",
    horario: "Ter a dom, 18h às 23h",
    pedidoMinimo: 2000,
    aceitaRetirada: true,
    bairros: [
      { nome: "Centro", taxa: 500 },
      { nome: "Vila Nova", taxa: 700 },
      { nome: "Jardim América", taxa: 800 },
      { nome: "Zona Rural (próximo)", taxa: 1500 },
    ],
    categorias: [
      {
        id: "lanches",
        nome: "Lanches",
        produtos: [
          {
            id: "x-salada",
            nome: "X-Salada",
            descricao: "Pão, hambúrguer, queijo, alface, tomate e maionese.",
            preco: 2200,
          },
          {
            id: "x-bacon",
            nome: "X-Bacon",
            descricao: "Pão, hambúrguer, queijo, bacon e maionese da casa.",
            preco: 2600,
          },
          {
            id: "x-tudo",
            nome: "X-Tudo",
            descricao: "Hambúrguer, ovo, bacon, presunto, queijo, salada e batata palha.",
            preco: 3200,
          },
        ],
      },
      {
        id: "porcoes",
        nome: "Porções",
        produtos: [
          { id: "batata", nome: "Batata frita (500 g)", preco: 2500 },
          { id: "frango", nome: "Frango a passarinho (500 g)", preco: 3800 },
        ],
      },
      {
        id: "bebidas",
        nome: "Bebidas",
        produtos: [
          { id: "refri-lata", nome: "Refrigerante lata", preco: 600 },
          { id: "suco-laranja", nome: "Suco de laranja (500 ml)", preco: 900 },
          { id: "agua", nome: "Água mineral", preco: 400, disponivel: false },
        ],
      },
    ],
  },
  {
    slug: "pizzaria-bella-massa",
    nome: "Pizzaria Bella Massa",
    descricao: "Pizzas no forno a lenha e esfihas.",
    whatsapp: "5500000000001",
    horario: "Qua a dom, 18h30 às 23h30",
    pedidoMinimo: 4000,
    aceitaRetirada: true,
    bairros: [
      { nome: "Centro", taxa: 600 },
      { nome: "Vila Nova", taxa: 800 },
      { nome: "Jardim América", taxa: 800 },
    ],
    categorias: [
      {
        id: "pizzas",
        nome: "Pizzas (8 pedaços)",
        produtos: [
          {
            id: "mussarela",
            nome: "Mussarela",
            descricao: "Molho, mussarela, tomate e orégano.",
            preco: 5200,
          },
          {
            id: "calabresa",
            nome: "Calabresa",
            descricao: "Molho, calabresa fatiada e cebola.",
            preco: 5400,
          },
          {
            id: "frango-catupiry",
            nome: "Frango com catupiry",
            descricao: "Frango desfiado temperado e catupiry original.",
            preco: 6200,
          },
        ],
      },
      {
        id: "esfihas",
        nome: "Esfihas",
        produtos: [
          { id: "esfiha-carne", nome: "Esfiha de carne", preco: 700 },
          { id: "esfiha-queijo", nome: "Esfiha de queijo", preco: 700 },
        ],
      },
      {
        id: "bebidas",
        nome: "Bebidas",
        produtos: [{ id: "refri-2l", nome: "Refrigerante 2 L", preco: 1400 }],
      },
    ],
  },
];

export function buscarLoja(slug: string): Loja | undefined {
  return lojas.find((loja) => loja.slug === slug);
}
