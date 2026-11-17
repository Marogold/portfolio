import { primingSugarGrams, type Sugar } from '../src/reference';

/** Une copie du calcul, vue de l'extérieur : mêmes entrées, grammes entiers en sortie. */
export type Engine = (volumes: number, volumeL: number, tempC: number, sugar: Sugar) => number;

export const CASES: ReadonlyArray<readonly [volumeL: number, volumes: number, tempC: number, sugar: Sugar]> = [
  [20, 2.4, 20, 'sucrose'],
  [20, 2.4, 20, 'dextrose'],
  [23, 2.8, 18, 'sucrose'],
  [10, 1.8, 25, 'dextrose'],
  [20, 0.5, 20, 'sucrose'], // cas limite : cible sous le CO₂ déjà dissous → 0 g, jamais négatif
];

/** La référence, arrondie comme l'écran. */
export const reference: Engine = (volumes, volumeL, tempC, sugar) =>
  Math.round(primingSugarGrams(volumeL, volumes, tempC, sugar));

export interface Mismatch {
  input: string;
  candidate: number;
  reference: number;
}

/** Liste les cas où `candidate` s'écarte de la référence. Liste vide = parité. */
export function compare(candidate: Engine): Mismatch[] {
  return CASES.flatMap(([volumeL, volumes, tempC, sugar]) => {
    const c = candidate(volumes, volumeL, tempC, sugar);
    const r = reference(volumes, volumeL, tempC, sugar);
    return c === r ? [] : [{ input: `${volumeL} L, ${volumes} vol, ${tempC} °C, ${sugar}`, candidate: c, reference: r }];
  });
}
