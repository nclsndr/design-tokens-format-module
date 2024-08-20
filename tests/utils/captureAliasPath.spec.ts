import { describe, it, expect } from 'vitest';

import { captureAliasPath } from '../../src/utils/captureAliasPath.js';

describe('captureAliasPath', () => {
  it('should return the alias path as a string when asString option is true', () => {
    expect(captureAliasPath('{alias.path}', true)).toStrictEqual({
      status: 'ok',
      value: 'alias.path',
    });
  });
  it('should return the alias path as an array when asString option is false', () => {
    expect(captureAliasPath('{alias.path}', false)).toStrictEqual({
      status: 'ok',
      value: ['alias', 'path'],
    });
  });
  it('should return the alias path as an array when no option is provided', () => {
    expect(captureAliasPath('{alias.path}')).toStrictEqual({
      status: 'ok',
      value: ['alias', 'path'],
    });
  });
  it('should return an error when the value is not a string', () => {
    expect(captureAliasPath(123)).toStrictEqual({
      status: 'error',
      error: {
        tag: 'TYPE_ERROR',
        message: 'Expected a string value. Got number.',
      },
    });
  });
  it('should return an error when the value is not an alias', () => {
    expect(captureAliasPath('alias.path')).toStrictEqual({
      status: 'error',
      error: {
        tag: 'FORMAT_ERROR',
        message:
          'Expected a string value enclosed in curly braces, using dot notation: {path.to.token}. Got "alias.path".',
      },
    });
  });
});
