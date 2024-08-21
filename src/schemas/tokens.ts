import { makeTokenJSONSchema } from './internals/makeTokenJSONSchema.js';
import { makeTokenValueJSONSchema } from './internals/makeTokenValueJSONSchema.js';
import { withBaseURI } from './internals/withBaseURI.js';
import {
  borderTypeName,
  colorTypeName,
  cubicBezierTypeName,
  dimensionTypeName,
  durationTypeName,
  fontFamilyTypeName,
  fontWeightTypeName,
  fontWeightValues,
  gradientTypeName,
  numberTypeName,
  shadowTypeName,
  strokeStyleLineCapValues,
  strokeStyleStringValues,
  strokeStyleTypeName,
  transitionTypeName,
  typographyTypeName,
} from '../definitions/tokenTypes.js';

// 8.1 Color
export const colorValuePattern = '^#[0-9a-fA-F]{6,8}$';
export const colorValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: colorTypeName,
  description: 'The hexadecimal representation of a color.',
  rawValueSchema: {
    type: 'string',
    pattern: colorValuePattern,
  },
});
export const colorJSONSchema = makeTokenJSONSchema({
  tokenType: colorTypeName,
  description: 'The color token.',
});

// 8.2 Dimension
export const dimensionValuePattern = '^(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:px|rem)$';
export const dimensionValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: dimensionTypeName,
  description: 'The dimension of a property.',
  rawValueSchema: {
    type: 'string',
    pattern: dimensionValuePattern,
  },
});
export const dimensionJSONSchema = makeTokenJSONSchema({
  tokenType: dimensionTypeName,
  description: 'The dimension token.',
});

// 8.3 Font Family
export const fontFamilyValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: fontFamilyTypeName,
  description: 'The font family of a property.',
  rawValueSchema: {
    oneOf: [
      {
        type: 'string',
      },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  },
});
export const fontFamilyJSONSchema = makeTokenJSONSchema({
  tokenType: fontFamilyTypeName,
  description: 'The font family token.',
});

// 8.4 Font Weight
export const fontWeightValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: fontWeightTypeName,
  description: 'The font weight of a property.',
  rawValueSchema: {
    oneOf: [
      {
        type: 'string',
        enum: fontWeightValues,
      },
      {
        type: 'number',
      },
    ],
  },
});
export const fontWeightJSONSchema = makeTokenJSONSchema({
  tokenType: fontWeightTypeName,
  description: 'The font weight token.',
});

// 8.5 Duration
export const durationValuePattern = '^(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:ms|s)$';
export const durationValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: durationTypeName,
  description: 'The duration of a property.',
  rawValueSchema: {
    type: 'string',
    pattern: durationValuePattern,
  },
});
export const durationJSONSchema = makeTokenJSONSchema({
  tokenType: durationTypeName,
  description: 'The duration token.',
});

// 8.6 Cubic Bezier
export const cubicBezierValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: cubicBezierTypeName,
  description: 'The cubic bezier of a property.',
  rawValueSchema: {
    type: 'array',
    items: {
      // TODO @Nico: missing 0-1 boundaries - how to tuple?
      type: 'number',
    },
    minItems: 4,
    maxItems: 4,
  },
});
export const cubicBezierJSONSchema = makeTokenJSONSchema({
  tokenType: cubicBezierTypeName,
  description: 'The cubic bezier token.',
});

// 8.7 Number
export const numberValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: numberTypeName,
  description: 'The number of a property.',
  rawValueSchema: {
    type: 'number',
  },
});
export const numberJSONSchema = makeTokenJSONSchema({
  tokenType: numberTypeName,
  description: 'The number token.',
});

// 9.2 Stroke Style
export const strokeStyleValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: strokeStyleTypeName,
  description: 'The stroke style of a property.',
  rawValueSchema: {
    oneOf: [
      {
        type: 'string',
        enum: strokeStyleStringValues,
      },
      {
        type: 'object',
        properties: {
          dashArray: {
            type: 'array',
            items: {
              $ref: withBaseURI('/tokens/dimension/value'),
            },
          },
          lineCap: {
            type: 'string',
            enum: strokeStyleLineCapValues,
          },
        },
        required: ['dashArray', 'lineCap'],
      },
    ],
  },
});
export const strokeStyleJSONSchema = makeTokenJSONSchema({
  tokenType: strokeStyleTypeName,
  description: 'The stroke style token.',
});

// 9.3 Border
export const borderValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: borderTypeName,
  description: 'The border of a property.',
  rawValueSchema: {
    type: 'object',
    properties: {
      color: {
        $ref: withBaseURI('/tokens/color/value'),
      },
      width: {
        $ref: withBaseURI('/tokens/dimension/value'),
      },
      style: {
        $ref: withBaseURI('/tokens/strokeStyle/value'),
      },
    },
    required: ['color', 'width', 'style'],
  },
});
export const borderJSONSchema = makeTokenJSONSchema({
  tokenType: borderTypeName,
  description: 'The border token.',
});

// 9.4 Transition
export const transitionValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: transitionTypeName,
  description: 'The transition of a property.',
  rawValueSchema: {
    type: 'object',
    properties: {
      duration: {
        $ref: withBaseURI('/tokens/duration/value'),
      },
      delay: {
        $ref: withBaseURI('/tokens/duration/value'),
      },
      timingFunction: {
        $ref: withBaseURI('/tokens/cubicBezier/value'),
      },
    },
    required: ['duration', 'delay', 'timingFunction'],
  },
});
export const transitionJSONSchema = makeTokenJSONSchema({
  tokenType: transitionTypeName,
  description: 'The transition token.',
});

// 9.5 Shadow
export const shadowValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: shadowTypeName,
  description: 'The shadow of a property.',
  rawValueSchema: {
    type: 'object',
    properties: {
      color: {
        $ref: withBaseURI('/tokens/color/value'),
      },
      offsetX: {
        $ref: withBaseURI('/tokens/dimension/value'),
      },
      offsetY: {
        $ref: withBaseURI('/tokens/dimension/value'),
      },
      blur: {
        $ref: withBaseURI('/tokens/dimension/value'),
      },
      spread: {
        $ref: withBaseURI('/tokens/dimension/value'),
      },
    },
    required: ['color', 'offsetX', 'offsetY', 'blur', 'spread'],
  },
});
export const shadowJSONSchema = makeTokenJSONSchema({
  tokenType: shadowTypeName,
  description: 'The shadow token.',
});

// 9.6 Gradient
export const gradientValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: gradientTypeName,
  description: 'The gradient of a property.',
  rawValueSchema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        color: {
          $ref: withBaseURI('/tokens/color/value'),
        },
        position: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
      required: ['color', 'position'],
    },
  },
});
export const gradientJSONSchema = makeTokenJSONSchema({
  tokenType: gradientTypeName,
  description: 'The gradient token.',
});

// 9.7 Typography
export const typographyValueJSONSchema = makeTokenValueJSONSchema({
  tokenType: typographyTypeName,
  description: 'The typography of a property.',
  rawValueSchema: {
    type: 'object',
    properties: {
      fontFamily: {
        $ref: withBaseURI('/tokens/fontFamily/value'),
      },
      fontSize: {
        $ref: withBaseURI('/tokens/dimension/value'),
      },
      fontWeight: {
        $ref: withBaseURI('/tokens/fontWeight/value'),
      },
      letterSpacing: {
        $ref: withBaseURI('/tokens/dimension/value'),
      },
      lineHeight: {
        $ref: withBaseURI('/tokens/number/value'),
      },
    },
    required: [
      'fontFamily',
      'fontSize',
      'fontWeight',
      'letterSpacing',
      'lineHeight',
    ],
  },
});
export const typographyJSONSchema = makeTokenJSONSchema({
  tokenType: typographyTypeName,
  description: 'The typography token.',
});

/* ------------------------------------------
   Mapping Exports
--------------------------------------------- */
export const allTokenValueJSONSchemas = [
  colorValueJSONSchema,
  dimensionValueJSONSchema,
  fontFamilyValueJSONSchema,
  fontWeightValueJSONSchema,
  durationValueJSONSchema,
  cubicBezierValueJSONSchema,
  numberValueJSONSchema,
  strokeStyleValueJSONSchema,
  borderValueJSONSchema,
  transitionValueJSONSchema,
  shadowValueJSONSchema,
  gradientValueJSONSchema,
  typographyValueJSONSchema,
] as const;
export const allTokenJSONSchemas = [
  colorJSONSchema,
  dimensionJSONSchema,
  fontFamilyJSONSchema,
  fontWeightJSONSchema,
  durationJSONSchema,
  cubicBezierJSONSchema,
  numberJSONSchema,
  strokeStyleJSONSchema,
  borderJSONSchema,
  transitionJSONSchema,
  shadowJSONSchema,
  gradientJSONSchema,
  typographyJSONSchema,
] as const;
