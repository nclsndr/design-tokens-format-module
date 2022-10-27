import { describe, it, expect } from 'vitest';

import { validateDesignTokenAndGroupName } from '../../src/utils/validateDesignTokenAndGroupName.js';

describe('validateTokenAndGroupName', () => {
  it('Should validate a regular string', () => {
    const parsed = validateDesignTokenAndGroupName('someString');
    expect(parsed).toBe('someString');
  });
  it('Should fail validating a string with "."', () => {
    expect(() => {
      validateDesignTokenAndGroupName('some.string');
    }).toThrowError(`[
  {
    "code": "custom",
    "message": "Token or Group name cannot contain \\".\\", \\"{\\" and \\"}\\"",
    "path": []
  }
]`);
  });
  it('Should fail validating a string with "{"', () => {
    expect(() => {
      validateDesignTokenAndGroupName('some{string');
    }).toThrowError(`[
  {
    "code": "custom",
    "message": "Token or Group name cannot contain \\".\\", \\"{\\" and \\"}\\"",
    "path": []
  }
]`);
  });
  it('Should fail validating a string with "}"', () => {
    expect(() => {
      validateDesignTokenAndGroupName('some}string');
    }).toThrowError(`[
  {
    "code": "custom",
    "message": "Token or Group name cannot contain \\".\\", \\"{\\" and \\"}\\"",
    "path": []
  }
]`);
  });
});
