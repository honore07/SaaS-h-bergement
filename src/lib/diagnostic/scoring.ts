// Moteur déterministe du Diagnostic de Conformité.
// C'est LA source de vérité des chiffres : la synthèse Claude ne fait que
// reformuler ces résultats, jamais les modifier.

import type { DiagnosticInput, DiagnosticReport, Infraction } from "./types";

export type ScoringResult = Omit<DiagnosticReport, "synthese">;

/** Pondération des gravités pour le calcul du score sur 10. */
const POIDS: Record<Infraction["gravite"], number> = {
  critique: 3,
  haute: 2,
  moyenne: 1,
};

export function calculerScoring(input: DiagnosticInput): ScoringResult {
  const { base, answers } = input;
  const revenus = Number.isFinite(base.revenusAnnuels)
    ? Math.max(0, base.revenusAnnuels)
    : 0;

  const infractions: Infraction[] = [];

  // Q1 — Enregistrement Declaloc (loi Le Meur)
  if (answers.declaloc !== "oui") {
    infractions.push({
      id: "declaloc",
      titre: "Défaut d'enregistrement Declaloc",
      description:
        answers.declaloc === "ne_sais_pas"
          ? "Vous n'êtes pas certain d'avoir obtenu votre numéro d'enregistrement. Depuis le 20 mai 2026, l'enregistrement via le téléservice national Declaloc est obligatoire pour tous les hébergeurs, nouveaux comme existants. Sans numéro, vous êtes en infraction."
          : "Depuis le 20 mai 2026, l'enregistrement via le téléservice national Declaloc est obligatoire pour tous les hébergeurs, nouveaux comme existants. L'amende peut atteindre 10 000 € par logement non enregistré.",
      reference: "Art. L324-1-1 code du tourisme (loi Le Meur n°2024-1039)",
      expositionMax: 10_000,
      gravite: "critique",
      action:
        "Enregistrez votre hébergement sur Declaloc dès maintenant pour obtenir votre numéro à 13 chiffres.",
    });
  }

  // Q2 — Numéro affiché sur les annonces
  if (answers.numeroAffiche === "non") {
    infractions.push({
      id: "numero-affiche",
      titre: "Numéro non affiché sur les annonces",
      description:
        "Depuis le 20 mai 2026, les plateformes (Airbnb, Booking...) retirent les annonces qui n'affichent pas le numéro d'enregistrement à 13 chiffres. Votre annonce risque la désactivation du jour au lendemain, en plus d'une amende possible.",
      reference: "Art. L324-1-1 code du tourisme — obligation d'affichage",
      expositionMax: 5_000,
      gravite: "critique",
      action:
        "Ajoutez votre numéro d'enregistrement sur toutes vos annonces (Airbnb, Booking, site direct) sans attendre.",
    });
  }

  // Q3 — DPE
  if (answers.dpe !== "oui") {
    infractions.push({
      id: "dpe-manquant",
      titre: "DPE manquant",
      description:
        "Un diagnostic de performance énergétique valide est obligatoire pour la location, y compris saisonnière. Son absence vous expose à une amende et bloque la vérification des interdictions de location (classe G interdite depuis janvier 2025).",
      reference:
        "Art. L126-26 et L271-4 code de la construction et de l'habitation",
      expositionMax: 3_000,
      gravite: "moyenne",
      action:
        "Faites réaliser un DPE par un diagnostiqueur certifié ADEME de votre département.",
    });
  } else if (answers.dpeClasse === "G") {
    infractions.push({
      id: "dpe-g",
      titre: "Location interdite depuis janvier 2025 (DPE classe G)",
      description:
        "Les logements classés G sont interdits à la location depuis janvier 2025. Poursuivre la location vous expose à des demandes de remboursement de loyers, à des sanctions et à l'obligation de réaliser des travaux de rénovation énergétique.",
      reference:
        "Loi Climat et Résilience — art. L173-2 code de la construction et de l'habitation",
      expositionMax: 15_000,
      gravite: "critique",
      action:
        "Suspendez la mise en location et engagez des travaux de rénovation énergétique pour sortir de la classe G.",
    });
  } else if (answers.dpeClasse === "F") {
    infractions.push({
      id: "dpe-f",
      titre: "DPE classe F : interdiction de location en 2028",
      description:
        "Votre logement classé F sera interdit à la location à partir de 2028 (puis la classe E en 2034). Aucune amende immédiate, mais anticiper les travaux dès maintenant vous évitera une interruption d'activité.",
      reference:
        "Loi Climat et Résilience — art. L173-2 code de la construction et de l'habitation",
      expositionMax: 0,
      gravite: "moyenne",
      action:
        "Planifiez dès maintenant les travaux de rénovation énergétique pour passer en classe E ou mieux avant 2028.",
    });
  }

  // Q4 — SIRET / immatriculation INPI
  if (answers.siret !== "oui") {
    infractions.push({
      id: "siret",
      titre: "Activité non immatriculée (SIRET)",
      description:
        "Toute activité de location meublée habituelle doit être immatriculée auprès de l'INPI pour obtenir un SIRET. Sans immatriculation, l'URSSAF peut réclamer des cotisations rétroactives.",
      reference: "Art. L123-1 code de commerce — guichet unique INPI",
      expositionMax: 3_000,
      gravite: "haute",
      action:
        "Déclarez votre activité de loueur en meublé sur le guichet unique de l'INPI (gratuit, en ligne).",
    });
  }

  // Q5 — Déclaration des revenus en BIC (2042-C-PRO)
  if (answers.declarationBic !== "oui") {
    const montant = Math.max(1_500, Math.round(revenus * 0.4));
    infractions.push({
      id: "declaration-bic",
      titre: "Revenus locatifs non déclarés (2042-C-PRO)",
      description:
        "Vos revenus locatifs doivent être déclarés en BIC via le formulaire 2042-C-PRO. La DGFiP croise désormais les données des plateformes (DAC7) avec les déclarations : un redressement s'accompagne d'une majoration de 40 à 80 % des sommes dues.",
      reference: "Art. 1728 et 1729 code général des impôts (majoration 40-80 %)",
      expositionMax: montant,
      gravite: "critique",
      action:
        "Régularisez spontanément votre déclaration 2042-C-PRO : une régularisation spontanée réduit fortement les pénalités.",
    });
  }

  // Q6 — Registre du logeur
  if (answers.registreLogeur !== "oui") {
    infractions.push({
      id: "registre-logeur",
      titre: "Absence de registre du logeur",
      description:
        "Le registre du logeur doit être tenu pour chaque séjour, même lorsque les plateformes collectent la taxe de séjour à votre place. Il est exigé lors des contrôles communaux.",
      reference: "Art. R2333-51 code général des collectivités territoriales",
      expositionMax: 750,
      gravite: "moyenne",
      action:
        "Mettez en place un registre du logeur conforme et reconstituez rétroactivement les séjours passés.",
    });
  }

  // Q7 — Taxe de séjour
  if (answers.taxeSejour === "non") {
    const montant = Math.max(300, Math.round(revenus * 0.03 * 0.125));
    infractions.push({
      id: "taxe-sejour",
      titre: "Taxe de séjour non collectée ou non reversée en direct",
      description:
        "Pour vos réservations directes, vous devez collecter la taxe de séjour auprès de vos voyageurs et la reverser à votre commune selon son calendrier. La commune peut procéder à une taxation d'office avec intérêts de retard.",
      reference: "Art. L2333-26 et suivants code général des collectivités territoriales",
      expositionMax: montant,
      gravite: "haute",
      action:
        "Calculez les montants dus (taux de votre commune), régularisez auprès de la mairie et mettez en place la collecte systématique.",
    });
  } else if (answers.taxeSejour === "que_ota") {
    infractions.push({
      id: "taxe-sejour-registre",
      titre: "Registre obligatoire même si les plateformes collectent",
      description:
        "Airbnb et Booking collectent la taxe de séjour dans la majorité des communes, mais cela ne vous dispense pas de tenir le registre du logeur ni de déclarer vos réservations directes le cas échéant.",
      reference: "Art. R2333-51 code général des collectivités territoriales",
      expositionMax: 300,
      gravite: "moyenne",
      action:
        "Vérifiez que toutes vos réservations directes sont couvertes et tenez votre registre à jour.",
    });
  }

  // Q8 — Assurance
  if (answers.assurance === "non") {
    infractions.push({
      id: "assurance",
      titre: "Activité non déclarée à l'assureur",
      description:
        "Votre assureur doit être informé de votre activité de location. En cas de sinistre (incendie, dégât des eaux, accident d'un voyageur), il peut refuser toute garantie si l'activité n'a pas été déclarée.",
      reference: "Art. L113-2 code des assurances",
      expositionMax: 2_000,
      gravite: "haute",
      action:
        "Envoyez une déclaration d'activité à votre assureur et souscrivez une responsabilité civile professionnelle adaptée.",
    });
  }

  // Score sur 10 : 10 − pondération des gravités, borné [0, 10]
  const penalite = infractions.reduce((acc, i) => acc + POIDS[i.gravite], 0);
  const score = Math.min(10, Math.max(0, 10 - penalite));

  // Exposition financière totale
  const expositionTotale = infractions.reduce(
    (acc, i) => acc + i.expositionMax,
    0
  );

  // Ordre de priorité : gravité décroissante puis montant décroissant
  const priorites = [...infractions]
    .sort(
      (a, b) =>
        POIDS[b.gravite] - POIDS[a.gravite] || b.expositionMax - a.expositionMax
    )
    .map((i) => i.id);

  // Pack recommandé
  const annonceMenacee =
    answers.declaloc !== "oui" && answers.numeroAffiche === "non";
  const urgenceFiscale = answers.declarationBic === "non" && revenus > 15_000;
  const packRecommande: ScoringResult["packRecommande"] =
    annonceMenacee || urgenceFiscale
      ? "express"
      : infractions.length >= 4
        ? "complet"
        : "essentiel";

  return { score, infractions, expositionTotale, priorites, packRecommande };
}
