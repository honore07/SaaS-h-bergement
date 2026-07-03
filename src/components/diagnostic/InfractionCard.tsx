import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatEuros } from "@/lib/format";
import type { Infraction } from "@/lib/diagnostic/types";

const GRAVITE_TONES = {
  critique: "red",
  haute: "amber",
  moyenne: "neutral",
} as const;

const GRAVITE_LABELS: Record<Infraction["gravite"], string> = {
  critique: "Critique",
  haute: "Haute",
  moyenne: "Moyenne",
};

export function InfractionCard({
  infraction,
  rang,
}: {
  infraction: Infraction;
  rang: number;
}) {
  return (
    <Card className="p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-900/5 text-xs font-bold text-foreground/60">
          {rang}
        </span>
        <h3 className="text-base font-semibold">{infraction.titre}</h3>
        <Badge tone={GRAVITE_TONES[infraction.gravite]}>
          {GRAVITE_LABELS[infraction.gravite]}
        </Badge>
      </div>

      <p className="mb-3 text-sm text-foreground/70">{infraction.description}</p>

      <div className="flex flex-col gap-2 border-t border-brand-900/10 pt-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs italic text-foreground/50">
          {infraction.reference}
        </span>
        <span className="font-semibold text-red-700">
          {infraction.expositionMax > 0
            ? `Exposition : jusqu'à ${formatEuros(infraction.expositionMax)}`
            : "Pas d'amende immédiate — échéance à anticiper"}
        </span>
      </div>

      <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-900">
        <span className="font-semibold">Action recommandée : </span>
        {infraction.action}
      </p>
    </Card>
  );
}
