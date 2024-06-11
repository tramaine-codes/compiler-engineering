import { beforeEach, expect, test } from 'bun:test';
import { Eva } from '../../src/Eva.js';

let eva: Eva;

beforeEach(() => {
  eva = new Eva();
});

test('accepts variable declarations', () => {
  expect(eva.eval(['var', 'foo', 10])).toStrictEqual(10);
});

test('provides variable values', () => {
  eva.eval(['var', 'foo', 20]);

  expect(eva.eval('foo')).toStrictEqual(20);
});

test('accepts boolean variable declaration', () => {
  expect(eva.eval(['var', 'foo', true])).toEqual(true);
  expect(eva.eval(['var', 'bar', false])).toEqual(false);
});

test('accepts null variable declaration', () => {
  expect(eva.eval(['var', 'foo', null])).toEqual(null);
});

test('accepts math expressions for variable declaration', () => {
  expect(eva.eval(['var', 'foo', ['-', ['+', 10, 15], 2]])).toEqual(23);
});

test('throws a reference error when accessing a variable that is not defined', () => {
  const variableName = 'foo';

  expect(() => eva.eval(variableName)).toThrowError(
    new ReferenceError(`Variable "${variableName}" is not defined.`)
  );
});
