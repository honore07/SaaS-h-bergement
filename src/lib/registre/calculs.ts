import type { Sejour, SejourCalcule } from "./types";

const MS_PAR_JOUR = 86_400_000;

/** Nombre de nuits entre deux dates ISO (0 si les dates sont incohérentes). */
export function calculerNbNuits(dateArrivee: string, dateDepart: string): number {
  if (!dateArrivee || !dateDepart) return 0;
  const arrivee = Date.parse(dateArrivee);
  const depart = Date.parse(dateDepart);
  if (Number.isNaN(arrivee) || Number.isNaN(depart)) return 0;
  const nuits = Math.round((depart - arrivee) / MS_PAR_JOUR);
  return nuits > 0 ? nuits : 0;
}

/**
 * Personnes assujetties à la taxe de séjour : les adultes moins les
 * exonérés « autres » (les mineurs sont exonérés de plein droit et ne
 * comptent jamais).
 */
export function calculerPersonnesAssujetties(
  nbAdultes: number,
  nbExoneresAutres: number
): number {
  return Math.max(0, nbAdultes - nbExoneresAutres);
}

/** Montant de taxe = tarif x personnes assujetties x nuits, arrondi à 2 décimales. */
export function calculerMontantTaxe(
  tarifTaxeParPersonne: number,
  personnesAssujetties: number,
  nbNuits: number
): number {
  return (
    Math.round(tarifTaxeParPersonne * personnesAssujetties * nbNuits * 100) / 100
  );
}

/** Complète un séjour avec ses champs dérivés. */
export function enrichirSejour(sejour: Sejour): SejourCalcule {
  const nbNuits = calculerNbNuits(sejour.dateArrivee, sejour.dateDepart);
  const personnesAssujetties = calculerPersonnesAssujetties(
    sejour.nbAdultes,
    sejour.nbExoneresAutres
  );
  const montantTaxe = calculerMontantTaxe(
    sejour.tarifTaxeParPersonne,
    personnesAssujetties,
    nbNuits
  );
  return { ...sejour, nbNuits, personnesAssujetties, montantTaxe };
}

/** Total de taxe de séjour collectée sur une liste de séjours. */
export function totalTaxeCollectee(sejours: Sejour[]): number {
  const total = sejours.reduce(
    (somme, sejour) => somme + enrichirSejour(sejour).montantTaxe,
    0
  );
  return Math.round(total * 100) / 100;
}
