# Exemple exécutable : un test de parité, et pourquoi il ne suffit pas

← [Retour au projet](../README.md) · [Décision n°1](../decisions.md#1-dupliquer-des-formules-puis-les-verrouiller-par-un-test-de-parité)

Le code source de Brewno est privé. Ce mini-projet est une **démonstration autonome** de la
technique de test décrite dans la décision n°1, que vous pouvez lancer vous-même :

```bash
corepack enable   # une seule fois
pnpm install
pnpm test         # 5 tests, moins d'une seconde
```

## L'histoire

Le calcul du sucre d'amorçage (grammes de sucre à ajouter avant la mise en bouteille) existait en trois copies : à l'écran, côté serveur et dans l'assistant. Elles avaient divergé en silence.

En brassant 20 L visés à 2,4 volumes de CO₂ (bière à 20°C), l'assistant m'a donné 118 g, une valeur correcte, alors que l'écran affichait 29 g. Aucun test ne l'avait vu. Un facteur 4 en sous-estimation donne une bière sous-carbonatée ; dans l'autre sens, ce serait un risque pour les bouteilles.

Corriger la formule a pris quelques lignes. Le vrai travail a été de rendre cette classe de bug détectable. [La troisième copie a été supprimée / fusionnée avec …]. Les deux copies restantes sont gardées volontairement (pas de refonte pour un correctif) et reliées par des tests.

## Ce que montrent les quatre fichiers de test

| Fichier | Ce qu'il établit |
|---|---|
| [`parity.test.ts`](test/parity.test.ts) | Les deux copies donnent les **mêmes** grammes sur tous les cas. Garantit la *cohérence*. |
| [`anchor.test.ts`](test/anchor.test.ts) | Deux valeurs connues écrites en dur, vérifiées sur chacune des deux copies : 118 g (20 L, 2,4 vol, 20 °C) et 137 g (25 L, 2,3 vol, 20 °C). Garantit l'exactitude. |
| [`detection.test.ts`](test/detection.test.ts) | **Le test est testé** : l'ancienne copie fautive (29 g) est bien rejetée. Un contrôle qui ne peut pas échouer ne prouve rien. |
| [`limits.test.ts`](test/limits.test.ts) | **Limite assumée** : si les deux copies se trompent pareil, la parité reste verte. Seul l'ancrage réagit. |

Cette dernière ligne est le point central : la parité et l'ancrage vont ensemble, aucun des deux ne
suffit seul.

## Vérifié en cassant volontairement le code

Les moteurs ont été cassés volontairement, un à un, pour confirmer que les tests réagissent comme prévu :

- **Une copie dérive** (constante modifiée) → la parité et l'ancrage échouent.
- **Les deux copies dérivent pareil** → la parité reste verte, l'ancrage échoue.

## Ce qui est réel et ce qui ne l'est pas

- Les formules sont des formules **publiées** (CO₂ dissous selon la température, stœchiométrie de la
  fermentation du sucre). Les constantes sont dérivées des masses molaires, indiquées dans
  [`src/reference.ts`](src/reference.ts).
- [`src/legacy.ts`](src/legacy.ts) est une **reconstitution pédagogique** de l'ancienne copie
  fautive : même défaut, même ordre de grandeur (29 g), mais ce n'est pas le code d'origine.
- Ce n'est pas du code extrait du dépôt privé : rien ici ne révèle de configuration, de secret ni de
  mécanisme interne.
- **Limites** : le test couvre le sucre d'amorçage. L'ABV, les IBU et le CO₂ résiduel sont comparés
  dans le vrai projet, mais pas ici ; OG, FG, couleur et volumes ne sont pas couverts par la parité
  (voir la limite assumée de la décision n°1).

## Comment ce code a été produit

Ce projet est écrit avec l'aide d'un agent, sous ma direction. Je décide de ce qui doit être testé et
je relis le résultat ; l'agent n'a pas d'autorité sur ce qui est jugé correct.
