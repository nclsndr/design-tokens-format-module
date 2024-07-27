import { describe, it, expect } from 'vitest';

import { parseRawToken } from '../../src/definitions/token.js';
import { JSONPath } from '../../src/definitions/JSONPath';

describe.concurrent('parseRawToken', () => {
  it('should parse the  description and extensions of a token', () => {
    const result = parseRawToken(
      {
        $type: 'number',
        $value: 42,
        $description: 'A number token',
        $extensions: { 'com.nclsndr.usage': 'const' },
      },
      {
        varName: 'aToken',
        path: JSONPath.fromJSONValuePath(['aToken']),
        resolvedType: 'number',
      },
    );

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      path: expect.any(Object),
      resolvedType: 'number',
      type: 'number',
      value: { raw: 42, toReferences: [] },
      description: 'A number token',
      extensions: { 'com.nclsndr.usage': 'const' },
    });
  });
  it('should parse a number token', () => {
    const result = parseRawToken(
      {
        $type: 'number',
        $value: 42,
      },
      {
        varName: 'aToken',
        path: JSONPath.fromJSONValuePath(['aToken']),
        resolvedType: 'number',
      },
    );

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      path: expect.any(Object),
      resolvedType: 'number',
      type: 'number',
      value: { raw: 42, toReferences: [] },
      description: undefined,
      extensions: undefined,
    });
  });
  it('should parse a string token', () => {
    const result = parseRawToken(
      {
        $type: 'string',
        $value: 'Hello, World!',
      },
      {
        varName: 'aToken',
        path: JSONPath.fromJSONValuePath(['aToken']),
        resolvedType: 'string',
      },
    );

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      path: expect.any(Object),
      resolvedType: 'string',
      type: 'string',
      value: { raw: 'Hello, World!', toReferences: [] },
      description: undefined,
      extensions: undefined,
    });
  });
  it('should parse an opaque color token', () => {
    const result = parseRawToken(
      {
        $type: 'color',
        $value: '#ff0000',
      },
      {
        varName: 'aToken',
        path: JSONPath.fromJSONValuePath(['aToken']),
        resolvedType: 'color',
      },
    );

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      path: expect.any(Object),
      resolvedType: 'color',
      type: 'color',
      value: { raw: '#ff0000', toReferences: [] },
      description: undefined,
      extensions: undefined,
    });
  });
  it('should parse a transparent color token', () => {
    const result = parseRawToken(
      {
        $type: 'color',
        $value: '#ff0000BB',
      },
      {
        varName: 'aToken',
        path: JSONPath.fromJSONValuePath(['aToken']),
        resolvedType: 'color',
      },
    );

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      path: expect.any(Object),
      resolvedType: 'color',
      type: 'color',
      value: { raw: '#ff0000BB', toReferences: [] },
      description: undefined,
      extensions: undefined,
    });
  });
  it('should parse a dimension token', () => {
    const result = parseRawToken(
      {
        $type: 'dimension',
        $value: '16px',
      },
      {
        varName: 'aToken',
        path: JSONPath.fromJSONValuePath(['aToken']),
        resolvedType: 'dimension',
      },
    );

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      path: expect.any(Object),
      resolvedType: 'dimension',
      type: 'dimension',
      value: { raw: '16px', toReferences: [] },
      description: undefined,
      extensions: undefined,
    });
  });
  it('should fail to parse an invalid token value', () => {
    const result = parseRawToken(
      {
        $type: 'number',
        // invalid values
        $value: 'not a number',
        $description: true,
        $extensions: 'invalid extensions',
      },
      {
        varName: 'aToken',
        path: JSONPath.fromJSONValuePath(['aToken']),
        resolvedType: 'number' as any,
      },
    );

    expect(result.isError()).toBe(true);
    expect(result.isError() && result.getError()).toHaveLength(3);
  });
  it('should fail when the raw value is invalid', () => {
    const result = parseRawToken(
      {
        $type: 'number',
        $value: 'not a number',
      },
      {
        varName: 'aToken',
        path: JSONPath.fromJSONValuePath(['aToken']),
        resolvedType: 'number',
      },
    );

    expect(result.isError()).toBe(true);
    expect(result.isError() && result.getError()).toHaveLength(1);
    expect(result.isError() && result.getError()[0].message).toBe(
      'aToken.$value must be a number. Got "string".',
    );
  });
});
