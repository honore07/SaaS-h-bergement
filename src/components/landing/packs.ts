export type Pack = {
  id: "essentiel" | "complet" | "express";
  name: string;
  price: number;
  tagline: string;
  audience: string;
  badge?: string;
  highlight?: boolean;
  summary: string[];
  features: string[];
};

export const PACKS: Pack[] = [
  {
    id: "essentiel",
    name: "Pack Essentiel",
    price: 50,
    tagline: "Les trois obligations qui bloquent tout le reste.",
    audience:
      "Pour les hébergeurs sans numéro d’enregistrement, en retard de déclaration fiscale ou sans registre du logeur.",
    summary: [
      "Enregistrement du meublé guidé, dossier prérempli",
      "Régularisation fiscale micro-BIC et 2042-C-PRO",
      "Registre du logeur rétroactif conforme",
    ],
    features: [
      "Guide d’enregistrement du meublé selon le canal de votre commune",
      "Dossier prérempli à partir de votre diagnostic",
      "Stockage du numéro d’enregistrement obtenu et alerte en cas de suspension",
      "Simulation de l’impact micro-BIC 2025 sur vos revenus",
      "Guide de correction de la déclaration 2042-C-PRO",
      "Correction des erreurs DAC7 courantes (brut vs net, taxe de séjour)",
      "Lettre de régularisation spontanée aux impôts",
      "Registre du logeur rétroactif (art. R2333-51 CGCT), export PDF",
      "Import CSV Airbnb et Booking pour reconstruire les séjours passés",
    ],
  },
  {
    id: "complet",
    name: "Pack Complet",
    price: 99,
    tagline: "La remise en conformité de bout en bout.",
    audience:
      "Pour couvrir l’ensemble des obligations : taxe de séjour en retard, assurance à déclarer, DPE à anticiper.",
    badge: "Le plus choisi",
    highlight: true,
    summary: [
      "Tout le Pack Essentiel",
      "Taxe de séjour en retard : calcul et régularisation communale",
      "Lettre à l’assureur et anticipation DPE 2034",
    ],
    features: [
      "Tout le contenu du Pack Essentiel",
      "Calcul des montants de taxe de séjour dus par commune et période (API DELTA)",
      "Aide à la déclaration communale de régularisation",
      "Lettre de régularisation spontanée à la commune",
      "Plan d’action DPE : anticiper l’échéance classe A–D au 1ᵉʳ janvier 2034",
      "Annuaire des diagnostiqueurs agréés ADEME par département",
      "Lettre type à l’assureur pour déclarer votre activité",
      "Guide d’accès au classement Atout France (abattement 30 % → 50 %)",
    ],
  },
  {
    id: "express",
    name: "Pack Express",
    price: 150,
    tagline: "Quand l’annonce est déjà supprimée ou la lettre déjà reçue.",
    audience:
      "Pour les situations urgentes : annonce Airbnb ou Booking retirée, courrier de la DGFiP dans la boîte aux lettres.",
    summary: [
      "Tout le Pack Complet",
      "Support prioritaire : réponse sous 24 h",
      "Accompagnement dédié annonce supprimée ou courrier DGFiP",
    ],
    features: [
      "Tout le contenu du Pack Complet",
      "Support prioritaire avec réponse garantie sous 24 h ouvrées",
      "Ordre de traitement optimisé : d’abord ce qui débloque vos revenus",
      "Relecture de vos courriers avant envoi à la plateforme ou à l’administration",
      "Accompagnement dédié en cas de courrier DGFiP",
    ],
  },
];

export const SUBSCRIPTION = {
  name: "Abonnement Conformité + Compta",
  monthly: 29,
  yearly: 290,
  yearlyDiscount: "-17 %",
  tagline: "Une fois en règle, restez-le sans y penser.",
  features: [
    "Alertes réglementaires : loi Le Meur, DPE 2034, enregistrement, échéances fiscales",
    "Registre du logeur continu, tenu séjour après séjour",
    "Tracker micro-BIC : alertes à 60 %, 80 % et 95 % du plafond",
    "Bibliothèque de documents à jour : contrat, état des lieux, fiche de police",
  ],
};
