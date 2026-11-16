// ANCRAGE : des valeurs connues, écrites en dur, qui ne dépendent d'aucune copie du code.
// Pour 20 L à 2,4 volumes et 20 °C, un brasseur attend environ 118 g de sucre de table
// (ou 137 g de dextrose monohydraté). C'est ce chiffre qui aurait signalé l'erreur.
import { describe, expect, it } from 'vitest';
import { calcCarbSugar } from '../src/screen';
import { reference } from './support';

describe('ancrage : valeurs attendues connues', () => {
  it('20 L, 2,4 vol, 20 °C, sucre de table → 118 g', () => {
    expect(reference(2.4, 20, 20, 'sucrose')).toBe(118);
    expect(calcCarbSugar(2.4, 20, 20, 'sucrose')).toBe(118);
  });

  it('20 L, 2,4 vol, 20 °C, dextrose monohydraté → 137 g', () => {
    expect(reference(2.4, 20, 20, 'dextrose')).toBe(137);
    expect(calcCarbSugar(2.4, 20, 20, 'dextrose')).toBe(137);
  });
});
