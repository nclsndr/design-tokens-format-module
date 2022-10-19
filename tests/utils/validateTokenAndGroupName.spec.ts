import { describe, it, expect } from 'vitest';

import { validateTokenAndGroupName } from '../../src/utils/validateTokenAndGroupName.js';

describe('validateTokenAndGroupName', () => {
  it('Should validate a regular string', () => {
    const parsed = validateTokenAndGroupName('someString');
    expect(parsed).toBe('someString');
  });
  it('Should fail validating a string with "."', () => {
    expect(() => {
      validateTokenAndGroupName('some.string');
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
      validateTokenAndGroupName('some{string');
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
      validateTokenAndGroupName('some}string');
    }).toThrowError(`[
  {
    "code": "custom",
    "message": "Token or Group name cannot contain \\".\\", \\"{\\" and \\"}\\"",
    "path": []
  }
]`);
  });
});
