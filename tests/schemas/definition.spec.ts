import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';

import {
  allTokenTypesJSONSchema,
  colorJSONSchema,
  colorValuePattern,
  cubicBezierJSONSchema,
  dimensionJSONSchema,
  dimensionValuePattern,
  durationJSONSchema,
  durationValuePattern,
  fontFamilyJSONSchema,
  fontWeightJSONSchema,
  numberJSONSchema,
} from '../../schemas/definition.js';

describe.concurrent('schemas definition', () => {
  describe.concurrent('numberJSONSchema', () => {
    const validateNumber = new Ajv().compile(numberJSONSchema);

    it('should validate a valid integer number object', () => {
      expect(validateNumber({ $type: 'number', $value: 10 })).toBe(true);
    });
    it('should validate a valid float number object', () => {
      expect(validateNumber({ $type: 'number', $value: 10.5 })).toBe(true);
    });
    it('should validate a negative number object', () => {
      expect(validateNumber({ $type: 'number', $value: -10 })).toBe(true);
    });
    it('should validate a number token with a description', () => {
      expect(
        validateNumber({
          $type: 'number',
          $value: 10,
          $description: 'A number',
        }),
      ).toBe(true);
    });
    it('should validate a number token with extensions', () => {
      expect(
        validateNumber({
          $type: 'number',
          $value: 10,
          $extensions: { foo: 'bar' },
        }),
      ).toBe(true);
    });
  });

  describe.concurrent('colorValuePattern', () => {
    it('should match a 6 digits color value', () => {
      const regex = new RegExp(colorValuePattern);

      expect(regex.test('#ff0000')).toBe(true);
    });
    it('should match a 8 digits color value', () => {
      const regex = new RegExp(colorValuePattern);

      expect(regex.test('#ff0000ff')).toBe(true);
    });
  });
  describe.concurrent('colorJSONSchema', () => {
    const ajv = new Ajv();
    const validateColor = ajv.compile(colorJSONSchema);

    it('should validate a valid color object', () => {
      expect(validateColor({ $type: 'color', $value: '#ff0000' })).toBe(true);
      expect(validateColor({ $type: 'color', $value: '#ff0000ff' })).toBe(true);
    });
    it('should validate a color token with a description', () => {
      expect(
        validateColor({
          $type: 'color',
          $value: '#ff0000',
          $description: 'A color',
        }),
      ).toBe(true);
    });
    it('should validate a color token with extensions', () => {
      expect(
        validateColor({
          $type: 'color',
          $value: '#ff0000',
          $extensions: { foo: 'bar' },
        }),
      ).toBe(true);
    });
    it('should fail to validate with a missing $type property', () => {
      expect(validateColor({ $value: '#ff0000' })).toBe(false);
    });
    it('should fail to validate with a missing $value property', () => {
      expect(validateColor({ $type: 'color' })).toBe(false);
    });
    it('should fail to validate with an extra property', () => {
      expect(
        validateColor({ $type: 'color', $value: '#ff0000', extra: true }),
      ).toBe(false);
    });
  });

  describe.concurrent('dimensionValuePattern', () => {
    it('should match a px dimension value', () => {
      const regex = new RegExp(dimensionValuePattern);

      expect(regex.test('10px')).toBe(true);
    });
    it('should match a px dimension float value', () => {
      const regex = new RegExp(dimensionValuePattern);

      expect(regex.test('10.5px')).toBe(true);
    });
    it('should match a rem dimension value', () => {
      const regex = new RegExp(dimensionValuePattern);

      expect(regex.test('10rem')).toBe(true);
    });
  });
  describe.concurrent('dimensionJSONSchema', () => {
    const ajv = new Ajv();
    const validateDimension = ajv.compile(dimensionJSONSchema);

    it('should validate a valid dimension object', () => {
      expect(validateDimension({ $type: 'dimension', $value: '10px' })).toBe(
        true,
      );
      expect(validateDimension({ $type: 'dimension', $value: '10rem' })).toBe(
        true,
      );
    });
    it('should validate a dimension token with a description', () => {
      expect(
        validateDimension({
          $type: 'dimension',
          $value: '10px',
          $description: 'A dimension',
        }),
      ).toBe(true);
    });
    it('should validate a dimension token with extensions', () => {
      expect(
        validateDimension({
          $type: 'dimension',
          $value: '10px',
          $extensions: { foo: 'bar' },
        }),
      ).toBe(true);
    });
    it('should fail to validate with a missing $type property', () => {
      expect(validateDimension({ $value: '10px' })).toBe(false);
    });
    it('should fail to validate with a missing $value property', () => {
      expect(validateDimension({ $type: 'dimension' })).toBe(false);
    });
    it('should fail to validate with an extra property', () => {
      expect(
        validateDimension({ $type: 'dimension', $value: '10px', extra: true }),
      ).toBe(false);
    });
  });

  describe.concurrent('fontFamilyJSONSchema', () => {
    const ajv = new Ajv();
    const validateFontFamily = ajv.compile(fontFamilyJSONSchema);

    it('should validate a valid font family object', () => {
      expect(validateFontFamily({ $type: 'fontFamily', $value: 'Arial' })).toBe(
        true,
      );
      expect(
        validateFontFamily({ $type: 'fontFamily', $value: ['Arial', 'sans'] }),
      ).toBe(true);
    });
    it('should validate a font family token with a description', () => {
      expect(
        validateFontFamily({
          $type: 'fontFamily',
          $value: 'Arial',
          $description: 'A font family',
        }),
      ).toBe(true);
    });
    it('should validate a font family token with extensions', () => {
      expect(
        validateFontFamily({
          $type: 'fontFamily',
          $value: 'Arial',
          $extensions: { foo: 'bar' },
        }),
      ).toBe(true);
    });
    it('should fail to validate with a missing $type property', () => {
      expect(validateFontFamily({ $value: 'Arial' })).toBe(false);
    });
    it('should fail to validate with a missing $value property', () => {
      expect(validateFontFamily({ $type: 'fontFamily' })).toBe(false);
    });
    it('should fail to validate with an extra property', () => {
      expect(
        validateFontFamily({
          $type: 'fontFamily',
          $value: 'Arial',
          extra: true,
        }),
      ).toBe(false);
    });
  });

  describe.concurrent('fontWeightJSONSchema', () => {
    const ajv = new Ajv();
    const validateFontWeight = ajv.compile(fontWeightJSONSchema);

    it('should validate a valid font weight object', () => {
      expect(
        validateFontWeight({ $type: 'fontWeight', $value: 'normal' }),
      ).toBe(true);
      expect(validateFontWeight({ $type: 'fontWeight', $value: 400 })).toBe(
        true,
      );
    });
    it('should validate a font weight token with a description', () => {
      expect(
        validateFontWeight({
          $type: 'fontWeight',
          $value: 'normal',
          $description: 'A font weight',
        }),
      ).toBe(true);
    });
    it('should validate a font weight token with extensions', () => {
      expect(
        validateFontWeight({
          $type: 'fontWeight',
          $value: 'normal',
          $extensions: { foo: 'bar' },
        }),
      ).toBe(true);
    });
    it('should fail to validate with a missing $type property', () => {
      expect(validateFontWeight({ $value: 'normal' })).toBe(false);
    });
    it('should fail to validate with a missing $value property', () => {
      expect(validateFontWeight({ $type: 'fontWeight' })).toBe(false);
    });
    it('should fail to validate with an extra property', () => {
      expect(
        validateFontWeight({
          $type: 'fontWeight',
          $value: 'normal',
          extra: true,
        }),
      ).toBe(false);
    });
  });

  describe.concurrent('durationValuePattern', () => {
    it('should match a valid duration value', () => {
      const regex = new RegExp(durationValuePattern);

      expect(regex.test('10ms')).toBe(true);
      expect(regex.test('10.23ms')).toBe(true);
    });
  });
  describe.concurrent('durationJSONSchema', () => {
    const ajv = new Ajv();
    const validateDuration = ajv.compile(durationJSONSchema);

    it('should validate a valid duration object', () => {
      expect(validateDuration({ $type: 'duration', $value: '10ms' })).toBe(
        true,
      );
    });
    it('should validate a duration token with a description', () => {
      expect(
        validateDuration({
          $type: 'duration',
          $value: '10ms',
          $description: 'A duration',
        }),
      ).toBe(true);
    });
    it('should validate a duration token with extensions', () => {
      expect(
        validateDuration({
          $type: 'duration',
          $value: '10ms',
          $extensions: { foo: 'bar' },
        }),
      ).toBe(true);
    });
    it('should fail to validate with a missing $type property', () => {
      expect(validateDuration({ $value: '10ms' })).toBe(false);
    });
    it('should fail to validate with a missing $value property', () => {
      expect(validateDuration({ $type: 'duration' })).toBe(false);
    });
    it('should fail to validate with an extra property', () => {
      expect(
        validateDuration({ $type: 'duration', $value: '10ms', extra: true }),
      ).toBe(false);
    });
  });

  describe.concurrent('cubicBezierJSONSchema', () => {
    const ajv = new Ajv();

    const validateCubicBezier = ajv.compile(cubicBezierJSONSchema);

    it('should validate a valid cubic bezier object', () => {
      expect(
        validateCubicBezier({
          $type: 'cubicBezier',
          $value: [0, 12, 1, 34],
        }),
      ).toBe(true);
    });
    it('should validate a cubic bezier token with a description', () => {
      expect(
        validateCubicBezier({
          $type: 'cubicBezier',
          $value: [0, 12, 1, 34],
          $description: 'A cubic bezier',
        }),
      ).toBe(true);
    });
    it('should validate a cubic bezier token with extensions', () => {
      expect(
        validateCubicBezier({
          $type: 'cubicBezier',
          $value: [0, 12, 1, 34],
          $extensions: { foo: 'bar' },
        }),
      ).toBe(true);
    });
    it('should fail to validate with a missing $type property', () => {
      expect(
        validateCubicBezier({
          $value: [0, 12, 1, 34],
        }),
      ).toBe(false);
    });
    it('should fail to validate with a missing $value property', () => {
      expect(validateCubicBezier({ $type: 'cubicBezier' })).toBe(false);
    });
    it('should fail to validate with an extra property', () => {
      expect(
        validateCubicBezier({
          $type: 'cubicBezier',
          $value: [0, 12, 1, 34],
          extra: true,
        }),
      ).toBe(false);
    });
  });

  describe.concurrent('allTokenTypesJSONSchema', () => {
    const ajv = new Ajv();
    const validate = ajv.compile(allTokenTypesJSONSchema);
    it('should validate a number token', () => {
      expect(validate({ $type: 'number', $value: 10 })).toBe(true);
    });
    it('should validate a color token', () => {
      expect(validate({ $type: 'color', $value: '#ff0000' })).toBe(true);
    });
    it('should validate a dimension token', () => {
      expect(validate({ $type: 'dimension', $value: '10px' })).toBe(true);
    });
    it('should validate a fontFamily token', () => {
      expect(validate({ $type: 'fontFamily', $value: 'Arial' })).toBe(true);
    });
    it('should validate a fontWeight token', () => {
      expect(validate({ $type: 'fontWeight', $value: 'normal' })).toBe(true);
    });
    it('should validate a duration token', () => {
      expect(validate({ $type: 'duration', $value: '10ms' })).toBe(true);
    });
    it('should validate a cubicBezier token', () => {
      expect(validate({ $type: 'cubicBezier', $value: [0, 12, 1, 34] })).toBe(
        true,
      );
    });
  });
});
