import { describe, it, expect } from 'vitest';

import { matchIsTokenTypeName } from '../../src/utils/matchIsTokenTypeName.js';
import { tokenTypeNames } from '../../src';

describe.concurrent('matchIsTokenTypeName', () => {
  it('should return true if the value is a token type name', () => {
    for (const type of tokenTypeNames) {
      expect(matchIsTokenTypeName(type)).toBe(true);
    }
  });
  it('should return false if the value is not a token type name', () => {
    expect(matchIsTokenTypeName('not a token type name')).toBe(false);
  });
});
