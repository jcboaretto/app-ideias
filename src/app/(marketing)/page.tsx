/* src/app/(marketing)/page.tsx */
import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/nav";
import { LandingHero } from "@/components/landing/hero";
import { StatsStrip } from "@/components/landing/stats-strip";
import { ForRestaurants } from "@/components/landing/for-restaurants";
import { StorePreview } from "@/components/landing/store-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PartnerCta } from "@/components/landing/partner-cta";
import { LandingFooter } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "CucoFood — Delivery dos restaurantes da sua cidade",
  description:
    "Peça nos melhores restaurantes locais. Sem intermediários, com suporte da cidade.",
  openGraph: {
    title: "CucoFood — Delivery dos restaurantes da sua cidade",
    description:
      "Peça nos melhores restaurantes locais. Sem intermediários, com suporte da cidade.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main>
        <LandingHero />
        <StatsStrip />
        <ForRestaurants />
        <StorePreview />
        <HowItWorks />
        <PartnerCta />
      </main>
      <LandingFooter />
    </>
  );
}
