"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatEuros } from "@/lib/format";
import { track } from "@/lib/tracking";
import { InfractionCard } from "./InfractionCard";
import { ScoreGauge } from "./ScoreGauge";
import { STORAGE_KEY } from "./DiagnosticWizard";
import type { DiagnosticReport } from "@/lib/diagnostic/types";

const PACKS: Record<
  DiagnosticReport["packRecommande"],
  { nom: string; prix: string; contenu: string }
> = {
  essentiel: {
    nom: "Pack Régularisation Essentiel",
    prix: "50 €",
    contenu: "Enregistrement + régularisation fiscale + registre du logeur",
  },
  complet: {
    nom: "Pack Régularisation Complet",
    prix: "99 €",
    contenu: "Essentiel + taxe de séjour + assurance + DPE",
  },
  express: {
    nom: "Pack Régularisation Express",
    prix: "150 €",
    contenu: "Complet + support prioritaire sous 24 h",
  },
};

// Contenu par palier (pattern scorecard « dynamic content per tier »).
function palierPourScore(score: number): {
  titre: string;
  message: string;
  classes: string;
} {
  if (score <= 3) {
    return {
      titre: "Situation critique — régularisation urgente recommandée",
      message:
        "Plusieurs obligations majeures ne sont pas remplies. Chaque semaine compte : une régularisation spontanée réduit fortement les pénalités.",
      classes: "border-red-200 bg-red-50 text-red-800",
    };
  }
  if (score <= 6) {
    return {
      titre: "Fondations fragiles — plusieurs manquements à corriger",
      message:
        "Votre base est là, mais des manquements vous exposent encore. En les traitant dans l'ordre ci-dessous, vous sécurisez rapidement votre activité.",
      classes: "border-accent-300 bg-accent-50 text-accent-800",
    };
  }
  return {
    titre: "Bonne base — quelques ajustements pour être serein",
    message:
      "Vous êtes proche de la conformité complète. Les quelques points restants se corrigent simplement et vous mettent à l'abri des contrôles.",
    classes: "border-brand-200 bg-brand-50 text-brand-800",
  };
}

// Lecture de sessionStorage via useSyncExternalStore : le rendu serveur
// affiche l'état de chargement (sentinelle), le client se resynchronise
// juste après l'hydratation.
const SSR_SENTINEL = "__ssr__";
const subscribe = () => () => {};
const lireStockage = () => sessionStorage.getItem(STORAGE_KEY);
const lireStockageServeur = () => SSR_SENTINEL;

export function RapportView() {
  const router = useRouter();
  const brut = useSyncExternalStore(subscribe, lireStockage, lireStockageServeur);
  const pret = brut !== SSR_SENTINEL;

  const report = useMemo<DiagnosticReport | null>(() => {
    if (!pret || brut === null) return null;
    try {
      return JSON.parse(brut) as DiagnosticReport;
    } catch {
      // Rapport illisible : on retombe sur l'invitation à refaire le diagnostic.
      return null;
    }
  }, [brut, pret]);

  // Événement result_viewed (une seule fois par rapport affiché).
  const resultTrace = useRef(false);
  useEffect(() => {
    if (!report || resultTrace.current) return;
    resultTrace.current = true;
    track("result_viewed", {
      score: report.score,
      pack: report.packRecommande,
    });
  }, [report]);

  function refaire() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    router.push("/diagnostic");
  }

  if (!pret) {
    return (
      <div className="py-24 text-center text-sm text-foreground/50">
        Chargement de votre rapport…
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold">Aucun rapport disponible</h1>
        <p className="mb-8 text-foreground/60">
          Nous n&apos;avons pas trouvé de diagnostic récent. Le rapport est
          généré à la fin du questionnaire, en 3 minutes et sans créer de
          compte.
        </p>
        <Link
          href="/diagnostic"
          className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-800"
        >
          Faire mon diagnostic gratuit
        </Link>
      </div>
    );
  }

  // Infractions dans l'ordre de priorité calculé par le moteur.
  const parId = new Map(report.infractions.map((i) => [i.id, i]));
  const ordonnees = report.priorites
    .map((id) => parId.get(id))
    .filter((i) => i !== undefined);
  // Sécurité : si une infraction n'apparaît pas dans priorites, on l'ajoute.
  for (const infraction of report.infractions) {
    if (!report.priorites.includes(infraction.id)) {
      ordonnees.push(infraction);
    }
  }

  const pack = PACKS[report.packRecommande];
  const palier = palierPourScore(report.score);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
        Votre rapport de conformité
      </h1>

      {/* Score */}
      <Card className="mb-6 flex flex-col items-center gap-2 py-8">
        <ScoreGauge score={report.score} />
        <p className="max-w-md text-center text-sm text-foreground/60">
          {report.infractions.length === 0
            ? "Aucune infraction détectée d'après vos réponses."
            : `${report.infractions.length} infraction${
                report.infractions.length > 1 ? "s" : ""
              } détectée${report.infractions.length > 1 ? "s" : ""} d'après vos réponses.`}
        </p>
        <p className="text-center text-xs text-foreground/50">
          Votre rapport complet vous a également été envoyé par email.
        </p>
      </Card>

      {/* Bandeau exposition totale */}
      {report.expositionTotale > 0 && (
        <div className="mb-6 rounded-2xl bg-red-600 px-6 py-6 text-center text-white shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide opacity-80">
            Exposition financière totale
          </p>
          <p className="mt-1 text-3xl font-bold sm:text-4xl">
            {formatEuros(report.expositionTotale)}
          </p>
          <p className="mt-2 text-sm opacity-90">
            Vous êtes exposé à des pénalités pouvant atteindre{" "}
            {formatEuros(report.expositionTotale)}.
          </p>
        </div>
      )}

      {/* Synthèse */}
      <Card className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">Notre analyse</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
          {report.synthese}
        </p>
      </Card>

      {/* Bandeau de palier (contenu dynamique selon le score) */}
      <div className={`mb-6 rounded-2xl border px-5 py-4 ${palier.classes}`}>
        <p className="font-semibold">{palier.titre}</p>
        <p className="mt-1 text-sm opacity-90">{palier.message}</p>
      </div>

      {/* Infractions par ordre de priorité */}
      {ordonnees.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">
            Vos régularisations, par ordre de priorité
          </h2>
          <div className="space-y-4">
            {ordonnees.map((infraction, index) => (
              <InfractionCard
                key={infraction.id}
                infraction={infraction}
                rang={index + 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA pack recommandé */}
      <div className="mb-8 rounded-2xl border border-brand-700/20 bg-brand-50 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
          Recommandé pour votre situation
        </p>
        <h2 className="mt-1 text-xl font-bold text-brand-900">
          {pack.nom} — {pack.prix}
        </h2>
        <p className="mt-1 text-sm text-brand-900/70">{pack.contenu}</p>
        <Link
          href={`/regulariser?pack=${report.packRecommande}`}
          onClick={() =>
            track("pack_cta_clicked", { pack: report.packRecommande })
          }
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-brand-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-800"
        >
          Régulariser ma situation
        </Link>
        <p className="mt-3 text-xs text-brand-900/50">
          Accompagnement pas à pas, documents préremplis, lettres types.
        </p>
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={refaire}>
          Refaire le diagnostic
        </Button>
      </div>
    </div>
  );
}
