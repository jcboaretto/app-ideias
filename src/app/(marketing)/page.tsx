/* src/app/(marketing)/page.tsx */
import Link from "next/link";

export default function LandingPlaceholder() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="font-heading text-4xl font-extrabold text-[--text-primary]">
        Cuco<span className="text-[--accent]">•</span>Food
      </h1>
      <p className="text-[--text-muted]">Landing page em construção.</p>
      <Link
        href="/lojas"
        className="rounded-lg bg-[--accent] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[--accent-hover]"
      >
        Ver lojas →
      </Link>
    </main>
  );
}
