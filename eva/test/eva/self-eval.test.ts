import { beforeEach, expect, test } from 'bun:test';
import { Eva } from '../../src/Eva.js';

let eva: Eva;

beforeEach(() => {
  eva = new Eva();
});

test('accepts numbers as expressions', () => {
  expect(eva.eval(1)).toStrictEqual(1);
});

test('accepts strings as expressions', () => {
  expect(eva.eval('"hello"')).toStrictEqual('hello');
});

test('access null as an expression', () => {
  expect(eva.eval(null)).toStrictEqual(null);
});

test('access booleans as expressions', () => {
  expect(eva.eval(true)).toStrictEqual(true);
  expect(eva.eval(false)).toStrictEqual(false);
});
