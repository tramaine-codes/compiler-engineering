import { beforeEach, expect, test } from 'bun:test';
import { Eva } from '../../src/Eva.js';

let eva: Eva;

beforeEach(() => {
  eva = new Eva();
});

test('accepts addition expressions', () => {
  expect(eva.eval(['+', 1, 5])).toStrictEqual(6);
  expect(eva.eval(['+', ['+', 2, 3], 5])).toStrictEqual(10);
});

test('accepts subtraction expressions', () => {
  expect(eva.eval(['-', 5, 1])).toStrictEqual(4);
  expect(eva.eval(['-', ['-', 10, 3], 5])).toStrictEqual(2);
});

test('accepts multiplication expressions', () => {
  expect(eva.eval(['*', 5, 3])).toStrictEqual(15);
  expect(eva.eval(['*', ['*', 10, 3], 5])).toStrictEqual(150);
});

test('accepts division expressions', () => {
  expect(eva.eval(['/', 27, 3])).toStrictEqual(9);
  expect(eva.eval(['/', ['/', 20, 4], 5])).toStrictEqual(1);
});

test('accepts modulo expressions', () => {
  expect(eva.eval(['%', 27, 4])).toStrictEqual(3);
  expect(eva.eval(['%', 27, 3])).toStrictEqual(0);
});

test('accepts combinations of math expressions', () => {
  expect(eva.eval(['*', ['/', ['+', 20, 4], 5], 10])).toStrictEqual(48);
});

test('performs calculations on variable expressions', () => {
  eva.eval(['var', 'x', 10]);
  eva.eval(['var', 'y', 20]);

  expect(eva.eval(['+', ['*', 'x', 'y'], 30])).toStrictEqual(230);
});
