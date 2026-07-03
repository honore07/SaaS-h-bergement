import { z } from "zod";
import { calculerScoring } from "@/lib/diagnostic/scoring";
import { genererSynthese } from "@/lib/diagnostic/claude";
import type { DiagnosticInput, DiagnosticReport } from "@/lib/diagnostic/types";

const yesNoUnknown = z.enum(["oui", "non", "ne_sais_pas"]);

const diagnosticInputSchema = z.object({
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

  const input: DiagnosticInput = parsed.data;

  // 1. Moteur déterministe — toujours exécuté, source de vérité des chiffres.
  const scoring = calculerScoring(input);

  // 2. Synthèse rédigée (Claude si disponible, sinon template local).
  //    genererSynthese ne lève jamais : fallback intégré.
  const synthese = await genererSynthese(input, scoring);

  const report: DiagnosticReport = { ...scoring, synthese };
  return Response.json(report);
}
