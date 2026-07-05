// Génération de la synthèse personnalisée du rapport.
// Si ANTHROPIC_API_KEY est défini, on demande à Claude de rédiger la synthèse
// à partir des chiffres du moteur déterministe (jamais modifiés).
// En cas d'erreur, de timeout ou d'absence de clé : synthèse templatée locale.
// L'API ne doit JAMAIS échouer à cause de Claude.

import Anthropic from "@anthropic-ai/sdk";
import { formatEuros } from "@/lib/format";
import type { DiagnosticInput, HebergementType } from "./types";
import type { ScoringResult } from "./scoring";

const TYPE_LABELS: Record<HebergementType, string> = {
  gite: "gîte",
  chambre_hotes: "chambre d'hôtes",
  insolite: "hébergement insolite",
  appartement: "appartement",
  autre: "hébergement",
};

const PACK_LABELS: Record<ScoringResult["packRecommande"], string> = {
  essentiel: "Pack Régularisation Essentiel (50 €)",
  complet: "Pack Régularisation Complet (99 €)",
  express: "Pack Régularisation Express (150 €)",
};

export async function genererSynthese(
  input: DiagnosticInput,
  scoring: ScoringResult
): Promise<string> {
  const fallback = syntheseLocale(input, scoring);

  if (!process.env.ANTHROPIC_API_KEY) {
    return fallback;
  }

  try {
    const client = new Anthropic();

    const contexte = {
      commune: input.base.commune,
      typeHebergement: TYPE_LABELS[input.base.typeHebergement],
      revenusAnnuels: formatEuros(input.base.revenusAnnuels),
      score: `${scoring.score}/10`,
      expositionTotale: formatEuros(scoring.expositionTotale),
      packRecommande: PACK_LABELS[scoring.packRecommande],
      infractions: scoring.infractions.map((i) => ({
        titre: i.titre,
        gravite: i.gravite,
        exposition: formatEuros(i.expositionMax),
        reference: i.reference,
      })),
      ordreDePriorite: scoring.priorites,
    };

    const response = await client.messages.create(
      {
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system:
          "Tu rédiges la synthèse d'un diagnostic de conformité pour un micro-hébergeur touristique français (service GîteOuvert). " +
          "Ton : empathique mais factuel, sans dramatiser ni minimiser. Vouvoiement. Français impeccable, aucun emoji, aucune liste à puces : un ou deux paragraphes de prose, entre 150 et 250 mots. " +
          "Reprends fidèlement les chiffres fournis (score, exposition totale, montants) sans jamais les modifier, les arrondir ou en inventer de nouveaux. " +
          "Structure : constat global (score et exposition), points les plus urgents dans l'ordre de priorité, puis une note rassurante indiquant que chaque point se régularise et qu'agir vite réduit les pénalités. " +
          "Réponds uniquement avec la synthèse, sans titre ni préambule.",
        messages: [
          {
            role: "user",
            content:
              "Voici les résultats du diagnostic à synthétiser :\n" +
              JSON.stringify(contexte, null, 2),
          },
        ],
      },
      { timeout: 15_000, maxRetries: 1 }
    );

    const texte = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    return texte.length > 0 ? texte : fallback;
  } catch {
    return fallback;
  }
}

/** Synthèse templatée, construite à partir des infractions détectées. */
function syntheseLocale(input: DiagnosticInput, scoring: ScoringResult): string {
  const type = TYPE_LABELS[input.base.typeHebergement];
  const commune = input.base.commune;

  if (scoring.infractions.length === 0) {
    return (
      `Bonne nouvelle : d'après vos réponses, votre ${type} à ${commune} ne présente ` +
      `aucune infraction détectée. Votre score de conformité est de 10/10 et votre ` +
      `exposition financière estimée est nulle. Vos obligations principales — enregistrement ` +
      `du meublé, performance énergétique, immatriculation, déclaration fiscale, registre du ` +
      `logeur, taxe de séjour et assurance — semblent couvertes. Restez vigilant : la réglementation évolue vite ` +
      `(loi Le Meur, seuils micro-BIC, calendrier DPE) et une obligation respectée aujourd'hui ` +
      `peut nécessiter un renouvellement demain. Pensez à refaire ce diagnostic après tout ` +
      `changement dans votre activité.`
    );
  }

  const ordonnees = scoring.priorites
    .map((id) => scoring.infractions.find((i) => i.id === id))
    .filter((i) => i !== undefined);
  const principales = ordonnees
    .slice(0, 3)
    .map((i) => i.titre.toLowerCase())
    .join(", ");
  const nb = scoring.infractions.length;

  return (
    `Votre diagnostic fait apparaître ${nb} point${nb > 1 ? "s" : ""} de ` +
    `non-conformité pour votre ${type} à ${commune}, soit un score de ` +
    `${scoring.score}/10. Au total, vous êtes exposé à des pénalités pouvant ` +
    `atteindre ${formatEuros(scoring.expositionTotale)}. Les points à traiter en ` +
    `priorité sont les suivants : ${principales}. Ces situations sont fréquentes ` +
    `chez les micro-hébergeurs : la réglementation s'est durcie rapidement avec la ` +
    `loi Le Meur et beaucoup de propriétaires découvrent leurs obligations après ` +
    `coup. La bonne nouvelle, c'est que chacun de ces points se régularise, et ` +
    `qu'une démarche spontanée réduit fortement les pénalités encourues, notamment ` +
    `sur le plan fiscal. Plus vous agissez tôt, plus la régularisation est simple ` +
    `et économique. Le ${PACK_LABELS[scoring.packRecommande]} correspond à votre ` +
    `situation : il vous guide pas à pas pour traiter chaque point dans le bon ordre.`
  );
}
