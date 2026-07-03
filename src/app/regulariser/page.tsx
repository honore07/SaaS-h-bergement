import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { CtaLink } from "@/components/landing/CtaLink";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { IconCheck, IconShield } from "@/components/landing/icons";
import { PACKS, SUBSCRIPTION } from "@/components/landing/packs";
import { formatEuros } from "@/lib/format";

export const metadata: Metadata = {
  title: "Packs de régularisation — Declaloc, fiscal, registre du logeur",
  description:
    "Régularisez votre meublé de tourisme à prix fixe : Pack Essentiel 299 € (Declaloc, fiscal, registre du logeur), Pack Complet 449 €, Pack Express 599 € avec support 24 h. Puis restez conforme avec l'abonnement à 29 €/mois.",
  alternates: {
    canonical: "/regulariser",
  },
};

type Urgence = {
  title: string;
  availability: string;
  intro: string;
  items: string[];
};

const urgences: Urgence[] = [
  {
    title: "Régularisation Declaloc",
    availability: "Dès le Pack Essentiel",
    intro:
      "L’enregistrement obligatoire depuis le 20 mai 2026 — celui dont l’absence fait supprimer les annonces.",
    items: [
      "Guide étape par étape pour vous enregistrer sur Declaloc",
      "Dossier prérempli à partir des informations de votre diagnostic",
      "Stockage de votre numéro à 13 chiffres et alerte en cas de suspension",
      "Lettre type à Airbnb ou Booking pour faire réactiver votre annonce",
    ],
  },
  {
    title: "Régularisation fiscale",
    availability: "Dès le Pack Essentiel",
    intro:
      "Le choc micro-BIC 2025 (plafond 15 000 €, abattement 30 %) et les courriers DAC7, traités méthodiquement.",
    items: [
      "Simulation de l’impact du nouveau micro-BIC sur vos revenus actuels",
      "Calcul de l’intérêt du classement Atout France (abattement 30 % → 50 %)",
      "Guide de correction de la déclaration 2042-C-PRO",
      "Correction des erreurs DAC7 courantes : brut vs net, taxe de séjour exclue des recettes",
      "Lettre de régularisation spontanée aux impôts, qui réduit les pénalités",
    ],
  },
  {
    title: "Registre du logeur rétroactif",
    availability: "Dès le Pack Essentiel",
    intro:
      "L’obligation que plus de 9 hébergeurs sur 10 ignorent — exigible lors d’un contrôle communal.",
    items: [
      "Génération automatique du registre légal rétroactif",
      "Import CSV Airbnb et Booking pour reconstruire les séjours passés",
      "Document conforme à l’article R2333-51 du CGCT, exportable en PDF",
      "Saisie manuelle possible si vous n’avez pas d’export de plateforme",
    ],
  },
  {
    title: "Taxe de séjour en retard",
    availability: "Packs Complet et Express",
    intro:
      "Pour vos réservations directes, la collecte et le reversement restent à votre charge — même si les plateformes collectent de leur côté.",
    items: [
      "Calcul des montants dus par commune et par période (données officielles DELTA)",
      "Aide à la déclaration communale de régularisation",
      "Lettre de régularisation spontanée adressée à votre commune",
    ],
  },
  {
    title: "DPE et assurance",
    availability: "Packs Complet et Express",
    intro:
      "La classe G est interdite à la location depuis janvier 2025, la classe F le sera en 2028 — et votre assureur doit connaître votre activité.",
    items: [
      "Plan d’action personnalisé selon votre classe DPE",
      "Annuaire des diagnostiqueurs agréés ADEME, département par département",
      "Lettre type à votre assureur pour déclarer votre activité d’hébergement",
    ],
  },
];

const CTA_LABEL = "Commencer par le diagnostic gratuit";

// Ids de packs acceptés dans ?pack= (handoff depuis le diagnostic).
const PACK_IDS = ["essentiel", "complet", "express"] as const;
type PackId = (typeof PACK_IDS)[number];

function packRecommandeDepuisParam(valeur: unknown): PackId | null {
  return typeof valeur === "string" && PACK_IDS.includes(valeur as PackId)
    ? (valeur as PackId)
    : null;
}

export default async function RegulariserPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const recommande = packRecommandeDepuisParam((await searchParams).pack);
  const packRecommande = recommande
    ? PACKS.find((p) => p.id === recommande)
    : undefined;

  return (
    <>
      {/* Bandeau handoff diagnostic → pack recommandé */}
      {packRecommande && (
        <div className="border-b border-brand-900/10 bg-brand-700 text-white">
          <div className="mx-auto max-w-6xl px-4 py-4 text-center text-sm font-medium sm:px-6">
            D&apos;après votre diagnostic, le {packRecommande.name} correspond
            à votre situation. Il est mis en avant ci-dessous.
          </div>
        </div>
      )}

      {/* Intro */}
      <section className="border-b border-brand-900/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <Badge tone="brand">Packs de régularisation</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-brand-950 sm:text-5xl">
              Remettez votre hébergement en règle, à prix fixe.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/70">
              Declaloc, fiscalité, registre du logeur, taxe de séjour, DPE :
              chaque pack traite vos infractions pas à pas, avec dossiers
              préremplis et lettres types. Un paiement unique — à comparer aux
              10 000 € d&apos;amende encourus par logement non enregistré.
            </p>
            <p className="mt-4 text-sm font-medium text-foreground/55">
              Tout commence par le diagnostic gratuit : il identifie vos
              infractions et vous oriente vers le pack qui correspond vraiment
              à votre situation.
            </p>
          </div>
        </div>
      </section>

      {/* Packs */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {PACKS.map((pack) => {
            // Avec ?pack=, seule la recommandation issue du diagnostic est
            // mise en avant ; sans paramètre, l'affichage reste inchangé.
            const estRecommande = recommande === pack.id;
            const misEnAvant = recommande ? estRecommande : pack.highlight;
            const badge = recommande
              ? estRecommande
                ? "Recommandé pour vous"
                : null
              : pack.badge;
            return (
            <div
              key={pack.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 ${
                misEnAvant
                  ? "border-brand-600 shadow-md ring-2 ring-brand-600/20"
                  : "border-brand-900/10 shadow-sm"
              }`}
            >
              {badge ? (
                <Badge tone="brand" className="absolute -top-3 left-8">
                  {badge}
                </Badge>
              ) : null}
              <h2 className="text-xl font-semibold text-brand-950">
                {pack.name}
              </h2>
              <p className="mt-1.5 text-sm leading-snug text-foreground/60">
                {pack.tagline}
              </p>
              <p className="mt-6 text-4xl font-bold tracking-tight text-brand-950">
                {formatEuros(pack.price)}
                <span className="ml-1.5 text-sm font-medium text-foreground/50">
                  une fois
                </span>
              </p>
              <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2.5 text-sm leading-relaxed text-brand-900">
                {pack.audience}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {pack.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <span className="text-foreground/75">{feature}</span>
                  </li>
                ))}
              </ul>
              <CtaLink
                href="/diagnostic"
                variant={misEnAvant ? "primary" : "outline"}
                className="mt-8 w-full"
              >
                {CTA_LABEL}
              </CtaLink>
            </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-foreground/55">
          Aucun paiement à cette étape : le diagnostic gratuit détermine
          d&apos;abord précisément ce que vous devez régulariser.
        </p>
      </section>

      {/* Abonnement */}
      <section className="border-y border-brand-900/10 bg-brand-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-brand-300">
                  <IconShield className="h-5 w-5" />
                </div>
                <Badge tone="amber">Après la régularisation</Badge>
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                {SUBSCRIPTION.name}
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/75">
                {SUBSCRIPTION.tagline} La réglementation bouge chaque année —
                l&apos;abonnement surveille pour vous et vous prévient avant
                que ça ne devienne un problème.
              </p>
              <p className="mt-6 text-4xl font-bold tracking-tight">
                {formatEuros(SUBSCRIPTION.monthly)}
                <span className="text-base font-medium text-white/60">
                  /mois
                </span>
              </p>
              <p className="mt-1.5 text-sm font-medium text-white/60">
                ou {formatEuros(SUBSCRIPTION.yearly)}/an, soit{" "}
                {SUBSCRIPTION.yearlyDiscount}
              </p>
            </div>
            <div>
              <ul className="space-y-4">
                {SUBSCRIPTION.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
                    <span className="text-sm leading-relaxed text-white/85">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <CtaLink
                href="/diagnostic"
                variant="secondary"
                size="lg"
                className="mt-8"
              >
                {CTA_LABEL}
              </CtaLink>
            </div>
          </div>
        </div>
      </section>

      {/* Urgences détaillées */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Le détail, urgence par urgence"
          title="Ce que les packs traitent concrètement"
          subtitle="Cinq urgences réglementaires, cinq réponses outillées. Chaque bloc indique à partir de quel pack il est inclus."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {urgences.map((urgence, index) => (
            <article
              key={urgence.title}
              className={`rounded-2xl border border-brand-900/10 bg-white p-8 shadow-sm ${
                index === urgences.length - 1 && urgences.length % 2 === 1
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-brand-950">
                  {urgence.title}
                </h3>
                <Badge
                  tone={
                    urgence.availability.startsWith("Dès") ? "brand" : "amber"
                  }
                >
                  {urgence.availability}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                {urgence.intro}
              </p>
              <ul className="mt-5 space-y-2.5">
                {urgence.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <span className="text-foreground/75">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-brand-900/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-brand-950">
            Quel pack pour votre situation ? Le diagnostic vous le dit.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-foreground/65">
            8 questions, 3 minutes, sans compte : vous obtenez votre score de
            conformité, votre exposition en euros et la liste exacte de ce
            qu&apos;il faut régulariser.
          </p>
          <div className="mt-8">
            <CtaLink href="/diagnostic" size="lg">
              {CTA_LABEL}
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
