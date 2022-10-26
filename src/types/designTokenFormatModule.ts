import { z } from 'zod';

import { JSONTokenTypeNameSchema, tokenTypeSchema } from '../utils/schemas.js';
import { JSONValue } from './JSON.js';

export type JSONTokenType = z.infer<typeof JSONTokenTypeNameSchema>;
export type TokenType = z.infer<typeof tokenTypeSchema>;

export type FontWeightNomenclature = {
  100: {
    value: 'thin' | 'hairline';
  };
  200: {
    value: 'extra-light' | 'ultra-light';
  };
  300: {
    value: 'light';
  };
  400: {
    value: 'normal' | 'regular' | 'book';
  };
  500: {
    value: 'medium';
  };
  600: {
    value: 'semi-bold' | 'demi-bold';
  };
  700: {
    value: 'bold';
  };
  800: {
    value: 'extra-bold' | 'ultra-bold';
  };
  900: {
    value: 'black' | 'heavy';
  };
  950: {
    value: 'extra-black' | 'ultra-black';
  };
};

export type DesignTokenAlias = `{${string}}`;

// JSON token value types
type JSONStringValue = string | DesignTokenAlias;
type JSONNumberValue = number | DesignTokenAlias;
type JSONBooleanValue = boolean | DesignTokenAlias;
type JSONNullValue = null | DesignTokenAlias;
type JSONArrayValue = Array<JSONTokenValue> | DesignTokenAlias;
export type JSONObjectValue =
  | { [key: string]: JSONTokenValue }
  | DesignTokenAlias;
export type JSONTokenValue =
  | JSONStringValue
  | JSONNumberValue
  | JSONBooleanValue
  | JSONNullValue
  | JSONObjectValue
  | JSONArrayValue
  | DesignTokenAlias;

// Primitive token value types
type ColorValue = `#${string}` | DesignTokenAlias; // #ff00ff (opaque) | #00000088 (transparent)
type DimensionValue = string | DesignTokenAlias; // 1px | 1rem | 1em | 1% | 1vh | 1vw | 1vmin | 1vmax
type FontFamilyValue = string | string[] | DesignTokenAlias; // "Helvetica" | ["Helvetica", "Arial", sans-serif]
type FontWeightValue =
  | number // [1-1000]
  | FontWeightNomenclature[keyof FontWeightNomenclature]['value'] // 'thin' | 'hairline' | 'extra-light' | 'ultra-light' | 'light' | 'normal' | 'regular' | 'book' | 'medium' | 'semi-bold' | 'demi-bold' | 'bold' | 'extra-bold' | 'ultra-bold' | 'black' | 'heavy' | 'extra-black' | 'ultra-black'
  | DesignTokenAlias;
type DurationValue = `${number}ms` | DesignTokenAlias; // 100ms
type CubicBezierValue =
  | [P1x: number, P1y: number, P2x: number, P2y: number]
  | DesignTokenAlias; // [P1x, P1y, P2x, P2y]

// Composite token value types
type ShadowValue =
  | {
      color: ColorValue;
      offsetX: DimensionValue;
      offsetY: DimensionValue;
      blur: DimensionValue;
      spread: DimensionValue;
    }
  | DesignTokenAlias;

type StrokeStyleValue =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'outset'
  | 'inset'
  | {
      dashArray: DimensionValue[];
      lineCap: 'round' | 'butt' | 'square';
    }
  | DesignTokenAlias;

type BorderValue =
  | {
      color: ColorValue;
      width: DimensionValue;
      style: StrokeStyleValue;
    }
  | DesignTokenAlias;

type TransitionValue =
  | {
      duration: DurationValue;
      delay: DurationValue;
      timingFunction: CubicBezierValue;
    }
  | DesignTokenAlias;

type GradientValue =
  | Array<{
      color: ColorValue;
      position: JSONNumberValue;
    }>
  | DesignTokenAlias;

type TypographyValue =
  | {
      fontFamily: FontFamilyValue;
      fontSize: DimensionValue;
      fontWeight: FontWeightValue;
      letterSpacing: DimensionValue;
      lineHeight: JSONStringValue;
    }
  | DesignTokenAlias;

export type TokenValue =
  | JSONTokenValue
  | ColorValue
  | DimensionValue
  | FontFamilyValue
  | FontWeightValue
  | DurationValue
  | CubicBezierValue
  | ShadowValue
  | StrokeStyleValue
  | BorderValue
  | TransitionValue
  | GradientValue
  | TypographyValue;

export type DesignToken = {
  // Token
  $value: TokenValue;
  $type?: TokenType;
  $description?: string;
  $extensions?: JSONValue;
};

export type TokenGroup = {
  // Group
  $type?: TokenType;
  $description?: string;
  // $value: never
};

export type TokenTree = {
  [name: string]: DesignToken | TokenGroup | TokenTree;
};
