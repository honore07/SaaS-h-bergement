"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  LIMITE_SEJOURS_GRATUITS,
  type LogementInfo,
  type Sejour,
} from "@/lib/registre/types";
import { mettreAJourRegistre, useRegistre } from "@/lib/registre/useRegistre";
import { LogementForm } from "./LogementForm";
import { SejourForm } from "./SejourForm";
import { SejourTable } from "./SejourTable";
import { UpsellCard } from "./UpsellCard";

export function RegistreClient() {
  const registre = useRegistre();
  const [exportEnCours, setExportEnCours] = useState(false);
  const [erreurExport, setErreurExport] = useState<string | null>(null);

  const limiteAtteinte = registre.sejours.length >= LIMITE_SEJOURS_GRATUITS;

  function modifierLogement(logement: LogementInfo) {
    mettreAJourRegistre((r) => ({ ...r, logement }));
  }

  function ajouterSejour(sejour: Sejour) {
    mettreAJourRegistre((r) => {
      if (r.sejours.length >= LIMITE_SEJOURS_GRATUITS) return r;
      return { ...r, sejours: [...r.sejours, sejour] };
    });
  }

  function supprimerSejour(id: string) {
    mettreAJourRegistre((r) => ({
      ...r,
      sejours: r.sejours.filter((sejour) => sejour.id !== id),
    }));
  }

  async function exporterPdf() {
    setExportEnCours(true);
    setErreurExport(null);
    try {
      // Import dynamique : @react-pdf/renderer n'est chargé que dans le
      // navigateur, au moment du clic — jamais au rendu serveur.
      const [{ pdf }, { RegistrePdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./RegistrePdf"),
      ]);
      const blob = await pdf(
        <RegistrePdf
          logement={registre.logement}
          sejours={registre.sejours}
          dateGeneration={new Date()}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const lien = document.createElement("a");
      lien.href = url;
      lien.download = `registre-du-logeur-${new Date().getFullYear()}.pdf`;
      document.body.appendChild(lien);
      lien.click();
      lien.remove();
      URL.revokeObjectURL(url);
    } catch {
      setErreurExport(
        "L'export PDF a échoué. Rechargez la page puis réessayez."
      );
    } finally {
      setExportEnCours(false);
    }
  }

  return (
    <div className="space-y-6">
      <LogementForm logement={registre.logement} onChange={modifierLogement} />

      {limiteAtteinte ? <UpsellCard /> : <SejourForm onAjouter={ajouterSejour} />}

      <SejourTable sejours={registre.sejours} onSupprimer={supprimerSejour} />

      <div className="flex flex-col items-start gap-2">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={exporterPdf}
          disabled={exportEnCours || registre.sejours.length === 0}
        >
          {exportEnCours
            ? "Génération du PDF…"
            : "Exporter le registre en PDF"}
        </Button>
        {registre.sejours.length === 0 && (
          <p className="text-xs text-foreground/50">
            Consignez au moins un séjour pour exporter votre registre.
          </p>
        )}
        {erreurExport && (
          <p className="text-sm text-red-600">{erreurExport}</p>
        )}
      </div>
    </div>
  );
}
