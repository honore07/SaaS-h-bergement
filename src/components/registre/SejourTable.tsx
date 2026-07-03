"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDateFr, formatEuros } from "@/lib/format";
import { enrichirSejour, totalTaxeCollectee } from "@/lib/registre/calculs";
import type { Sejour } from "@/lib/registre/types";

interface SejourTableProps {
  sejours: Sejour[];
  onSupprimer: (id: string) => void;
}

const enTetes = [
  "Arrivée",
  "Départ",
  "Nuits",
  "Personnes",
  "Assujettis",
  "Tarif taxe",
  "Montant taxe",
  "",
];

export function SejourTable({ sejours, onSupprimer }: SejourTableProps) {
  const lignes = sejours.map(enrichirSejour);
  const total = totalTaxeCollectee(sejours);

  return (
    <Card className="p-0">
      <div className="flex items-baseline justify-between gap-4 px-6 pt-6">
        <h2 className="text-lg font-semibold text-brand-950">
          Séjours consignés
        </h2>
        <span className="text-sm text-foreground/60">
          {sejours.length} séjour{sejours.length > 1 ? "s" : ""}
        </span>
      </div>

      {lignes.length === 0 ? (
        <p className="px-6 py-8 text-sm text-foreground/60">
          Aucun séjour pour le moment. Consignez votre premier séjour avec le
          formulaire ci-dessus : il apparaîtra ici et dans votre export PDF.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-brand-900/10 bg-brand-50 text-left text-xs uppercase tracking-wide text-brand-800">
                {enTetes.map((enTete, i) => (
                  <th key={i} className="px-4 py-2.5 font-semibold">
                    {enTete}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lignes.map((sejour) => (
                <tr
                  key={sejour.id}
                  className="border-b border-brand-900/5 last:border-b-0 hover:bg-brand-50/50"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDateFr(sejour.dateArrivee)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDateFr(sejour.dateDepart)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{sejour.nbNuits}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {sejour.nbAdultes + sejour.nbMineurs}
                    {sejour.nbMineurs > 0 && (
                      <span className="text-foreground/50">
                        {" "}
                        (dont {sejour.nbMineurs} mineur
                        {sejour.nbMineurs > 1 ? "s" : ""})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {sejour.personnesAssujetties}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                    {formatEuros(sejour.tarifTaxeParPersonne)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-brand-800">
                    {formatEuros(sejour.montantTaxe)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => onSupprimer(sejour.id)}
                      aria-label={`Supprimer le séjour du ${formatDateFr(sejour.dateArrivee)}`}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-brand-800 bg-brand-100/60">
                <td
                  colSpan={6}
                  className="px-4 py-3 text-right font-semibold text-brand-950"
                >
                  Total annuel de taxe de séjour collectée
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-bold tabular-nums text-brand-950">
                  {formatEuros(total)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </Card>
  );
}
