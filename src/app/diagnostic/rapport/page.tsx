import type { Metadata } from "next";
import { RapportView } from "@/components/diagnostic/RapportView";

export const metadata: Metadata = {
  title: "Votre rapport de conformité",
  description:
    "Score de conformité, infractions détectées et exposition financière de votre hébergement touristique.",
  robots: { index: false },
};

export default function RapportPage() {
  return <RapportView />;
}
