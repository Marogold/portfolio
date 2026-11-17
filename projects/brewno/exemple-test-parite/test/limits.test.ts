// LIMITE ASSUMÉE : la parité compare deux copies entre elles. Si les DEUX se trompent de la même
// façon, elle reste verte. Seule une valeur d'ancrage (anchor.test.ts) peut alors réagir.
import { describe, expect, it } from 'vitest';
import { legacyCalcCarbSugar } from '../src/legacy';
import { CASES, type Engine } from './support';

describe('limite de la parité seule', () => {
  it('deux copies identiques et fausses passent la parité, mais pas l’ancrage', () => {
    const copyA: Engine = (v, l, t, s) => legacyCalcCarbSugar(v, l, t, s);
    const copyB: Engine = (v, l, t, s) => legacyCalcCarbSugar(v, l, t, s);

    // Parité entre les deux copies : aucune divergence, tout est « vert »…
    const diverging = CASES.filter(([l, v, t, s]) => copyA(v, l, t, s) !== copyB(v, l, t, s));
    expect(diverging).toEqual([]);

    // … et pourtant le résultat est faux. L'ancrage, lui, le voit.
    expect(copyA(2.4, 20, 20, 'sucrose')).not.toBe(118);
  });
});
