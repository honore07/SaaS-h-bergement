import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatEuros } from "@/lib/format";
import { PACKS, SUBSCRIPTION } from "./packs";
import { SectionHeading } from "./SectionHeading";
import { CtaLink } from "./CtaLink";
import { IconArrowRight, IconCheck } from "./icons";

export function PricingSummary() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Packs de régularisation"
        title="Un prix fixe. Pas de surprise, pas d’honoraires."
        subtitle="Chaque pack traite vos infractions pas à pas, avec dossiers préremplis et lettres types. À comparer aux 10 000 € d’amende que vous risquez sans rien faire."
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm ${
              pack.highlight
                ? "border-brand-600 ring-2 ring-brand-600/20"
                : "border-brand-900/10"
            }`}
          >
            {pack.badge ? (
              <Badge tone="brand" className="absolute -top-3 left-8">
                {pack.badge}
              </Badge>
            ) : null}
            <h3 className="text-lg font-semibold text-brand-950">
              {pack.name}
            </h3>
            <p className="mt-1 text-sm text-foreground/60">{pack.tagline}</p>
            <p className="mt-5 text-4xl font-bold tracking-tight text-brand-950">
              {formatEuros(pack.price)}
              <span className="ml-1.5 text-sm font-medium text-foreground/50">
                une fois
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {pack.summary.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span className="text-foreground/75">{item}</span>
                </li>
              ))}
            </ul>
            <CtaLink
              href="/regulariser"
              variant={pack.highlight ? "primary" : "outline"}
              className="mt-8 w-full"
            >
              Voir le détail du pack
            </CtaLink>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-brand-900/10 bg-brand-50 p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-brand-950">
              {SUBSCRIPTION.name}
            </h3>
            <Badge tone="green">{SUBSCRIPTION.yearlyDiscount} en annuel</Badge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/65">
            {SUBSCRIPTION.tagline} Alertes réglementaires, registre du logeur
            continu, tracker micro-BIC et bibliothèque de documents à jour.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <p className="text-3xl font-bold tracking-tight text-brand-950">
            {formatEuros(SUBSCRIPTION.monthly)}
            <span className="text-sm font-medium text-foreground/50">
              /mois
            </span>
            <span className="ml-2 text-sm font-medium text-foreground/50">
              ou {formatEuros(SUBSCRIPTION.yearly)}/an
            </span>
          </p>
          <Link
            href="/regulariser"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Tout savoir sur l&apos;abonnement
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
