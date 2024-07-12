import { describe, it, expect } from 'vitest';

import { matchIsGroup } from '../../src/utils/matchIsGroup.js';

describe.concurrent('matchIsGroup', () => {
  it('should return true if the value is an object without the "$value" property', () => {
    expect(matchIsGroup({ foo: 'bar' })).toBe(true);
  });
  it('should return false if the value is an object with the "$value" property', () => {
    expect(matchIsGroup({ $value: 'any' })).toBe(false);
  });
  it('should return false if the value is a string', () => {
    expect(matchIsGroup('a string')).toBe(false);
  });
  it('should return false if the value is an array', () => {
    expect(matchIsGroup([])).toBe(false);
  });
});
