import { beforeEach, expect, test } from 'bun:test';
import { Eva } from '../../src/Eva.js';

let eva: Eva;

beforeEach(() => {
  eva = new Eva();
});

test('add version to global environment', () => {
  expect(eva.eval('VERSION')).toEqual('0.1.0');
});
