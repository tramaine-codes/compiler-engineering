import { beforeEach, expect, test } from 'bun:test';
import { Eva } from '../../src/Eva.js';

let eva: Eva;

beforeEach(() => {
  eva = new Eva();
});

test('add version to global environment', () => {
  expect(
    eva.eval([
      'begin',
      ['var', 'counter', 0],
      ['var', 'result', 0],
      [
        'while',
        ['<', 'counter', 10],
        [
          'begin',
          ['set', 'result', ['+', 'result', 1]],
          ['set', 'counter', ['+', 'counter', 1]],
        ],
      ],
      'result',
    ])
  ).toEqual(10);
});
