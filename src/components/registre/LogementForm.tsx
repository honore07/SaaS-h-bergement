"use client";

import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import type { LogementInfo } from "@/lib/registre/types";

interface LogementFormProps {
  logement: LogementInfo;
  onChange: (logement: LogementInfo) => void;
}

export function LogementForm({ logement, onChange }: LogementFormProps) {
  function modifier(champ: keyof LogementInfo, valeur: string) {
    onChange({ ...logement, [champ]: valeur });
  }

  return (
    <Card>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold text-brand-950">Mon logement</h2>
        <span className="text-xs text-foreground/50">
          Sauvegardé automatiquement sur cet appareil
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="logement-nom">Nom de l&apos;établissement</Label>
          <Input
            id="logement-nom"
            value={logement.nomEtablissement}
            onChange={(e) => modifier("nomEtablissement", e.target.value)}
            placeholder="Ex. : La Charrette du Ried"
            autoComplete="organization"
          />
        </div>
        <div>
          <Label htmlFor="logement-adresse">Adresse</Label>
          <Input
            id="logement-adresse"
            value={logement.adresse}
            onChange={(e) => modifier("adresse", e.target.value)}
            placeholder="Ex. : 12 rue des Vergers"
            autoComplete="street-address"
          />
        </div>
        <div>
          <Label htmlFor="logement-commune">Commune</Label>
          <Input
            id="logement-commune"
            value={logement.commune}
            onChange={(e) => modifier("commune", e.target.value)}
            placeholder="Ex. : Sélestat"
          />
        </div>
        <div>
          <Label htmlFor="logement-declaloc">
            Numéro Declaloc <span className="font-normal text-foreground/50">(optionnel)</span>
          </Label>
          <Input
            id="logement-declaloc"
            value={logement.numeroDeclaloc ?? ""}
            onChange={(e) => modifier("numeroDeclaloc", e.target.value)}
            placeholder="Ex. : 6746200012345"
          />
        </div>
      </div>
    </Card>
  );
}
