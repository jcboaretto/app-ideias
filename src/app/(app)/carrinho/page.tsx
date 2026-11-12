/* src/app/(app)/carrinho/page.tsx */
import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Carrinho" };

export default function PaginaCarrinho() {
  return <Checkout />;
}
