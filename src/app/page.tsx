import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { StatsBand } from "@/components/landing/StatsBand";
import { AlertSignals } from "@/components/landing/AlertSignals";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingSummary } from "@/components/landing/PricingSummary";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCta } from "@/components/landing/FinalCta";

export const metadata: Metadata = {
  title:
    "Declaloc, annonce Airbnb supprimée, micro-BIC 2025 : vérifiez la conformité de votre meublé en 3 minutes",
  description:
    "Annonce Airbnb supprimée faute de numéro d'enregistrement ? Declaloc, comment faire ? Micro-BIC meublé 2025 : plafond 15 000 €, abattement 30 %. Diagnostic de conformité gratuit en 3 minutes : score, infractions et exposition en euros, puis régularisation guidée.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <AlertSignals />
      <HowItWorks />
      <PricingSummary />
      <FaqSection />
      <FinalCta />
    </>
  );
}
