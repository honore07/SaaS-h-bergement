# Pack créas Meta Ads — GîteOuvert (v1, juillet 2026)

Méthodologie : skill `leadfactory-creative-static-free-v2` (matrice de variations, formats natifs)
+ `quiz-funnel-expert` (hook orienté score, CTA action). Images générées via GPT Image (ChatGPT).

**Objectif de campagne** : trafic vers https://saa-s-h-bergement.vercel.app/diagnostic (lead = diagnostic complété, email capturé → Brevo).
**Cible** : propriétaires de gîtes, chambres d'hôtes et hébergements insolites en France (1-3 unités), 35-65 ans, intérêts Airbnb Host / location saisonnière / Gîtes de France.
**Audiences de test** : (a) intérêts hôtes, (b) lookalike contacts Brevo dès 500 leads, (c) retargeting visiteurs diagnostic non complété.

---

## Matrice de variations (1 variable par cellule)

| # | Format natif | Angle | Ratio | Fichier |
|---|--------------|-------|-------|---------|
| C1 | Stat / data-viz | Amende 10 000 € (objection prix : le pack coûte 3 % du risque) | 3:4 | creatives/c1-stat-10000.png |
| C2 | iOS Note | « Ce que personne ne dit aux propriétaires de gîtes » (éducation) | 3:4 | creatives/c2-note-registre.png |
| C3 | Listicle | « 5 signaux que votre location n'est pas en règle » (curiosité quantifiée) | 3:4 | creatives/c3-listicle-5-signaux.png |
| C4 | Alerte directe | Annonce supprimée depuis le 20 mai 2026 (urgence Declaloc) | 9:16 | creatives/c4-story-annonce.png |

Variable testée en premier : **l'angle** (même CTA, même destination). Ensuite : format 3:4 vs 9:16 sur l'angle gagnant.

---

## Textes d'accompagnement (primary text)

### C1 — Stat 10 000 €
> 10 000 € par logement : c'est l'amende prévue par la loi Le Meur si votre meublé de tourisme
> n'a pas son numéro d'enregistrement Declaloc. 8 questions, 3 minutes : découvrez votre score
> de conformité et votre exposition réelle en euros. Gratuit, sans compte.
**Titre** : Votre gîte est-il en règle ? · **CTA bouton** : En savoir plus

### C2 — iOS Note (éducation registre)
> La plupart des propriétaires pensent être en règle parce qu'Airbnb collecte la taxe de séjour.
> Pourtant le registre du logeur reste obligatoire (art. R2333-51 CGCT), le DPE classe G est
> interdit à la location depuis 2025, et le numéro d'enregistrement doit figurer sur chaque annonce.
> Vérifiez votre situation en 3 minutes — diagnostic gratuit.
**Titre** : 92 % des meublés ont au moins une infraction · **CTA** : En savoir plus

### C3 — Listicle 5 signaux
> 1. Pas de numéro Declaloc sur votre annonce. 2. Revenus non déclarés en BIC. 3. Pas de registre
> du logeur. 4. DPE expiré ou classe G. 5. Assureur jamais informé. Un seul de ces signaux suffit
> à créer un risque. Faites le point en 3 minutes avec le diagnostic gratuit GîteOuvert.
**Titre** : Combien de signaux vous concernent ? · **CTA** : En savoir plus

### C4 — Story urgence Declaloc
> Depuis le 20 mai 2026, Airbnb et Booking suppriment les annonces sans numéro d'enregistrement.
> Ne découvrez pas le problème le jour où vos réservations s'arrêtent. Diagnostic de conformité
> gratuit : score sur 10 + exposition en euros + plan de régularisation.
**Titre** : Votre annonce risque la suppression · **CTA** : En savoir plus

---

## Règles créas (skill leadfactory)
- Bord à bord, jamais de bandeau blanc ; CTA en MAJUSCULES aligné sous le titre
- Texte lisible en vignette 400 px ; orthographe vérifiée à la main avant mise en ligne
- Palette : crème #FBFBF8, vert sapin #196750, ambre #F59E0B
- 1 variable par cellule de test ; couper une créa < 1 % CTR après 1 000 impressions

## Conformité
- Pas de promesse chiffrée de gain ni de « garantie » ; les montants cités sont les plafonds légaux réels
- Mention implicite service payant : le diagnostic est gratuit, les packs sont payants (cohérent avec la landing)
