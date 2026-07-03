// Client open data DGFiP « DELTA » — tarifs de taxe de séjour délibérés par les communes.
// Serveur uniquement (appelé depuis le route handler /api/taxe-sejour).
//
// Dataset retenu (vérifié le 03/07/2026 via l'API Explore v2.1 de data.economie.gouv.fr) :
//   id      : delta_deliberation_ts_tarif0
//   titre   : « Tarifs taxe de séjour - Delta à partir de 2024 »
//   volume  : ~1 504 000 enregistrements, ~36 000 communes
//   portail : https://data.economie.gouv.fr/explore/dataset/delta_deliberation_ts_tarif0/
//
// Champs utilisés (schéma vérifié par appels réels — ex. Colmar 68066, Paris 75056) :
//   departement      text   « 68 », « 2A », « 972 » (3 caractères pour l'outre-mer)
//   commune          text   code commune SANS le département : « 066 » (métropole, 3 car.),
//                           « 14 » (outre-mer, 2 car.) — le code INSEE complet n'existe pas tel quel
//   libelle_commune  text   « COLMAR »
//   date_effet       date   année d'application de la délibération (2024, 2025, …)
//   hebergement      text   catégorie : « Hôtels de tourisme 3 étoiles », « Chambres d'hôtes », …
//   regime           text   « Réel » | « Forfaitaire »
//   tarif            double tarif voté par la collectivité (hors taxes additionnelles)
//   unite            text   « € » (tarif fixe par nuit et par personne) | « % » (taux proportionnel
//                           au coût de la nuitée, hébergements non classés)
//   tarif_total      double tarif TTC taxes additionnelles incluses (départementale 10 %,
//                           régionales Île-de-France, etc.) — c'est la valeur à payer
//   periode_1..6     text   périodes de perception, ex. « 01-01 - 31-12 »

export interface TauxTaxeSejour {
  /** Catégorie d'hébergement telle que publiée dans DELTA. */
  categorieHebergement: string;
  /** « Réel » (taxe au réel, cas général) ou « Forfaitaire ». */
  regime: string;
  /** Tarif fixe en €/nuit/personne, taxes additionnelles incluses. `null` si taux proportionnel. */
  tarifFixe: number | null;
  /** Taux en % du coût de la nuitée par personne (hébergements non classés), taxes additionnelles incluses. */
  tauxProportionnel: number | null;
  /**
   * Plafond en €/nuit/personne applicable au taux proportionnel
   * (tarif le plus élevé voté par la collectivité, art. L2333-30 CGCT).
   */
  plafond: number | null;
  /** Année d'application de la délibération. */
  annee: string;
  /** Périodes de perception (souvent « 01-01 - 31-12 »). */
  periodes: string[];
  /** Provenance de la donnée. */
  source: "delta";
}

export interface DeliberationsCommune {
  /** Libellé DELTA de la commune, `null` si aucune délibération publiée. */
  libelleCommune: string | null;
  taux: TauxTaxeSejour[];
}

const DATASET_URL =
  "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/delta_deliberation_ts_tarif0/records";

interface DeltaRecord {
  libelle_commune: string | null;
  date_effet: string | null;
  hebergement: string | null;
  regime: string | null;
  tarif: number | null;
  unite: string | null;
  tarif_total: number | null;
  periode_1: string | null;
  periode_2: string | null;
  periode_3: string | null;
  periode_4: string | null;
  periode_5: string | null;
  periode_6: string | null;
}

/**
 * Découpe un code INSEE (5 caractères) en (departement, codes commune candidats)
 * selon la convention DELTA : « 68066 » → ("68", ["066", "66", "6"…]),
 * « 2A004 » → ("2A", ["004", "04", "4"]), « 97214 » → ("972", ["14"]).
 * Le padding varie selon le millésime (2024/2025 : « 066 » ; 2026 : « 66 » ;
 * Ajaccio : « 4 ») — on interroge donc toutes les variantes avec/sans zéros initiaux.
 */
function splitCodeInsee(codeInsee: string): {
  departement: string;
  communes: string[];
} {
  const outreMer = codeInsee.startsWith("97") || codeInsee.startsWith("98");
  const departement = outreMer ? codeInsee.slice(0, 3) : codeInsee.slice(0, 2);
  let commune = codeInsee.slice(departement.length);
  const communes = [commune];
  while (commune.length > 1 && commune.startsWith("0")) {
    commune = commune.slice(1);
    communes.push(commune);
  }
  return { departement, communes };
}

/**
 * Ordre d'affichage : du plus haut de gamme au plein air. Les règles « plein air »
 * sont évaluées en premier car leurs libellés citent aussi des étoiles
 * (ex. « Terrains de camping classés en 3, 4 et 5 étoiles »).
 */
const REGLES_ORDRE: Array<[RegExp, number]> = [
  [/camping-car|stationnement/, 12],
  [/camping|caravanage|plein air/, 11],
  [/port de plaisance/, 13],
  [/village/, 10],
  [/palace/, 0],
  [/5 étoiles/, 1],
  [/4 étoiles/, 2],
  [/3 étoiles/, 3],
  [/2 étoiles/, 4],
  [/1 étoile/, 5],
  [/auberge/, 6],
  [/chambre/, 7],
  [/sans classement|attente de classement/, 8],
];

function rangCategorie(hebergement: string): number {
  const h = hebergement.toLowerCase();
  for (const [motif, rang] of REGLES_ORDRE) {
    if (motif.test(h)) return rang;
  }
  return 9;
}

/**
 * Récupère les délibérations de taxe de séjour d'une commune (année la plus récente
 * publiée dans DELTA), avec le libellé de la commune.
 *
 * @throws Error si l'API DELTA est injoignable ou répond en erreur.
 */
export async function getDeliberationsTaxeSejour(
  codeInsee: string
): Promise<DeliberationsCommune> {
  const { departement, communes } = splitCodeInsee(codeInsee);
  const communeIn = communes.map((c) => `'${c}'`).join(",");
  const params = new URLSearchParams({
    where: `departement='${departement}' and commune in (${communeIn})`,
    order_by: "date_effet desc",
    select:
      "libelle_commune,date_effet,hebergement,regime,tarif,unite,tarif_total,periode_1,periode_2,periode_3,periode_4,periode_5,periode_6",
    limit: "100",
  });

  const res = await fetch(`${DATASET_URL}?${params}`, {
    headers: { Accept: "application/json" },
    // Cache Next : les délibérations changent au plus une fois par an → 24 h suffisent.
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error(`DELTA ${res.status}`);
  }
  const data = (await res.json()) as { results: DeltaRecord[] };
  const records = data.results ?? [];
  if (records.length === 0) {
    // Commune sans délibération publiée dans DELTA.
    return { libelleCommune: null, taux: [] };
  }

  // Ne conserver que l'année la plus récente (les résultats sont triés par date_effet desc).
  const anneeMax = records[0].date_effet ?? "";
  const recents = records.filter((r) => r.date_effet === anneeMax);

  // Dédoublonner par catégorie en privilégiant le régime « Réel » (cas général pour un logeur).
  const parCategorie = new Map<string, DeltaRecord>();
  for (const r of recents) {
    if (!r.hebergement || r.tarif_total == null) continue;
    const existant = parCategorie.get(r.hebergement);
    if (!existant || (existant.regime !== "Réel" && r.regime === "Réel")) {
      parCategorie.set(r.hebergement, r);
    }
  }

  // Plafond légal du taux proportionnel : tarif fixe le plus élevé voté par la collectivité.
  const tarifsFixes = [...parCategorie.values()]
    .filter((r) => r.unite === "€")
    .map((r) => r.tarif_total as number);
  const plafond = tarifsFixes.length > 0 ? Math.max(...tarifsFixes) : null;

  const taux: TauxTaxeSejour[] = [...parCategorie.values()]
    .map((r) => {
      const proportionnel = r.unite === "%";
      return {
        categorieHebergement: r.hebergement as string,
        regime: r.regime ?? "Réel",
        tarifFixe: proportionnel ? null : (r.tarif_total as number),
        tauxProportionnel: proportionnel ? (r.tarif_total as number) : null,
        plafond: proportionnel ? plafond : null,
        annee: anneeMax,
        periodes: [
          r.periode_1,
          r.periode_2,
          r.periode_3,
          r.periode_4,
          r.periode_5,
          r.periode_6,
        ].filter((p): p is string => Boolean(p && p.trim())),
        source: "delta" as const,
      };
    })
    .sort(
      (a, b) =>
        rangCategorie(a.categorieHebergement) -
        rangCategorie(b.categorieHebergement)
    );

  return { libelleCommune: records[0].libelle_commune, taux };
}

/**
 * Taux de taxe de séjour d'une commune (dernière année publiée dans DELTA).
 * Renvoie `[]` si la commune n'a pas de délibération publiée.
 */
export async function getTauxTaxeSejour(
  codeInsee: string
): Promise<TauxTaxeSejour[]> {
  const { taux } = await getDeliberationsTaxeSejour(codeInsee);
  return taux;
}
