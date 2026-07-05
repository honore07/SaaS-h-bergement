# Rapport de vérification réglementaire — GîteOuvert

*Établi en juillet 2026 à partir de 3 recherches croisées sur sources primaires (Légifrance, decrets 2026-196/197, guide pratique 2025 du ministère de l'Écologie, DGE/entreprises.gouv.fr, impots.gouv.fr, BOFiP, guide DGCL taxe de séjour). Objectif : corriger les inexactitudes du document projet v2 et fiabiliser le moteur de diagnostic.*

> **Avertissement** : ce document synthétise l'état du droit tel que vérifié en juillet 2026, en pleine période transitoire de la loi Le Meur. Il ne constitue pas un conseil juridique. Chaque montant/règle est sourcé dans les transcriptions des agents de recherche.

---

## 0. Les 6 corrections majeures (TL;DR)

| # | Affirmation du doc v2 | Verdict | Réalité vérifiée |
|---|---|---|---|
| 1 | « Declaloc = enregistrement national obligatoire depuis mai 2026 » | **Imprécis** | L'obligation d'enregistrement est **nationale** depuis le 20 mai 2026, mais **Declaloc n'est PAS le téléservice national** : c'est un produit privé (éditeur Nouveaux Territoires) utilisé par ~420 communes abonnées. Le canal varie selon la commune. |
| 2 | « DPE classe G interdit à la location depuis janv. 2025, F en 2028, E en 2034 » | **FAUX pour les meublés de tourisme** | Ce calendrier vise les **baux d'habitation** (résidence principale du locataire). Pour les meublés de tourisme : DPE **A-E** requis pour une **nouvelle autorisation de changement d'usage** depuis nov. 2024, et **A-D pour TOUS d'ici le 1/1/2034** (A-E outre-mer), sauf résidence principale du loueur. |
| 3 | « Amende défaut d'enregistrement 10 000 € » | **Nuance de nature** | Montant correct (10 000 €) mais c'est désormais une **amende administrative prononcée par la commune (maire)**, plus seulement civile. Fausse déclaration : 20 000 €. |
| 4 | « Numéro non affiché : amende 5 000 € (loueur) » | **Obsolète** | Le « 5 000 € » est l'ancien régime. Le défaut d'affichage du loueur relève des obligations du III (→ 10 000 €). La sanction de 12 500 €/annonce vise les **plateformes**. |
| 5 | « Registre du logeur obligatoire même quand Airbnb collecte » | **Nuancé** | Le registre (art. R2333-51 CGCT) ne concerne que la taxe **au réel** collectée par le loueur. Quand la plateforme collecte (obligatoire pour les loueurs non pros), **c'est elle qui déclare**. À ne pas confondre avec la **fiche de police** (voyageurs étrangers). |
| 6 | « Assurance : activité à déclarer à l'assureur (obligation) » | **Nuancé** | Aucune **obligation légale** (sauf RC en copropriété). C'est une **exigence contractuelle** (art. L113-2 code des assurances) fortement recommandée, pas une infraction réglementaire. |

---

## 1. Enregistrement / Declaloc — le point qui a motivé cette vérification

**Ce que le user pressentait est juste, mais l'implication est inverse de ce qu'on croyait :**

- Avant le 20 mai 2026 : l'enregistrement avec numéro n'était obligatoire que dans les communes l'ayant institué par délibération (~420 communes). Ailleurs : simple déclaration en mairie (CERFA), voire rien.
- **Depuis le 20 mai 2026** (loi Le Meur, art. L324-1-1 III réécrit ; décrets 2026-196 et 2026-197 du 19 mars 2026) : la **déclaration soumise à enregistrement est généralisée à TOUTE la France**, résidence principale comme secondaire. L'ancienne « déclaration simple » (ex-II de L324-1-1) est **abrogée**.
- **Mais nous sommes en période transitoire** : le téléservice national (opéré par la DGE, écosystème « API Meublés », `apimeubles.finances.gouv.fr`) n'est pleinement déployé côté loueurs qu'au **2nd semestre 2026**. En attendant, **ce sont les communes qui délivrent les numéros**, via des canaux différents :
  - **Communes abonnées à Declaloc** (~420) → dépôt sur `declaloc.fr` ;
  - **Grandes villes à téléservice propre** (Paris, etc.) → leur portail ;
  - **Autres communes** → **CERFA n°14004*04 en mairie** (consigne officielle service-public R14321).

**Il n'existe PAS de liste officielle machine-readable des communes Declaloc.** Heuristique retenue pour l'app (par ordre de fiabilité) :
1. Interroger la recherche de commune de `declaloc.fr` (code postal → « couverte » / « ne bénéficie pas du service »). Best-effort, endpoint non documenté, à mettre en cache + fallback.
2. Petite table d'exceptions en dur (Paris…).
3. Fallback : « rapprochez-vous de votre mairie » (consigne officielle).

**Conséquence pour le quiz** : on ne demande plus « votre commune impose-t-elle l'enregistrement ? » (réponse = oui partout). On demande « avez-vous votre **numéro d'enregistrement** ? » (terme correct, pas « numéro Declaloc ») et on **adapte le canal de régularisation** affiché selon la commune détectée via l'adresse.

**Format du numéro** : 13 caractères = code INSEE commune (5 chiffres) + identifiant (6 chiffres) + clé de contrôle (2 caractères). Contrôle de cohérence possible : les 5 premiers chiffres = code INSEE de la commune du bien.

**Amendes (art. L324-1-1 V, en vigueur depuis le 20 mai 2026)** :

| Manquement | Montant max | Nature | Prononcée par |
|---|---|---|---|
| Défaut d'enregistrement | **10 000 €** | administrative | la commune (maire) — ou président du TJ |
| Fausse déclaration / faux numéro | **20 000 €** | administrative | la commune |
| Dépassement 120 j (ou 90 si délibération) — résidence principale | **15 000 €** | civile | président du TJ |
| Location de locaux non destinés à l'habitation sans autorisation | **25 000 €** | civile | président du TJ |
| Changement d'usage non autorisé | **100 000 €** | — | (L651-2 CCH) |
| Plateforme : annonce sans numéro | 12 500 €/annonce | civile | président du TJ |
| Plateforme : non-retrait / non-transmission données | 50 000 €/meublé | civile | président du TJ |

---

## 2. Fiscal, SIE, URSSAF, CFE

- **Immatriculation** : déclaration de début d'activité **obligatoire sous 15 jours** au guichet unique INPI (`formalites.entreprises.gouv.fr`), gratuite, → SIRET. Le **SIE compétent est celui du LIEU DU BIEN** (pas du domicile du loueur). Le loueur **choisit** son régime ; le SIE l'enregistre, gère la CFE et la liasse au réel.
- **Micro-BIC (revenus 2025 déclarés 2026)** : non classé **15 000 € / 30 %** ; classé **77 700 € / 50 %** (art. 50-0 CGI modifié par la loi Le Meur art. 7). ⚠️ Les anciens « 77 700 €/50 % non classé » et « 71 % classé » sont **obsolètes**. Seuils **nationaux**, aucune variation régionale. (Revenus 2026 : plafond classé revalorisé à 83 600 €.)
- **Déclaration** : revenus imposables **dès le 1er euro** sur la **2042-C-PRO** (le seuil de 23 000 € n'est QUE social). En micro-BIC on déclare le **brut** (avant commissions plateforme). DAC7 : transmission automatique chaque janvier, **sans seuil de dispense pour la location immobilière**.
- **URSSAF** : affiliation obligatoire au-delà de **23 000 €** de recettes (courte durée). LMP fiscal = 2 conditions **cumulatives** (23 000 € **ET** recettes > autres revenus d'activité du foyer) → on peut être LMNP fiscal **et** cotisant social.
- **CFE** : due par principe. **Exonération (art. 1459-3° CGI) SEULEMENT si le local fait partie de l'habitation personnelle du loueur** — un bien **dédié** à la location touristique est imposable. Exonérations générales cumulables : **année de création** (aucune CFE), **recettes ≤ 5 000 €** (exonération de la cotisation minimum, art. 1647 D → la plupart des petits loueurs ne paient rien). Déclaration initiale **1447-C** avant le 31 décembre de l'année de début.
- **Redressement** : intérêt de retard 0,20 %/mois ; majorations 10 / 40 / 80 %. **La régularisation spontanée réduit réellement** (intérêts −50 %, pas de majoration de 10 %). Activité jamais immatriculée = « activité occulte » : **80 %** + reprise sur **10 ans**.

---

## 3. DPE, registre, assurance, sécurité, copropriété, durée

- **DPE** : voir correction #2. Pour un meublé de tourisme classique en commune sans changement d'usage, **pas d'obligation DPE aujourd'hui** ; échéance **A-D au 1/1/2034**. Sanction (à partir de l'entrée en vigueur) : amende administrative **5 000 €** max + astreinte 100 €/j pour non-transmission. **Ne plus afficher « G interdit depuis 2025 » comme une infraction actuelle.**
- **Registre du logeur** : voir correction #5. Sanctions taxe de séjour (art. L2333-34-1 CGCT) : 150 €/omission (max 12 500 €), défaut d'état 750 à 12 500 €, etc.
- **Fiche de police** (distincte) : obligatoire pour **voyageurs étrangers** (art. R814-1 s. CESEDA), conservation 6 mois.
- **Assurance** : voir correction #6.
- **Sécurité** : DAAF obligatoire (propriétaire) ; ERP 5e cat. **au-delà de 15 personnes** ; piscine enterrée non close → dispositif normalisé (sanction pénale jusqu'à 45 000 €).
- **Copropriété** : informer le **syndic** dès l'obtention du numéro ; interdiction possible à la **double majorité art. 26 (2/3)** dans les copros interdisant l'activité commerciale (sauf résidence principale louée occasionnellement).
- **Durée résidence principale** : **120 jours/an** reste la règle nationale ; **90 jours seulement si la commune a délibéré**.

---

## 4. Impact sur le produit (fait dans la foulée)

1. **Terminologie** : « numéro Declaloc » → « **numéro d'enregistrement** » partout (le numéro n'est pas « Declaloc »).
2. **Wizard** : détection du **canal d'enregistrement** selon la commune (adresse BAN) → guidance Declaloc / mairie / téléservice national ; la question sur le numéro reste posée à tous.
3. **Moteur de scoring** : montants et bases légales corrigés (10 000 € administrative, 20 000 € fausse déclaration ; suppression du 5 000 € affichage) ; **DPE** requalifié (plus d'« interdiction G 2025 » ; échéance 2034 + changement d'usage) ; **assurance** requalifiée en risque contractuel, gravité abaissée ; **registre** nuancé (réel vs plateforme).
4. **Textes du site** (landing, packs, créas) : alignés sur les montants et périmètres corrects.
5. **Document projet v2** : erratum ajouté en tête (`PROJET_GITEOPENFRANCE_v2.md`).

*Fin du rapport.*
