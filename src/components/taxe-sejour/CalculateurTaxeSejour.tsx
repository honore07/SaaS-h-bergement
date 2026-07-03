"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label, Select } from "@/components/ui/Input";
import { formatEuros } from "@/lib/format";
import type { TauxTaxeSejour } from "@/lib/api/delta";
import type { BanResult } from "@/lib/api/ban";

interface ApiReponse {
  commune: string | null;
  codeInsee: string;
  taux: TauxTaxeSejour[];
}

type Statut = "vide" | "chargement" | "ok" | "erreur";

function formatTaux(t: TauxTaxeSejour): string {
  if (t.tarifFixe != null) {
    return `${formatEuros(t.tarifFixe)} / nuit / pers.`;
  }
  const pourcentage = `${String(t.tauxProportionnel).replace(".", ",")} % du coût de la nuitée / pers.`;
  return t.plafond != null
    ? `${pourcentage} (plafond ${formatEuros(t.plafond)})`
    : pourcentage;
}

export function CalculateurTaxeSejour() {
  const [commune, setCommune] = useState<BanResult | null>(null);
  const [statut, setStatut] = useState<Statut>("vide");
  const [donnees, setDonnees] = useState<ApiReponse | null>(null);

  // Simulateur
  const [categorie, setCategorie] = useState("");
  const [adultes, setAdultes] = useState("2");
  const [nuits, setNuits] = useState("2");
  const [prixNuitee, setPrixNuitee] = useState("90");

  async function chercherCommune(resultat: BanResult) {
    setCommune(resultat);
    setStatut("chargement");
    setDonnees(null);
    setCategorie("");
    try {
      const res = await fetch(
        `/api/taxe-sejour?commune=${encodeURIComponent(resultat.citycode)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as ApiReponse;
      setDonnees(data);
      setStatut("ok");
      // Présélectionne la catégorie la plus courante pour un micro-hébergeur :
      // la grande majorité des meublés loués sur les plateformes sont non classés.
      const nonClasse = data.taux.find((t) =>
        /sans classement|attente de classement/i.test(t.categorieHebergement)
      );
      const meuble = data.taux.find((t) =>
        t.categorieHebergement.toLowerCase().includes("meublé")
      );
      setCategorie(
        (nonClasse ?? meuble ?? data.taux[0])?.categorieHebergement ?? ""
      );
    } catch {
      setStatut("erreur");
    }
  }

  const tauxChoisi = useMemo(
    () =>
      donnees?.taux.find((t) => t.categorieHebergement === categorie) ?? null,
    [donnees, categorie]
  );

  const estimation = useMemo(() => {
    if (!tauxChoisi) return null;
    const nbAdultes = Math.max(1, Math.floor(Number(adultes) || 0));
    const nbNuits = Math.max(1, Math.floor(Number(nuits) || 0));
    const prix = Math.max(0, Number(prixNuitee.replace(",", ".")) || 0);

    let parPersonneParNuit: number;
    if (tauxChoisi.tarifFixe != null) {
      parPersonneParNuit = tauxChoisi.tarifFixe;
    } else {
      // Taux proportionnel : appliqué au coût de la nuitée par personne, plafonné
      // au tarif le plus élevé voté par la collectivité (art. L2333-30 CGCT).
      const coutParPersonne = prix / nbAdultes;
      parPersonneParNuit =
        ((tauxChoisi.tauxProportionnel ?? 0) / 100) * coutParPersonne;
      if (tauxChoisi.plafond != null) {
        parPersonneParNuit = Math.min(parPersonneParNuit, tauxChoisi.plafond);
      }
    }
    return {
      parPersonneParNuit,
      total: parPersonneParNuit * nbAdultes * nbNuits,
      nbAdultes,
      nbNuits,
    };
  }, [tauxChoisi, adultes, nuits, prixNuitee]);

  const nomCommune = donnees?.commune ?? commune?.city ?? "";

  return (
    <div className="space-y-8">
      {/* Recherche de commune */}
      <Card>
        <Label htmlFor="commune-taxe-sejour">
          Dans quelle commune se trouve votre hébergement ?
        </Label>
        <AddressAutocomplete
          id="commune-taxe-sejour"
          mode="commune"
          placeholder="Ex. Colmar, Riquewihr, Kaysersberg…"
          onSelect={chercherCommune}
        />
        <p className="mt-2 text-xs text-foreground/50">
          Source : délibérations officielles transmises à la DGFiP via
          l&apos;application DELTA (data.economie.gouv.fr), plus de 36 000
          communes couvertes.
        </p>
      </Card>

      {/* États */}
      {statut === "vide" && (
        <Card className="text-center text-sm text-foreground/60">
          Recherchez votre commune ci-dessus pour afficher les tarifs de taxe
          de séjour votés par votre collectivité.
        </Card>
      )}

      {statut === "chargement" && (
        <Card className="text-center text-sm text-foreground/60">
          Chargement des tarifs de {commune?.city}…
        </Card>
      )}

      {statut === "erreur" && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm font-medium text-red-800">
            Impossible d&apos;interroger la base DELTA pour le moment.
          </p>
          <p className="mt-1 text-sm text-red-700">
            Le service open data de la DGFiP est peut-être momentanément
            indisponible. Réessayez dans quelques instants.
          </p>
        </Card>
      )}

      {statut === "ok" && donnees && donnees.taux.length === 0 && (
        <Card className="border-accent-200 bg-accent-50">
          <p className="text-sm font-medium text-accent-800">
            {nomCommune} n&apos;a pas publié ses taux dans DELTA.
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            Votre commune (ou son intercommunalité) n&apos;a pas de
            délibération de taxe de séjour enregistrée dans la base DELTA de la
            DGFiP. Cela ne signifie pas forcément qu&apos;aucune taxe
            n&apos;est due : vérifiez auprès de votre mairie ou de votre office
            de tourisme.
          </p>
        </Card>
      )}

      {statut === "ok" && donnees && donnees.taux.length > 0 && (
        <>
          {/* Tableau des taux */}
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">
                Tarifs votés à {nomCommune}
              </h2>
              <Badge tone="brand">Année {donnees.taux[0].annee}</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-900/10 text-left text-xs uppercase tracking-wide text-foreground/50">
                    <th className="py-2 pr-4 font-medium">
                      Catégorie d&apos;hébergement
                    </th>
                    <th className="py-2 pr-4 font-medium">Tarif</th>
                    <th className="py-2 font-medium">Période</th>
                  </tr>
                </thead>
                <tbody>
                  {donnees.taux.map((t) => (
                    <tr
                      key={t.categorieHebergement}
                      className={`border-b border-brand-900/5 last:border-0 ${
                        t.categorieHebergement === categorie
                          ? "bg-brand-50"
                          : ""
                      }`}
                    >
                      <td className="py-2 pr-4">{t.categorieHebergement}</td>
                      <td className="py-2 pr-4 font-medium whitespace-nowrap">
                        {formatTaux(t)}
                      </td>
                      <td className="py-2 text-foreground/60 whitespace-nowrap">
                        {t.periodes[0] ?? "Toute l'année"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-foreground/50">
              Tarifs par personne et par nuit, taxes additionnelles
              (départementale, régionale) incluses. Régime{" "}
              {donnees.taux[0].regime.toLowerCase()}.
            </p>
          </Card>

          {/* Simulateur */}
          <Card>
            <h2 className="mb-4 text-lg font-semibold">
              Estimez la taxe pour un séjour
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="ts-categorie">
                  Catégorie de votre hébergement
                </Label>
                <Select
                  id="ts-categorie"
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                >
                  {donnees.taux.map((t) => (
                    <option
                      key={t.categorieHebergement}
                      value={t.categorieHebergement}
                    >
                      {t.categorieHebergement}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="ts-adultes">Nombre d&apos;adultes</Label>
                <Input
                  id="ts-adultes"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={adultes}
                  onChange={(e) => setAdultes(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ts-nuits">Nombre de nuits</Label>
                <Input
                  id="ts-nuits"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={nuits}
                  onChange={(e) => setNuits(e.target.value)}
                />
              </div>
              {tauxChoisi?.tauxProportionnel != null && (
                <div className="sm:col-span-2">
                  <Label htmlFor="ts-prix">
                    Prix de la nuitée (logement entier, en euros)
                  </Label>
                  <Input
                    id="ts-prix"
                    type="number"
                    min={0}
                    step="1"
                    inputMode="decimal"
                    value={prixNuitee}
                    onChange={(e) => setPrixNuitee(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-foreground/50">
                    Nécessaire car votre catégorie applique un taux
                    proportionnel au coût de la nuitée par personne.
                  </p>
                </div>
              )}
            </div>

            {estimation && (
              <div className="mt-6 rounded-xl bg-brand-50 p-4">
                <p className="text-sm text-foreground/70">
                  Taxe de séjour estimée pour {estimation.nbAdultes}{" "}
                  {estimation.nbAdultes > 1 ? "adultes" : "adulte"} et{" "}
                  {estimation.nbNuits}{" "}
                  {estimation.nbNuits > 1 ? "nuits" : "nuit"} :
                </p>
                <p className="mt-1 text-3xl font-bold text-brand-800">
                  {formatEuros(estimation.total)}
                </p>
                <p className="mt-1 text-xs text-foreground/50">
                  soit {formatEuros(estimation.parPersonneParNuit)} par
                  personne et par nuit. Montant à collecter auprès de vos
                  voyageurs et à reverser à la collectivité.
                </p>
              </div>
            )}

            <div className="mt-4 rounded-lg border border-brand-900/10 p-4 text-sm text-foreground/70">
              <p className="font-medium text-foreground">
                Exonérations légales (art. L2333-31 CGCT) — ne comptez pas :
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>les personnes mineures (moins de 18 ans) ;</li>
                <li>
                  les titulaires d&apos;un contrat de travail saisonnier
                  employés dans la commune ;
                </li>
                <li>
                  les personnes bénéficiant d&apos;un hébergement
                  d&apos;urgence ou d&apos;un relogement temporaire.
                </li>
              </ul>
            </div>
          </Card>
        </>
      )}

      {/* Encart pédagogique */}
      <Card className="border-brand-200 bg-brand-50">
        <h2 className="text-lg font-semibold">
          Airbnb ou Booking collectent pour vous ? Le registre reste
          obligatoire.
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          Même lorsque les plateformes collectent et reversent la taxe de
          séjour à votre place, vous restez tenu de tenir un registre du
          logeur : nombre de personnes hébergées, nombre de nuitées, montants
          perçus, motifs d&apos;exonération. En cas de contrôle de la
          collectivité, c&apos;est ce registre qui vous protège. Et pour les
          réservations en direct (bouche-à-oreille, site personnel), c&apos;est
          vous qui collectez.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/registre">
            <Button variant="primary">Générer mon registre du logeur</Button>
          </Link>
          <Link href="/diagnostic">
            <Button variant="outline">
              Diagnostic de conformité gratuit
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
