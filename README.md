# GîteOuvert (Hémergeurs)

SaaS français de mise en conformité réglementaire pour micro-hébergeurs touristiques (gîtes, chambres d'hôtes, hébergements insolites) déjà en activité.

**Le problème** : ~1 100 000 meublés de tourisme sur 1 200 000 en France portent au moins une infraction (Declaloc, déclaration fiscale, registre du logeur, taxe de séjour, DPE). Depuis la loi Le Meur et l'obligation Declaloc du 20 mai 2026, les annonces non conformes sont supprimées des plateformes et les amendes atteignent 10 000 € par logement.

**Le produit** : diagnostic d'infraction instantané gratuit → packs de régularisation one-shot (299/449/599 €) → abonnement de conformité continue (29 €/mois).

## MVP v0 (ce repo)

- `/` — Landing page orientée protection + SEO
- `/diagnostic` — Diagnostic de Conformité : 8 questions, score /10, exposition financière en €, rapport généré par Claude API (fallback moteur déterministe)
- `/diagnostic/rapport` — Rapport personnalisé + CTA packs
- `/regulariser` — Hub des packs de régularisation
- `/taxe-sejour` — Calculateur de taxe de séjour par commune (open data DELTA DGFiP)
- `/registre` — Registre du logeur (art. R2333-51 CGCT) avec export PDF, gratuit jusqu'à 3 séjours

Volontairement hors scope v0 : auth, paiement Stripe, comptabilité, alertes continues (voir `docs/PROJET_GITEOPENFRANCE_v2.md`).

## Stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · Claude API (`claude-sonnet-4-6`) · @react-pdf/renderer · APIs publiques : BAN, DELTA DGFiP.

## Démarrer

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY optionnelle (fallback sans IA)
npm run dev
```

## Documents

- [docs/PROJET_GITEOPENFRANCE_v2.md](docs/PROJET_GITEOPENFRANCE_v2.md) — document projet complet (marché, réglementation, modèle économique, roadmap)
- [docs/SKILLS_CLAUDE_CODE_GITEOPENFRANCE.md](docs/SKILLS_CLAUDE_CODE_GITEOPENFRANCE.md) — skills Claude Code utilisés (installés dans `.agents/skills/`)

## Avertissement

Les informations produites par l'outil ont un caractère général et ne constituent ni un conseil juridique ni un conseil fiscal personnalisé.
