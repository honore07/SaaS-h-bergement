import {
  LOGEMENT_VIDE,
  type LogementInfo,
  type RegistreData,
  type Sejour,
} from "./types";

const CLE_STOCKAGE = "gio_registre_v1";

function nombreValide(valeur: unknown): valeur is number {
  return typeof valeur === "number" && Number.isFinite(valeur) && valeur >= 0;
}

function estSejourValide(valeur: unknown): valeur is Sejour {
  if (typeof valeur !== "object" || valeur === null) return false;
  const s = valeur as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.dateArrivee === "string" &&
    typeof s.dateDepart === "string" &&
    nombreValide(s.nbAdultes) &&
    nombreValide(s.nbMineurs) &&
    nombreValide(s.nbExoneresAutres) &&
    nombreValide(s.prixNuitee) &&
    nombreValide(s.tarifTaxeParPersonne) &&
    (s.commentaire === undefined || typeof s.commentaire === "string")
  );
}

function normaliserLogement(valeur: unknown): LogementInfo {
  if (typeof valeur !== "object" || valeur === null) return { ...LOGEMENT_VIDE };
  const l = valeur as Record<string, unknown>;
  return {
    nomEtablissement:
      typeof l.nomEtablissement === "string" ? l.nomEtablissement : "",
    adresse: typeof l.adresse === "string" ? l.adresse : "",
    commune: typeof l.commune === "string" ? l.commune : "",
    numeroDeclaloc:
      typeof l.numeroDeclaloc === "string" ? l.numeroDeclaloc : "",
  };
}

export function registreVide(): RegistreData {
  return { logement: { ...LOGEMENT_VIDE }, sejours: [] };
}

/**
 * Charge le registre depuis le localStorage. Retourne un registre vide si
 * la clé est absente ou si le JSON est corrompu.
 */
export function chargerRegistre(): RegistreData {
  if (typeof window === "undefined") return registreVide();
  try {
    const brut = window.localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return registreVide();
    const donnees: unknown = JSON.parse(brut);
    if (typeof donnees !== "object" || donnees === null) return registreVide();
    const d = donnees as Record<string, unknown>;
    const sejours = Array.isArray(d.sejours)
      ? d.sejours.filter(estSejourValide)
      : [];
    return { logement: normaliserLogement(d.logement), sejours };
  } catch {
    return registreVide();
  }
}

/** Sauvegarde le registre dans le localStorage (silencieux en cas d'échec). */
export function sauvegarderRegistre(donnees: RegistreData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(donnees));
  } catch {
    // Quota dépassé ou stockage indisponible : on n'interrompt pas l'utilisateur.
  }
}
