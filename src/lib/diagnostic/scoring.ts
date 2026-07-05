// Moteur déterministe du Diagnostic de Conformité.
// C'est LA source de vérité des chiffres : la synthèse Claude ne fait que
// reformuler ces résultats, jamais les modifier.
//
// Barème corrigé conformément à docs/RAPPORT-VERIFICATION-REGLEMENTAIRE.md
// (état du droit vérifié juillet 2026, période transitoire loi Le Meur).

import type { DiagnosticInput, DiagnosticReport, Infraction } from "./types";

export type ScoringResult = Omit<DiagnosticReport, "synthese">;

/** Pondération des gravités pour le calcul du score sur 10. */
const POIDS: Record<Infraction["gravite"], number> = {
  critique: 3,
  haute: 2,
  moyenne: 1,
};

/** Seuil social URSSAF (affiliation obligatoire au-delà, courte durée). */
const SEUIL_URSSAF = 23_000;

export function calculerScoring(input: DiagnosticInput): ScoringResult {
  const { base, answers } = input;
  const revenus = Number.isFinite(base.revenusAnnuels)
    ? Math.max(0, base.revenusAnnuels)
    : 0;

  const infractions: Infraction[] = [];

  // Q1 — Défaut d'enregistrement du meublé de tourisme.
  // « Declaloc » n'est qu'un des canaux (produit privé de ~420 communes) :
  // l'obligation est l'enregistrement, généralisé à toute la France depuis
  // le 20 mai 2026. L'amende est administrative, prononcée par la commune.
  if (answers.declaloc !== "oui") {
    infractions.push({
      id: "enregistrement",
      titre: "Défaut d'enregistrement du meublé de tourisme",
      description:
        answers.declaloc === "ne_sais_pas"
          ? "Vous n'êtes pas certain d'avoir obtenu votre numéro d'enregistrement. Depuis le 20 mai 2026, l'enregistrement est obligatoire dans toute la France, résidence principale comme secondaire. Sans numéro valide, vous êtes en infraction et vous vous exposez à une amende administrative prononcée par la commune (le maire), jusqu'à 10 000 €."
          : "Depuis le 20 mai 2026, l'enregistrement du meublé de tourisme est obligatoire dans toute la France, résidence principale comme secondaire. Sans numéro d'enregistrement, vous vous exposez à une amende administrative prononcée par la commune (le maire), jusqu'à 10 000 € (une fausse déclaration ou un faux numéro pouvant aller jusqu'à 20 000 €).",
      reference:
        "Art. L324-1-1 III et V code du tourisme (loi Le Meur n°2024-1039)",
      expositionMax: 10_000,
      gravite: "critique",
      action:
        "Obtenez votre numéro d'enregistrement (13 caractères) selon le canal de votre commune : téléservice dédié, plateforme Declaloc si votre commune y est abonnée, ou formulaire CERFA en mairie.",
    });
  }

  // Q2 — Numéro non affiché sur les annonces.
  // L'ancien régime « 5 000 € loueur » est abrogé. Le défaut d'affichage par
  // le loueur relève des obligations du III (rattachées à l'enregistrement).
  // La sanction de 12 500 €/annonce vise les PLATEFORMES, pas le loueur.
  if (answers.numeroAffiche === "non") {
    infractions.push({
      id: "numero-affiche",
      titre: "Numéro d'enregistrement non affiché sur les annonces",
      description:
        "Le numéro d'enregistrement doit figurer sur toutes vos annonces (art. L324-1-1 III code du tourisme). Cette obligation est rattachée à l'enregistrement du meublé. La sanction de 12 500 € par annonce vise les plateformes qui diffusent sans numéro, mais un numéro absent fragilise vos annonces et signale une situation à régulariser.",
      reference: "Art. L324-1-1 III code du tourisme",
      expositionMax: 0,
      gravite: "moyenne",
      action:
        "Affichez votre numéro d'enregistrement sur toutes vos annonces (Airbnb, Booking, site direct) une fois celui-ci obtenu.",
    });
  }

  // Q3 — DPE (réécriture complète).
  // Le calendrier « G interdit 2025 / F 2028 » vise les BAUX D'HABITATION,
  // pas les meublés de tourisme. Pour ces derniers : DPE A-D requis pour TOUS
  // d'ici le 1er janvier 2034 (A-E outre-mer), sauf résidence principale du
  // loueur ; A-E déjà requis pour une nouvelle autorisation de changement
  // d'usage dans les communes concernées.
  if (answers.dpe === "oui" && (answers.dpeClasse === "F" || answers.dpeClasse === "G")) {
    infractions.push({
      id: "dpe-echeance-2034",
      titre: `DPE classe ${answers.dpeClasse} : mise en conformité avant 2034`,
      description:
        "Contrairement aux baux d'habitation classiques, votre meublé de tourisme n'est pas interdit à la location aujourd'hui du fait de sa classe énergétique. En revanche, tous les meublés de tourisme devront être classés A à D d'ici le 1er janvier 2034 (A à E en outre-mer), sauf s'il s'agit de la résidence principale du loueur. Anticiper les travaux évite une interruption d'activité et un risque d'amende administrative à l'échéance.",
      reference: "Art. L324-2-2 code du tourisme (échéance 1er janvier 2034)",
      expositionMax: 5_000,
      gravite: "moyenne",
      action:
        "Planifiez des travaux de rénovation énergétique pour atteindre au moins la classe D avant le 1er janvier 2034.",
    });
  } else if (answers.dpe !== "oui") {
    infractions.push({
      id: "dpe-non-connu",
      titre: "Performance énergétique (DPE) non connue",
      description:
        "Vous ne disposez pas d'un DPE à jour. Un meublé de tourisme classique n'a pas d'obligation de DPE immédiate, mais une classe A-E est requise pour obtenir une nouvelle autorisation de changement d'usage dans les communes concernées, et une classe A-D sera exigée de tous les meublés d'ici le 1er janvier 2034. Connaître votre classe vous permet d'anticiper.",
      reference: "Art. L324-2-2 code du tourisme ; changement d'usage L631-7 CCH",
      expositionMax: 0,
      gravite: "moyenne",
      action:
        "Faites réaliser un DPE par un diagnostiqueur certifié pour connaître votre classe et anticiper l'échéance 2034.",
    });
  }

  // Q4 — SIRET / immatriculation INPI.
  // Le volet cotisations URSSAF n'est déclenché qu'au-delà de 23 000 € de
  // recettes (seuil social réel). En dessous, l'infraction demeure mais sans
  // ce volet. Le SIE compétent est celui du LIEU DU BIEN.
  if (answers.siret !== "oui") {
    const voletSocial = revenus > SEUIL_URSSAF;
    infractions.push({
      id: "siret",
      titre: "Activité non immatriculée (SIRET)",
      description: voletSocial
        ? "Toute activité de location meublée doit faire l'objet d'une déclaration de début d'activité sous 15 jours au guichet unique de l'INPI, qui délivre un SIRET (le service des impôts des entreprises compétent est celui du lieu du bien). Vos recettes dépassant 23 000 €, vous relevez aussi de l'affiliation sociale : l'URSSAF peut réclamer des cotisations rétroactives."
        : "Toute activité de location meublée doit faire l'objet d'une déclaration de début d'activité sous 15 jours au guichet unique de l'INPI, qui délivre un SIRET (le service des impôts des entreprises compétent est celui du lieu du bien). En dessous de 23 000 € de recettes, aucune cotisation sociale n'est due, mais l'immatriculation reste obligatoire.",
      reference: "Art. L123-1 code de commerce — guichet unique INPI",
      expositionMax: voletSocial ? 3_000 : 0,
      gravite: "haute",
      action:
        "Déclarez votre activité de loueur en meublé sur le guichet unique de l'INPI (gratuit, en ligne) pour obtenir votre SIRET.",
    });
  }

  // Q5 — Déclaration des revenus en BIC (2042-C-PRO). Inchangé (correct) :
  // revenus imposables dès le 1er euro, redressement + majoration.
  if (answers.declarationBic !== "oui") {
    const montant = Math.max(1_500, Math.round(revenus * 0.4));
    infractions.push({
      id: "declaration-bic",
      titre: "Revenus locatifs non déclarés (2042-C-PRO)",
      description:
        "Vos revenus locatifs sont imposables dès le premier euro et doivent être déclarés en BIC via le formulaire 2042-C-PRO. La DGFiP reçoit chaque année les données des plateformes (DAC7, sans seuil de dispense pour la location) : un redressement s'accompagne d'une majoration (10, 40 ou 80 %) et d'intérêts de retard.",
      reference: "Art. 1728 et 1729 code général des impôts",
      expositionMax: montant,
      gravite: "critique",
      action:
        "Régularisez spontanément votre déclaration 2042-C-PRO : une démarche spontanée réduit les intérêts de moitié et évite la majoration de 10 %.",
    });
  }

  // Q6 — Registre du logeur (nuancé).
  // Le registre (art. R2333-51 CGCT) concerne la taxe de séjour AU RÉEL
  // collectée par le loueur. Quand la plateforme collecte (obligatoire pour
  // les loueurs non pros), c'est elle qui déclare : pas de registre requis
  // pour ces séjours. On ne garde l'infraction que si le loueur collecte en
  // direct (taxeSejour "non") sans registre.
  if (answers.registreLogeur !== "oui" && answers.taxeSejour !== "que_ota") {
    infractions.push({
      id: "registre-logeur",
      titre: "Absence de registre du logeur",
      description:
        "Lorsque vous collectez vous-même la taxe de séjour au réel (réservations en direct), vous devez tenir un registre du logeur consignant chaque séjour (art. R2333-51 CGCT). Ce registre n'est pas exigé pour les séjours dont la taxe est collectée et déclarée par une plateforme. À ne pas confondre avec la fiche de police, distincte, obligatoire pour les voyageurs étrangers.",
      reference: "Art. R2333-51 code général des collectivités territoriales",
      expositionMax: 750,
      gravite: "moyenne",
      action:
        "Tenez un registre du logeur pour vos réservations en direct et reconstituez rétroactivement les séjours concernés.",
    });
  }

  // Q7 — Taxe de séjour (réservations en direct). Le cas "que_ota" ne génère
  // plus d'infraction : la plateforme collecte et déclare.
  if (answers.taxeSejour === "non") {
    const montant = Math.max(300, Math.round(revenus * 0.03 * 0.125));
    infractions.push({
      id: "taxe-sejour",
      titre: "Taxe de séjour non collectée ou non reversée en direct",
      description:
        "Pour vos réservations directes, vous devez collecter la taxe de séjour auprès de vos voyageurs et la reverser à votre commune selon son calendrier. À défaut, la commune peut appliquer des sanctions (150 € par omission, jusqu'à 12 500 €) et procéder à une taxation d'office.",
      reference: "Art. L2333-34-1 et suivants code général des collectivités territoriales",
      expositionMax: montant,
      gravite: "haute",
      action:
        "Calculez les montants dus (taux de votre commune), régularisez auprès de la mairie et mettez en place la collecte systématique.",
    });
  }

  // Q8 — Assurance (requalifiée).
  // Ce n'est PAS une infraction réglementaire : aucune obligation légale
  // d'assurance (hors RC copropriété). Exigence contractuelle (L113-2 code
  // des assurances) : risque de réduction/refus de garantie en cas de
  // sinistre. Gravité moyenne, décrite comme un risque financier.
  if (answers.assurance === "non") {
    infractions.push({
      id: "assurance",
      titre: "Assureur non informé de l'activité de location",
      description:
        "Informer votre assureur n'est pas une obligation réglementaire, mais une exigence contractuelle (art. L113-2 code des assurances). En cas de sinistre (incendie, dégât des eaux, accident d'un voyageur), l'absence de déclaration de l'activité peut entraîner une réduction, voire un refus de garantie — un risque financier potentiellement lourd, non une amende.",
      reference: "Art. L113-2 code des assurances (obligation contractuelle)",
      expositionMax: 2_000,
      gravite: "moyenne",
      action:
        "Déclarez votre activité de location à votre assureur et vérifiez que votre contrat couvre bien la location saisonnière (responsabilité civile).",
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
