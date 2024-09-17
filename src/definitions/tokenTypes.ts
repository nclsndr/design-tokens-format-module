import type { WithAliasValue } from './Alias.js';
import type { TokenSignature } from './TokenSignature.js';
import { JSONValue } from './JSONSignatures.js';

// Type declaration following the https://tr.designtokens.org/format specification

// 8.1 Color
const colorTypeName = 'color';
export namespace Color {
  export type TypeName = typeof colorTypeName;
  export type RawValue = `#${string}`;
  export type Value = WithAliasValue<Color.RawValue>;
  export type Token = TokenSignature<Color.TypeName, Color.Value>;
}

// 8.2 Dimension
const dimensionTypeName = 'dimension';
export namespace Dimension {
  export type TypeName = typeof dimensionTypeName;
  export type RawValue = `${number}px` | `${number}rem`;
  export type Value = WithAliasValue<Dimension.RawValue>;
  export type Token = TokenSignature<Dimension.TypeName, Dimension.Value>;
}

// 8.3 Font Family
const fontFamilyTypeName = 'fontFamily';
export namespace FontFamily {
  export type TypeName = typeof fontFamilyTypeName;
  export type RawValue = string | Array<string>;
  export type Value = WithAliasValue<FontFamily.RawValue>;
  export type Token = TokenSignature<FontFamily.TypeName, FontFamily.Value>;
}

// 8.4 Font Weight
const fontWeightTypeName = 'fontWeight';
export const fontWeightValues = [
  'thin',
  'hairline',
  'extra-light',
  'ultra-light',
  'light',
  'normal',
  'regular',
  'book',
  'medium',
  'semi-bold',
  'demi-bold',
  'bold',
  'extra-bold',
  'ultra-bold',
  'black',
  'heavy',
  'extra-black',
  'ultra-black',
] as const;
export namespace FontWeight {
  export type TypeName = typeof fontWeightTypeName;
  export type RawValue = (typeof fontWeightValues)[number] | number;
  export type Value = WithAliasValue<FontWeight.RawValue>;
  export type Token = TokenSignature<FontWeight.TypeName, FontWeight.Value>;
}

// 8.5 Duration
const durationTypeName = 'duration';
export namespace Duration {
  export type TypeName = typeof durationTypeName;
  export type RawValue = `${number}ms` | `${number}s`;
  export type Value = WithAliasValue<Duration.RawValue>;
  export type Token = TokenSignature<Duration.TypeName, Duration.Value>;
}

// 8.6 Cubic Bezier
const cubicBezierTypeName = 'cubicBezier';
export namespace CubicBezier {
  export type TypeName = typeof cubicBezierTypeName;
  export type RawValue = [number, number, number, number];
  export type Value = WithAliasValue<CubicBezier.RawValue>;
  export type Token = TokenSignature<CubicBezier.TypeName, CubicBezier.Value>;
}

// 8.7 Number
const numberTypeName = 'number';
export namespace Number {
  export type TypeName = typeof numberTypeName;
  export type RawValue = number;
  export type Value = WithAliasValue<Number.RawValue>;
  export type Token = TokenSignature<Number.TypeName, Number.Value>;
}

/*
   9. Composite Types
   https://tr.designtokens.org/format/#composite-types
*/
// 9.2 Stroke Style
const strokeStyleTypeName = 'strokeStyle';
export const strokeStyleStringValues = [
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'outset',
  'inset',
] as const;
export const strokeStyleLineCapValues = ['round', 'butt', 'square'] as const;
export namespace StrokeStyle {
  export type TypeName = typeof strokeStyleTypeName;
  export type RawValue =
    | (typeof strokeStyleStringValues)[number]
    | {
        dashArray: Dimension.Value[];
        lineCap: (typeof strokeStyleLineCapValues)[number];
      };
  export type Value = WithAliasValue<StrokeStyle.RawValue>;
  export type Token = TokenSignature<StrokeStyle.TypeName, StrokeStyle.Value>;
}

// 9.3 Border
const borderTypeName = 'border';
export namespace Border {
  export type TypeName = typeof borderTypeName;
  export type RawValue = {
    color: Color.Value;
    width: Dimension.Value;
    style: StrokeStyle.Value;
  };
  export type Value = WithAliasValue<Border.RawValue>;
  export type Token = TokenSignature<Border.TypeName, Border.Value>;
}

// 9.4 Transition
const transitionTypeName = 'transition';
export namespace Transition {
  export type TypeName = typeof transitionTypeName;
  export type RawValue = {
    duration: Duration.Value;
    delay: Duration.Value;
    timingFunction: CubicBezier.Value;
  };
  export type Value = WithAliasValue<Transition.RawValue>;
  export type Token = TokenSignature<Transition.TypeName, Transition.Value>;
}

// 9.5 Shadow
const shadowTypeName = 'shadow';
export namespace Shadow {
  export type TypeName = typeof shadowTypeName;
  export type RawValue =
    | Array<{
        color: Color.Value;
        offsetX: Dimension.Value;
        offsetY: Dimension.Value;
        blur: Dimension.Value;
        spread: Dimension.Value;
        inset?: boolean;
      }>
    | {
        color: Color.Value;
        offsetX: Dimension.Value;
        offsetY: Dimension.Value;
        blur: Dimension.Value;
        spread: Dimension.Value;
        inset?: boolean;
      };
  export type Value = WithAliasValue<Shadow.RawValue>;
  export type Token = TokenSignature<Shadow.TypeName, Shadow.Value>;
}

// 9.6 Gradient
const gradientTypeName = 'gradient';
export namespace Gradient {
  export type TypeName = typeof gradientTypeName;
  export type RawValue = Array<{
    color: Color.Value;
    position: Number.Value;
  }>;
  export type Value = WithAliasValue<Gradient.RawValue>;
  export type Token = TokenSignature<Gradient.TypeName, Gradient.Value>;
}

// 9.7 Typography
const typographyTypeName = 'typography';
export namespace Typography {
  export type TypeName = typeof typographyTypeName;
  export type RawValue = {
    fontFamily: FontFamily.Value;
    fontSize: Dimension.Value;
    fontWeight: FontWeight.Value;
    letterSpacing: Dimension.Value;
    lineHeight: Number.Value;
  };
  export type Value = WithAliasValue<Typography.RawValue>;
  export type Token = TokenSignature<Typography.TypeName, Typography.Value>;
}

/* ------------------------------------------
   Mapping Exports
--------------------------------------------- */
export const tokenTypeNames = [
  colorTypeName,
  dimensionTypeName,
  fontFamilyTypeName,
  fontWeightTypeName,
  durationTypeName,
  cubicBezierTypeName,
  numberTypeName,
  strokeStyleTypeName,
  borderTypeName,
  transitionTypeName,
  shadowTypeName,
  gradientTypeName,
  typographyTypeName,
] as const;

export const tokenTypeNamesMapping = tokenTypeNames.reduce<{
  [T in TokenTypeName]: T;
}>((acc: any, t) => {
  acc[t] = t;
  return acc;
}, {} as any);

export type TokenTypeName =
  | Color.TypeName
  | Dimension.TypeName
  | FontFamily.TypeName
  | FontWeight.TypeName
  | Duration.TypeName
  | CubicBezier.TypeName
  | Number.TypeName
  | StrokeStyle.TypeName
  | Border.TypeName
  | Transition.TypeName
  | Shadow.TypeName
  | Gradient.TypeName
  | Typography.TypeName;

export type DesignToken =
  | Color.Token
  | Dimension.Token
  | FontFamily.Token
  | FontWeight.Token
  | Duration.Token
  | CubicBezier.Token
  | Number.Token
  | StrokeStyle.Token
  | Border.Token
  | Transition.Token
  | Shadow.Token
  | Gradient.Token
  | Typography.Token;

export type PickTokenByType<T extends TokenTypeName> = {
  color: Color.Token;
  dimension: Dimension.Token;
  fontFamily: FontFamily.Token;
  fontWeight: FontWeight.Token;
  duration: Duration.Token;
  cubicBezier: CubicBezier.Token;
  number: Number.Token;
  strokeStyle: StrokeStyle.Token;
  border: Border.Token;
  transition: Transition.Token;
  shadow: Shadow.Token;
  gradient: Gradient.Token;
  typography: Typography.Token;
}[T];
