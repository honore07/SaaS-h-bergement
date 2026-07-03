import { z } from "zod";
import { calculerScoring } from "@/lib/diagnostic/scoring";
import { genererSynthese } from "@/lib/diagnostic/claude";
import { creerContactBrevo } from "@/lib/api/brevo";
import type { DiagnosticInput, DiagnosticReport } from "@/lib/diagnostic/types";

const yesNoUnknown = z.enum(["oui", "non", "ne_sais_pas"]);

// Contact requis : le rapport n'est jamais délivré sans email + consentement.
const contactSchema = z.object({
  email: z.email(),
  prenom: z.string().max(80).optional(),
  consent: z.literal(true),
});

type DiagnosticContact = z.infer<typeof contactSchema>;

const diagnosticInputSchema = z.object({
  contact: contactSchema,
  base: z.object({
    adresse: z.string().min(1).max(300),
    codeInsee: z.string().min(1).max(10),
    commune: z.string().min(1).max(120),
    typeHebergement: z.enum([
      "gite",
      "chambre_hotes",
      "insolite",
      "appartement",
      "autre",
    ]),
    revenusAnnuels: z.number().min(0).max(10_000_000),
    classe: yesNoUnknown,
  }),
  answers: z.object({
    declaloc: yesNoUnknown,
    numeroAffiche: z.enum(["oui", "non"]),
    dpe: z.enum(["oui", "non", "pas_sur"]),
    dpeClasse: z.enum(["A", "B", "C", "D", "E", "F", "G"]).optional(),
    siret: yesNoUnknown,
    declarationBic: z.enum(["oui", "non", "pas_encore"]),
    registreLogeur: z.enum(["oui", "non", "cest_quoi"]),
    taxeSejour: z.enum(["oui", "non", "que_ota"]),
    assurance: z.enum(["oui", "non"]),
  }),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Corps de requête invalide (JSON attendu)." },
      { status: 400 }
    );
  }

  const parsed = diagnosticInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Données du diagnostic invalides.",
        details: parsed.error.issues.map((issue) => ({
          champ: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const { contact, ...input }: DiagnosticInput & { contact: DiagnosticContact } =
    parsed.data;

  // 1. Moteur déterministe — toujours exécuté, source de vérité des chiffres.
  const scoring = calculerScoring(input);

  // 2. Synthèse rédigée (Claude si disponible, sinon template local).
  //    genererSynthese ne lève jamais : fallback intégré.
  const synthese = await genererSynthese(input, scoring);

  const report: DiagnosticReport = { ...scoring, synthese };

  // 3. Contact Brevo — fire-and-forget (jamais bloquant, catch silencieux).
  creerContactBrevo({
    email: contact.email,
    ...(contact.prenom ? { prenom: contact.prenom } : {}),
    score: report.score,
    expositionEur: report.expositionTotale,
    packRecommande: report.packRecommande,
    commune: input.base.commune,
    typeHebergement: input.base.typeHebergement,
    revenusAnnuels: input.base.revenusAnnuels,
  });

  // 4. Notification n8n (lead) — fire-and-forget.
  notifierN8n(input, contact, report);

  return Response.json(report);
}

// Envoie le lead au workflow n8n « GiteOuvert — Lead diagnostic » si
// N8N_WEBHOOK_URL est défini. Ne bloque jamais la réponse au client.
function notifierN8n(
  input: DiagnosticInput,
  contact: DiagnosticContact,
  report: DiagnosticReport
): void {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;
  const lead = {
    contact: {
      email: contact.email,
      prenom: contact.prenom,
    },
    base: {
      commune: input.base.commune,
      codeInsee: input.base.codeInsee,
      typeHebergement: input.base.typeHebergement,
      revenusAnnuels: input.base.revenusAnnuels,
    },
    report: {
      score: report.score,
      expositionTotale: report.expositionTotale,
      packRecommande: report.packRecommande,
      infractions: report.infractions.map((i) => ({ id: i.id })),
    },
  };
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(5000),
  }).catch(() => {
    // Le lead n8n est best-effort : jamais d'impact sur le diagnostic.
  });
}
