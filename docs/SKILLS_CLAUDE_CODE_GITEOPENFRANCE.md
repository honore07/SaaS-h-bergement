# Skills Claude Code — GîteOuvert
## Sélection optimale pour un SaaS + funnel de conversion

---

## COMMENT INSTALLER UN SKILL

```bash
# Via npx (méthode recommandée)
npx skills add <repo>/<skill-name>

# Exemple
npx skills add supabase/postgres-best-practices
npx skills add rampstackco/claude-skills --skill signup-flow-cro page-cro

# Vérifier les skills installés
npx skills list
```

---

## TIER 1 — ESSENTIELS (installer en premier)

### 1. frontend-design (Anthropic officiel)
**Repo :** `github.com/anthropics/skills/tree/main/skills/frontend-design`
**Installation :** `npx skills add anthropics/frontend-design`
**Pourquoi :** Évite le résultat générique habituel des UI générées par IA.
Injecte des contraintes de design fortes : hiérarchie typographique, layout,
couleurs, motion. Indispensable pour un SaaS qui doit inspirer confiance.
**Utiliser pour :** toutes les pages (landing, diagnostic, dashboard, packs).

---

### 2. stripe-integration
**Repo :** `github.com/wshobson/agents/tree/main/plugins/payment-processing/skills/stripe-integration`
**Installation :** `npx skills add wshobson/stripe-integration`
**Pourquoi :** Stripe a des opinions précises sur les webhooks, la gestion des
abonnements, la vérification de signature et l'idempotence. Ce skill les connaît
et les implémente correctement dès le premier essai.
**Utiliser pour :** paiement one-shot packs (299/449/599 €) + abonnement 29 €/mois.

---

### 3. supabase/postgres-best-practices
**Repo :** `github.com/supabase/postgres-best-practices`
**Installation :** `npx skills add supabase/postgres-best-practices`
**Pourquoi :** Best practices PostgreSQL natives pour Supabase + Prisma.
Indexation, Row Level Security (RLS), gestion des migrations, performance.
**Utiliser pour :** schéma base de données (users, hébergements, diagnostics,
infractions, registres, paiements).

---

### 4. wsimmonds/claude-nextjs-skills
**Repo :** `github.com/wsimmonds/claude-nextjs-skills`
**Installation :** `npx skills add wsimmonds/claude-nextjs-skills`
**Pourquoi :** Skill spécialisé Next.js qui améliore le taux de succès de Claude
sur les patterns App Router (Server Components, Server Actions, metadata SEO,
loading.tsx, error.tsx). Validé sur les evals nextjs.org/evals.
**Utiliser pour :** toute l'architecture Next.js du projet.

---

### 5. n8n-skills
**Repo :** `github.com/n8n-io/n8n-skills` (ou via VoltAgent awesome-agent-skills)
**Installation :** `npx skills add n8n-io/n8n-skills`
**Pourquoi :** Tu as déjà n8n en production. Ce skill aide Claude à concevoir,
valider et déployer des workflows n8n correctement (idempotence, gestion erreurs,
expressions, nœuds). Critique pour les alertes conformité automatiques.
**Utiliser pour :** workflows d'alertes (DPE, Declaloc, seuils micro-BIC),
emails automatiques (Brevo via n8n), webhooks Stripe.

---

## TIER 2 — FUNNEL ET CONVERSION

### 6. rampstackco/claude-skills (collection complète)
**Repo :** `github.com/rampstackco/claude-skills`
**Installation :** `npx skills add rampstackco/claude-skills`
**Pourquoi :** 59 skills couvrant le cycle de vie complet du produit SaaS.
Collection la plus complète disponible pour le funnel de conversion.

**Skills prioritaires pour GîteOuvert :**

| Skill | Usage concret |
|-------|--------------|
| `signup-flow-cro` | Optimiser le flow inscription après le diagnostic gratuit |
| `page-cro` | Optimiser la landing page (taux de clic CTA) |
| `onboarding-cro` | Premier accès dashboard après achat du pack |
| `lead-magnet-design` | Structurer le diagnostic gratuit pour maximiser les emails capturés |
| `calculator-design` | Calculateur taxe de séjour + simulateur fiscal (lead magnets interactifs) |
| `value-triggered-upgrade` | Déclencher l'upgrade vers l'abonnement au bon moment |
| `churn-prevention` | Alertes de renouvellement, emails de valeur avant résiliation |
| `seo-audit` | Audit SEO des pages de régularisation |
| `programmatic-seo` | Pages SEO générées pour chaque commune (taxe de séjour) |
| `email-sequence` | Séquence emails post-diagnostic (nurturing vers achat) |

**Installation sélective :**
```bash
npx skills add rampstackco/claude-skills --skill signup-flow-cro page-cro onboarding-cro lead-magnet-design calculator-design value-triggered-upgrade churn-prevention seo-audit email-sequence
```

---

### 7. coreyhaines31/marketingskills
**Repo :** `github.com/coreyhaines31/marketingskills`
**Installation :** `npx skills add coreyhaines31/marketingskills`
**Pourquoi :** 32 skills de marketing direct (avatar, copywriting, offre, SEO,
objections). Encode la méthodologie d'agences réelles, pas des conseils génériques.
Complémentaire à rampstackco.

**Skills prioritaires :**

| Skill | Usage concret |
|-------|--------------|
| `avatar-extraction` | Définir précisément le profil du gîteur non-conforme |
| `offer-extraction` | Structurer les packs 299/449/599 € en offre irrésistible |
| `schwartz-awareness-mapper` | Niveau de conscience de l'audience (sait-il qu'il est en infraction ?) |
| `objection-crusher` | Objections classiques : "c'est trop cher", "j'ai pas le temps", "je ne suis pas vraiment en infraction" |
| `headline-matrix` | Titres landing page et ads Meta |

---

### 8. webapp-testing (Anthropic officiel)
**Repo :** `github.com/anthropics/skills/tree/main/skills/webapp-testing`
**Installation :** `npx skills add anthropics/webapp-testing`
**Pourquoi :** Skill officiel Anthropic pour tester les apps web locales avec
Playwright. Permet à Claude de naviguer dans l'interface, faire des screenshots,
inspecter les logs console et vérifier le comportement UI.
**Utiliser pour :** tester le flow diagnostic (8 questions → rapport), le flow
paiement Stripe, les pages SEO.

---

## TIER 3 — QUALITÉ ET SÉCURITÉ

### 9. owasp-security
**Repo :** `github.com/BehiSecc/awesome-claude-skills` (skill `owasp-security`)
**Installation :** `npx skills add BehiSecc/awesome-claude-skills --skill owasp-security`
**Pourquoi :** OWASP Top 10 2025 + ASVS 5.0 + patterns sécurisés pour 20+ langages.
Un SaaS qui gère des données fiscales et des informations sur les infractions
des clients a une obligation forte de sécurité.
**Utiliser pour :** avant tout déploiement production — review automatique du code.

---

### 10. systematic-debugging
**Repo :** `github.com/BehiSecc/awesome-claude-skills` (skill `systematic-debugging`)
**Installation :** `npx skills add BehiSecc/awesome-claude-skills --skill systematic-debugging`
**Pourquoi :** Structure la démarche de debug de Claude (remonter jusqu'à la
cause racine avant de proposer des fixes). Évite les corrections superficielles.
**Utiliser pour :** toute session de debug.

---

### 11. hookdeck/webhook-skills
**Repo :** Via VoltAgent awesome-agent-skills
**Installation :** `npx skills add hookdeck/webhook-skills`
**Pourquoi :** Les webhooks Stripe (paiement confirmé, abonnement résilié,
échec de paiement) sont critiques et faciles à rater. Ce skill connaît les
patterns corrects : raw body, ordre middleware, vérification signature, replay
safety, idempotence.
**Utiliser pour :** implémentation des webhooks Stripe.

---

### 12. session-memory (compression de contexte)
**Repo :** Trending repo février 2026 — chercher "claude-session-memory" sur GitHub
**Pourquoi :** Auto-capture ce que Claude fait en session, compresse avec IA,
et réinjecte le contexte dans les sessions futures. Pour un projet long comme
GîteOuvert, ne plus re-expliquer le projet à chaque session fait gagner
énormément de temps.
**Utiliser pour :** toutes les sessions Claude Code.

---

### 13. product-manager-skills
**Repo :** `github.com/BehiSecc/awesome-claude-skills` (skill `product-manager-skills`)
**Installation :** `npx skills add BehiSecc/awesome-claude-skills --skill product-manager-skills`
**Pourquoi :** Agent PM avec 6 domaines de connaissance, 12 templates, 30+
frameworks : discovery, strategy, delivery, SaaS metrics. Utile pour structurer
les prochaines itérations produit après le MVP.
**Utiliser pour :** roadmap post-MVP, définition des prochaines features.

---

## RÉCAPITULATIF D'INSTALLATION

```bash
# === TIER 1 — Essentiels ===
npx skills add anthropics/frontend-design
npx skills add wshobson/stripe-integration
npx skills add supabase/postgres-best-practices
npx skills add wsimmonds/claude-nextjs-skills
npx skills add n8n-io/n8n-skills

# === TIER 2 — Funnel & Conversion ===
npx skills add rampstackco/claude-skills --skill signup-flow-cro page-cro onboarding-cro lead-magnet-design calculator-design value-triggered-upgrade churn-prevention seo-audit email-sequence
npx skills add coreyhaines31/marketingskills --skill avatar-extraction offer-extraction schwartz-awareness-mapper objection-crusher headline-matrix
npx skills add anthropics/webapp-testing

# === TIER 3 — Qualité & Sécurité ===
npx skills add BehiSecc/awesome-claude-skills --skill owasp-security systematic-debugging product-manager-skills
npx skills add hookdeck/webhook-skills
```

---

## ORDRE DE DÉPLOIEMENT RECOMMANDÉ

Pour le MVP de mardi, installe dans cet ordre :

1. `frontend-design` → UI propre dès le début
2. `wsimmonds/claude-nextjs-skills` → architecture Next.js correcte
3. `supabase/postgres-best-practices` → schéma DB solide
4. `webapp-testing` → vérifier le diagnostic en live
5. `systematic-debugging` → quand quelque chose casse

Stripe, n8n et les skills marketing arrivent quand tu branches le paiement
et le funnel d'acquisition (semaines 2-3).

---

## CLAUDE.md — FICHIER À CRÉER À LA RACINE DU PROJET

Crée ce fichier immédiatement dans Claude Code pour que Claude mémorise
le contexte du projet entre les sessions :

```markdown
# GîteOuvert — SaaS de conformité pour micro-hébergeurs

## Stack
- Next.js 15 App Router + TypeScript strict
- PostgreSQL + Prisma + Supabase
- Clerk (auth) + Stripe (paiement) + Brevo (emails)
- Claude API (claude-sonnet-4-6) pour diagnostic + génération docs
- n8n pour automatisation (alertes, webhooks)

## Marché
SaaS français de régularisation réglementaire pour gîtes/hébergements insolites.
~1,1M hébergements en France portent au moins une infraction (Declaloc, fiscal,
registre logeur, DPE). Cible : les hébergeurs existants non conformes, pas les
nouvelles ouvertures.

## MVP actuel
1. Diagnostic de Conformité (8 questions → score + exposition € → CTA packs)
2. Registre du logeur automatisé (art. R2333-51 CGCT)

## Premier GET à implémenter
GET /api/taxe-sejour?commune={code_insee}
→ Appel API DELTA (data.economie.gouv.fr)
→ Retourne taux taxe de séjour par catégorie d'hébergement

## APIs publiques clés
- DELTA DGFiP : https://data.economie.gouv.fr/api/explore/v2.1/
- Base Adresse Nationale : https://api-adresse.data.gouv.fr
- DPE ADEME : https://data.ademe.fr/datasets/dpe-v2-logements-existants

## Décisions techniques actées
- PAS de SSR pour le dashboard (Client Components avec SWR)
- PAS de tRPC pour le MVP (API Routes simples)
- PDF via react-pdf (pas Puppeteer en v0)
- Pas d'auth en v0 (diagnostic public, compte à partir du paiement)

## Conventions de code
- Composants : PascalCase
- Fonctions : camelCase
- Variables env : NEXT_PUBLIC_ pour le client, sans préfixe pour le serveur
- Tous les appels API dans /src/lib/api/
- Tous les types Prisma générés dans /src/types/generated
```

---

*Document créé juillet 2026 — À intégrer dans le projet Claude Code*
