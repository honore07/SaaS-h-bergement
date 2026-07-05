// Types partagés du Diagnostic de Conformité (Module 0).

export type YesNoUnknown = "oui" | "non" | "ne_sais_pas";

export type HebergementType =
  | "gite"
  | "chambre_hotes"
  | "insolite"
  | "appartement"
  | "autre";

export type ClasseDPE = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface DiagnosticBaseInfo {
  /** Libellé d'adresse BAN sélectionné */
  adresse: string;
  /** Code INSEE de la commune */
  codeInsee: string;
  commune: string;
  typeHebergement: HebergementType;
  /** Revenus locatifs annuels bruts estimés, en euros */
  revenusAnnuels: number;
  /** Le logement est-il classé (Atout France) ? */
  classe: YesNoUnknown;
}

export interface DiagnosticAnswers {
  /** Q1 — Numéro d'enregistrement du meublé obtenu (canal selon la commune : téléservice, Declaloc ou mairie) */
  declaloc: YesNoUnknown;
  /** Q2 — Numéro affiché sur toutes les annonces */
  numeroAffiche: "oui" | "non";
  /** Q3 — DPE valide + classe */
  dpe: "oui" | "non" | "pas_sur";
  dpeClasse?: ClasseDPE;
  /** Q4 — SIRET / immatriculation INPI */
  siret: YesNoUnknown;
  /** Q5 — Revenus déclarés en BIC (2042-C-PRO) */
  declarationBic: "oui" | "non" | "pas_encore";
  /** Q6 — Registre du logeur tenu */
  registreLogeur: "oui" | "non" | "cest_quoi";
  /** Q7 — Taxe de séjour collectée/reversée en direct */
  taxeSejour: "oui" | "non" | "que_ota";
  /** Q8 — Assureur informé de l'activité */
  assurance: "oui" | "non";
}

export interface DiagnosticInput {
  base: DiagnosticBaseInfo;
  answers: DiagnosticAnswers;
}

export interface Infraction {
  id: string;
  titre: string;
  description: string;
  /** Base légale, ex. "Art. L324-1-1 code du tourisme" */
  reference: string;
  /** Exposition financière maximale en euros */
  expositionMax: number;
  gravite: "critique" | "haute" | "moyenne";
  /** Action de régularisation recommandée */
  action: string;
}

export interface DiagnosticReport {
  /** Score de conformité sur 10 */
  score: number;
  infractions: Infraction[];
  /** Somme des expositions, en euros */
  expositionTotale: number;
  /** Ordre de priorité des régularisations (ids d'infractions) */
  priorites: string[];
  /** Synthèse personnalisée (générée par Claude API ou moteur local) */
  synthese: string;
  /** Pack recommandé */
  packRecommande: "essentiel" | "complet" | "express";
}
