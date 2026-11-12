import Link from "next/link";
import { Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import { lojas } from "@/data/lojas";
import { formatarPreco } from "@/lib/pedido";

export default function Inicio() {
  return (
    <div className="space-y-6">
      {/* Hero strip */}
      <section className="-mx-4 bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-8 text-white">
        <h1 className="font-heading text-2xl font-bold">
          O que você quer pedir hoje?
        </h1>
        <p className="mt-1 text-sm text-orange-100">
          Escolha uma loja e monte seu pedido.
        </p>
      </section>

      {/* Grid de lojas */}
      <ul className="grid gap-4 sm:grid-cols-2">
        {lojas.map((loja) => (
          <li key={loja.slug}>
            <Link
              href={`/loja/${loja.slug}`}
              className="block h-full overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-all hover:border-orange-400 hover:shadow-md focus-visible:outline-orange-600"
            >
              {/* Área de imagem — placeholder com inicial */}
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-orange-500 to-amber-400">
                <span className="font-heading text-5xl font-bold text-white/90 select-none">
                  {loja.nome[0]}
                </span>
              </div>

              {/* Corpo do card */}
              <div className="p-4">
                <h2 className="font-heading text-base font-semibold text-slate-900">
                  {loja.nome}
                </h2>
                <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
                  {loja.descricao}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
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
