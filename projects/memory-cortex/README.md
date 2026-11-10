# Memory-Cortex *(en développement)*

Couche de mémoire projet pour le travail assisté par agents.

← [Retour au portfolio](../../README.md)

## État vérifiable aujourd'hui

- Le Markdown versionné fait foi : la mémoire projet vit dans Git et se relit en diff.
- L'index de rappel est **dérivé, jetable et reconstructible** à partir de ce Markdown.
- Les agents **lisent** la mémoire ; ils n'écrivent jamais dans l'index. Ce qu'ils retiennent passe
  par une revue en diff.
- Les contraintes dures l'emportent sur les indices de rappel.

## Direction

Réduire le couplage du contexte projet aux outils et aux agents. Cette direction n'est **pas**
revendiquée comme livrée.

## Voir aussi

- [Comment le produit est construit avec des agents](../brewmaster-pro/architecture/ARCH-PUBLIC-003.png)
