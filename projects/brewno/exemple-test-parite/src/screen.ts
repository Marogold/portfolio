// Copie « côté écran » (dans le vrai produit : le moteur du navigateur, qui doit répondre sans réseau
// et en direct pendant l'édition d'une recette). Écrite autrement que la référence, mais censée donner
// les mêmes chiffres. Elle renvoie des grammes entiers, comme l'interface les affiche.

import type { Sugar } from './reference';

const CO2_YIELD_PER_GRAM: Record<Sugar, number> = {
  sucrose: 4 * 44.01 / 342.3,
  dextrose: 2 * 44.01 / 198.17,
};

export function calcCarbSugar(volumes: number, volumeL: number, tempC: number, sugar: Sugar = 'sucrose'): number {
  const tempF = 32 + tempC * 1.8;
  const dissolved = 3.0378 + tempF * (-0.050062 + tempF * 0.00026555);
  const toAdd = Math.max(0, volumes - dissolved);
  return Math.round((toAdd * volumeL * 1.977) / CO2_YIELD_PER_GRAM[sugar]);
}
