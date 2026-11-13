# Pascal Gauthier — Ingénierie Qualité & IA

Je construis des produits où l'IA propose et où l'application décide. Les composants probabilistes
vivent derrière des frontières déterministes, avec des tests, une chaîne de livraison et une
sécurité traités comme des exigences de conception, pas comme une finition.

Ce dépôt est une vue publique choisie de mon travail : architecture, décisions, preuves. Le code
source des projets reste privé.

**GitHub** : [github.com/Marogold](https://github.com/Marogold) · **LinkedIn** : [linkedin.com/in/gauthierpascal](https://www.linkedin.com/in/gauthierpascal/)

---

## Par où commencer (5 minutes)

1. [Le projet en chiffres](#brewmaster-pro--brewno-en-chiffres)
2. [Cinq décisions d'architecture](projects/brewmaster-pro/decisions.md)
3. Les diagrammes : [frontières du système et de l'IA](projects/brewmaster-pro/architecture/ARCH-PUBLIC-001.png),
   [actions IA contrôlées](projects/brewmaster-pro/architecture/ARCH-PUBLIC-002.png),
   [travail assisté par agents](projects/brewmaster-pro/architecture/ARCH-PUBLIC-003.png)

---

## BrewMaster Pro / Brewno

**Le problème.** Un brasseur veut agir sur sa session (ajouter un ingrédient, lancer un minuteur,
consulter son stock) en langage naturel, sans qu'un modèle de langage puisse corrompre ses données.

**L'approche.** Le modèle interprète et propose une intention structurée. L'application la valide,
détermine son niveau de risque (lecture, modification, action sensible) et seuls les services
métier exécutent. Il n'existe aucun chemin entre le modèle et la base de données. Disposer d'une
capacité ne veut pas dire que l'IA doit agir : l'application garde l'autorité de l'exécuter.

**Surfaces.** Application web/PWA, Android et Android TV, testées sur trois profils distincts.

Détail, diagrammes et limites : [page du projet](projects/brewmaster-pro/README.md).

### BrewMaster Pro / Brewno en chiffres

*Relevés dans le dépôt, 2026-11-09.*

| Mesure | Valeur |
|---|---|
| Historique | environ 2 000 commits en 15 semaines (depuis 2026-07-26) |
| Tests | 368 fichiers de tests unitaires et d'intégration, 65 scénarios E2E, environ 4 200 cas (comptage statique) |
| Données | 36 modèles, 64 migrations versionnées |
| Livraison | 22 workflows CI/CD, 88 actions épinglées par empreinte SHA |
| Traçabilité | 366 issues référencées dans l'historique, 8 ADR, 12 décisions et 21 notes d'exploitation versionnées |
| Documentation | 189 pages sous `docs/`, liens vérifiés automatiquement |

### Ce qui est démontré

- **IA encadrée.** Intention structurée, trois niveaux de risque, confirmation explicite pour les
  actions sensibles, aucun accès direct modèle → base.
- **Contexte et retrieval.** PostgreSQL/Supabase avec recherche vectorielle (pgvector) pour le
  contexte applicatif.
- **Qualité à plusieurs niveaux.** Unitaire, intégration, contrat d'API, base de données,
  E2E mockés et E2E réels, tests de propriétés sur les calculs, fuzzing ciblé de l'authentification.
- **Livraison gouvernée.** Environnement de recette, UAT humaine, promotion explicite vers la production.
- **AppSec dans le cycle.** Détection de secrets bloquante en PR (Gitleaks), SAST informatif
  (Semgrep Cloud, PR vers `master`/`staging` et push `master`), surveillance des dépendances
  (Dependabot), permissions CI explicites sur 20 workflows sur 22.

### Décisions d'architecture choisies

Chacune est détaillée (contexte, options écartées, limite assumée) dans
[decisions.md](projects/brewmaster-pro/decisions.md).

1. **Dupliquer des formules, puis les verrouiller par un test de parité** plutôt que d'élargir un
   correctif en refonte.
2. **Séparer les E2E mockés des E2E réels** : un vert qui ne teste pas l'authentification réelle
   avait laissé passer un bug en production.
3. **Déléguer l'authentification** à un fournisseur dédié pour réduire la surface de sécurité
   maintenue soi-même.
4. **Une seule entité d'assistance**, conçue pour des mains gantées et une télécommande, avec une
   écoute toujours déclenchée explicitement.
5. **Des erreurs visibles, jamais de faux zéros** : un échec de chargement n'est pas une liste vide.

---

## Comment je travaille avec des agents

Le développement est assisté par des agents, mais gouverné : un besoin, une boucle de proposition
validée par un humain, des tests et une livraison en environnement de recette, une UAT humaine, puis
la promotion. La mémoire projet est consultée selon le domaine de la tâche. Les agents la lisent et
n'écrivent pas dans l'index : ce qu'ils retiennent passe par une revue en diff.

Détail : [ARCH-PUBLIC-003](projects/brewmaster-pro/architecture/ARCH-PUBLIC-003.png).

## Memory-Cortex *(en développement)*

Couche de mémoire projet pour le travail assisté par agents. Voir la
[page dédiée](projects/memory-cortex/README.md).

---

## Principes d'ingénierie

- **Frontières explicites.** Séparer raisonnement probabiliste, autorité applicative et exécution
  déterministe.
- **Confiance vérifiable.** Une affirmation sans test, contrôle automatisé ou revue n'est pas publiée.
- **Sécurité dans le cycle.** Intégrée au développement et à la CI, pas seulement en aval.
- **Divulgation maîtrisée.** Architecture et décisions oui ; secrets, configurations, prompts et
  mécanismes internes non.
- **Limites dites.** SAST informatif et non bloquant ; Memory-Cortex en développement ; deux
  workflows sans bloc de permissions explicite.

## Stack

| Domaine | Technologies |
|---|---|
| Application | React, Vite, Fastify, Capacitor |
| Données | PostgreSQL, Supabase, pgvector, Prisma |
| IA | Modèle de langage, RAG, actions contrôlées |
| Qualité | Vitest, Playwright, fast-check |
| Sécurité et chaîne logicielle | Gitleaks, Semgrep Cloud, Dependabot, GitHub Actions |
| Livraison | GitHub Actions, Vercel |
