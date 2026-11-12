/* src/components/landing/partner-cta.tsx */
export function PartnerCta() {
  return (
    <section className="bg-(--dark)">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-24 text-center">
        <h2 className="font-heading text-3xl font-extrabold text-white md:text-5xl">
          Traga seu restaurante
          <br />
          para o CucoFood.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/60 md:text-lg">
          Sem taxa de entrada. Sem contrato. Só resultados.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:parceiros@cucofood.com.br"
            className="inline-flex items-center gap-2 rounded-xl bg-(--accent) px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-(--accent-hover)"
          >
            Falar com a gente →
          </a>
          <span className="text-sm text-white/50">parceiros@cucofood.com.br</span>
        </div>
      </div>
    </section>
  );
}
