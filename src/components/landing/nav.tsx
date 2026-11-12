/* src/components/landing/nav.tsx */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";

export function LandingNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-(--border) bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-screen-lg items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading text-lg font-extrabold text-(--text-primary)"
          >
            Cuco<span className="text-(--accent)">•</span>Food
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-(--text-muted)">
            <Link href="/lojas" className="hover:text-(--text-primary) transition-colors">
              Restaurantes
            </Link>
            <Link href="#como-funciona" className="hover:text-(--text-primary) transition-colors">
              Como funciona
            </Link>
            <Link href="/lojas" className="hover:text-(--text-primary) transition-colors">
              Entrar
            </Link>
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/lojas"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white hover:bg-(--accent-hover) transition-colors"
          >
            Começar agora →
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-(--border) text-(--text-muted)"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <nav
        aria-label="Menu mobile"
        id="menu-mobile"
        inert={!open || undefined}
        className={`md:hidden fixed top-[57px] inset-x-0 z-40 bg-white border-b border-(--border) transition-transform duration-200 ${
          open ? "translate-y-0" : "-translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          <Link
            href="/lojas"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-(--text-primary) hover:bg-(--surface)"
          >
            Restaurantes
          </Link>
          <Link
            href="#como-funciona"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-(--text-primary) hover:bg-(--surface)"
          >
            Como funciona
          </Link>
          <Link
            href="#parceiros"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-(--text-primary) hover:bg-(--surface)"
          >
            Para restaurantes
          </Link>
          <Link
            href="/lojas"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-(--accent) px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-(--accent-hover)"
          >
            Começar agora →
          </Link>
        </div>
      </nav>
    </>
  );
}
