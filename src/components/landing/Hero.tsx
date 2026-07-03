import { Badge } from "@/components/ui/Badge";
import { CtaLink } from "./CtaLink";
import { IconCheck } from "./icons";

const reassurance = ["Gratuit", "3 minutes", "Sans création de compte"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 30rem at 85% -10%, rgba(43,156,120,0.25), transparent 60%), radial-gradient(40rem 24rem at 0% 110%, rgba(245,158,11,0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-3xl">
          <Badge tone="amber">
            Loi Le Meur — Declaloc obligatoire depuis le 20 mai 2026
          </Badge>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Votre annonce Airbnb risque d&apos;être supprimée.{" "}
            <span className="text-brand-300">
              Vérifiez votre conformité en 3 minutes.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Depuis le 20 mai 2026, tout meublé de tourisme doit être enregistré
            sur Declaloc. Sans numéro d&apos;enregistrement, les plateformes
            retirent votre annonce et le défaut d&apos;enregistrement expose à
            une amende pouvant atteindre 10 000 € par logement. Faites le point
            avant qu&apos;un contrôle ne le fasse pour vous.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaLink href="/diagnostic" variant="secondary" size="lg">
              Vérifier ma conformité gratuitement
            </CtaLink>
            <CtaLink href="/regulariser" variant="outline-light" size="lg">
              Voir les packs de régularisation
            </CtaLink>
          </div>
          <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
            {reassurance.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-white/70"
              >
                <IconCheck className="h-4 w-4 text-brand-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
