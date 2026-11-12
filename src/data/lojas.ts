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
    imagem: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    categoria: "Lanches · Sucos",
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
            imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
          },
          {
            id: "x-bacon",
            nome: "X-Bacon",
            descricao: "Pão, hambúrguer, queijo, bacon e maionese da casa.",
            preco: 2600,
            imagem: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80",
          },
          {
            id: "x-tudo",
            nome: "X-Tudo",
            descricao: "Hambúrguer, ovo, bacon, presunto, queijo, salada e batata palha.",
            preco: 3200,
            imagem: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
          },
        ],
      },
      {
        id: "porcoes",
        nome: "Porções",
        produtos: [
          {
            id: "batata",
            nome: "Batata frita (500 g)",
            preco: 2500,
            imagem: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
          },
          {
            id: "frango",
            nome: "Frango a passarinho (500 g)",
            preco: 3800,
            imagem: "https://images.unsplash.com/photo-1569565804531-f1a2f9456e49?w=400&q=80",
          },
        ],
      },
      {
        id: "bebidas",
        nome: "Bebidas",
        produtos: [
          {
            id: "refri-lata",
            nome: "Refrigerante lata",
            preco: 600,
            imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
          },
          {
            id: "suco-laranja",
            nome: "Suco de laranja (500 ml)",
            preco: 900,
            imagem: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80",
          },
          { id: "agua", nome: "Água mineral", preco: 400, disponivel: false },
        ],
      },
    ],
  },
  {
    slug: "pizzaria-bella-massa",
    nome: "Pizzaria Bella Massa",
    descricao: "Pizzas no forno a lenha e esfihas.",
    imagem: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    categoria: "Pizza · Esfiha",
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
            imagem: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
          },
          {
            id: "calabresa",
            nome: "Calabresa",
            descricao: "Molho, calabresa fatiada e cebola.",
            preco: 5400,
            imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
          },
          {
            id: "frango-catupiry",
            nome: "Frango com catupiry",
            descricao: "Frango desfiado temperado e catupiry original.",
            preco: 6200,
            imagem: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80",
          },
        ],
      },
      {
        id: "esfihas",
        nome: "Esfihas",
        produtos: [
          {
            id: "esfiha-carne",
            nome: "Esfiha de carne",
            preco: 700,
            imagem: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&q=80",
          },
          {
            id: "esfiha-queijo",
            nome: "Esfiha de queijo",
            preco: 700,
            imagem: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&q=80",
          },
        ],
      },
      {
        id: "bebidas",
        nome: "Bebidas",
        produtos: [
          {
            id: "refri-2l",
            nome: "Refrigerante 2 L",
            preco: 1400,
            imagem: "https://images.unsplash.com/photo-1527960669566-f882ba85a4c6?w=400&q=80",
          },
        ],
      },
    ],
  },
];

export function buscarLoja(slug: string): Loja | undefined {
  return lojas.find((loja) => loja.slug === slug);
}
