/* src/app/(app)/lojas/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import { lojas } from "@/data/lojas";
import { formatarPreco } from "@/lib/pedido";

export const metadata: Metadata = { title: "Lojas" };

export default function Lojas() {
  return (
    <div className="space-y-6">
      {/* Hero strip */}
      <section className="-mx-4 bg-(--dark) px-4 py-8 text-white">
        <h1 className="font-heading text-2xl font-bold">
          O que você quer pedir hoje?
        </h1>
        <p className="mt-1 text-sm text-white/70">
          Escolha uma loja e monte seu pedido.
        </p>
      </section>

      {/* Grid de lojas */}
      <ul className="grid gap-4 sm:grid-cols-2">
        {lojas.map((loja) => (
          <li key={loja.slug}>
            <Link
              href={`/loja/${loja.slug}`}
              className="block h-full overflow-hidden rounded-2xl border border-(--border) bg-white shadow-sm transition-all hover:border-(--accent) hover:shadow-md focus-visible:outline-(--accent)"
            >
              <div className="flex h-28 items-center justify-center bg-(--accent)">
                <span className="font-heading text-5xl font-bold text-white/90 select-none">
                  {loja.nome[0]}
                </span>
              </div>
              <div className="p-4">
                <h2 className="font-heading text-base font-semibold text-(--text-primary)">
                  {loja.nome}
                </h2>
                <p className="mt-0.5 line-clamp-2 text-sm text-(--text-muted)">
                  {loja.descricao}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-(--text-muted)">
                  <span className="flex items-center gap-1">
                    <Clock size={12} aria-hidden />
                    {loja.horario}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} aria-hidden />
                    Mín. {formatarPreco(loja.pedidoMinimo)}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
