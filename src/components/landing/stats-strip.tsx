/* src/components/landing/stats-strip.tsx */
export function StatsStrip() {
  return (
    <section className="bg-(--surface) border-y border-(--border)" aria-label="Estatísticas">
      <div className="mx-auto max-w-screen-lg px-4 py-5">
        <dl className="flex flex-wrap items-center justify-center gap-6 text-center md:gap-12">
          {[
            { value: "12", label: "restaurantes" },
            { value: "1", label: "cidade atendida" },
            { value: "847+", label: "pedidos feitos" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <dt className="font-heading text-2xl font-bold text-(--text-primary) md:text-3xl">
                {value}
              </dt>
              <dd className="text-sm text-(--text-muted)">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
