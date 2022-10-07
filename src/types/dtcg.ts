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

type Alias = `{${string}}`;

// JSON token value types
type JSONStringValue = string | Alias;
type JSONNumberValue = number | Alias;
type JSONBooleanValue = boolean | Alias;
type JSONNullValue = null | Alias;
type JSONArrayValue = Array<JSONTokenValue> | Alias;
export type JSONObjectValue = { [key: string]: JSONTokenValue } | Alias;
export type JSONTokenValue =
  | JSONStringValue
  | JSONNumberValue
  | JSONBooleanValue
  | JSONNullValue
  | JSONObjectValue
  | JSONArrayValue
  | Alias;

// Primitive token value types
type ColorValue = `#${string}` | Alias; // #ff00ff (opaque) | #00000088 (transparent)
type DimensionValue = string | Alias; // 1px | 1rem | 1em | 1% | 1vh | 1vw | 1vmin | 1vmax
type FontFamilyValue = string | string[] | Alias; // "Helvetica" | ["Helvetica", "Arial", sans-serif]
type FontWeightValue =
  | number // [1-1000]
  | FontWeightNomenclature[keyof FontWeightNomenclature]['value'] // 'thin' | 'hairline' | 'extra-light' | 'ultra-light' | 'light' | 'normal' | 'regular' | 'book' | 'medium' | 'semi-bold' | 'demi-bold' | 'bold' | 'extra-bold' | 'ultra-bold' | 'black' | 'heavy' | 'extra-black' | 'ultra-black'
  | Alias;
type DurationValue = `${number}ms` | Alias; // 100ms
type CubicBezierValue = [number, number, number, number] | Alias; // [P1x, P1y, P2x, P2y]

// Composite token value types
type ShadowValue =
  | {
      color: ColorValue;
      offsetX: DimensionValue;
      offsetY: DimensionValue;
      blur: DimensionValue;
      spread: DimensionValue;
    }
  | Alias;

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
  | Alias;

type BorderValue =
  | {
      color: ColorValue;
      width: DimensionValue;
      style: StrokeStyleValue;
    }
  | Alias;

type TransitionValue =
  | {
      duration: DurationValue;
      delay: DurationValue;
      timingFunction: CubicBezierValue;
    }
  | Alias;

type GradientValue =
  | Array<{
      color: ColorValue;
      position: JSONNumberValue;
    }>
  | Alias;

type TypographyValue =
  | {
      fontFamily: FontFamilyValue;
      fontSize: DimensionValue;
      fontWeight: FontWeightValue;
      letterSpacing: DimensionValue;
      lineHeight: JSONStringValue;
    }
  | Alias;

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

export type TokenUnit = {
  // Token
  $value: TokenValue;
  $type?: TokenType;
  $description?: string;
};

type TokenGroup = {
  // Group
  $type?: TokenType;
  $description?: string;
  $extensions?: JSONValue;
  // $value: never
};

export type TokenTree = {
  [name: string]: TokenUnit | TokenGroup | TokenTree;
};
