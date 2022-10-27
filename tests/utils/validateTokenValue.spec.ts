import { describe, it, expect, afterEach, vi } from 'vitest';

import { validateDesignTokenValue } from '../../src/utils/validateDesignTokenValue.js';

describe('validateTokenValue', () => {
  it('Should validate a JSON String type', () => {
    const value = 'someString';
    const parsed = validateDesignTokenValue('string', value);
    expect(parsed).toBe(value);
  });
  it('Should validate a JSON Number type', () => {
    const value = 123;
    const parsed = validateDesignTokenValue('number', value);
    expect(parsed).toBe(value);
  });
  it('Should validate a JSON Boolean type', () => {
    const value = true;
    const parsed = validateDesignTokenValue('boolean', value);
    expect(parsed).toBe(value);
  });
  it('Should validate a JSON Null type', () => {
    const value = null;
    const parsed = validateDesignTokenValue('null', value);
    expect(parsed).toBe(value);
  });
  it('Should validate a JSON Object type', () => {
    const value = { some: 'object', with: 123, values: true };
    const parsed = validateDesignTokenValue('object', value);
    expect(parsed).toEqual(value);
  });
  it('Should validate a JSON Array type', () => {
    const value = ['some', 'array', 1, true];
    const parsed = validateDesignTokenValue('array', value);
    expect(parsed).toEqual(value);
  });
  it('Should validate a color type', () => {
    const value = '#123456';
    const parsed = validateDesignTokenValue('color', value);
    expect(parsed).toBe(value);
  });
  it('Should validate a dimension type', () => {
    const value = '4px';
    const parsed = validateDesignTokenValue('dimension', value);
    expect(parsed).toBe(value);
  });
  it('Should validate a fontFamily type', () => {
    const value = 'Arial';
    const parsed = validateDesignTokenValue('fontFamily', value);
    expect(parsed).toBe(value);
  });
  it('Should validate a numerical fontWeight type', () => {
    const value = 400;
    const parsed = validateDesignTokenValue('fontWeight', value);
    expect(parsed).toBe(value);
  });
  it('Should validate a string based fontWeight type', () => {
    const value = 'light';
    const parsed = validateDesignTokenValue('fontWeight', value);
    expect(parsed).toBe(value);
  });
  it('Should validate a duration type', () => {
    const value = '80ms';
    const parsed = validateDesignTokenValue('duration', value);
    expect(parsed).toBe(value);
  });
  it('Should validate a cubicBezier type', () => {
    const value = [0.4, 0, 0.2, 1];
    const parsed = validateDesignTokenValue('cubicBezier', value);
    expect(parsed).toEqual(value);
  });
  it('Should validate a shadow type', () => {
    const value = {
      color: '#000000',
      offsetX: '0px',
      offsetY: '2px',
      blur: '3px',
      spread: '2px',
    };
    const parsed = validateDesignTokenValue('shadow', value);
    expect(parsed).toEqual(value);
  });
  it('Should validate a string based strokeStyle type', () => {
    const value = 'solid';
    const parsed = validateDesignTokenValue('strokeStyle', value);
    expect(parsed).toBe(value);
  });
  it('Should validate an object based strokeStyle type', () => {
    const value = {
      dashArray: ['2px', '4px'],
      lineCap: 'round',
    };
    const parsed = validateDesignTokenValue('strokeStyle', value);
    expect(parsed).toEqual(value);
  });
  it('Should validate a border type', () => {
    const value = {
      color: '#000000',
      width: '2px',
      style: 'solid',
    };
    const parsed = validateDesignTokenValue('border', value);
    expect(parsed).toEqual(value);
  });
  it('Should validate a transition type', () => {
    const value = {
      duration: '200ms',
      delay: '0ms',
      timingFunction: [0.5, 0, 1, 1],
    };
    const parsed = validateDesignTokenValue('transition', value);
    expect(parsed).toEqual(value);
  });
  it('Should validate a gradient type', () => {
    const value = [
      {
        color: '#0000ff',
        position: 0,
      },
      {
        color: '#ff0000',
        position: 1,
      },
    ];
    const parsed = validateDesignTokenValue('gradient', value);
    expect(parsed).toEqual(value);
  });
  it('Should validate a typography type', () => {
    const value = {
      fontFamily: 'Arial',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0px',
    };
    const parsed = validateDesignTokenValue('typography', value);
    expect(parsed).toEqual(value);
  });
});

describe('validateTokenValue with mocks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('Should fail validating an unknown type', async () => {
    const invalidTokenType = 'invalidTokenType';

    vi.mock('../../src/utils/schemas.js', async () => {
      const mod = (await vi.importActual('../../src/utils/schemas.js')) as any;
      return {
        ...mod,
        tokenTypeSchema: {
          parse: (v: any) => v,
        },
      };
    });

    expect(() => {
      validateDesignTokenValue(invalidTokenType as any, 'null');
    }).toThrowError(`No validator found for token type "${invalidTokenType}"`);
  });
});
