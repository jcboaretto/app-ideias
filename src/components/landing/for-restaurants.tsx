/* src/components/landing/for-restaurants.tsx */
import { RocketLaunch, ChartBar, Headset } from "@phosphor-icons/react/dist/ssr";

type PhosphorIcon = typeof RocketLaunch;

type CardProps = {
  Icon: PhosphorIcon;
  title: string;
  desc: string;
};

const cards: CardProps[] = [
  {
    Icon: RocketLaunch,
    title: "Zero setup",
    desc: "Cadastre-se em 5 minutos, sem taxa de entrada e sem contrato.",
  },
  {
    Icon: ChartBar,
    title: "Dashboard ao vivo",
    desc: "Acompanhe pedidos em tempo real, direto do celular.",
  },
  {
    Icon: Headset,
    title: "Suporte local",
    desc: "Time na sua cidade, pronto para ajudar quando precisar.",
  },
];

export function ForRestaurants() {
  return (
    <section
      id="parceiros"
      className="mx-auto w-full max-w-screen-lg px-4 py-20"
    >
      <div className="mb-10 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-(--accent)">
          Para restaurantes
        </p>
        <h2 className="font-heading mt-2 text-3xl font-bold text-(--text-primary) md:text-4xl">
          Para quem quer crescer
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map(({ Icon, title, desc }) => (
          <li
            key={title}
            className="rounded-xl border border-(--border) p-6 transition-colors hover:border-(--accent)"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-(--accent-light)">
              <Icon size={20} className="text-(--accent)" aria-hidden weight="bold" />
            </div>
            <h3 className="font-heading text-lg font-bold text-(--text-primary)">
              {title}
            </h3>
            <p className="mt-2 text-sm text-(--text-muted)">{desc}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <a
          href="mailto:parceiros@cucofood.com.br"
          className="inline-flex items-center gap-2 rounded-xl bg-(--accent) px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-(--accent-hover)"
        >
          Cadastrar meu restaurante →
        </a>
      </div>
    </section>
  );
}
