/* src/components/landing/store-preview.tsx */
import Link from "next/link";
import { Clock } from "@phosphor-icons/react/dist/ssr";
import { lojas } from "@/data/lojas";

export function StorePreview() {
  const preview = lojas.slice(0, 6);

  return (
    <section className="bg-(--surface) border-y border-(--border)">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-heading text-3xl font-bold text-(--text-primary) md:text-4xl">
            O que tem na sua cidade
          </h2>
          <Link
            href="/lojas"
            className="hidden text-sm font-medium text-(--accent) hover:underline sm:block"
          >
            Ver todas →
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {preview.map((loja) => (
            <li key={loja.slug}>
              <Link
                href={`/loja/${loja.slug}`}
                className="block overflow-hidden rounded-2xl border border-(--border) bg-white transition-all hover:border-(--accent) hover:shadow-sm"
              >
                <div className="flex h-20 items-center justify-center bg-(--accent)">
                  <span className="font-heading text-4xl font-bold text-white/90 select-none">
                    {loja.nome[0]}
                  </span>
                </div>
                <div className="p-3">
                  <p className="font-heading text-sm font-semibold text-(--text-primary) truncate">
                    {loja.nome}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-(--text-muted)">
                    <Clock size={11} aria-hidden />
                    {loja.horario}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/lojas"
            className="text-sm font-medium text-(--accent) hover:underline"
          >
            Ver todas as lojas →
          </Link>
        </div>
      </div>
    </section>
  );
}
