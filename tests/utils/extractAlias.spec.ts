import { describe, it, expect } from 'vitest';

import {
  extractAliasPathAsArray,
  extractAliasPathAsString,
} from '../../src/utils/extractAliasPath.js';

describe('extractAlias', () => {
  describe('extractAliasPathAsString', () => {
    it('should return the alias path as a string', () => {
      expect(extractAliasPathAsString('{alias.path}')).toBe('alias.path');
    });
  });
  describe('extractAliasPathAsArray', () => {
    it('should return the alias path as an array', () => {
      expect(extractAliasPathAsArray('{alias.path}')).toEqual([
        'alias',
        'path',
      ]);
    });
  });
});
