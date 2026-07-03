// Client Brevo — création/mise à jour du contact issu du diagnostic.
// Usage STRICTEMENT côté serveur (la clé API ne doit jamais fuiter côté client).
// Best-effort : ne lève jamais. La promesse doit être attendue par l'appelant
// (en serverless, un fetch non attendu est tué au gel de la lambda).

export interface BrevoContactDiagnostic {
  email: string;
  prenom?: string;
  score: number;
  expositionEur: number;
  packRecommande: string;
  commune: string;
  typeHebergement: string;
  revenusAnnuels: number;
}

export async function creerContactBrevo(
  contact: BrevoContactDiagnostic
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const listIdBrut = process.env.BREVO_LIST_ID;
  const listId = listIdBrut ? Number(listIdBrut) : undefined;

  const body = {
    email: contact.email,
    updateEnabled: true,
    attributes: {
      PRENOM: contact.prenom ?? "",
      SCORE: contact.score,
      EXPOSITION_EUR: contact.expositionEur,
      PACK_RECOMMANDE: contact.packRecommande,
      COMMUNE: contact.commune,
      TYPE_HEBERGEMENT: contact.typeHebergement,
      REVENUS_ANNUELS: contact.revenusAnnuels,
      DATE_DIAGNOSTIC: new Date().toISOString(),
    },
    listIds:
      listId !== undefined && Number.isFinite(listId) ? [listId] : undefined,
  };

  await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  }).catch(() => {
    // Best-effort : l'échec Brevo n'impacte jamais le diagnostic.
  });
}
