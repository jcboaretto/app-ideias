/* src/app/(app)/loja/[slug]/page.tsx */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle, Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import { buscarLoja, lojas } from "@/data/lojas";
import { formatarPreco } from "@/lib/pedido";
import { BotaoAdicionar } from "@/components/botao-adicionar";
import { NavCategorias } from "@/components/nav-categorias";

export function generateStaticParams() {
  return lojas.map((loja) => ({ slug: loja.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loja = buscarLoja(slug);
  return { title: loja ? loja.nome : "Loja não encontrada" };
}

export default async function PaginaLoja({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loja = buscarLoja(slug);
  if (!loja) notFound();

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <section className="-mx-4 bg-(--dark) px-4 py-6 text-white">
        <h1 className="font-heading text-2xl font-bold">{loja.nome}</h1>
        <p className="mt-1 text-sm text-white/70">{loja.descricao}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs">
            <Clock size={12} aria-hidden />
            {loja.horario}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs">
            <MapPin size={12} aria-hidden />
            Mín. {formatarPreco(loja.pedidoMinimo)}
          </span>
          {loja.aceitaRetirada && (
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs">
              <CheckCircle size={12} aria-hidden />
              Aceita retirada
            </span>
          )}
        </div>
      </section>

      {/* Barra de categorias sticky */}
      <NavCategorias
        categorias={loja.categorias.map((c) => ({ id: c.id, nome: c.nome }))}
      />

      {/* Seções do cardápio */}
      {loja.categorias.map((categoria) => (
        <section key={categoria.id} id={categoria.id} className="scroll-mt-32">
          <h2 className="font-heading mb-3 text-lg font-semibold text-(--text-primary)">
            {categoria.nome}
          </h2>
          <ul className="overflow-hidden overscroll-contain rounded-2xl border border-(--border) bg-white divide-y divide-(--border)">
            {categoria.produtos.map((produto) => {
              const disponivel = produto.disponivel !== false;
              return (
                <li key={produto.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-semibold ${
                        disponivel ? "text-(--text-primary)" : "text-slate-400 line-through"
                      }`}
                    >
                      {produto.nome}
                    </h3>
                    {produto.descricao && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-(--text-muted)">
                        {produto.descricao}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-(--price)">
                      {formatarPreco(produto.preco)}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {disponivel ? (
                      <BotaoAdicionar lojaSlug={loja.slug} produtoId={produto.id} />
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400">
                        Esgotado
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
