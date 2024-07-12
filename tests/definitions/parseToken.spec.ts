import { describe, it, expect } from 'vitest';

import { parseToken } from '../../src/definitions/token.js';

describe.concurrent('parseToken', () => {
  it('should parse a number token', () => {
    const result = parseToken(
      {
        $type: 'number',
        $value: 42,
      },
      {
        varName: 'token',
      },
    );

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      $type: 'number',
      $value: 42,
    });
  });
  it('should parse a string token', () => {
    const result = parseToken(
      {
        $type: 'string',
        $value: 'Hello, World!',
      },
      {
        varName: 'token',
      },
    );

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      $type: 'string',
      $value: 'Hello, World!',
    });
  });
  it('should parse an opaque color token', () => {
    const result = parseToken(
      {
        $type: 'color',
        $value: '#ff0000',
      },
      {
        varName: 'token',
      },
    );

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      $type: 'color',
      $value: '#ff0000',
    });
  });
  it('should parse a transparent color token', () => {
    const result = parseToken(
      {
        $type: 'color',
        $value: '#ff0000BB',
      },
      {
        varName: 'token',
      },
    );

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      $type: 'color',
      $value: '#ff0000BB',
    });
  });
  it('should parse a dimension token', () => {
    const result = parseToken(
      {
        $type: 'dimension',
        $value: '16px',
      },
      {
        varName: 'token',
      },
    );

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      $type: 'dimension',
      $value: '16px',
    });
  });
  it('should fail to parse an unknown token type', () => {
    const result = parseToken(
      {
        $type: 'unknown',
        $value: 'unknown',
      },
      {
        varName: 'token',
      },
    );

    expect(result.isError()).toBe(true);
    expect(result.isError() && result.getError()).toHaveLength(1);
    expect(result.isError() && result.getError()[0].message).toBe(
      'token.$type must be a value among: "number", "string", "color", "dimension". Got "unknown".',
    );
  });
  it('should fail when the raw value is invalid', () => {
    const result = parseToken(
      {
        $type: 'number',
        $value: 'not a number',
      },
      {
        varName: 'token',
      },
    );

    expect(result.isError()).toBe(true);
    expect(result.isError() && result.getError()).toHaveLength(1);
    expect(result.isError() && result.getError()[0].message).toBe(
      'token.$value must be a number. Got "string".',
    );
  });
});
