import type { Metadata } from "next";
import { CalculateurTaxeSejour } from "@/components/taxe-sejour/CalculateurTaxeSejour";

export const metadata: Metadata = {
  title: "Calculateur taxe de séjour par commune 2026 — tarifs officiels DELTA",
  description:
    "Calculez gratuitement la taxe de séjour de votre commune : tarifs officiels 2026 par catégorie d'hébergement (meublé de tourisme, chambre d'hôtes, non classé) issus de la base DELTA de la DGFiP. Simulation du montant par séjour et rappel des exonérations.",
  alternates: {
    canonical: "/taxe-sejour",
  },
};

export default function TaxeSejourPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Outil gratuit
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Calculateur de taxe de séjour par commune
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
          Retrouvez les tarifs officiels votés par votre commune (base DELTA de
          la DGFiP) et estimez en quelques secondes le montant à collecter
          auprès de vos voyageurs.
        </p>
      </div>
      <CalculateurTaxeSejour />
    </main>
  );
}
