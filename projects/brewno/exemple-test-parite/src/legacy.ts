// RECONSTITUTION PÉDAGOGIQUE de l'ancienne copie fautive. Ce n'est pas le code d'origine : c'est une
// version qui reproduit le même défaut et le même ordre de grandeur, pour pouvoir le démontrer.
//
// Défaut : le CO₂ déjà dissous est supposé fixe à ~2,04 volumes (la réalité à 20 °C est ~0,86), et un
// facteur approximatif de 4,0 g/L/volume remplace la stœchiométrie. Résultat pour 20 L à 2,4 volumes :
// (2,4 − 2,04) × 20 × 4,0 ≈ 29 g, au lieu d'environ 118 g.

import type { Sugar } from './reference';

export function legacyCalcCarbSugar(volumes: number, volumeL: number, _tempC: number, _sugar: Sugar = 'sucrose'): number {
  const assumedDissolved = 2.04;
  return Math.round(Math.max(0, volumes - assumedDissolved) * volumeL * 4.0);
}
