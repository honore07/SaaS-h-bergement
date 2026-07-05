"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label, Select } from "@/components/ui/Input";
import { track } from "@/lib/tracking";
import {
  detecterCanal,
  type ResultatCanal,
} from "@/lib/api/enregistrement";
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

// Sous-étapes de « Vos obligations » : les 8 questions (inchangées) sont
// présentées en trois groupes, entrecoupés de deux micro-insights qui
// s'appuient sur les réponses déjà données.
// 0: Q1-Q3 | 1: insight DPE | 2: Q4-Q6 | 3: insight registre | 4: Q7-Q8
const GROUPES_QUESTIONS = [
  { debut: 0, fin: 3 },
  { debut: 3, fin: 6 },
  { debut: 6, fin: 8 },
] as const;

// Messages de chargement honnêtes : ils décrivent ce que fait réellement
// l'API (score déterministe, exposition en euros, synthèse rédigée).
const MESSAGES_CHARGEMENT = [
  "Calcul de votre score sur 10…",
  "Estimation de votre exposition financière…",
  "Rédaction de vos recommandations personnalisées…",
] as const;

interface MicroInsight {
  titre: string;
  texte: string;
}

// Micro-insight n°1, affiché après la Q3 (DPE). Tous les chiffres viennent
// de docs/PROJET_GITEOPENFRANCE_v2.md — aucune statistique inventée.
function insightApresDpe(reponses: Record<string, string>): MicroInsight {
  if (reponses.declaloc !== "oui") {
    return {
      titre: "Vous n'êtes pas seul",
      texte:
        "Entre 240 000 et 360 000 hébergements n'ont pas encore leur numéro d'enregistrement. Votre analyse intégrera la procédure de régularisation, étape par étape, selon le canal de votre commune.",
    };
  }
  if (reponses.dpe === "oui" && (reponses.dpeClasse === "F" || reponses.dpeClasse === "G")) {
    return {
      titre: "Une échéance à anticiper",
      texte:
        "Votre meublé de tourisme n'est pas interdit à la location aujourd'hui du fait de sa classe énergétique. En revanche, tous les meublés devront être classés A à D d'ici le 1er janvier 2034. Votre rapport vous dira comment anticiper sans interrompre votre activité.",
    };
  }
  if (reponses.dpe !== "oui") {
    return {
      titre: "Un point à éclaircir",
      texte:
        "Connaître votre classe énergétique vous permet d'anticiper : une classe A à D sera exigée de tous les meublés de tourisme d'ici le 1er janvier 2034. Votre analyse en tiendra compte.",
    };
  }
  if (reponses.numeroAffiche === "non") {
    return {
      titre: "Vos annonces d'abord",
      texte:
        "Le numéro d'enregistrement doit figurer sur toutes vos annonces. Une fois votre numéro obtenu, il vous suffit de l'ajouter. Votre analyse fera le point sur ce volet.",
    };
  }
  return {
    titre: "Bon départ",
    texte:
      "Enregistrement, affichage du numéro, performance énergétique : les trois premiers contrôles semblent en ordre. Passons au volet fiscal — 300 000 à 420 000 hébergeurs y sont en défaut sans le savoir.",
  };
}

// Micro-insight n°2, affiché après la Q6 (registre du logeur).
function insightApresRegistre(reponses: Record<string, string>): MicroInsight {
  if (reponses.declarationBic !== "oui") {
    return {
      titre: "Le fisc croise déjà les données",
      texte:
        "Environ 100 000 courriers ont été envoyés en 2024 aux loueurs repérés via les données des plateformes (DAC7), un chiffre qui double en 2025. Votre analyse chiffrera votre risque et la marche à suivre pour une régularisation spontanée.",
    };
  }
  if (reponses.siret !== "oui") {
    return {
      titre: "Une formalité gratuite souvent oubliée",
      texte:
        "200 000 à 250 000 hébergeurs exercent sans SIRET alors que l'immatriculation INPI est obligatoire pour une activité habituelle. Votre analyse vérifiera ce point — la démarche en ligne est gratuite.",
    };
  }
  if (reponses.registreLogeur !== "oui") {
    return {
      titre: "Vous êtes loin d'être le seul",
      texte:
        "960 000 à 1 080 000 hébergements n'ont pas de registre du logeur conforme (art. R2333-51 CGCT). Bonne nouvelle : il se reconstitue rétroactivement, et votre rapport vous montrera comment.",
    };
  }
  return {
    titre: "Volet fiscal solide",
    texte:
      "SIRET, déclaration BIC et registre du logeur : votre socle administratif est en place. Plus que deux questions pour compléter votre profil.",
  };
}

interface QuestionDef {
  key: keyof DiagnosticAnswers;
  libelle: string;
  options: QuestionOption[];
}

const QUESTIONS: QuestionDef[] = [
  {
    key: "declaloc",
    libelle:
      "Avez-vous obtenu votre numéro d'enregistrement de meublé de tourisme ?",
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
  // Écran d'entrée (« entry promise ») affiché avant la première étape.
  const [demarre, setDemarre] = useState(false);
  const [etape, setEtape] = useState(0);
  // Sous-étape de l'étape « Vos obligations » (groupes + micro-insights).
  const [sousEtape, setSousEtape] = useState(0);
  // Index du message de chargement affiché pendant l'appel API.
  const [messageIndex, setMessageIndex] = useState(0);

  // Étape 1 — infos de base
  const [adresse, setAdresse] = useState("");
  const [codeInsee, setCodeInsee] = useState("");
  const [commune, setCommune] = useState("");
  // Canal d'enregistrement détecté à partir de la commune (adresse BAN) :
  // sert à afficher la bonne procédure de régularisation. null tant que la
  // détection n'a pas abouti (fallback silencieux : rien affiché).
  const [canal, setCanal] = useState<ResultatCanal | null>(null);
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

  // Validité d'un groupe de questions (la classe DPE est exigée dans le
  // groupe 0, qui contient la Q3).
  const groupeValide = (groupe: 0 | 1 | 2): boolean => {
    const { debut, fin } = GROUPES_QUESTIONS[groupe];
    const repondu = QUESTIONS.slice(debut, fin).every(
      (q) => reponses[q.key] !== undefined
    );
    if (!repondu) return false;
    if (groupe === 0 && reponses.dpe === "oui") {
      return CLASSES_DPE.includes(reponses.dpeClasse as ClasseDPE);
    }
    return true;
  };

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
    setMessageIndex(0);
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
      setSousEtape(0);
      return;
    }
    if (etape === 1) {
      if (sousEtape === 0) {
        if (!groupeValide(0)) {
          setErreur(
            reponses.dpe === "oui" && !reponses.dpeClasse
              ? "Merci d'indiquer la classe de votre DPE."
              : "Merci de répondre aux questions 1 à 3 avant de continuer."
          );
          return;
        }
        setSousEtape(1);
        track("insight_viewed", { insight_id: "insight_dpe" });
        return;
      }
      if (sousEtape === 1) {
        setSousEtape(2);
        return;
      }
      if (sousEtape === 2) {
        if (!groupeValide(1)) {
          setErreur("Merci de répondre aux questions 4 à 6 avant de continuer.");
          return;
        }
        setSousEtape(3);
        track("insight_viewed", { insight_id: "insight_registre" });
        return;
      }
      if (sousEtape === 3) {
        setSousEtape(4);
        return;
      }
      // sousEtape 4 : dernières questions, puis email gate.
      if (!groupeValide(2) || !etape2Valide) {
        setErreur("Merci de répondre aux questions 7 et 8 avant de continuer.");
        return;
      }
      setEtape(2);
      track("email_gate_viewed");
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
    track("email_submitted");
    setEtape(3);
    track("loading_viewed");
    void envoyer();
  }

  function precedent() {
    setErreur(null);
    if (statut === "echec") setStatut("saisie");
    if (etape === 1) {
      if (sousEtape === 0) {
        setEtape(0);
      } else {
        setSousEtape((s) => s - 1);
      }
      return;
    }
    if (etape === 2) {
      setEtape(1);
      setSousEtape(GROUPES_QUESTIONS.length + 1); // dernier groupe (Q7-Q8)
      return;
    }
    setEtape((e) => Math.max(0, e - 1));
  }

  // Progression honnête des messages de chargement : chaque message reste
  // affiché ~3,5 s puis passe au suivant, sans fausse barre de progression.
  useEffect(() => {
    if (etape !== 3 || statut !== "envoi") return;
    const id = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES_CHARGEMENT.length - 1));
    }, 3500);
    return () => clearInterval(id);
  }, [etape, statut]);

  // Écran d'entrée (« entry promise ») : promesse de résultat, attente de
  // temps, preuve sociale réelle (92 % du marché non conforme — doc projet).
  if (!demarre) {
    return (
      <Card className="mx-auto max-w-xl py-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
          Diagnostic gratuit, sans compte
        </p>
        <h2 className="mb-4 text-2xl font-bold">
          Découvrez votre score de conformité et votre exposition en euros
        </h2>
        <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-foreground/60">
          92 % des meublés de tourisme en France portent au moins une
          infraction réglementaire — la plupart des propriétaires
          l&apos;ignorent. En 8 questions, vous saurez où vous en êtes,
          chiffres à l&apos;appui, et par quoi commencer.
        </p>
        <p className="mb-6 text-sm font-medium text-foreground/70">
          8 questions · 3 minutes · Résultat immédiat
        </p>
        <Button
          size="lg"
          onClick={() => {
            track("quiz_started");
            setDemarre(true);
          }}
        >
          Commencer mon diagnostic
        </Button>
      </Card>
    );
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
                  // Détection best-effort du canal d'enregistrement ; en cas
                  // d'échec on n'affiche simplement pas la guidance.
                  void detecterCanal(r.citycode, r.city)
                    .then(setCanal)
                    .catch(() => setCanal(null));
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

      {/* Étape 2 — les 8 questions, par groupes de 3/3/2 */}
      {etape === 1 && sousEtape % 2 === 0 && (
        <div className="space-y-4">
          {(() => {
            const groupe = GROUPES_QUESTIONS[sousEtape / 2];
            return QUESTIONS.slice(groupe.debut, groupe.fin).map(
              (q, index) => (
                <QuestionCard
                  key={q.key}
                  numero={groupe.debut + index + 1}
                  total={QUESTIONS.length}
                  libelle={q.libelle}
                  name={q.key}
                  options={q.options}
                  value={reponses[q.key]}
                  onChange={(value) => {
                    if (reponses[q.key] === undefined) {
                      track("question_answered", { question_id: q.key });
                    }
                    setReponses((r) => {
                      const next = { ...r, [q.key]: value };
                      if (q.key === "dpe" && value !== "oui") {
                        delete next.dpeClasse;
                      }
                      return next;
                    });
                  }}
                >
                  {q.key === "dpe" && reponses.dpe === "oui" && (
                    <div className="mt-4 max-w-xs">
                      <Label htmlFor="dpe-classe">Classe du DPE</Label>
                      <Select
                        id="dpe-classe"
                        value={reponses.dpeClasse ?? ""}
                        onChange={(e) =>
                          setReponses((r) => ({
                            ...r,
                            dpeClasse: e.target.value,
                          }))
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
              )
            );
          })()}
          {sousEtape === 4 && nbRepondues >= 6 && (
            <p className="text-center text-sm font-medium text-brand-700">
              Plus qu&apos;une étape : votre score personnalisé s&apos;affiche
              juste après.
            </p>
          )}
        </div>
      )}

      {/* Micro-insights : contenu conditionné par les réponses déjà données */}
      {etape === 1 && (sousEtape === 1 || sousEtape === 3) && (
        <Card className="mx-auto max-w-xl py-8 text-center">
          {(() => {
            const insight =
              sousEtape === 1
                ? insightApresDpe(reponses)
                : insightApresRegistre(reponses);
            return (
              <>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Point d&apos;étape
                </p>
                <h2 className="mb-3 text-xl font-bold">{insight.titre}</h2>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-foreground/70">
                  {insight.texte}
                </p>
              </>
            );
          })()}
        </Card>
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

          {reponses.declaloc !== "oui" && canal && (
            <div className="mb-5 rounded-lg bg-brand-50 px-4 py-3 text-xs leading-relaxed text-brand-900">
              <p className="font-semibold">
                Votre enregistrement ({canal.libelle})
              </p>
              <p className="mt-1 text-brand-900/80">{canal.instruction}</p>
              {canal.url && (
                <a
                  href={canal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-block font-semibold underline"
                >
                  Vérifier le canal de ma commune
                </a>
              )}
            </div>
          )}

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
              <h2 className="mb-6 text-lg font-semibold">
                Analyse de votre situation…
              </h2>
              <ul className="mx-auto max-w-sm space-y-3 text-left">
                {MESSAGES_CHARGEMENT.map((message, i) => {
                  const etat =
                    i < messageIndex
                      ? "fait"
                      : i === messageIndex
                        ? "en_cours"
                        : "a_venir";
                  return (
                    <li key={message} className="flex items-center gap-3">
                      {etat === "fait" && (
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                          aria-hidden="true"
                        >
                          &#10003;
                        </span>
                      )}
                      {etat === "en_cours" && (
                        <span
                          className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700"
                          aria-hidden="true"
                        />
                      )}
                      {etat === "a_venir" && (
                        <span
                          className="h-5 w-5 shrink-0 rounded-full border-2 border-brand-900/10"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`text-sm ${
                          etat === "en_cours"
                            ? "font-semibold text-foreground"
                            : etat === "fait"
                              ? "text-foreground/60"
                              : "text-foreground/40"
                        }`}
                      >
                        {message}
                      </span>
                    </li>
                  );
                })}
              </ul>
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
            {etape === 1 && sousEtape === 4
              ? "Calculer mon score"
              : etape === 1 && (sousEtape === 1 || sousEtape === 3)
                ? "Continuer"
                : "Suivant"}
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
