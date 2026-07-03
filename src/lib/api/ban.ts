// Client Base Adresse Nationale (BAN) — https://api-adresse.data.gouv.fr
// Utilisable côté client (CORS ouvert) comme côté serveur.

export interface BanResult {
  /** Libellé complet, ex. "12 Rue des Vignes 68000 Colmar" */
  label: string;
  /** Code INSEE de la commune (≠ code postal) */
  citycode: string;
  city: string;
  postcode: string;
  /** Contexte départemental, ex. "68, Haut-Rhin, Grand Est" */
  context: string;
}

interface BanFeature {
  properties: {
    label: string;
    citycode: string;
    city: string;
    postcode: string;
    context: string;
  };
}

async function searchBan(
  query: string,
  type?: "municipality"
): Promise<BanResult[]> {
  if (query.trim().length < 3) return [];
  const params = new URLSearchParams({ q: query, limit: "6" });
  if (type) params.set("type", type);
  const res = await fetch(
    `https://api-adresse.data.gouv.fr/search/?${params}`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error(`BAN ${res.status}`);
  const data = (await res.json()) as { features: BanFeature[] };
  return data.features.map((f) => ({
    label: f.properties.label,
    citycode: f.properties.citycode,
    city: f.properties.city,
    postcode: f.properties.postcode,
    context: f.properties.context,
  }));
}

/** Recherche d'adresse complète (numéro, rue, commune). */
export function searchAddresses(query: string): Promise<BanResult[]> {
  return searchBan(query);
}

/** Recherche restreinte aux communes (pour le calculateur taxe de séjour). */
export function searchCommunes(query: string): Promise<BanResult[]> {
  return searchBan(query, "municipality");
}
