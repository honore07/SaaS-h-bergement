import type { Metadata } from "next";
import { RegistreClient } from "@/components/registre/RegistreClient";

export const metadata: Metadata = {
  title: "Registre du logeur : modèle légal gratuit",
  description:
    "Tenez votre registre du logeur en ligne gratuitement : saisie des séjours, calcul automatique de la taxe de séjour et export PDF conforme à l'article R2333-51 du CGCT.",
  keywords: [
    "registre du logeur",
    "modèle registre du logeur",
    "taxe de séjour",
    "R2333-51 CGCT",
    "meublé de tourisme",
  ],
  alternates: { canonical: "/registre" },
};

export default function RegistrePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600">
          Obligation légale — art. R2333-51 CGCT
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
          Registre du logeur : modèle légal gratuit
        </h1>
        <p className="mt-4 text-base leading-relaxed text-foreground/70">
          Le registre du logeur est le document dans lequel tout hébergeur
          collecteur de la taxe de séjour consigne, pour chaque séjour, les
          informations nécessaires au calcul et au reversement de la taxe :
          dates, nombre de personnes hébergées, personnes exonérées, tarif
          appliqué et montant perçu. Il est exigé par l&apos;article R2333-51
          du Code général des collectivités territoriales et doit pouvoir être
          présenté à votre commune.
        </p>
        <div className="mt-5 rounded-xl border border-accent-300 bg-accent-50 px-5 py-4 text-sm leading-relaxed text-accent-900">
          <strong className="font-semibold">Bon à savoir :</strong> le registre
          reste obligatoire même quand Airbnb ou Booking collectent la taxe de
          séjour à votre place. Les plateformes reversent la taxe, mais la
          tenue du registre reste votre responsabilité d&apos;hébergeur.
        </div>
      </header>

      <RegistreClient />
    </div>
  );
}
