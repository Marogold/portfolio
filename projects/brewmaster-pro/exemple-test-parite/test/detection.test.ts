// LE TEST EST TESTÉ : un contrôle qui ne peut pas échouer ne prouve rien.
// Ici on branche l'ancienne copie fautive (reconstituée dans src/legacy.ts) et on vérifie que la
// comparaison la rejette, avec le symptôme observé en brassant : 29 g au lieu de 118 g.
import { describe, expect, it } from 'vitest';
import { legacyCalcCarbSugar } from '../src/legacy';
import { compare } from './support';

describe("la parité aurait attrapé l'ancien bug", () => {
  it('signale 29 g au lieu de 118 g pour 20 L à 2,4 vol', () => {
    const mismatches = compare(legacyCalcCarbSugar);
    expect(mismatches).toContainEqual({
      input: '20 L, 2.4 vol, 20 °C, sucrose',
      candidate: 29,
      reference: 118,
    });
  });
});
