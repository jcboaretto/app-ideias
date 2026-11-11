import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buscarLoja, lojas } from "@/data/lojas";
import { formatarPreco } from "@/lib/pedido";
import { BotaoAdicionar } from "@/components/botao-adicionar";

export function generateStaticParams() {
  return lojas.map((loja) => ({ slug: loja.slug }));
}

export async function generateMetadata({ params }: PageProps<"/loja/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const loja = buscarLoja(slug);
  return { title: loja ? `${loja.nome} | Peça na Cidade` : "Loja não encontrada" };
}

export default async function PaginaLoja({ params }: PageProps<"/loja/[slug]">) {
  const { slug } = await params;
  const loja = buscarLoja(slug);
  if (!loja) notFound();

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-orange-600 p-5 text-white">
        <h1 className="text-2xl font-bold">{loja.nome}</h1>
        <p className="text-orange-50">{loja.descricao}</p>
        <p className="mt-2 text-sm text-orange-100">
          {loja.horario} · Pedido mínimo {formatarPreco(loja.pedidoMinimo)}
          {loja.aceitaRetirada ? " · Aceita retirada" : ""}
        </p>
      </section>

      <nav className="flex gap-2 overflow-x-auto pb-1">
        {loja.categorias.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="shrink-0 rounded-full border border-stone-300 bg-white px-3 py-1 text-sm"
          >
            {c.nome}
          </a>
        ))}
      </nav>

      {loja.categorias.map((categoria) => (
        <section key={categoria.id} id={categoria.id} className="scroll-mt-20">
          <h2 className="mb-2 text-lg font-semibold">{categoria.nome}</h2>
          <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
            {categoria.produtos.map((produto) => {
              const disponivel = produto.disponivel !== false;
              return (
                <li key={produto.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <h3 className={`font-medium ${disponivel ? "" : "text-stone-400"}`}>
                      {produto.nome}
                    </h3>
                    {produto.descricao && (
                      <p className="text-sm text-stone-600">{produto.descricao}</p>
                    )}
                    <p className="mt-1 font-semibold text-orange-700">
                      {formatarPreco(produto.preco)}
                    </p>
                  </div>
                  {disponivel ? (
                    <BotaoAdicionar lojaSlug={loja.slug} produtoId={produto.id} />
                  ) : (
                    <span className="text-sm text-stone-400">Esgotado</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
