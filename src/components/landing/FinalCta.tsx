import { CtaLink } from "./CtaLink";
import { IconCheck } from "./icons";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50rem 26rem at 50% 120%, rgba(43,156,120,0.28), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Trois minutes pour savoir exactement où vous en êtes.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
          8 questions, un score de conformité et votre exposition financière
          chiffrée en euros. Mieux vaut le découvrir maintenant que dans un
          courrier de la DGFiP.
        </p>
        <div className="mt-9">
          <CtaLink href="/diagnostic" variant="secondary" size="lg">
            Lancer mon diagnostic gratuit
          </CtaLink>
        </div>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {["Gratuit", "3 minutes", "Sans création de compte"].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm font-medium text-white/60"
            >
              <IconCheck className="h-4 w-4 text-brand-300" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
