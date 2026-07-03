"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { formatEuros } from "@/lib/format";
import {
  calculerMontantTaxe,
  calculerNbNuits,
  calculerPersonnesAssujetties,
} from "@/lib/registre/calculs";
import type { Sejour } from "@/lib/registre/types";

interface SejourFormProps {
  onAjouter: (sejour: Sejour) => void;
}

interface Brouillon {
  dateArrivee: string;
  dateDepart: string;
  nbAdultes: string;
  nbMineurs: string;
  nbExoneresAutres: string;
  prixNuitee: string;
  tarifTaxeParPersonne: string;
  commentaire: string;
}

const BROUILLON_INITIAL: Brouillon = {
  dateArrivee: "",
  dateDepart: "",
  nbAdultes: "2",
  nbMineurs: "0",
  nbExoneresAutres: "0",
  prixNuitee: "",
  tarifTaxeParPersonne: "",
  commentaire: "",
};

function entier(valeur: string): number {
  const n = Number.parseInt(valeur, 10);
  return Number.isNaN(n) ? 0 : n;
}

function decimal(valeur: string): number {
  const n = Number.parseFloat(valeur.replace(",", "."));
  return Number.isNaN(n) ? 0 : n;
}

function validerBrouillon(b: Brouillon): string[] {
  const erreurs: string[] = [];
  if (!b.dateArrivee) erreurs.push("La date d'arrivée est obligatoire.");
  if (!b.dateDepart) erreurs.push("La date de départ est obligatoire.");
  if (
    b.dateArrivee &&
    b.dateDepart &&
    calculerNbNuits(b.dateArrivee, b.dateDepart) === 0
  ) {
    erreurs.push("La date de départ doit être postérieure à la date d'arrivée.");
  }
  if (entier(b.nbAdultes) < 1) {
    erreurs.push("Le séjour doit compter au moins un adulte.");
  }
  if (entier(b.nbMineurs) < 0 || entier(b.nbExoneresAutres) < 0) {
    erreurs.push("Les nombres de personnes ne peuvent pas être négatifs.");
  }
  if (entier(b.nbExoneresAutres) > entier(b.nbAdultes)) {
    erreurs.push(
      "Le nombre d'exonérés ne peut pas dépasser le nombre d'adultes."
    );
  }
  if (decimal(b.prixNuitee) < 0) {
    erreurs.push("Le prix de la nuitée ne peut pas être négatif.");
  }
  if (b.tarifTaxeParPersonne.trim() === "" || decimal(b.tarifTaxeParPersonne) < 0) {
    erreurs.push(
      "Le tarif de taxe de séjour est obligatoire (0 si votre commune n'en applique pas)."
    );
  }
  return erreurs;
}

export function SejourForm({ onAjouter }: SejourFormProps) {
  const [brouillon, setBrouillon] = useState<Brouillon>(BROUILLON_INITIAL);
  const [erreurs, setErreurs] = useState<string[]>([]);

  function modifier(champ: keyof Brouillon, valeur: string) {
    setBrouillon((b) => ({ ...b, [champ]: valeur }));
  }

  const apercu = useMemo(() => {
    const nbNuits = calculerNbNuits(brouillon.dateArrivee, brouillon.dateDepart);
    const personnesAssujetties = calculerPersonnesAssujetties(
      entier(brouillon.nbAdultes),
      entier(brouillon.nbExoneresAutres)
    );
    const montantTaxe = calculerMontantTaxe(
      decimal(brouillon.tarifTaxeParPersonne),
      personnesAssujetties,
      nbNuits
    );
    return { nbNuits, personnesAssujetties, montantTaxe };
  }, [brouillon]);

  function soumettre(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const problemes = validerBrouillon(brouillon);
    setErreurs(problemes);
    if (problemes.length > 0) return;

    const commentaire = brouillon.commentaire.trim();
    onAjouter({
      id: crypto.randomUUID(),
      dateArrivee: brouillon.dateArrivee,
      dateDepart: brouillon.dateDepart,
      nbAdultes: entier(brouillon.nbAdultes),
      nbMineurs: entier(brouillon.nbMineurs),
      nbExoneresAutres: entier(brouillon.nbExoneresAutres),
      prixNuitee: decimal(brouillon.prixNuitee),
      tarifTaxeParPersonne: decimal(brouillon.tarifTaxeParPersonne),
      ...(commentaire ? { commentaire } : {}),
    });
    setBrouillon(BROUILLON_INITIAL);
    setErreurs([]);
  }

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-brand-950">
        Ajouter un séjour
      </h2>
      <form onSubmit={soumettre} noValidate>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="sejour-arrivee">Date d&apos;arrivée</Label>
            <Input
              id="sejour-arrivee"
              type="date"
              value={brouillon.dateArrivee}
              onChange={(e) => modifier("dateArrivee", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="sejour-depart">Date de départ</Label>
            <Input
              id="sejour-depart"
              type="date"
              value={brouillon.dateDepart}
              onChange={(e) => modifier("dateDepart", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="sejour-adultes">Adultes</Label>
            <Input
              id="sejour-adultes"
              type="number"
              min={1}
              step={1}
              value={brouillon.nbAdultes}
              onChange={(e) => modifier("nbAdultes", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sejour-mineurs">Mineurs</Label>
            <Input
              id="sejour-mineurs"
              type="number"
              min={0}
              step={1}
              value={brouillon.nbMineurs}
              onChange={(e) => modifier("nbMineurs", e.target.value)}
            />
            <p className="mt-1 text-xs text-foreground/50">
              Exonérés de plein droit
            </p>
          </div>
          <div>
            <Label htmlFor="sejour-exoneres">Autres exonérés</Label>
            <Input
              id="sejour-exoneres"
              type="number"
              min={0}
              step={1}
              value={brouillon.nbExoneresAutres}
              onChange={(e) => modifier("nbExoneresAutres", e.target.value)}
            />
            <p className="mt-1 text-xs text-foreground/50">
              Saisonniers, logement d&apos;urgence…
            </p>
          </div>
          <div>
            <Label htmlFor="sejour-prix">Prix de la nuitée (€)</Label>
            <Input
              id="sejour-prix"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              value={brouillon.prixNuitee}
              onChange={(e) => modifier("prixNuitee", e.target.value)}
              placeholder="Ex. : 95"
            />
          </div>
          <div>
            <Label htmlFor="sejour-tarif">Tarif taxe / pers. / nuit (€)</Label>
            <Input
              id="sejour-tarif"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              value={brouillon.tarifTaxeParPersonne}
              onChange={(e) => modifier("tarifTaxeParPersonne", e.target.value)}
              placeholder="Ex. : 0,80"
            />
            <p className="mt-1 text-xs text-foreground/50">
              Fixé par votre commune ou intercommunalité
            </p>
          </div>
          <div>
            <Label htmlFor="sejour-commentaire">
              Commentaire{" "}
              <span className="font-normal text-foreground/50">(optionnel)</span>
            </Label>
            <Input
              id="sejour-commentaire"
              value={brouillon.commentaire}
              onChange={(e) => modifier("commentaire", e.target.value)}
              placeholder="Ex. : réservation Airbnb"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-900">
          <span className="font-medium">Calcul en direct :</span>
          <Badge tone="brand">
            {apercu.nbNuits} nuit{apercu.nbNuits > 1 ? "s" : ""}
          </Badge>
          <Badge tone="brand">
            {apercu.personnesAssujetties} personne
            {apercu.personnesAssujetties > 1 ? "s" : ""} assujettie
            {apercu.personnesAssujetties > 1 ? "s" : ""}
          </Badge>
          <Badge tone="green">
            Taxe du séjour : {formatEuros(apercu.montantTaxe)}
          </Badge>
        </div>

        {erreurs.length > 0 && (
          <ul className="mt-4 space-y-1 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erreurs.map((erreur) => (
              <li key={erreur}>{erreur}</li>
            ))}
          </ul>
        )}

        <div className="mt-5">
          <Button type="submit">Consigner ce séjour</Button>
        </div>
      </form>
    </Card>
  );
}
