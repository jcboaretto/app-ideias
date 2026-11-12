/* src/components/landing/hero.tsx */
export function LandingHero() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, #EDE9FE 0%, transparent 65%), #FFFFFF",
      }}
    >
      <div className="mx-auto w-full max-w-screen-lg px-4 py-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-(--border) bg-white px-3 py-1 text-xs font-medium text-(--text-muted)">
            <span className="h-1.5 w-1.5 rounded-full bg-(--accent)" />
            Delivery local · sem taxas de entrada
          </div>

          {/* Headline */}
          <h1 className="font-heading text-6xl font-extrabold leading-none tracking-tight text-(--text-primary) md:text-8xl">
            Delivery que
            <br />
            respeita sua
            <br />
            <span className="text-(--accent)">cidade.</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-xl text-lg text-(--text-muted) md:text-xl">
            CucoFood conecta restaurantes locais a clientes que valorizam o que
            é de verdade.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <a
              href="/lojas"
              className="inline-flex items-center gap-2 rounded-xl bg-(--accent) px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-(--accent-hover)"
            >
              Fazer pedido →
            </a>
            <a
              href="#parceiros"
              className="inline-flex items-center gap-2 rounded-xl border border-(--border) bg-white px-6 py-3 text-base font-semibold text-(--text-primary) transition-colors hover:border-(--accent)"
            >
              Seja parceiro
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
