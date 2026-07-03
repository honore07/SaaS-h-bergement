import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { enrichirSejour, totalTaxeCollectee } from "@/lib/registre/calculs";
import type { LogementInfo, Sejour } from "@/lib/registre/types";

const VERT_FONCE = "#144437";
const VERT = "#196750";
const GRIS_BORDURE = "#c8d3cf";
const GRIS_CLAIR = "#f2f6f4";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    paddingBottom: 54,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1c2321",
  },
  titre: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: VERT_FONCE,
    marginBottom: 4,
  },
  mentionLegale: {
    fontSize: 9,
    color: VERT,
    marginBottom: 12,
  },
  blocLogement: {
    backgroundColor: GRIS_CLAIR,
    borderRadius: 4,
    padding: 10,
    marginBottom: 14,
  },
  ligneLogement: {
    flexDirection: "row",
    marginBottom: 2,
  },
  libelleLogement: {
    width: 130,
    fontFamily: "Helvetica-Bold",
  },
  table: {
    borderWidth: 1,
    borderColor: GRIS_BORDURE,
    borderRadius: 2,
  },
  ligneEntete: {
    flexDirection: "row",
    backgroundColor: VERT_FONCE,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
  },
  ligne: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: GRIS_BORDURE,
  },
  ligneAlternee: {
    backgroundColor: GRIS_CLAIR,
  },
  cellule: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  colArrivee: { width: "11%" },
  colDepart: { width: "11%" },
  colNuits: { width: "7%", textAlign: "right" },
  colAdultes: { width: "8%", textAlign: "right" },
  colMineurs: { width: "8%", textAlign: "right" },
  colExoneres: { width: "10%", textAlign: "right" },
  colAssujettis: { width: "9%", textAlign: "right" },
  colPrix: { width: "10%", textAlign: "right" },
  colTarif: { width: "12%", textAlign: "right" },
  colMontant: { width: "14%", textAlign: "right" },
  ligneTotal: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderTopColor: VERT_FONCE,
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#d8f3e6",
  },
  celluleTotalLibelle: {
    width: "86%",
    paddingVertical: 5,
    paddingHorizontal: 6,
    textAlign: "right",
  },
  celluleTotalMontant: {
    width: "14%",
    paddingVertical: 5,
    paddingHorizontal: 6,
    textAlign: "right",
  },
  vide: {
    padding: 12,
    textAlign: "center",
    color: "#5b6763",
  },
  piedDePage: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#5b6763",
    borderTopWidth: 1,
    borderTopColor: GRIS_BORDURE,
    paddingTop: 6,
  },
});

function euros(valeur: number): string {
  return `${valeur.toFixed(2).replace(".", ",")} €`;
}

function dateCourte(iso: string): string {
  const [annee, mois, jour] = iso.split("-");
  if (!annee || !mois || !jour) return iso;
  return `${jour}/${mois}/${annee}`;
}

export interface RegistrePdfProps {
  logement: LogementInfo;
  sejours: Sejour[];
  dateGeneration: Date;
}

export function RegistrePdf({
  logement,
  sejours,
  dateGeneration,
}: RegistrePdfProps) {
  const lignes = sejours.map(enrichirSejour);
  const total = totalTaxeCollectee(sejours);
  const nomEtablissement =
    logement.nomEtablissement.trim() || "Établissement non renseigné";
  const dateFr = dateGeneration.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Document
      title={`Registre du logeur — ${nomEtablissement}`}
      author="GîteOuvert"
      language="fr"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.titre}>
          Registre du logeur — {nomEtablissement}
        </Text>
        <Text style={styles.mentionLegale}>
          Tenu en application de l&apos;article R2333-51 du Code général des
          collectivités territoriales
        </Text>

        <View style={styles.blocLogement}>
          <View style={styles.ligneLogement}>
            <Text style={styles.libelleLogement}>Établissement</Text>
            <Text>{nomEtablissement}</Text>
          </View>
          <View style={styles.ligneLogement}>
            <Text style={styles.libelleLogement}>Adresse</Text>
            <Text>{logement.adresse.trim() || "Non renseignée"}</Text>
          </View>
          <View style={styles.ligneLogement}>
            <Text style={styles.libelleLogement}>Commune</Text>
            <Text>{logement.commune.trim() || "Non renseignée"}</Text>
          </View>
          <View style={styles.ligneLogement}>
            <Text style={styles.libelleLogement}>Numéro Declaloc</Text>
            <Text>{logement.numeroDeclaloc?.trim() || "Non renseigné"}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.ligneEntete} fixed>
            <Text style={[styles.cellule, styles.colArrivee]}>Arrivée</Text>
            <Text style={[styles.cellule, styles.colDepart]}>Départ</Text>
            <Text style={[styles.cellule, styles.colNuits]}>Nuits</Text>
            <Text style={[styles.cellule, styles.colAdultes]}>Adultes</Text>
            <Text style={[styles.cellule, styles.colMineurs]}>Mineurs</Text>
            <Text style={[styles.cellule, styles.colExoneres]}>
              Autres exonérés
            </Text>
            <Text style={[styles.cellule, styles.colAssujettis]}>
              Assujettis
            </Text>
            <Text style={[styles.cellule, styles.colPrix]}>Prix nuitée</Text>
            <Text style={[styles.cellule, styles.colTarif]}>
              Tarif taxe/pers./nuit
            </Text>
            <Text style={[styles.cellule, styles.colMontant]}>
              Taxe collectée
            </Text>
          </View>

          {lignes.length === 0 ? (
            <View style={styles.ligne}>
              <Text style={styles.vide}>
                Aucun séjour consigné pour le moment.
              </Text>
            </View>
          ) : (
            lignes.map((sejour, index) => (
              <View
                key={sejour.id}
                style={
                  index % 2 === 1
                    ? [styles.ligne, styles.ligneAlternee]
                    : styles.ligne
                }
                wrap={false}
              >
                <Text style={[styles.cellule, styles.colArrivee]}>
                  {dateCourte(sejour.dateArrivee)}
                </Text>
                <Text style={[styles.cellule, styles.colDepart]}>
                  {dateCourte(sejour.dateDepart)}
                </Text>
                <Text style={[styles.cellule, styles.colNuits]}>
                  {sejour.nbNuits}
                </Text>
                <Text style={[styles.cellule, styles.colAdultes]}>
                  {sejour.nbAdultes}
                </Text>
                <Text style={[styles.cellule, styles.colMineurs]}>
                  {sejour.nbMineurs}
                </Text>
                <Text style={[styles.cellule, styles.colExoneres]}>
                  {sejour.nbExoneresAutres}
                </Text>
                <Text style={[styles.cellule, styles.colAssujettis]}>
                  {sejour.personnesAssujetties}
                </Text>
                <Text style={[styles.cellule, styles.colPrix]}>
                  {euros(sejour.prixNuitee)}
                </Text>
                <Text style={[styles.cellule, styles.colTarif]}>
                  {euros(sejour.tarifTaxeParPersonne)}
                </Text>
                <Text style={[styles.cellule, styles.colMontant]}>
                  {euros(sejour.montantTaxe)}
                </Text>
              </View>
            ))
          )}

          <View style={styles.ligneTotal}>
            <Text style={styles.celluleTotalLibelle}>
              Total de taxe de séjour collectée
            </Text>
            <Text style={styles.celluleTotalMontant}>{euros(total)}</Text>
          </View>
        </View>

        <View style={styles.piedDePage} fixed>
          <Text>Généré par GîteOuvert le {dateFr}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
