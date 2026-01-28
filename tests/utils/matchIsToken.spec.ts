import { describe, it, expect } from 'vitest';

import { matchIsToken } from '../../src/utils/matchIsToken.js';

describe.concurrent('matchIsToken', () => {
  it('should return true if the value is an object with the "$value" property', () => {
    expect(matchIsToken({ $value: 'any' })).toBe(true);
  });
  it('should return true if the value is a reference token with only "$"-prefixed keys', () => {
    expect(matchIsToken({ $ref: '#/base' })).toBe(true);
    expect(matchIsToken({ $ref: '#/base', $description: 'ref token' })).toBe(true);
  });
  it('should return false if the value is a group with "$ref" plus non "$"-prefixed keys', () => {
    expect(matchIsToken({ $ref: '#/base', child: { $value: 1 } })).toBe(false);
  });
  it('should return false if the value is an object without the "$value" property', () => {
    expect(matchIsToken({ foo: 'bar' })).toBe(false);
  });
  it('should return false if the value is a string', () => {
    expect(matchIsToken('a string')).toBe(false);
  });
  it('should return false if the value is an array', () => {
    expect(matchIsToken([])).toBe(false);
  });
});
