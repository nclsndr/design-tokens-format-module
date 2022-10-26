import { describe, it, expect } from 'vitest';

import { inferJSONValueType } from '../../src/utils/inferJSONValueType.js';

describe('inferJSONValueType', () => {
  it('Should infer a String type', async () => {
    const result = inferJSONValueType('someString');
    const expectedType = 'string';
    expect(result).toBe(expectedType);
  });
  it('Should infer a Number type', async () => {
    const result = inferJSONValueType(123);
    const expectedType = 'number';
    expect(result).toBe(expectedType);
  });
  it('Should infer a Boolean type', async () => {
    const result = inferJSONValueType(true);
    const expectedType = 'boolean';
    expect(result).toBe(expectedType);
  });
  it('Should infer a Null type', async () => {
    const result = inferJSONValueType(null);
    const expectedType = 'null';
    expect(result).toBe(expectedType);
  });
  it('Should infer a Object type', async () => {
    const result = inferJSONValueType({
      some: 'object',
      with: 123,
      values: true,
    });
    const expectedType = 'object';
    expect(result).toEqual(expectedType);
  });
  it('Should infer a Array type', async () => {
    const result = inferJSONValueType(['some', 'array', 1, true]);
    const expectedType = 'array';
    expect(result).toEqual(expectedType);
  });
  it('Should fail inferring "undefined"', async () => {
    expect(() => inferJSONValueType(undefined)).toThrowError(
      'Unexpected type "undefined" of value "undefined"'
    );
  });
  it('Should fail inferring a function signature', async () => {
    expect(() => inferJSONValueType(() => 1)).toThrowError(
      'Unexpected type "function" of value "() => 1"'
    );
  });
});
