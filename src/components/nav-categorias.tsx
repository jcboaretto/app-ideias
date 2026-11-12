"use client";

import { useEffect, useState } from "react";

type Categoria = { id: string; nome: string };

export function NavCategorias({ categorias }: { categorias: Categoria[] }) {
  const [ativa, setAtiva] = useState(categorias[0]?.id ?? "");

  useEffect(() => {
    if (categorias.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visivel = entries.find((e) => e.isIntersecting);
        if (visivel) setAtiva(visivel.target.id);
      },
      { threshold: 0.2, rootMargin: "-120px 0px -55% 0px" },
    );
    categorias.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [categorias]);

  return (
    <nav
      aria-label="Categorias do cardápio"
      className="sticky top-14 z-30 -mx-4 border-b border-(--border) bg-(--background)"
    >
      <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-2">
        {categorias.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              ativa === c.id
                ? "bg-(--accent) text-white"
                : "border border-(--border) bg-white text-(--text-muted) hover:border-(--accent)"
            }`}
          >
            {c.nome}
          </a>
        ))}
      </div>
    </nav>
  );
}
