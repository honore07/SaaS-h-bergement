# PROJET : GîteOuvert (nom de travail)
## Document de projet complet v2 — Contexte pour Claude Code
## Pivot : Marché de la régularisation (juillet 2026)

---

> ## ⚠️ ERRATUM RÉGLEMENTAIRE (juillet 2026) — LIRE AVANT LA SUITE
>
> Une vérification sur sources officielles (voir **[docs/RAPPORT-VERIFICATION-REGLEMENTAIRE.md](RAPPORT-VERIFICATION-REGLEMENTAIRE.md)**) a corrigé plusieurs points de ce document. **En cas de contradiction, le rapport de vérification fait foi.**
>
> 1. **Declaloc n'est PAS le téléservice national.** C'est un produit privé utilisé par ~420 communes abonnées. Depuis le 20 mai 2026 l'enregistrement est obligatoire **partout**, mais le **canal** varie : Declaloc (communes abonnées), téléservice propre (Paris…), ou **CERFA 14004*04 en mairie** ailleurs. Le téléservice national DGE (API Meublés) n'est déployé côté loueurs qu'au 2nd semestre 2026. → Parler de « **numéro d'enregistrement** », pas de « numéro Declaloc ».
> 2. **DPE — le calendrier « G interdit 2025 / F 2028 / E 2034 » est FAUX pour les meublés de tourisme** (il vise les baux d'habitation). Règle réelle : DPE **A-E** pour une nouvelle autorisation de changement d'usage (depuis nov. 2024) ; **A-D pour tous les meublés d'ici le 1/1/2034** (A-E outre-mer), sauf résidence principale du loueur. Amende administrative 5 000 € max. → Ne plus présenter le DPE G comme une infraction actuelle.
> 3. **Amendes** : défaut d'enregistrement 10 000 € (**administrative, prononcée par la commune**), fausse déclaration 20 000 €. Le « 5 000 € défaut d'affichage » est l'ancien régime **abrogé** ; la sanction de 12 500 €/annonce vise les **plateformes**.
> 4. **Micro-BIC classé** : abattement **50 %** / 77 700 € (pas 71 %). Revenus imposables **dès le 1er euro** (le seuil 23 000 € n'est que social). **SIE** compétent = **lieu du bien**.
> 5. **CFE** : exonération seulement si le local fait partie de l'**habitation personnelle** du loueur ; un bien dédié est imposable (sauf recettes ≤ 5 000 € ou année de création).
> 6. **Registre du logeur** : concerne la taxe **au réel** collectée par le loueur ; si la plateforme collecte (cas des loueurs non pros), **c'est elle qui déclare**. Distinct de la fiche de police (voyageurs étrangers).
> 7. **Assurance** : pas d'obligation légale (sauf RC copropriété) — **exigence contractuelle** recommandée, pas une infraction.
> 8. **Durée résidence principale** : **120 jours** (règle nationale) ; **90 jours seulement si la commune a délibéré**.
>
> **9. Dimensionnement de marché** : le « ~1,1M sur 1,2M en infraction (92 %) » et la table de projection (section 5, bâtie sur des packs 299/449/599 €) sont **caducs**. Voir **[docs/DIMENSIONNEMENT-MARCHE-REALISTE.md](DIMENSIONNEMENT-MARCHE-REALISTE.md)** : le vrai cœur de cible non conforme ET solvable est de ~150k–400k loueurs (pas 1,1M) ; TAM ≈ 90–180 M€, SAM ≈ 25–55 M€, SOM an 1-3 ≈ 0,2 → 1,5 M€ ; projections recalées sur les tarifs actuels (50/99/150 € + 29 €/mois).
>
> Le contenu ci-dessous est conservé tel quel pour l'historique, mais les sections 3 (réglementaire), 4 (MODULE 0/1), 5 (modèle économique) et 6 doivent être lues à travers ces corrections.

---

## 0. PIVOT STRATÉGIQUE — LIRE EN PREMIER

### Le changement de cap
La v1 ciblait les **nouvelles ouvertures** (35 000/an). La v2 cible en priorité les **hébergeurs existants non conformes** (~1 100 000 sur 1 200 000 au total soit 92 % du marché).

### Pourquoi ce pivot
- Marché de régularisation = 30x plus grand que le marché des nouvelles ouvertures
- Urgences réelles et documentées maintenant (Declaloc depuis le 20 mai 2026, DAC7, micro-BIC effondré)
- Portefeuille client déjà existant → propension à payer bien plus forte
- Douleur ressentie immédiatement → conversion sans effort de conviction

### Ce que ça change dans le message
- AVANT : *"Ouvre ton gîte en règle"* → aspiration
- APRÈS : *"Vérifie ta conformité avant que ça te coûte cher"* → protection

---

## 1. VISION ET POSITIONNEMENT

### Concept
SaaS vertical de mise en conformité réglementaire pour micro-hébergeurs touristiques français déjà en activité (gîtes, chambres d'hôtes, hébergements insolites). Le produit combine un diagnostic d'infraction instantané, des outils de régularisation pas à pas, et un abonnement de conformité continue.

### Inspiration
LegalPlace pour les créations d'entreprises : un achat one-shot (régularisation) + abonnement récurrent (conformité continue + comptabilité). Même logique de funnel, même cible (non-initiés face à une complexité réglementaire anxiogène), même modèle économique bifacial.

### Problème résolu
~1 100 000 meublés de tourisme sur 1 200 000 en France portent au moins une infraction réglementaire :
- 240 000–360 000 sans Declaloc (amende jusqu'à 10 000 €)
- 300 000–420 000 avec non-déclaration fiscale (redressement + majoration 40-80 %)
- 960 000–1 080 000 sans registre du logeur légal
- 200 000–250 000 sans SIRET (cotisations URSSAF dues rétrospectivement)
- 60 000–96 000 avec DPE classe G actif (interdit depuis janvier 2025)

Ces propriétaires ont reçu des lettres du fisc, voient leurs annonces supprimées par Airbnb, et ne savent pas quoi faire. Aucun outil numérique ne les accompagne vers la mise en conformité.

### Ce que l'outil n'est PAS
- Pas un channel manager (Smoobu fait ça)
- Pas une conciergerie (trop humain-heavy, trop urbain)
- Pas un expert-comptable (partenaires référencés, pas substitution)
- Pas un outil de création d'annonces OTA (exclu du scope)
- Pas un outil de gestion opérationnelle des réservations
- Pas un outil avec "garantie de rendement" (CIF/AMF — illégal sans agrément)

### Marché cible
- **Cible primaire** : Micro-hébergeurs existants (1 à 3 unités), en activité, non conformes
- **Volume adressable** : ~1 100 000 hébergements en infraction en France
- **Sous-segment prioritaire** : Hébergeurs ayant reçu une lettre DAC7, dont l'annonce est menacée, ou découvrant le changement micro-BIC 2025
- **Géographie initiale** : Alsace/Grand Est (test terrain), puis France entière via SEO
- **Vans exclus** : réglementation véhiculaire trop différente
- **Nouvelles ouvertures** : segment secondaire — même produit mais message différent

---

## 2. LES 5 DÉCLENCHEURS D'URGENCE (signaux d'acquisition)

Ce sont les événements concrets qui créent de la demande immédiate. Chaque déclencheur correspond à des requêtes Google à fort intent transactionnel.

### Déclencheur 1 — Annonce Airbnb/Booking supprimée
Depuis le 20 mai 2026, les plateformes retirent les annonces sans numéro Declaloc.
Requêtes cibles : *"annonce airbnb supprimée numéro enregistrement"*, *"declaloc urgent comment faire"*, *"mon annonce booking inactive 2026"*

### Déclencheur 2 — Lettre des impôts DAC7
~100 000 courriers envoyés en 2024, ce chiffre double en 2025. La DGFiP croise les déclarations avec les données des plateformes.
Requêtes cibles : *"j'ai reçu lettre impôts location airbnb"*, *"régulariser revenus airbnb"*, *"redressement fiscal location saisonnière"*

### Déclencheur 3 — Choc fiscal micro-BIC 2025
Le plafond est passé de 77 700 € à 15 000 € avec abattement à 30 %. Des milliers d'opérateurs basculent au régime réel sans le savoir.
Requêtes cibles : *"micro-BIC meublé 2025 changement"*, *"abattement airbnb 30% que faire"*, *"loi le meur fiscalité 2025 impact"*

### Déclencheur 4 — DPE classe G illégal
Interdit à la location depuis janvier 2025. Beaucoup ignorent la règle.
Requêtes cibles : *"DPE G location saisonnière interdit 2025"*, *"classe énergie gîte location illégal"*

### Déclencheur 5 — URSSAF revenus > 23 000 €
Bascule automatique vers le régime LMP avec cotisations sociales.
Requêtes cibles : *"URSSAF location airbnb 23000 euros"*, *"LMP LMNP seuil 2026"*

---

## 3. CONTEXTE RÉGLEMENTAIRE (à connaître absolument)

### Loi Le Meur (loi n°2024-1039 du 19 novembre 2024)
Réforme majeure qui crée l'urgence produit :
- Enregistrement obligatoire via **Declaloc** depuis le 20 mai 2026 — tous les hébergeurs, nouveaux ET existants
- Numéro d'enregistrement à 13 chiffres obligatoire sur toutes les annonces
- DPE obligatoire : classe G interdite depuis janvier 2025, F interdite en 2028, E en 2034
- Seuil micro-BIC non classé : 15 000 €/an, abattement 30 % (LFI 2025)
- Seuil micro-BIC classé : 77 700 €/an, abattement 50 %
- Limite location résidence principale : 90 jours/an (certaines communes)
- Amende défaut d'enregistrement : 10 000 € par logement
- Amende fausse déclaration : 20 000 €
- Amendes changement d'usage non autorisé : jusqu'à 100 000 €

### Obligations légales complètes (hébergeur existant)
1. **Declaloc** — enregistrement téléservice national obligatoire depuis mai 2026
2. **Immatriculation INPI/SIRET** si activité habituelle
3. **Statut fiscal** : LMNP micro-BIC ou réel, LMP si seuils dépassés
4. **Déclaration 2042-C-PRO** — BIC sur déclaration annuelle revenus
5. **DAC7** — fourni les infos fiscales aux plateformes (IBAN, situation)
6. **DPE valide** — classe A à E minimum
7. **Assurance RC professionnelle** — déclarée à l'assureur
8. **Taxe de séjour** — collecte + registre + reversement communal
9. **Registre du logeur** — tenu pour chaque séjour (art. R2333-51 CGCT)
10. **CFE** — Cotisation Foncière des Entreprises si SIRET (exonération 1ère année)
11. **Classement Atout France** — optionnel mais fiscalement stratégique (50 % vs 30 %)
12. **Normes sécurité** — détecteurs fumée, extincteurs (<15 pers.) ou ERP 5e cat. (>15 pers.)
13. **Copropriété** — informer le syndic depuis 2025

### Fiscal détaillé
- LMNP micro-BIC non classé : abattement 30 %, plafond 15 000 €/an
- LMNP micro-BIC classé : abattement 50 %, plafond 77 700 €/an
- LMNP régime réel : déduction charges réelles (intérêts emprunt, travaux, assurance, amortissements)
- LMP si revenus >23 000 € ET >50 % des revenus du foyer
- Prélèvements sociaux : 17,2 % (LMNP)
- CFE due dès SIRET actif (exonération si ZRR ou <5 000 € CA)
- DAC7 : plateformes déclarent revenus bruts — ≠ revenus nets versés (erreur classique)
- Erreur fréquente : déclarer le montant net Airbnb au lieu du montant brut + commissions
- Erreur fréquente : inclure la taxe de séjour collectée dans les recettes BIC

### Taxe de séjour
- API DELTA (data.economie.gouv.fr) : taux pour 36 000 communes, REST public, gratuit, mis à jour mi-octobre
- Airbnb/Booking collectent automatiquement dans la majorité des communes
- Pour réservations directes : collecte manuelle, reversement selon calendrier communal
- Registre du logeur obligatoire même quand la plateforme collecte
- Erreur fréquente : ne pas tenir le registre parce qu'Airbnb collecte

---

## 4. ARCHITECTURE PRODUIT

### MODULE 0 — Diagnostic de Conformité Instantané (GRATUIT — feature principale)

C'est le produit phare, pas un simple formulaire d'entrée de funnel.

**8 questions, 3 minutes, score de risque chiffré en euros**

Questions :
1. Avez-vous obtenu votre numéro Declaloc avant le 20 mai 2026 ? (Oui / Non / Je ne sais pas)
2. Ce numéro est-il affiché sur toutes vos annonces ? (Oui / Non)
3. Avez-vous un DPE valide — et quelle est sa classe ? (Oui classe... / Non / Pas sûr)
4. Avez-vous déclaré votre activité à l'INPI (SIRET) ? (Oui / Non / Je ne sais pas)
5. Avez-vous déclaré vos revenus locatifs en BIC sur votre déclaration 2025 ? (Oui / Non / Pas encore)
6. Tenez-vous un registre du logeur pour chaque séjour ? (Oui / Non / C'est quoi ?)
7. Pour vos réservations directes, collectez-vous et reversez-vous la taxe de séjour ? (Oui / Non / Que OTA)
8. Avez-vous informé votre assureur de votre activité ? (Oui / Non)

**Output généré par Claude API :**
- Score de conformité visuel (ex : 3/10)
- Liste des infractions détectées avec amende correspondante
- Exposition financière totale estimée (ex : "Vous êtes exposé à des pénalités pouvant atteindre 32 500 €")
- Priorité des régularisations à effectuer
- CTA : "Régulariser ma situation → Pack Régularisation"

**Note technique :** le chiffre d'exposition en euros est le déclencheur de conversion principal.

---

### MODULE 1 — Pack Régularisation (ONE-SHOT PAYANT)

**Pricing :**
- Pack Essentiel (Declaloc + fiscal + registre logeur) : 299 €
- Pack Complet (essentiel + taxe de séjour + assurance + DPE) : 449 €
- Pack Express (complet + support prioritaire 24h) : 599 € → pour annonces supprimées ou lettres DGFiP

**Urgence 1 — Régularisation Declaloc**
- Guide étape par étape pour s'enregistrer sur Declaloc
- Génération du dossier prérempli à partir des infos du diagnostic
- Stockage du numéro obtenu, alerte si suspension
- Lettre type à la plateforme (Airbnb/Booking) pour réactiver l'annonce

**Urgence 2 — Régularisation fiscale**
- Simulation de l'impact du changement micro-BIC 2025 sur les revenus actuels
- Calcul de l'intérêt du classement (30 % → 50 % d'abattement)
- Guide de correction de la déclaration 2042-C-PRO
- Correction des erreurs DAC7 courantes (brut vs net, taxe de séjour exclue)
- Guide d'accès au classement Atout France pour récupérer 50 % d'abattement
- Lettre de régularisation spontanée aux impôts (réduit les pénalités)

**Urgence 3 — Registre du logeur rétroactif**
- Génération automatique du registre légal rétroactif
- Import CSV Airbnb/Booking pour reconstruction des séjours passés
- Document conforme art. R2333-51 CGCT, exportable PDF pour contrôle communal
- Entrée manuelle si pas de CSV disponible

**Urgence 4 — Taxe de séjour en retard**
- Calcul API DELTA des montants dus par commune et période
- Aide à la déclaration communale de régularisation
- Lettre de régularisation spontanée à la commune

**Urgence 5 — DPE et assurance**
- Guide des actions selon la classe DPE (G = illégal maintenant, F = illégal 2028)
- Annuaire diagnostiqueurs agréés ADEME par département
- Lettre type à l'assureur pour déclaration d'activité

---

### MODULE 2 — Taxe de séjour continue (RÉCURRENT)
- Calculateur automatique via API DELTA (commune → taux → calcul)
- Registre du logeur automatisé (saisie ou import CSV)
- Calendrier de reversement personnalisé par commune
- Alertes changements de taux (mise à jour DELTA mi-octobre)
- Gestion exonérations légales (mineurs, saisonniers)

---

### MODULE 3 — Comptabilité gîte (ABONNEMENT RÉCURRENT 29 €/mois)
- Import CSV Airbnb/Booking → reconstruction revenu brut
- Tracker seuils micro-BIC (alertes progressives à 60 %, 80 %, 95 %)
- Simulateur régime réel vs micro-BIC en temps réel
- Taxe de séjour en comptabilité (compte 4471, non-BIC)
- CFE : estimation + alerte décembre
- Génération pré-remplissage 2042-C-PRO annuel

---

### MODULE 4 — Conformité continue (INCLUS DANS ABONNEMENT)
Alertes invisibles qui créent la rétention :
- DPE : renouvellement, alertes F avant 2028
- Declaloc : suivi statut, alerte suspension
- Classement Atout France : renouvellement tous les 5 ans
- Changements loi Le Meur (toute modification réglementaire)
- Changements taux taxe de séjour communale (DELTA)
- Seuils micro-BIC approchés
- Échéances fiscales : CFE décembre, 2042 mai-juin
- DAC7 : rappel que les plateformes déclarent aux impôts

---

### MODULE 5 — Bibliothèque documents vivants (INCLUS DANS ABONNEMENT)
Mis à jour automatiquement quand la réglementation change :
- Contrat de location saisonnière (conforme loi Le Meur 2024)
- Règlement intérieur personnalisable
- État des lieux entrée/sortie
- Registre du logeur (format légal art. R2333-51)
- Fiche de police
- Lettre réclamation caution
- Note/facture (prestation >25 € TTC)
- Livret d'accueil / guide voyageur

---

## 5. MODÈLE ÉCONOMIQUE

### Pricing
| Produit | Prix | Type |
|---------|------|------|
| Diagnostic de Conformité | Gratuit | Lead magnet |
| Pack Régularisation Essentiel | 299 € | One-shot |
| Pack Régularisation Complet | 449 € | One-shot |
| Pack Régularisation Express | 599 € | One-shot |
| Abonnement Conformité + Compta | 29 €/mois | Récurrent |
| Engagement annuel | 290 €/an | Récurrent (-17 %) |

### Affiliation (revenus complémentaires)
- Assurance : ~40 €/lead qualifié
- DPE : ~20 €/lead qualifié
- Expert-comptable : 20 % sur consultation 90 € = 18 €/mise en relation
- Classement Atout France : guide ou organisme agréé partenaire

### Projection financière
| Clients | MRR abo | CA packs | Total annuel |
|---------|---------|----------|-------------|
| 50 | 1 450 € | 18 700 € | 36 100 € |
| 200 | 5 800 € | 74 800 € | 144 400 € |
| 500 | 14 500 € | 149 500 € | 323 500 € |
| 1 000 | 29 000 € | 224 300 € | 572 300 € |
| 3 000 | 87 000 € | 337 000 € | 1 381 000 € |

---

## 6. ACQUISITION

### SEO (canal principal — coût quasi nul)
Requêtes à fort intent transactionnel, concurrence SEO faible :

Cluster Declaloc :
- "declaloc comment faire 2026"
- "mon annonce airbnb supprimée numéro enregistrement"
- "déclarer meublé tourisme urgent"

Cluster fiscal :
- "lettre impôts revenus airbnb que faire"
- "micro-BIC meublé 2025 changement impact"
- "régulariser revenus location saisonnière"
- "abattement 30% gite 2025"

Cluster conformité :
- "DPE G location saisonnière interdit que faire"
- "registre du logeur obligation gîte"
- "taxe de séjour non déclarée régularisation"
- "URSSAF location airbnb 23000 euros"

### Publicité Meta ciblée
Groupes Facebook : "Propriétaires Airbnb France", "Gîtes et meublés de tourisme", "Location saisonnière France"
Message test A/B :
- *"Depuis le 20 mai 2026, votre annonce Airbnb risque d'être supprimée. Vérifiez votre conformité en 3 minutes."*
- *"Vous risquez jusqu'à 10 000 € d'amende si votre gîte n'est pas enregistré. Diagnostic gratuit →"*

### Partenariats
- Experts-comptables ruraux (commission sur leads qualifiés)
- Offices de tourisme (newsletter co-brandée "mise en conformité 2026")
- Relais Gîtes de France départementaux
- Groupes Facebook d'hébergeurs (partage contenu SEO)

---

## 7. SOURCES DE DONNÉES PUBLIQUES (API GRATUITES)

| Source | Données | URL | Mise à jour |
|--------|----------|-----|------------|
| DELTA DGFiP | Taux taxe de séjour 36 000 communes | https://data.economie.gouv.fr/api/explore/v2.1/ | Annuelle, mi-octobre |
| Base Adresse Nationale | Commune + code INSEE depuis adresse | https://api-adresse.data.gouv.fr | Continue |
| DPE ADEME | Classe DPE par adresse | https://data.ademe.fr/datasets/dpe-v2-logements-existants | Continue |
| SIRENE INSEE | Vérification SIRET | https://api.insee.fr/entreprises/sirene | Continue |

---

## 8. STACK TECHNIQUE

### Frontend
- Next.js 15+ (App Router, SSR pour SEO)
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui (composants)
- React Hook Form + Zod (validation)

### Backend
- Next.js API Routes (démarrage) → Node.js/Express si besoin de scalabilité
- PostgreSQL (base principale)
- Prisma (ORM)

### Auth
- Clerk (inscription, connexion, gestion sessions)

### Paiement
- Stripe (one-shot + abonnements + webhooks)

### Emails / Notifications
- Brevo (ex-Sendinblue — réputation France, interface FR)

### Hébergement
- Vercel (frontend + API)
- Supabase ou Railway (PostgreSQL managé)

### IA
- Claude API (claude-sonnet-4-6) pour :
  - Génération rapport de diagnostic personnalisé
  - Recommandations de régularisation selon profil
  - Génération des documents (contrats, registres)
  - Chatbot support réglementaire (Q&A)

### Automatisation (déjà en place)
- n8n : alertes conformité, notifications, webhooks Stripe, emails automatiques
- Claude API via n8n pour traitements batch

### Génération PDF
- React-PDF ou Puppeteer (registre du logeur, contrats, rapports)

---

## 9. MVP v0 — OBJECTIF MARDI

### Ce qu'on BUILD en premier (priorité absolue)

**Brique 1 — Diagnostic de Conformité** (2-3 jours)
Wizard multi-étapes :
- Étape 1 : infos de base (adresse → commune détectée auto via BAN, type hébergement, revenus)
- Étape 2 : les 8 questions de conformité (réponses booléennes + "je ne sais pas")
- Étape 3 : rapport généré par Claude API avec score, infractions, exposition en € et CTA

Premier GET à implémenter : `GET /api/taxe-sejour?commune=XXXXX` → requête DELTA → retour taux JSON

**Brique 2 — Registre du logeur automatisé** (1-2 jours)
- Formulaire : adresse logement, dates séjour, nb adultes, nb nuits, montant taxe, exonérations
- Génération PDF conforme art. R2333-51 CGCT
- Gratuit jusqu'à 3 séjours → upsell abonnement

### Critère de succès MVP
- Diagnostic produit un rapport personnalisé cohérent avec exposition en €
- Calculateur taxe de séjour fonctionnel avec données DELTA réelles
- Interface propre et professionnelle (pas de template générique)
- Déployable sur URL publique Vercel

### Ce qu'on NE BUILD PAS en v0
- Auth / gestion de compte
- Stripe / paiement
- Modules comptabilité et documents
- Alertes et conformité continue

---

## 10. DÉCISIONS ACTÉES (ne pas remettre en question)

- Marché régularisation = priorité absolue sur les nouvelles ouvertures
- Vans exclus du scope
- Création d'annonces OTA exclue du scope
- Garantie de rendement exclue (risque CIF/AMF)
- Cible : micro-hébergeurs 1-3 unités, pas les conciergeries
- Modèle bifacial : one-shot régularisation + abonnement récurrent
- Source taxe de séjour : API DELTA officielle
- IA : Claude API (claude-sonnet-4-6)
- Automatisation : n8n pour workflows back-office

---

## 11. ARBORESCENCE PRODUIT CIBLE

```
/                              → Landing page + SEO
/diagnostic                    → Module 0 — Audit conformité (gratuit)
/diagnostic/rapport            → Rapport personnalisé + CTA packs
/regulariser                   → Hub packs de régularisation
  /declaloc                    → Guide + dossier Declaloc
  /fiscal                      → Simulateur + guide déclaration
  /registre                    → Registre du logeur rétroactif
  /taxe-sejour                 → Calcul + régularisation commune
  /dpe-assurance               → Actions DPE + lettre assureur
/dashboard                     → Espace client abonné
  /conformite                  → Module 4 alertes calendrier
  /comptabilite                → Module 3 finances + BIC tracker
  /taxe-sejour                 → Registre continu + déclarations
  /documents                   → Module 5 bibliothèque
/blog                          → SEO longue traîne (guides réglementaires)
```

---

## 12. SEO — ARTICLES PRIORITAIRES

Cluster régularisation (conversion immédiate) :
- "Declaloc : comment régulariser si vous n'êtes pas encore enregistré"
- "J'ai reçu une lettre des impôts pour ma location Airbnb : que faire ?"
- "Micro-BIC meublé 2025 : ce qui change et comment vous adapter"
- "Registre du logeur : l'obligation que 90 % des hébergeurs ignorent"
- "DPE classe G gîte : que faire pour continuer à louer légalement"
- "Taxe de séjour non déclarée : comment régulariser sans pénalités"

Cluster informatif (SEO volume + trust) :
- "Calculateur taxe de séjour par commune 2026"
- "LMNP ou LMP pour mon gîte : le comparatif fiscal complet"
- "Contrat de location saisonnière : modèle conforme loi Le Meur"
- "Gîte et classement étoiles Atout France : économisez jusqu'à 3 000 € d'impôts"

---

*Document v2 — Mise à jour juillet 2026 suite au pivot marché régularisation*
*Synthèse de la session de market research, product design et market sizing*
