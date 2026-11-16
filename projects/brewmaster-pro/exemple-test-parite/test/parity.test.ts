// PARITÉ : la copie « écran » doit donner exactement les mêmes grammes que la référence.
// Ce test garantit la COHÉRENCE entre deux copies. Il ne garantit pas leur EXACTITUDE :
// voir limits.test.ts, et anchor.test.ts pour ce qui comble ce manque.
import { describe, expect, it } from 'vitest';
import { calcCarbSugar } from '../src/screen';
import { compare } from './support';

describe('parité écran ↔ référence', () => {
  it('aucune divergence sur tous les cas', () => {
    expect(compare(calcCarbSugar)).toEqual([]);
  });
});
