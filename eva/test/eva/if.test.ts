import { beforeEach, expect, test } from 'bun:test';
import { Eva } from '../../src/Eva.js';

let eva: Eva;

beforeEach(() => {
  eva = new Eva();
});

test('accepts if expressions', () => {
  expect(
    eva.eval([
      'begin',
      ['var', 'x', 10],
      ['var', 'y', 0],
      ['if', ['>', 'x', 10], ['set', 'y', 20], ['set', 'y', 30]],
      'y',
    ])
  ).toEqual(30);
});
