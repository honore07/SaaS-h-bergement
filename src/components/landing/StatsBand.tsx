const stats = [
  {
    value: "1,1 million",
    label:
      "de meublés de tourisme en infraction, sur 1,2 million recensés en France",
  },
  {
    value: "10 000 €",
    label:
      "d’amende par logement en cas de défaut d’enregistrement Declaloc",
  },
  {
    value: "20 mai 2026",
    label:
      "depuis cette date, Declaloc est obligatoire et les annonces sans numéro sont retirées",
  },
];

export function StatsBand() {
  return (
    <section className="border-b border-brand-900/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3 sm:gap-6 sm:px-6">
        {stats.map((stat) => (
          <div key={stat.value} className="text-center sm:text-left">
            <p className="text-4xl font-bold tracking-tight text-brand-800">
              {stat.value}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
