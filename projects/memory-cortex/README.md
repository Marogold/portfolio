# Memory-Cortex *(en développement)*

Couche de mémoire projet pour le travail assisté par agents.

← [Retour au portfolio](../../README.md)

## Architecture

![Architecture de Memory-Cortex](architecture/ARCH-PUBLIC-004.png)

Une mémoire partagée par plusieurs projets et lisible par n'importe quel agent. Le Markdown versionné
dans Git fait foi ; l'index de rappel en est dérivé. Les agents passent par une façade unique qui
cache les backends, et ne modifient la mémoire qu'en proposant du Markdown relu en diff.
Version vectorielle : [`.svg`](architecture/ARCH-PUBLIC-004.svg).

## État vérifiable aujourd'hui

- Le Markdown versionné fait foi : la mémoire projet vit dans Git et se relit en diff.
- L'index de rappel est **dérivé, jetable et reconstructible** à partir de ce Markdown. Sans
  recherche vectorielle, un rappel lexical fonctionne hors ligne, sans infrastructure.
- Deux portées, globale et par projet, sans copie de l'une vers l'autre ; un fait avéré dans trois
  projets peut être promu vers le global par une PR.
- Les agents **lisent** la mémoire ; ils n'écrivent jamais dans l'index. Ce qu'ils retiennent passe
  par une revue en diff.
- Les contraintes dures l'emportent sur les indices de rappel.

## Direction

Réduire le couplage du contexte projet aux outils et aux agents. Cette direction n'est **pas**
revendiquée comme livrée.

## Voir aussi

- [Comment le produit est construit avec des agents](../brewmaster-pro/architecture/ARCH-PUBLIC-003.png)
