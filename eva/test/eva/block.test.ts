import { beforeEach, expect, test } from 'bun:test';
import { Eva } from '../../src/Eva.js';

let eva: Eva;

beforeEach(() => {
  eva = new Eva();
});

test('accepts blocks', () => {
  expect(
    eva.eval([
      'begin',
      ['var', 'x', 10],
      ['var', 'y', 20],
      ['+', ['*', 'x', 'y'], 30],
    ])
  ).toEqual(230);
});

test('provides blocks with their own environment', () => {
  expect(
    eva.eval(['begin', ['var', 'x', 10], ['begin', ['var', 'x', 20], 'x'], 'x'])
  ).toEqual(10);
});

test('provides blocks with access to its outer environment', () => {
  expect(
    eva.eval([
      'begin',
      ['var', 'x', 10],
      ['var', 'result', ['begin', ['var', 'y', ['+', 'x', 20]], 'y']],
      'result',
    ])
  ).toEqual(30);
});

test('accepts assignments within nested environments', () => {
  expect(
    eva.eval(['begin', ['var', 'x', 10], ['begin', ['set', 'x', 20]], 'x'])
  ).toEqual(20);
});
