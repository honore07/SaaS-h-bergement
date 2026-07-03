import Link from "next/link";
import { type ComponentType, type SVGProps } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "./SectionHeading";
import {
  IconArrowRight,
  IconBan,
  IconEnergy,
  IconGauge,
  IconMail,
  IconTrendDown,
} from "./icons";

type Signal = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  pain: string;
  risk: string;
};

const signals: Signal[] = [
  {
    icon: IconBan,
    title: "Votre annonce a été supprimée ou masquée",
    pain: "Depuis le 20 mai 2026, Airbnb et Booking retirent les annonces sans numéro d’enregistrement Declaloc à 13 chiffres. Du jour au lendemain, plus de réservations.",
    risk: "Amende jusqu’à 10 000 € par logement, en plus des revenus perdus chaque semaine d’inactivité.",
  },
  {
    icon: IconMail,
    title: "Vous avez reçu une lettre DAC7 des impôts",
    pain: "La DGFiP croise désormais vos déclarations avec les revenus transmis par les plateformes. Plus de 100 000 courriers envoyés en 2024, deux fois plus en 2025.",
    risk: "Redressement fiscal avec majoration de 40 à 80 % sur les revenus non déclarés.",
  },
  {
    icon: IconTrendDown,
    title: "Le choc micro-BIC 2025 vous concerne",
    pain: "Le plafond du micro-BIC non classé est passé de 77 700 € à 15 000 €, avec un abattement réduit à 30 %. Des milliers d’hébergeurs ont basculé au régime réel sans le savoir.",
    risk: "Déclaration 2025 erronée et imposition sur un régime qui ne vous correspond plus.",
  },
  {
    icon: IconEnergy,
    title: "Votre logement est classé G au DPE",
    pain: "Les logements classés G sont interdits à la location depuis janvier 2025 — les classes F suivront en 2028. Beaucoup de propriétaires l’ignorent encore.",
    risk: "Location illégale : loyers contestables et responsabilité engagée en cas de litige.",
  },
  {
    icon: IconGauge,
    title: "Vos revenus locatifs dépassent 23 000 €",
    pain: "Au-delà de 23 000 € par an, vous pouvez basculer automatiquement en loueur professionnel (LMP), avec affiliation URSSAF et cotisations sociales.",
    risk: "Cotisations sociales dues rétroactivement sur les années non régularisées.",
  },
];

export function AlertSignals() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Les 5 signaux d’alerte"
        title="Un de ces signaux vous parle ? Il est temps d’agir."
        subtitle="Ce sont les cinq situations qui déclenchent contrôles, redressements et suppressions d’annonces. Chacune se mesure — et se régularise."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {signals.map((signal) => (
          <Card
            key={signal.title}
            className="group flex flex-col transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <signal.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold leading-snug text-brand-950">
              {signal.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/65">
              {signal.pain}
            </p>
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium leading-snug text-red-800">
              {signal.risk}
            </p>
            <Link
              href="/diagnostic"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors group-hover:text-brand-800"
            >
              Mesurer mon risque
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        ))}
        <Card className="flex flex-col justify-center bg-brand-950 text-white">
          <h3 className="text-lg font-semibold leading-snug">
            Vous ne savez pas si vous êtes concerné ?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            C&apos;est précisément le rôle du diagnostic : 8 questions, et vous
            savez exactement où vous en êtes — avec votre exposition financière
            chiffrée en euros.
          </p>
          <Link
            href="/diagnostic"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-brand-950 transition-colors hover:bg-accent-400"
          >
            Lancer le diagnostic gratuit
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>
    </section>
  );
}
