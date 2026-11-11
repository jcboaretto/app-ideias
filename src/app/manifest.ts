import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Peça na Cidade",
    short_name: "Peça",
    description: "Cardápios e delivery das lojas da nossa cidade.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#ea580c",
    lang: "pt-BR",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
