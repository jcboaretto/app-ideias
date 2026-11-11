import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Carrinho | Peça na Cidade" };

export default function PaginaCarrinho() {
  return <Checkout />;
}
