/* src/components/landing/how-it-works.tsx */
const steps = [
  {
    num: "01",
    title: "Escolha uma loja",
    desc: "Veja os restaurantes disponíveis perto de você.",
  },
  {
    num: "02",
    title: "Monte seu pedido",
    desc: "Adicione itens ao carrinho com um toque.",
  },
  {
    num: "03",
    title: "Receba em casa",
    desc: "Entrega ou retirada — você escolhe.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="mx-auto w-full max-w-screen-lg px-4 py-20"
    >
      <h2 className="font-heading mb-12 text-center text-3xl font-bold text-[--text-primary] md:text-4xl">
        Como funciona
      </h2>
      <ol className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {steps.map(({ num, title, desc }) => (
          <li key={num} className="flex flex-col gap-3">
            <span
              className="font-heading text-7xl font-extrabold leading-none select-none"
              style={{ color: "#EDE9FE" }}
              aria-hidden
            >
              {num}
            </span>
            <h3 className="font-heading text-xl font-bold text-[--text-primary]">
              {title}
            </h3>
            <p className="text-[--text-muted]">{desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
