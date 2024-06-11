import { beforeEach, expect, test } from 'bun:test';
import { Environment } from '../src/Environment.js';

let env: Environment;

beforeEach(() => {
  env = new Environment();
});

test('defines variables in environment', () => {
  expect(env.define('foo', 1)).toStrictEqual(1);
});

test('provies access to variables in environment', () => {
  env.define('foo', 'bar');

  expect(env.lookup('foo')).toStrictEqual('bar');
});
