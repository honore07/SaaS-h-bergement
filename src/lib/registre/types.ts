/** Un séjour consigné dans le registre du logeur (art. R2333-51 CGCT). */
export interface Sejour {
  id: string;
  /** Date d'arrivée au format ISO (AAAA-MM-JJ). */
  dateArrivee: string;
  /** Date de départ au format ISO (AAAA-MM-JJ). */
  dateDepart: string;
  nbAdultes: number;
  /** Mineurs : exonérés de plein droit de la taxe de séjour. */
  nbMineurs: number;
  /** Autres exonérés parmi les adultes (travailleurs saisonniers, etc.). */
  nbExoneresAutres: number;
  /** Prix de la nuitée en euros. */
  prixNuitee: number;
  /** Tarif de taxe de séjour par personne et par nuit, en euros. */
  tarifTaxeParPersonne: number;
  commentaire?: string;
}

/** Champs dérivés calculés à partir d'un séjour. */
export interface SejourCalcule extends Sejour {
  nbNuits: number;
  personnesAssujetties: number;
  /** Montant de taxe de séjour collectée, arrondi à 2 décimales. */
  montantTaxe: number;
}

/** Informations sur le logement tenues en tête de registre. */
export interface LogementInfo {
  nomEtablissement: string;
  adresse: string;
  commune: string;
  numeroDeclaloc?: string;
}

/** Structure persistée dans le localStorage. */
export interface RegistreData {
  logement: LogementInfo;
  sejours: Sejour[];
}

/** Nombre de séjours inclus dans l'offre gratuite. */
export const LIMITE_SEJOURS_GRATUITS = 3;

export const LOGEMENT_VIDE: LogementInfo = {
  nomEtablissement: "",
  adresse: "",
  commune: "",
  numeroDeclaloc: "",
};
