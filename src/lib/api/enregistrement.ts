// Détection du canal d'enregistrement d'un meublé de tourisme selon la commune.
//
// Contexte (voir docs/RAPPORT-VERIFICATION-REGLEMENTAIRE.md) : depuis le 20 mai
// 2026 (loi Le Meur), la déclaration soumise à enregistrement est obligatoire
// dans TOUTE la France. Le téléservice national (DGE / API Meublés) n'est
// pleinement déployé côté loueurs qu'au 2nd semestre 2026 ; en attendant, ce
// sont les communes qui délivrent les numéros, via des canaux différents :
//   - communes à téléservice propre (Paris, Lyon…) → leur portail
//   - communes abonnées à Declaloc (~420) → declaloc.fr
//   - autres communes → CERFA 14004*04 en mairie
//
// Il n'existe AUCUNE liste officielle machine-readable des communes Declaloc.
// On ne prétend donc pas connaître la couverture : on oriente honnêtement vers
// le bon canal, avec un lien de vérification. Ce module est sans I/O réseau
// (déterministe) : il peut tourner client comme serveur.

export type CanalEnregistrement =
  | "teleservice_propre"
  | "declaloc"
  | "mairie"
  | "inconnu";

export interface ResultatCanal {
  canal: CanalEnregistrement;
  /** Libellé court affichable */
  libelle: string;
  /** Marche à suivre pour l'hébergeur */
  instruction: string;
  /** URL utile (portail commune, declaloc, ou vérification) */
  url?: string;
}

// Grandes villes disposant de leur propre téléservice d'enregistrement.
// Clé = code INSEE de la commune.
const TELESERVICE_PROPRE: Record<string, { ville: string; url: string }> = {
  "75056": {
    ville: "Paris",
    url: "https://meuble-tourisme.paris.fr/",
  },
  "69123": {
    ville: "Lyon",
    url: "https://www.grandlyon.com/services/declarer-un-meuble-de-tourisme",
  },
  "13055": {
    ville: "Marseille",
    url: "https://www.marseille.fr/logement/meubles-de-tourisme",
  },
  "33063": {
    ville: "Bordeaux",
    url: "https://www.bordeaux.fr/p116136/meubles-de-tourisme",
  },
  "06088": {
    ville: "Nice",
    url: "https://www.nice.fr/fr/logement/les-meubles-de-tourisme",
  },
};

const LIEN_DECLALOC = "https://www.declaloc.fr/";

/**
 * Détermine le canal d'enregistrement à partir du code INSEE de la commune.
 * Déterministe et synchrone-friendly (retourne une Promise pour laisser la
 * porte ouverte à une vérification réseau ultérieure sans casser l'appelant).
 */
export async function detecterCanal(
  codeInsee: string,
  commune: string
): Promise<ResultatCanal> {
  const propre = TELESERVICE_PROPRE[codeInsee];
  if (propre) {
    return {
      canal: "teleservice_propre",
      libelle: `Téléservice de ${propre.ville}`,
      instruction: `${propre.ville} dispose de son propre téléservice d'enregistrement. Déposez votre demande de numéro d'enregistrement en ligne.`,
      url: propre.url,
    };
  }

  // Hors grandes villes : on ne peut pas garantir la couverture Declaloc
  // (pas de liste officielle). On oriente vers les deux canaux possibles.
  return {
    canal: "inconnu",
    libelle: "Selon votre commune",
    instruction: `Depuis le 20 mai 2026, l'enregistrement est obligatoire partout. Le canal dépend de votre commune (${commune}) : de nombreuses communes utilisent Declaloc, les autres passent par une déclaration en mairie (formulaire CERFA 14004*04). Vérifiez la couverture de votre commune sur Declaloc ; si elle n'y figure pas, rapprochez-vous de votre mairie.`,
    url: LIEN_DECLALOC,
  };
}

/**
 * Vérifie la cohérence d'un numéro d'enregistrement à 13 caractères :
 * les 5 premiers chiffres doivent correspondre au code INSEE de la commune.
 * (Contrôle local, sans appel réseau.)
 */
export function numeroCoherent(
  numero: string,
  codeInsee: string
): boolean {
  const nettoye = numero.replace(/[\s-]/g, "").toUpperCase();
  if (nettoye.length !== 13) return false;
  return nettoye.slice(0, 5) === codeInsee.toUpperCase();
}
