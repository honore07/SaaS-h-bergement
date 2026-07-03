import type { Metadata } from "next";
import { DiagnosticWizard } from "@/components/diagnostic/DiagnosticWizard";

export const metadata: Metadata = {
  title: "Diagnostic de conformité gratuit en 3 minutes",
  description:
    "8 questions, 3 minutes : vérifiez gratuitement la conformité de votre gîte, chambre d'hôtes ou hébergement insolite. Declaloc, DPE, fiscalité micro-BIC, registre du logeur, taxe de séjour, assurance — obtenez votre score et votre exposition financière en euros.",
  alternates: { canonical: "/diagnostic" },
  openGraph: {
    title: "Diagnostic de conformité gratuit — GîteOuvert",
    description:
      "Vérifiez en 3 minutes si votre meublé de tourisme est en règle et découvrez votre exposition financière.",
  },
};

export default function DiagnosticPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-2xl font-bold sm:text-3xl">
          Diagnostic de conformité de votre hébergement
        </h1>
        <p className="mx-auto max-w-xl text-sm text-foreground/60">
          Declaloc, DPE, fiscalité, taxe de séjour, registre du logeur,
          assurance : faites le point complet sur vos obligations.
        </p>
      </div>
      <DiagnosticWizard />
    </div>
  );
}
