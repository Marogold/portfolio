# Cinq décisions d'architecture

Chaque décision suit la même forme : contexte, décision, ce qu'elle montre, et sa limite assumée.
Elles sont tirées des ADR et des notes d'exploitation du projet, reformulées sans détail interne.

← [Retour au projet](README.md)

---

## 1. Dupliquer des formules, puis les verrouiller par un test de parité

**Contexte.** Les mêmes formules de brassage existent à trois endroits : l'écran, le calcul serveur
et l'outil déterministe de l'assistant. Elles avaient divergé : le sucre d'amorçage affiché à l'écran
et calculé côté serveur était sous-estimé d'un facteur environ 4, alors que l'assistant donnait la
bonne valeur.

**Décision.** Garder une copie côté web et une côté API/assistant, reliées par un test de parité qui
compare les moteurs (ABV, IBU, CO₂ résiduel, sucre d'amorçage) et échoue en CI dès qu'une copie
diverge.

**Options écartées.**
- Un module de calcul partagé : une seule source, mais il aurait élargi un correctif de quelques
  lignes en refonte du moteur.
- Faire appeler l'API pour tout calcul : une seule source, mais on perd la latence faible, le
  hors-ligne et le calcul en direct dans l'éditeur de recette.

**Ce que ça montre.** Arbitrer entre une solution propre et une solution livrable, et le dire.

**Limite assumée.** Toute nouvelle formule commune doit être ajoutée aux deux moteurs et au test.
OG, FG, couleur et volumes ne sont pas couverts par ce test. Si les formules communes se multiplient,
un module partagé sera réévalué dans une refonte dédiée.

---

## 2. Séparer les E2E mockés des E2E réels

**Contexte.** La suite Playwright existante mockait la session d'authentification et toutes les routes
API. Un bug d'algorithme de signature des jetons, qui cassait l'authentification sur toutes les
routes protégées en production, lui était donc structurellement invisible : les mocks empêchent de
tester le vrai flux d'authentification ou le vrai backend.

**Décision.** Deux suites distinctes plutôt qu'une conversion complète.
- La suite existante reste une suite d'intégration front, rapide et large, avec des mocks assumés.
- Une suite réelle, sans mock, volontairement restreinte à trois parcours critiques : authentification
  réelle, création/suppression d'un profil d'équipement (régression directe du bug) et création
  complète d'une recette. Elle s'exécute en CI contre le déploiement qui vient d'être créé, avec un
  vrai login et la vraie base de recette ; chaque test crée ses ressources avec un nom unique et les
  supprime.

**Ce que ça montre.** Ne pas se fier à un vert qui ne teste pas ce qu'on croit.

**Limite assumée.** Le compte de test est partagé entre les exécutions, acceptable pour trois tests
séquentiels. La suite mockée garde un nom trompeur et sa documentation n'a pas encore été mise à jour
pour dire qu'elle ne couvre pas l'authentification et le backend réels.

---

## 3. Déléguer l'authentification à un fournisseur dédié

**Contexte.** L'application gérait elle-même mots de passe, double authentification, vérification
d'e-mail et jetons de session : une double responsabilité de sécurité entre l'application et la base.

**Décision.** Confier toute l'authentification à un fournisseur dédié, avec une synchronisation à sens
unique vers la table applicative, la suppression des colonnes mot de passe et 2FA côté application et
une isolation des données par ligne côté base.

**Ce que ça montre.** Réduire la surface de sécurité qu'on maintient soi-même.

---

## 4. Une seule entité d'assistance, conçue pour le terrain

**Contexte.** L'interface avait deux éléments flottants qui se superposaient : un bouton « Parler » et
une bulle de chat. Pour l'utilisateur, c'étaient deux interlocuteurs pour un seul produit. Le terrain
impose ses contraintes : tablette et télévision, mains gantées ou mouillées, et aucune interaction
tactile sur télévision, seulement une télécommande.

**Décision.** Un seul point d'entrée, dont la voix est une modalité. Activer le bouton déclenche
directement l'écoute, sans geste ambigu comme l'appui long, et le panneau de conversation s'ouvre
tout seul quand la réponse est prête. Par défaut, il n'y a pas d'écoute passive : chaque écoute est
déclenchée explicitement, par respect de la vie privée.

**Ce que ça montre.** Concevoir à partir des contraintes du terrain et de la vie privée, avant la
commodité technique.

**Limite assumée.** Le mode texte pur devient moins direct : il passe par un premier échange vocal ou
par le panneau une fois ouvert.

---

## 5. Des erreurs visibles, jamais de faux zéros

**Contexte.** Le tableau de bord affichait « 0 brassin » ou « Aucun équipement » alors que les données
existaient. La cause : une valeur par défaut de liste vide sur une requête dont l'état d'erreur
n'était jamais lu, de sorte qu'un échec de chargement s'affichait comme s'il s'agissait de la vraie
donnée. Au même moment, une validation d'identifiant trop stricte faisait échouer l'ajustement de
stock pour presque tous les ingrédients.

**Décision.** Lire l'état d'erreur, afficher une bannière explicite et bloquer le rendu de la liste
tant que la requête n'a pas réellement réussi. La validation d'identifiant a été assouplie après
vérification des données de départ.

**Ce que ça montre.** Un échec silencieux est un bug de confiance, pas un détail d'interface.
