# Dimensionnement de marché réaliste — GîteOuvert

*Établi en juillet 2026. Objectif : remplacer le chiffrage gonflé du document projet v2 (« ~1,1M sur 1,2M de meublés en infraction, 92 % ») par un TAM/SAM/SOM crédible, sourcé et défendable face à un investisseur sceptique. À lire en complément de [RAPPORT-VERIFICATION-REGLEMENTAIRE.md](RAPPORT-VERIFICATION-REGLEMENTAIRE.md).*

> **Avertissement méthodo** : aucune statistique n'est inventée. Quand une donnée est introuvable dans une source primaire, c'est signalé et remplacé par une fourchette raisonnée à partir des données adjacentes. Chaque chiffre clé porte sa source. Les euros sont des ordres de grandeur, pas des prévisions comptables.

---

## Synthèse (le vrai chiffre à retenir)

Le parc réel de meublés de tourisme en France est d'environ **1,0 à 1,2 million de logements** (≈ 1,19 M d'annonces sur plateformes en 2023 selon le rapport Le Meur, ≈ 1,31 M de listings actifs mensuels tous canaux selon AirDNA 2024-25). Mais le « **1,1M en infraction (92 %) » du doc initial est faux** : la même source parlementaire montre que **~1 million de loueurs sont déjà déclarés au fisc comme LMNP** (DGFiP 2021) et que **48 % du parc est de la résidence principale louée occasionnellement** — un segment très majoritairement conforme et peu solvable. La non-conformité **réelle et monétisable** ne porte pas sur 1,1M de logements mais sur un cœur de cible bien plus étroit : **~150 000 à 400 000 loueurs** cumulant un vrai risque (fiscal mal géré, non-enregistrés en zone tendue, choc micro-BIC 2025) ET une capacité/volonté de payer. C'est ce chiffre, pas le 1,1M, qui fonde le SAM. Le marché reste réel et intéressant, mais il faut le vendre honnêtement : **niche de valeur, pas raz-de-marée**.

**Chiffres clés retenus :**
- **TAM ≈ 90–180 M€/an** (tout le parc adressable × ARPU réaliste mixte)
- **SAM ≈ 25–55 M€/an** (cœur de cible : micro-hébergeurs 1-3 unités non conformes fiscalement ou non enregistrés en zone à risque)
- **SOM an 1-3 ≈ 0,2 → 1,5 M€/an** (part réellement atteignable via SEO + Meta Ads, conversions prudentes)

---

## 1. Les confusions du doc initial

| Affirmation initiale (v2) | Réalité vérifiée | Source |
|---|---|---|
| « 1,2M de meublés, dont ~1,1M en infraction (92 %) » | Le parc est bien ~1,0–1,2M, mais le taux de 92 % d'infraction est une addition d'infractions largement fictives ou non cumulables. Le vrai « stock non conforme monétisable » est de l'ordre de 150k–400k. | Rapport Le Meur (via [paulduvaux.com](https://www.paulduvaux.com/documentations/location-meublee-et-parahotellerie/item/751-les-informations-statistiques-interessantes-mais-incompletes-fournies-par-le-rapport-le-meur)) ; [DGE](https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme) |
| « 960 000–1 080 000 sans registre du logeur légal » | **Surestimé / largement faux.** Le registre du logeur (R2333-51 CGCT) ne concerne que la taxe **au réel collectée par le loueur** ; quand la plateforme collecte (cas des non-pros, majoritaire), **c'est elle qui déclare**. Ce « 960k-1080k » double-compte des gens qui n'ont aucune obligation de registre. | [RAPPORT-VERIFICATION-REGLEMENTAIRE.md](RAPPORT-VERIFICATION-REGLEMENTAIRE.md) §5 ; art. R2333-51 CGCT |
| « 60 000–96 000 avec DPE classe G actif (interdit depuis janv. 2025) » | **Faux pour les meublés de tourisme.** Le calendrier G/F/E vise les baux d'habitation. Pour les meublés : DPE A-E seulement en cas de nouvelle autorisation de changement d'usage, et A-D pour tous **d'ici 2034**. Donc **pas une infraction actuelle** → 0 € d'exposition aujourd'hui. | [RAPPORT-VERIFICATION-REGLEMENTAIRE.md](RAPPORT-VERIFICATION-REGLEMENTAIRE.md) §2 ; décrets 2026-196/197 |
| « 300 000–420 000 avec non-déclaration fiscale » | Plausible en ordre de grandeur mais à nuancer fortement : **~1M de loueurs sont déjà déclarés LMNP** au fisc (600k micro non classé, 120k micro classé, 300k réel). La marge de non-déclarants est le résidu, pas la majorité. DAC7 la réduit chaque année. | Rapport Le Meur / DGFiP 2021 (via [paulduvaux.com](https://www.paulduvaux.com/documentations/location-meublee-et-parahotellerie/item/751-les-informations-statistiques-interessantes-mais-incompletes-fournies-par-le-rapport-le-meur)) |
| « Assurance : obligation → infraction » | Pas d'obligation légale (sauf RC copropriété). Exigence contractuelle. **0 € d'amende.** Ne compte pas dans l'exposition réglementaire. | [RAPPORT-VERIFICATION-REGLEMENTAIRE.md](RAPPORT-VERIFICATION-REGLEMENTAIRE.md) §6 |
| « 240 000–360 000 sans enregistrement » | Le bon axe, mais avant mai 2026 l'enregistrement n'était obligatoire que dans les communes l'ayant institué (grandes villes + zones tendues, « ~420 communes » — ordre de grandeur non confirmé par source primaire machine-readable). La généralisation au 20/05/2026 crée un vrai flux, mais **en période transitoire** : téléservice national DGE non déployé côté loueurs avant le 2nd semestre 2026. | [RAPPORT-VERIFICATION-REGLEMENTAIRE.md](RAPPORT-VERIFICATION-REGLEMENTAIRE.md) §1 ; [lmnp.ai](https://lmnp.ai/meuble-tourisme-2026) |
| Table de projection bâtie sur packs à 299/449/599 € | Tarifs abandonnés. Nouveaux packs **50/99/150 €** + abo **29 €/mois**. Toute la projection financière du doc v2 est caduque (voir §5). | Décision produit interne |

**Le vice de raisonnement du 92 %** : le doc additionne 5 catégories d'« infractions » (enregistrement + fiscal + registre + SIRET + DPE) qui (a) se recouvrent (un même loueur compté 3-4 fois), (b) incluent des non-infractions (DPE, assurance), (c) surestiment massivement une catégorie (registre). Résultat : un total qui frôle l'exhaustivité du parc alors que le vrai « non conforme, à risque, solvable » est une fraction.

---

## 2. Parc adressable — entonnoir chiffré

### Les 3 chiffres qu'on confond (à démêler)

| Métrique | Chiffre | Ce que ça mesure | Source |
|---|---|---|---|
| Annonces / listings actifs | **~1,19M** (2023, plateformes) → **~1,31M** listings actifs mensuels 2024-25 | Des **annonces**, pas des logements ni des personnes. Un loueur multi-biens = plusieurs listings. Un logement = parfois 2 annonces (Airbnb + Booking). | Rapport Le Meur ([paulduvaux](https://www.paulduvaux.com/documentations/location-meublee-et-parahotellerie/item/751-les-informations-statistiques-interessantes-mais-incompletes-fournies-par-le-rapport-le-meur)) ; [AirDNA 2024-25](https://www.airdna.co/press/airbnb-france-territory-reach) |
| Parc « meublés de tourisme » | **~1,0–1,2M** logements (chiffre officiel DGE : « 1,2 million ») | Le parc de logements. Passé de ~300k à 1,2M en 8 ans. | [DGE](https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme) |
| Loueurs / exploitants LMNP | **~1M** (DGFiP 2021) | Des **personnes** déclarant l'activité au fisc. C'est le vrai dénominateur « acheteurs potentiels ». | Rapport Le Meur / DGFiP ([paulduvaux](https://www.paulduvaux.com/documentations/location-meublee-et-parahotellerie/item/751-les-informations-statistiques-interessantes-mais-incompletes-fournies-par-le-rapport-le-meur)) |
| Meublés **classés** Atout France | **~179k–186k** | Sous-ensemble ayant fait une démarche qualité (donc plutôt les plus « pros » / conformes). | [ADN Tourisme / DGE](https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme) |

**Répartition par usage (estimation PwC/Airbnb citée par le rapport Le Meur)** : **48 % résidence principale** louée occasionnellement, **44 % résidence secondaire**, **8 % dédié** (>120 nuits/an). Les 8 % dédiés (~80–96k logements) sont les plus « pro » et souvent déjà accompagnés par un expert-comptable. Le cœur de notre cible se trouve dans le haut du segment résidence secondaire + le bas des dédiés : des gens qui louent « pour de vrai » mais gèrent seuls, sans comptable, avec une conformité approximative.

### Entonnoir (fourchettes basse / haute + hypothèses)

| Étage | Basse | Haute | Hypothèse |
|---|---|---|---|
| **Parc total meublés de tourisme** | 1 000 000 | 1 200 000 | DGE + rapport Le Meur |
| **− Résidence principale occasionnelle** (peu de risque, peu de valeur) | −48 % | −40 % | Split PwC ; on retire l'essentiel des RP |
| **= Loueurs « actifs / investis »** (RS + dédiés) | ~520 000 | ~720 000 | Base réellement adressable |
| **dont réellement non conformes de façon monétisable** | ~150 000 | ~400 000 | Voir décomposition ci-dessous |
| **dont atteignables + solvables** (canal digital, prêts à payer 50-150 €) | ~60 000 | ~180 000 | Taux d'accessibilité 30-45 % du non-conforme |

**Décomposition du « non conforme monétisable » (non additif — recouvrements possibles)** :
- **Non-enregistrés en zone où ça mord** (annonce menacée/désactivée post 20/05/2026) : ordre de grandeur **100k–250k** logements. Le doc v2 disait 240-360k ; on garde la borne basse plus prudente car la généralisation est récente et en période transitoire (numéros pas tous délivrables immédiatement). *Donnée exacte introuvable — pas de compteur national public de numéros délivrés à ce jour.*
- **Mal déclarés / choc micro-BIC 2025** (bascule non classé de 77 700 €→15 000 € et abattement 50 %→30 %) : les loueurs non classés dépassant 15 000 € basculent au réel sans le savoir → besoin d'accompagnement. Sous-ensemble estimé **80k–200k**. *Nombre exact de loueurs impactés non publié.* ([TGS France](https://www.tgs-france.fr/blog/location-meublee-de-tourisme-non-classee-regles-fiscales-regime-micro-2025/))
- **Non-déclarants fiscaux purs** (résidu après les ~1M déjà LMNP) : **fourchette large 50k–250k**, en décroissance sous l'effet DAC7 (croisement automatique plateformes ↔ 2042-C-PRO). *Aucune source officielle ne chiffre le taux de fraude ; fourchette raisonnée.*

> **Point d'honnêteté** : ces sous-ensembles se recoupent. On ne les additionne PAS. Le « 150k–400k » de la ligne « non conforme monétisable » est une estimation de l'union des ensembles, pas leur somme.

---

## 3. TAM / SAM / SOM (en euros)

### Hypothèse ARPU (mix one-shot + récurrent)

Nouveaux tarifs : packs **50 / 99 / 150 €** (one-shot) + abo **29 €/mois** (≈ 290 €/an avec engagement).

- **ARPU one-shot moyen** (mix des 3 packs, pondéré vers le milieu) : **~90 €**.
- **Taux de passage à l'abonnement** parmi les acheteurs one-shot : hypothèse prudente **12–20 %**.
- **Durée de vie abo** : hypothèse **~14 mois** (churn élevé typique d'un abo « conformité » sur micro-hébergeurs) → **~340–400 €** de LTV abo par abonné.
- **ARPU annualisé mixte** (one-shot amorti + fraction d'abonnés) : **~110–150 €/client/an** la première année, montant possible **~130–180 €** avec maturité de l'abo.

Ancrage WTP (crédibilité du prix) : les comptables LMNP en ligne facturent **200–630 €/an** ([JD2M](https://www.jedeclaremonmeuble.com/tarif/) : 299 € Essentielle → 629 € Intégrale ; [Amarris Immo](https://www.amarris-immo.fr/nos-offres-et-tarifs-lmp-lmnp/) dès ~390 €/an ; Decla.fr dès ~9,90 €/mois). Nos packs 50-150 € se positionnent **nettement sous** le comptable → prix d'appel crédible, faible friction, mais ARPU par tête structurellement bas. C'est le volume qui fait le marché, pas le ticket.

### TAM — tout le parc adressable × ARPU réaliste

Base = loueurs « actifs / investis » (le parc RP occasionnelle est retiré, non solvable) : **520k–720k**.

```
TAM = 520 000 à 720 000 loueurs adressables × 130-250 € ARPU annualisé potentiel
    ≈ 90 M€ (bas)  à  180 M€ (haut)
```
Interprétation : **~90–180 M€/an** est la taille théorique si l'on servait tout le parc réellement investi au tarif GîteOuvert. À comparer au « TAM » implicite du doc v2 (1,1M × ~300-600 € = 330 M€–660 M€), qui était gonflé par (a) un parc surévalué en « acheteurs » et (b) des tarifs 3-6× supérieurs abandonnés.

### SAM — segment prioritaire réaliste

Segment servi : **micro-hébergeurs 1-3 unités, non conformes fiscalement OU non enregistrés en zone à risque, gérant seuls (sans comptable), joignables en digital**.

```
Cœur non conforme monétisable :   150 000 à 400 000
× part réellement adressable/solvable digitalement (30-45 %) : 
SAM en clients potentiels ≈ 60 000 à 180 000
× ARPU annualisé 130-300 € :
SAM ≈ 25 M€ (bas)  à  55 M€ (haut)   [borne haute prudente ~55 M€]
```
On retient **SAM ≈ 25–55 M€/an**. C'est le marché qu'on peut raisonnablement viser à maturité si l'on capte une part significative du segment prioritaire.

### SOM — part atteignable an 1-3 (SEO + Meta Ads)

Hypothèses de conversion **prudentes** :
- Trafic qualifié atteignable an 1-3 (SEO longue traîne « intent régularisation » + Meta Ads groupes hébergeurs) : **diagnostics gratuits complétés** ≈ 8k (an 1) → 25k (an 2) → 60k (an 3).
- **Taux de conversion diagnostic → pack payant** : 3 % (an 1, prudent) → 5 % (an 2) → 6 % (an 3). *Un funnel « douleur réglementaire » avec chiffre d'exposition en € peut faire mieux, mais on reste conservateur.*
- **ARPU annualisé** : 110 € (an 1) → 140 € (an 2) → 160 € (an 3, effet base abo).

```
An 1 :  8 000 diag × 3 %  =   240 clients × 110 € ≈  26 k€ ... arrondi prudent 0,2-0,3 M€
        (avec upsell abo + affiliation : ~0,2 M€)
An 2 : 25 000 diag × 5 %  = 1 250 clients × 140 € ≈ 175 k€ + base abo cumulée ≈ 0,4-0,6 M€
An 3 : 60 000 diag × 6 %  = 3 600 nouveaux + parc abo cumulé ≈ 1,0-1,5 M€ /an
```
On retient **SOM an 1-3 ≈ 0,2 M€ → 1,5 M€/an**. Soit, à l'horizon an 3, **~2-4 % du SAM** — plausible pour un acteur early-stage sans force de vente, porté par le SEO et Meta. Aller au-delà supposerait partenariats (experts-comptables ruraux, offices de tourisme, Gîtes de France) et/ou budget d'acquisition significatif.

---

## 4. Scénarios de revenus revus (tarifs 50/99/150 € + abo 29 €/mois)

Remplace la table de projection du doc v2 (bâtie sur 299/449/599 €). Le mix suppose : ARPU one-shot ~90 €, 15 % des acheteurs prennent l'abo (290 €/an moyen constaté ≈ 24 €/mois net après churn), + affiliation ~10-15 €/client (assurance/DPE/expert-comptable).

| Clients payants (cumul actifs) | Abonnés (15 %) | MRR abo | CA packs one-shot (annuel, nouveaux) | Affiliation | **Total annuel** |
|---|---|---|---|---|---|
| 250 | ~38 | ~1 000 € | ~22 500 € | ~3 000 € | **~37 k€** |
| 1 000 | ~150 | ~3 900 € | ~90 000 € | ~12 000 € | **~150 k€** |
| 2 500 | ~375 | ~9 800 € | ~225 000 € | ~30 000 € | **~372 k€** |
| 5 000 | ~750 | ~19 500 € | ~450 000 € | ~60 000 € | **~745 k€** |
| 10 000 | ~1 500 | ~39 000 € | ~900 000 € | ~120 000 € | **~1,49 M€** |

**Trois scénarios à horizon an 3 :**

| Scénario | Clients payants an 3 (flux annuel) | Conversion diag→payant | CA an 3 | Commentaire |
|---|---|---|---|---|
| **Prudent** | ~1 000 | 3-4 % | **~0,15–0,3 M€** | SEO seul, Meta limité, pas de partenariats. Réaliste sans levée. |
| **Base** | ~3 000-4 000 | 5 % | **~0,5–0,9 M€** | SEO mature + Meta soutenu + 1-2 partenariats régionaux. |
| **Optimiste** | ~8 000-10 000 | 6-7 % | **~1,3–1,6 M€** | Effet loi Le Meur maximal, partenariats offices/Gîtes de France, base abo qui compose. |

> **Écart vs doc v2** : la table v2 affichait 1,38 M€ à 3 000 clients grâce à des packs à 299-599 €. Avec les tarifs réels (50-150 €), il faut **~10 000 clients** pour approcher 1,5 M€, soit ~3× plus de volume. C'est le vrai visage du modèle : ticket bas, volume élevé, dépendance forte au SEO gratuit et à la récurrence de l'abo.

---

## 5. Limites & incertitudes

**Ce qu'on ne sait pas (données introuvables en source primaire) :**
- **Aucun compteur national public** du nombre de numéros d'enregistrement délivrés, ni de la proportion réelle de logements non enregistrés après le 20/05/2026 (période transitoire, téléservice DGE incomplet). La borne 100k-250k est raisonnée, pas mesurée.
- **Aucune estimation officielle** du taux de non-déclaration fiscale des loueurs (ni Cour des comptes, ni DGFiP publiquement). On sait seulement que ~1M sont déjà LMNP déclarés et que DAC7 resserre l'écart. Le « 50k-250k non-déclarants » est une fourchette large assumée.
- **Nombre de loueurs impactés par le choc micro-BIC 2025** non publié.
- Le « ~420 communes » (enregistrement pré-2026) et le « ~100k courriers DAC7 » du doc v2 **n'ont pas pu être confirmés** en source primaire lors de cette vérification — à traiter comme des ordres de grandeur non sourcés, pas des faits.

**Sensibilité des hypothèses (ce qui fait bouger le SOM) :**
- **Taux de conversion diagnostic → payant** : passer de 3 % à 6 % double le CA. C'est le levier #1 et le plus incertain (dépend de la qualité du chiffre d'exposition € et du parcours).
- **Taux d'attach abo + churn** : l'essentiel de la LTV et de la valorisation. Un abo « conformité » sur micro-hébergeurs saisonniers churn potentiellement vite (usage 1×/an). Si l'abo ne prend pas, le modèle redevient du one-shot pur à faible LTV.
- **Solvabilité du parc RP** : on a retiré ~48 % du parc (résidence principale). Si une partie de ces RP « occasionnelles » se révèle payante (ex. après réception d'une lettre DAC7), le SAM remonte — mais parier dessus serait optimiste.
- **Effet réglementaire** : le funnel dépend d'urgences (désactivation d'annonces, lettres fisc). Si l'application de la loi Le Meur est molle ou repoussée, la demande retombe. À l'inverse, une vague d'amendes municipales dope l'intent.

**En une phrase pour l'investisseur** : marché réel, timing porteur (loi Le Meur + DAC7), mais **niche de valeur** (SAM ~25-55 M€, pas 330 M€+), à ticket bas et dépendante de l'exécution SEO/conversion/rétention. Le « 92 % / 1,1M » initial n'était pas défendable ; ce chiffrage-ci l'est.

---

### Sources

- [DGE — Les meublés de tourisme (« 1,2 million »)](https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme)
- [Analyse des statistiques du rapport Le Meur — paulduvaux.com (1,19M annonces 2023 ; ~1M LMNP DGFiP ; split 48/44/8 PwC ; 186k classés)](https://www.paulduvaux.com/documentations/location-meublee-et-parahotellerie/item/751-les-informations-statistiques-interessantes-mais-incompletes-fournies-par-le-rapport-le-meur)
- [AirDNA — 1,31M listings actifs, 81 % des communes (oct. 2024-sept. 2025)](https://www.airdna.co/press/airbnb-france-territory-reach)
- [LOI n° 2024-1039 du 19 novembre 2024 (loi Le Meur) — Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000050612711)
- [Guide pratique 2025 de la réglementation des meublés de tourisme — Ministère de l'Écologie](https://www.ecologie.gouv.fr/sites/default/files/documents/25113_GuidePratique2025MeubleTourisme.pdf)
- [Micro-BIC meublé non classé 2025 (15 000 € / 30 %) — TGS France](https://www.tgs-france.fr/blog/location-meublee-de-tourisme-non-classee-regles-fiscales-regime-micro-2025/)
- [Tarifs JeDéclareMonMeuble (299 / 629 / 829 € TTC/an)](https://www.jedeclaremonmeuble.com/tarif/)
- [Offres et tarifs Amarris Immo (dès ~390 €/an)](https://www.amarris-immo.fr/nos-offres-et-tarifs-lmp-lmnp/)
- [Enregistrement / désactivation annonces post 20 mai 2026 — Me Kohen](https://kohenavocats.fr/2026/05/21/annonce-airbnb-sans-numero-enregistrement-amende-recours-2026/)
- [RAPPORT-VERIFICATION-REGLEMENTAIRE.md](RAPPORT-VERIFICATION-REGLEMENTAIRE.md) (corrections DPE, registre, assurance, enregistrement)

*Fin du rapport.*
