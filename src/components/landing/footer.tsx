/* src/components/landing/footer.tsx */
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-(--dark)">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-heading text-lg font-extrabold text-white">
            Cuco<span className="text-(--accent)">•</span>Food
          </span>

          <nav className="flex flex-wrap gap-4 text-sm text-white/60">
            <Link href="/lojas" className="hover:text-white transition-colors">
              Lojas
            </Link>
            <Link href="#como-funciona" className="hover:text-white transition-colors">
              Como funciona
            </Link>
            <Link href="#parceiros" className="hover:text-white transition-colors">
              Para restaurantes
            </Link>
            <a
              href="mailto:parceiros@cucofood.com.br"
              className="hover:text-white transition-colors"
            >
              Contato
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/40">
          © 2026 CucoFood. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
