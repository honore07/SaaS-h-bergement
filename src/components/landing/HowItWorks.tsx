import { SectionHeading } from "./SectionHeading";

const steps = [
  {
    number: "1",
    title: "Diagnostic gratuit",
    description:
      "8 questions, 3 minutes. Vous obtenez votre score de conformité et votre exposition financière chiffrée en euros — sans créer de compte.",
  },
  {
    number: "2",
    title: "Pack Régularisation guidé",
    description:
      "Declaloc, fiscal, registre du logeur, taxe de séjour, DPE : chaque infraction est traitée pas à pas, avec dossiers préremplis et lettres types.",
  },
  {
    number: "3",
    title: "Conformité continue",
    description:
      "L’abonnement veille pour vous : alertes réglementaires, registre tenu automatiquement, suivi des seuils micro-BIC, documents toujours à jour.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-brand-900/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Comment ça marche"
          title="De l’infraction à la sérénité, en trois étapes"
          subtitle="Un parcours pensé pour les hébergeurs qui découvrent leurs obligations — pas pour les juristes."
        />
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step) => (
            <li key={step.number} className="relative">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700 text-lg font-bold text-white">
                  {step.number}
                </span>
                <span
                  aria-hidden
                  className="hidden h-px flex-1 bg-brand-900/10 md:block"
                />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-brand-950">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
