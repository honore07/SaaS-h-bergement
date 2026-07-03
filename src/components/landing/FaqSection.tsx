import { SectionHeading } from "./SectionHeading";

const faqs = [
  {
    question: "« Je ne suis pas vraiment en infraction. »",
    answer:
      "C’est ce que pensent la plupart des 1,1 million d’hébergeurs concernés. Le registre du logeur, par exemple, manque dans plus de 9 hébergements sur 10 — et il reste obligatoire même quand Airbnb collecte la taxe de séjour. Le diagnostic vous le dit en 3 minutes, gratuitement : soit vous êtes en règle et vous dormez tranquille, soit vous savez exactement quoi corriger.",
  },
  {
    question: "« 299 €, c’est trop cher. »",
    answer:
      "Le défaut d’enregistrement Declaloc seul est passible de 10 000 € d’amende par logement, et un redressement fiscal peut ajouter une majoration de 40 à 80 %. Un pack coûte moins de 3 % du risque qu’il élimine — et beaucoup moins qu’une consultation d’avocat ou d’expert-comptable pour le même périmètre.",
  },
  {
    question: "« Je n’ai pas le temps de m’en occuper. »",
    answer:
      "Le diagnostic prend 3 minutes, sans création de compte. Ensuite, tout est découpé en étapes guidées : dossiers préremplis, lettres types, registre reconstruit automatiquement depuis vos exports Airbnb ou Booking. Vous avancez à votre rythme — l’essentiel est de savoir où vous en êtes avant un contrôle.",
  },
  {
    question: "« Régulariser après coup, ça ne va pas m’attirer d’ennuis ? »",
    answer:
      "C’est l’inverse. La régularisation spontanée est prévue par l’administration et réduit fortement les pénalités par rapport à un contrôle subi. Chaque pack inclut les lettres de régularisation spontanée adaptées (impôts, commune, plateforme).",
  },
];

export function FaqSection() {
  return (
    <section className="border-t border-brand-900/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Vos objections, nos réponses"
          title="On sait ce que vous vous dites"
        />
        <dl className="mx-auto mt-14 grid max-w-4xl gap-x-12 gap-y-10 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="text-base font-semibold text-brand-950">
                {faq.question}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-foreground/65">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
