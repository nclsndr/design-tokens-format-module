import { describe, it, expect } from 'vitest';

import { matchIsAliasValue } from '../../src/utils/matchIsAliasValue.js';

describe.concurrent('matchIsAliasValue', () => {
  it('should return true if the value is an alias', () => {
    expect(matchIsAliasValue('{foo}')).toBe(true);
  });
  it('should return false if the value is a string with no heading "{" character', () => {
    expect(matchIsAliasValue('foo')).toBe(false);
  });
  it('should return false if the value is a number', () => {
    expect(matchIsAliasValue(1)).toBe(false);
  });
});
