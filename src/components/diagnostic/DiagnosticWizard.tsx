"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label, Select } from "@/components/ui/Input";
import { QuestionCard, type QuestionOption } from "./QuestionCard";
import type {
  ClasseDPE,
  DiagnosticAnswers,
  DiagnosticInput,
  HebergementType,
  YesNoUnknown,
} from "@/lib/diagnostic/types";

export const STORAGE_KEY = "gio_diagnostic_report";

const ETAPES = [
  "Votre hébergement",
  "Vos obligations",
  "Votre rapport",
  "Analyse",
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Corps envoyé à POST /api/diagnostic : diagnostic + contact obligatoire. */
type DiagnosticPayload = DiagnosticInput & {
  contact: { email: string; prenom?: string; consent: true };
};

interface QuestionDef {
  key: keyof DiagnosticAnswers;
  libelle: string;
  options: QuestionOption[];
}

const QUESTIONS: QuestionDef[] = [
  {
    key: "declaloc",
    libelle:
      "Avez-vous obtenu votre numéro Declaloc avant le 20 mai 2026 ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
      { value: "ne_sais_pas", label: "Je ne sais pas" },
    ],
  },
  {
    key: "numeroAffiche",
    libelle: "Ce numéro est-il affiché sur toutes vos annonces ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
    ],
  },
  {
    key: "dpe",
    libelle: "Avez-vous un DPE valide — et quelle est sa classe ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
      { value: "pas_sur", label: "Pas sûr" },
    ],
  },
  {
    key: "siret",
    libelle: "Avez-vous déclaré votre activité à l'INPI (SIRET) ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
      { value: "ne_sais_pas", label: "Je ne sais pas" },
    ],
  },
  {
    key: "declarationBic",
    libelle:
      "Avez-vous déclaré vos revenus locatifs en BIC sur votre déclaration 2025 ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
      { value: "pas_encore", label: "Pas encore" },
    ],
  },
  {
    key: "registreLogeur",
    libelle: "Tenez-vous un registre du logeur pour chaque séjour ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
      { value: "cest_quoi", label: "C'est quoi ?" },
    ],
  },
  {
    key: "taxeSejour",
    libelle:
      "Pour vos réservations directes, collectez-vous et reversez-vous la taxe de séjour ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
      { value: "que_ota", label: "Que via les plateformes" },
    ],
  },
  {
    key: "assurance",
    libelle: "Avez-vous informé votre assureur de votre activité ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
    ],
  },
];

const CLASSES_DPE: ClasseDPE[] = ["A", "B", "C", "D", "E", "F", "G"];

export function DiagnosticWizard() {
  const router = useRouter();
  const [etape, setEtape] = useState(0);

  // Étape 1 — infos de base
  const [adresse, setAdresse] = useState("");
  const [codeInsee, setCodeInsee] = useState("");
  const [commune, setCommune] = useState("");
  const [typeHebergement, setTypeHebergement] = useState<"" | HebergementType>(
    ""
  );
  const [revenus, setRevenus] = useState("");
  const [classe, setClasse] = useState<"" | YesNoUnknown>("");

  // Étape 2 — les 8 questions
  const [reponses, setReponses] = useState<Record<string, string>>({});

  // Étape 3 — email gate (le rapport n'est jamais accessible sans email)
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  const [erreur, setErreur] = useState<string | null>(null);
  const [statut, setStatut] = useState<"saisie" | "envoi" | "echec">("saisie");
  const envoiEnCours = useRef(false);

  const revenusNum = Number(revenus.replace(/\s/g, "").replace(",", "."));
  const etape1Valide =
    codeInsee !== "" &&
    commune !== "" &&
    typeHebergement !== "" &&
    revenus.trim() !== "" &&
    Number.isFinite(revenusNum) &&
    revenusNum >= 0 &&
    classe !== "";

  const etape2Valide =
    QUESTIONS.every((q) => reponses[q.key] !== undefined) &&
    (reponses.dpe !== "oui" || CLASSES_DPE.includes(reponses.dpeClasse as ClasseDPE));

  const nbRepondues = QUESTIONS.filter(
    (q) => reponses[q.key] !== undefined
  ).length;

  // Teaser scorecard : nombre de réponses non conformes, SANS révéler les
  // chiffres (score et exposition restent derrière l'email gate).
  const nbVigilance = QUESTIONS.reduce((acc, q) => {
    const valeur = reponses[q.key];
    if (valeur === undefined) return acc;
    if (q.key === "dpe") {
      const dpeRisque =
        valeur !== "oui" ||
        reponses.dpeClasse === "F" ||
        reponses.dpeClasse === "G";
      return acc + (dpeRisque ? 1 : 0);
    }
    return acc + (valeur !== "oui" ? 1 : 0);
  }, 0);

  const emailValide = EMAIL_REGEX.test(email.trim());

  const construireInput = useCallback((): DiagnosticPayload => {
    const answers = {
      declaloc: reponses.declaloc,
      numeroAffiche: reponses.numeroAffiche,
      dpe: reponses.dpe,
      siret: reponses.siret,
      declarationBic: reponses.declarationBic,
      registreLogeur: reponses.registreLogeur,
      taxeSejour: reponses.taxeSejour,
      assurance: reponses.assurance,
      ...(reponses.dpe === "oui" && reponses.dpeClasse
        ? { dpeClasse: reponses.dpeClasse }
        : {}),
    } as DiagnosticAnswers;

    return {
      base: {
        adresse,
        codeInsee,
        commune,
        typeHebergement: typeHebergement as HebergementType,
        revenusAnnuels: Math.round(revenusNum),
        classe: classe as YesNoUnknown,
      },
      answers,
      contact: {
        email: email.trim(),
        ...(prenom.trim() !== "" ? { prenom: prenom.trim() } : {}),
        consent: true,
      },
    };
  }, [
    adresse,
    classe,
    codeInsee,
    commune,
    email,
    prenom,
    reponses,
    revenusNum,
    typeHebergement,
  ]);

  const envoyer = useCallback(async () => {
    if (envoiEnCours.current) return;
    envoiEnCours.current = true;
    setStatut("envoi");
    try {
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(construireInput()),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const report = await res.json();
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(report));
      router.push("/diagnostic/rapport");
    } catch {
      envoiEnCours.current = false;
      setStatut("echec");
    }
  }, [construireInput, router]);

  function suivant() {
    setErreur(null);
    if (etape === 0) {
      if (!etape1Valide) {
        setErreur(
          "Merci de renseigner l'adresse (en la sélectionnant dans la liste), le type d'hébergement, vos revenus annuels et le classement Atout France."
        );
        return;
      }
      setEtape(1);
    } else if (etape === 1) {
      if (!etape2Valide) {
        setErreur(
          reponses.dpe === "oui" && !reponses.dpeClasse
            ? "Merci d'indiquer la classe de votre DPE."
            : "Merci de répondre aux 8 questions avant de lancer l'analyse."
        );
        return;
      }
      setEtape(2);
    }
  }

  // Email gate : seule porte d'accès au rapport.
  function validerGate() {
    setErreur(null);
    if (!emailValide) {
      setErreur("Merci d'indiquer une adresse email valide pour recevoir votre rapport.");
      return;
    }
    if (!consent) {
      setErreur(
        "Merci de cocher la case de consentement : elle nous autorise à vous envoyer votre rapport par email."
      );
      return;
    }
    setEtape(3);
    void envoyer();
  }

  function precedent() {
    setErreur(null);
    if (statut === "echec") setStatut("saisie");
    setEtape((e) => Math.max(0, e - 1));
  }

  return (
    <div>
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs font-medium text-foreground/60">
          {ETAPES.map((label, i) => (
            <span
              key={label}
              className={i <= etape ? "text-brand-700 font-semibold" : ""}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${((etape + 1) / ETAPES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Étape 1 — infos de base */}
      {etape === 0 && (
        <Card>
          <h2 className="mb-4 text-lg font-semibold">
            Parlez-nous de votre hébergement
          </h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="adresse">Adresse de l&apos;hébergement</Label>
              <AddressAutocomplete
                id="adresse"
                mode="address"
                onSelect={(r) => {
                  setAdresse(r.label);
                  setCodeInsee(r.citycode);
                  setCommune(r.city);
                }}
              />
              {commune !== "" && (
                <p className="mt-1.5 text-xs text-brand-700">
                  Commune retenue : {commune} (code INSEE {codeInsee})
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="type-hebergement">Type d&apos;hébergement</Label>
              <Select
                id="type-hebergement"
                value={typeHebergement}
                onChange={(e) =>
                  setTypeHebergement(e.target.value as "" | HebergementType)
                }
              >
                <option value="" disabled>
                  Sélectionnez un type
                </option>
                <option value="gite">Gîte</option>
                <option value="chambre_hotes">Chambre d&apos;hôtes</option>
                <option value="insolite">
                  Hébergement insolite (cabane, roulotte, yourte...)
                </option>
                <option value="appartement">Appartement</option>
                <option value="autre">Autre</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="revenus">
                Revenus locatifs annuels bruts estimés (en euros)
              </Label>
              <Input
                id="revenus"
                type="number"
                min={0}
                step={100}
                inputMode="numeric"
                placeholder="Ex. 12 000"
                value={revenus}
                onChange={(e) => setRevenus(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-foreground/50">
                Montant brut, avant commissions des plateformes.
              </p>
            </div>

            <div>
              <Label>Votre logement est-il classé Atout France ?</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "oui", label: "Oui" },
                    { value: "non", label: "Non" },
                    { value: "ne_sais_pas", label: "Je ne sais pas" },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      classe === option.value
                        ? "border-brand-700 bg-brand-50 text-brand-800"
                        : "border-brand-900/15 bg-white text-foreground/70 hover:border-brand-400 hover:text-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name="classe-atout-france"
                      value={option.value}
                      checked={classe === option.value}
                      onChange={() => setClasse(option.value)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Étape 2 — les 8 questions */}
      {etape === 1 && (
        <div className="space-y-4">
          {QUESTIONS.map((q, index) => (
            <QuestionCard
              key={q.key}
              numero={index + 1}
              total={QUESTIONS.length}
              libelle={q.libelle}
              name={q.key}
              options={q.options}
              value={reponses[q.key]}
              onChange={(value) =>
                setReponses((r) => {
                  const next = { ...r, [q.key]: value };
                  if (q.key === "dpe" && value !== "oui") {
                    delete next.dpeClasse;
                  }
                  return next;
                })
              }
            >
              {q.key === "dpe" && reponses.dpe === "oui" && (
                <div className="mt-4 max-w-xs">
                  <Label htmlFor="dpe-classe">Classe du DPE</Label>
                  <Select
                    id="dpe-classe"
                    value={reponses.dpeClasse ?? ""}
                    onChange={(e) =>
                      setReponses((r) => ({ ...r, dpeClasse: e.target.value }))
                    }
                  >
                    <option value="" disabled>
                      Sélectionnez la classe
                    </option>
                    {CLASSES_DPE.map((c) => (
                      <option key={c} value={c}>
                        Classe {c}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </QuestionCard>
          ))}
          {nbRepondues >= 6 && (
            <p className="text-center text-sm font-medium text-brand-700">
              Plus qu&apos;une étape : votre score personnalisé s&apos;affiche
              juste après.
            </p>
          )}
        </div>
      )}

      {/* Étape 3 — email gate : le rapport n'est jamais accessible sans email */}
      {etape === 2 && (
        <Card className="mx-auto max-w-xl">
          <div className="mb-6 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
              Analyse terminée
            </p>
            <h2 className="mb-3 text-xl font-bold">
              Votre score de conformité est calculé
            </h2>
            <p className="text-sm text-foreground/60">
              {nbVigilance > 0 ? (
                <>
                  <span className="font-semibold text-accent-700">
                    {nbVigilance} point{nbVigilance > 1 ? "s" : ""} de
                    vigilance détecté{nbVigilance > 1 ? "s" : ""} sur 8
                  </span>{" "}
                  dans vos réponses. Indiquez où envoyer votre rapport pour
                  découvrir votre score, vos risques chiffrés en euros et vos
                  priorités de régularisation.
                </>
              ) : (
                <>
                  Aucun point de vigilance détecté sur les 8 contrôles.
                  Indiquez où envoyer votre rapport pour découvrir votre score
                  détaillé et nos recommandations.
                </>
              )}
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              validerGate();
            }}
            noValidate
          >
            <div>
              <Label htmlFor="gate-prenom">Prénom (facultatif)</Label>
              <Input
                id="gate-prenom"
                type="text"
                autoComplete="given-name"
                maxLength={80}
                placeholder="Ex. Camille"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="gate-email">Votre email</Label>
              <Input
                id="gate-email"
                type="email"
                autoComplete="email"
                required
                placeholder="vous@exemple.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-foreground/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-brand-900/20 accent-brand-700"
              />
              <span>
                J&apos;accepte de recevoir mon rapport de conformité et des
                conseils réglementaires par email. Désinscription en un clic.
              </span>
            </label>

            <Button type="submit" size="lg" className="w-full">
              Voir mon score et recevoir mon rapport
            </Button>

            <p className="text-center text-xs text-foreground/50">
              Gratuit · Sans engagement · Vos données restent en France
            </p>
          </form>
        </Card>
      )}

      {/* Étape 4 — envoi et analyse */}
      {etape === 3 && (
        <Card className="py-12 text-center">
          {statut === "echec" ? (
            <div>
              <h2 className="mb-2 text-lg font-semibold">
                L&apos;analyse n&apos;a pas pu aboutir
              </h2>
              <p className="mb-6 text-sm text-foreground/60">
                Une erreur est survenue lors de l&apos;envoi de vos réponses.
                Vérifiez votre connexion puis réessayez.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={precedent}>
                  Revenir
                </Button>
                <Button onClick={() => void envoyer()}>Réessayer</Button>
              </div>
            </div>
          ) : (
            <div>
              <div
                className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-700"
                aria-hidden="true"
              />
              <h2 className="mb-2 text-lg font-semibold">
                Analyse de votre situation…
              </h2>
              <p className="text-sm text-foreground/60">
                Nous vérifions vos obligations (Declaloc, DPE, fiscalité, taxe
                de séjour, registre, assurance) et chiffrons votre exposition.
              </p>
            </div>
          )}
        </Card>
      )}

      {erreur && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {erreur}
        </p>
      )}

      {/* Navigation */}
      {etape < 2 && (
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={precedent}
            disabled={etape === 0}
            className={etape === 0 ? "invisible" : ""}
          >
            Précédent
          </Button>
          <Button size="lg" onClick={suivant}>
            {etape === 1 ? "Calculer mon score" : "Suivant"}
          </Button>
        </div>
      )}
      {etape === 2 && (
        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={precedent}>
            Précédent
          </Button>
        </div>
      )}
    </div>
  );
}
