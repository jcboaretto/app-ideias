import Link from "next/link";
import { lojas } from "@/data/lojas";
import { formatarPreco } from "@/lib/pedido";

export default function Inicio() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Peça das lojas da cidade</h1>
        <p className="mt-1 text-stone-600">
          Escolha uma loja, monte seu pedido e envie direto pelo WhatsApp.
        </p>
      </section>

      <ul className="grid gap-4 sm:grid-cols-2">
        {lojas.map((loja) => (
          <li key={loja.slug}>
            <Link
              href={`/loja/${loja.slug}`}
              className="block h-full rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-orange-400"
            >
              <h2 className="text-lg font-semibold">{loja.nome}</h2>
              <p className="text-sm text-stone-600">{loja.descricao}</p>
              <p className="mt-3 text-xs text-stone-500">{loja.horario}</p>
              <p className="text-xs text-stone-500">
                Pedido mínimo {formatarPreco(loja.pedidoMinimo)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
