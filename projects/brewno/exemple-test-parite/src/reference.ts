// Moteur de référence (côté serveur dans le vrai produit) : calcule le sucre d'amorçage en grammes.
//
// Principe : on veut atteindre `targetVolumes` de CO₂ dans la bouteille. Le moût en contient déjà une
// partie en solution (selon la température de fermentation) ; il faut apporter la différence, en
// sucre que les levures transforment en CO₂.

export type Sugar = 'sucrose' | 'dextrose';

const MOLAR_CO2 = 44.01; // g/mol
const MOLAR_SUCROSE = 342.3; // C12H22O11 + H2O → 4 C2H5OH + 4 CO2
const MOLAR_DEXTROSE_MONOHYDRATE = 198.17; // C6H12O6·H2O → 2 C2H5OH + 2 CO2

/** Masse de CO₂ (g) contenue dans 1 L de bière pour 1 « volume » de CO₂ (masse volumique à 0 °C, 1 atm). */
const CO2_G_PER_L_PER_VOLUME = 1.977;

/** Grammes de CO₂ produits par gramme de sucre fermenté (stœchiométrie). */
const SUGAR_CO2_YIELD: Record<Sugar, number> = {
  sucrose: (4 * MOLAR_CO2) / MOLAR_SUCROSE,
  dextrose: (2 * MOLAR_CO2) / MOLAR_DEXTROSE_MONOHYDRATE,
};

/** CO₂ déjà dissous (en volumes) à la température de fermentation. Formule publiée (Palmer), en °F. */
export function residualCo2Volumes(temperatureC: number): number {
  const f = (temperatureC * 9) / 5 + 32;
  return 3.0378 - 0.050062 * f + 0.00026555 * f ** 2;
}

export function primingSugarGrams(volumeL: number, targetVolumes: number, temperatureC: number, sugar: Sugar): number {
  const missingVolumes = Math.max(0, targetVolumes - residualCo2Volumes(temperatureC));
  return (missingVolumes * volumeL * CO2_G_PER_L_PER_VOLUME) / SUGAR_CO2_YIELD[sugar];
}
