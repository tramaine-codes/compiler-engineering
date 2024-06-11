import { beforeEach, expect, test } from 'bun:test';
import { Eva } from '../src/Eva.js';

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

test('accepts variable declarations', () => {
  expect(eva.eval(['var', 'foo', 10])).toStrictEqual(10);
});

test('provides variable values', () => {
  eva.eval(['var', 'foo', 20]);

  expect(eva.eval('foo')).toStrictEqual(20);
});

test('performs calculations on variable expressions', () => {
  eva.eval(['var', 'x', 10]);
  eva.eval(['var', 'y', 20]);

  expect(eva.eval(['+', ['*', 'x', 'y'], 30])).toStrictEqual(230);
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

test('throws a reference error when accessing a variable that is not defined', () => {
  const variableName = 'foo';

  expect(() => eva.eval(variableName)).toThrowError(
    new ReferenceError(`Variable "${variableName}" is not defined.`)
  );
});

test('add null to global environment', () => {
  expect(eva.eval(null)).toEqual(null);
});

test('add true to global environment', () => {
  expect(eva.eval(true)).toEqual(true);
});

test('add false to global environment', () => {
  expect(eva.eval(false)).toEqual(false);
});

test('add version to global environment', () => {
  expect(eva.eval('VERSION')).toEqual('0.1.0');
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
