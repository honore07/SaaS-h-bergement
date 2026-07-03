export function ScoreGauge({ score }: { score: number }) {
  const borne = Math.min(10, Math.max(0, score));
  const rayon = 54;
  const circonference = 2 * Math.PI * rayon;
  const portion = circonference * (borne / 10);

  const couleur =
    borne >= 7 ? "#1d7f61" : borne >= 4 ? "#d97706" : "#dc2626";
  const libelle =
    borne >= 7 ? "Bonne conformité" : borne >= 4 ? "Conformité partielle" : "Situation à risque";

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 128 128"
        className="h-40 w-40"
        role="img"
        aria-label={`Score de conformité : ${borne} sur 10`}
      >
        <circle
          cx="64"
          cy="64"
          r={rayon}
          fill="none"
          stroke="#e7e5df"
          strokeWidth="11"
        />
        <circle
          cx="64"
          cy="64"
          r={rayon}
          fill="none"
          stroke={couleur}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${portion} ${circonference}`}
          transform="rotate(-90 64 64)"
        />
        <text
          x="64"
          y="66"
          textAnchor="middle"
          fontSize="34"
          fontWeight="700"
          fill={couleur}
        >
          {borne}
        </text>
        <text
          x="64"
          y="86"
          textAnchor="middle"
          fontSize="13"
          fill="#1c2321"
          opacity="0.55"
        >
          / 10
        </text>
      </svg>
      <p className="mt-1 text-sm font-semibold" style={{ color: couleur }}>
        {libelle}
      </p>
    </div>
  );
}
