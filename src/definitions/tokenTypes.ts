import type { WithAliasValue } from './Alias.js';
import type { TokenSignature } from './TokenSignature.js';

// Type declaration following the https://tr.designtokens.org/format specification

// 8.1 Color
const colorTypeName = 'color';
type ColorTypeName = typeof colorTypeName;
type ColorRawValue = `#${string}`;
type ColorValue = WithAliasValue<ColorRawValue>;
type ColorToken = TokenSignature<ColorTypeName, ColorValue>;
export namespace Color {
  export type TypeName = ColorTypeName;
  export type RawValue = ColorRawValue;
  export type Value = ColorValue;
  export type Token = ColorToken;
}

// 8.2 Dimension
const dimensionTypeName = 'dimension';
type DimensionTypeName = typeof dimensionTypeName;
type DimensionRawValue = `${number}px` | `${number}rem`;
type DimensionValue = WithAliasValue<DimensionRawValue>;
type DimensionToken = TokenSignature<DimensionTypeName, DimensionValue>;
export namespace Dimension {
  export type TypeName = DimensionTypeName;
  export type RawValue = DimensionRawValue;
  export type Value = DimensionValue;
  export type Token = DimensionToken;
}

// 8.3 Font Family
const fontFamilyTypeName = 'fontFamily';
type FontFamilyTypeName = typeof fontFamilyTypeName;
type FontFamilyRawValue = string | Array<string>;
type FontFamilyValue = WithAliasValue<FontFamilyRawValue>;
type FontFamilyToken = TokenSignature<FontFamilyTypeName, FontFamilyValue>;
export namespace FontFamily {
  export type TypeName = FontFamilyTypeName;
  export type RawValue = FontFamilyRawValue;
  export type Value = FontFamilyValue;
  export type Token = FontFamilyToken;
}

// 8.4 Font Weight
const fontWeightTypeName = 'fontWeight';
type FontWeightTypeName = typeof fontWeightTypeName;
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
type FontWeightRawValue = (typeof fontWeightValues)[number] | number;
type FontWeightValue = WithAliasValue<FontWeightRawValue>;
type FontWeightToken = TokenSignature<FontWeightTypeName, FontWeightValue>;
export namespace FontWeight {
  export type TypeName = FontWeightTypeName;
  export type RawValue = FontWeightRawValue;
  export type Value = FontWeightValue;
  export type Token = FontWeightToken;
}

// 8.5 Duration
const durationTypeName = 'duration';
type DurationTypeName = typeof durationTypeName;
type DurationRawValue = `${number}ms` | `${number}s`;
type DurationValue = WithAliasValue<DurationRawValue>;
type DurationToken = TokenSignature<DurationTypeName, DurationValue>;
export namespace Duration {
  export type TypeName = DurationTypeName;
  export type RawValue = DurationRawValue;
  export type Value = DurationValue;
  export type Token = DurationToken;
}

// 8.6 Cubic Bezier
const cubicBezierTypeName = 'cubicBezier';
type CubicBezierTypeName = typeof cubicBezierTypeName;
type CubicBezierRawValue = [number, number, number, number];
type CubicBezierValue = WithAliasValue<CubicBezierRawValue>;
type CubicBezierToken = TokenSignature<CubicBezierTypeName, CubicBezierValue>;
export namespace CubicBezier {
  export type TypeName = CubicBezierTypeName;
  export type RawValue = CubicBezierRawValue;
  export type Value = CubicBezierValue;
  export type Token = CubicBezierToken;
}

// 8.7 Number
const numberTypeName = 'number';
type NumberTypeName = typeof numberTypeName;
type NumberRawValue = number;
type NumberValue = WithAliasValue<NumberRawValue>;
type NumberToken = TokenSignature<NumberTypeName, NumberValue>;
export namespace Number {
  export type TypeName = NumberTypeName;
  export type RawValue = NumberRawValue;
  export type Value = NumberValue;
  export type Token = NumberToken;
}

/*
   9. Composite Types
   https://tr.designtokens.org/format/#composite-types
*/
// 9.2 Stroke Style
const strokeStyleTypeName = 'strokeStyle';
type StrokeStyleTypeName = typeof strokeStyleTypeName;
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
type StrokeStyleRawValue =
  | (typeof strokeStyleStringValues)[number]
  | {
      dashArray: DimensionValue[];
      lineCap: (typeof strokeStyleLineCapValues)[number];
    };
type StrokeStyleValue = WithAliasValue<StrokeStyleRawValue>;
type StrokeStyleToken = TokenSignature<StrokeStyleTypeName, StrokeStyleValue>;
export namespace StrokeStyle {
  export type TypeName = StrokeStyleTypeName;
  export type RawValue = StrokeStyleRawValue;
  export type Value = StrokeStyleValue;
  export type Token = StrokeStyleToken;
}

// 9.3 Border
const borderTypeName = 'border';
type BorderTypeName = typeof borderTypeName;
type BorderRawValue = {
  color: ColorValue;
  width: DimensionValue;
  style: StrokeStyleValue;
};
type BorderValue = WithAliasValue<BorderRawValue>;
type BorderToken = TokenSignature<BorderTypeName, BorderValue>;
export namespace Border {
  export type TypeName = BorderTypeName;
  export type RawValue = BorderRawValue;
  export type Value = BorderValue;
  export type Token = BorderToken;
}

// 9.4 Transition
const transitionTypeName = 'transition';
type TransitionTypeName = typeof transitionTypeName;
type TransitionRawValue = {
  duration: DurationValue;
  delay: DurationValue;
  timingFunction: CubicBezierValue;
};
type TransitionValue = WithAliasValue<TransitionRawValue>;
type TransitionToken = TokenSignature<TransitionTypeName, TransitionValue>;
export namespace Transition {
  export type TypeName = TransitionTypeName;
  export type RawValue = TransitionRawValue;
  export type Value = TransitionValue;
  export type Token = TransitionToken;
}

// 9.5 Shadow
const shadowTypeName = 'shadow';
type ShadowTypeName = typeof shadowTypeName;
type ShadowRawValue = {
  color: ColorValue;
  offsetX: DimensionValue;
  offsetY: DimensionValue;
  blur: DimensionValue;
  spread: DimensionValue;
};
type ShadowValue = WithAliasValue<ShadowRawValue>;
type ShadowToken = TokenSignature<ShadowTypeName, ShadowValue>;
export namespace Shadow {
  export type TypeName = ShadowTypeName;
  export type RawValue = ShadowRawValue;
  export type Value = ShadowValue;
  export type Token = ShadowToken;
}

// 9.6 Gradient
const gradientTypeName = 'gradient';
type GradientTypeName = typeof gradientTypeName;
type GradientRawValue = Array<{
  color: ColorValue;
  position: NumberValue;
}>;
type GradientValue = WithAliasValue<GradientRawValue>;
type GradientToken = TokenSignature<GradientTypeName, GradientValue>;
export namespace Gradient {
  export type TypeName = GradientTypeName;
  export type RawValue = GradientRawValue;
  export type Value = GradientValue;
  export type Token = GradientToken;
}

// 9.7 Typography
const typographyTypeName = 'typography';
type TypographyTypeName = typeof typographyTypeName;
type TypographyRawValue = {
  fontFamily: FontFamilyValue;
  fontSize: DimensionValue;
  fontWeight: FontWeightValue;
  letterSpacing: DimensionValue;
  lineHeight: NumberValue;
};
type TypographyValue = WithAliasValue<TypographyRawValue>;
type TypographyToken = TokenSignature<TypographyTypeName, TypographyValue>;
export namespace Typography {
  export type TypeName = TypographyTypeName;
  export type RawValue = TypographyRawValue;
  export type Value = TypographyValue;
  export type Token = TypographyToken;
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
  | ColorTypeName
  | DimensionTypeName
  | FontFamilyTypeName
  | FontWeightTypeName
  | DurationTypeName
  | CubicBezierTypeName
  | NumberTypeName
  | StrokeStyleTypeName
  | BorderTypeName
  | TransitionTypeName
  | ShadowTypeName
  | GradientTypeName
  | TypographyTypeName;

export type DesignToken =
  | ColorToken
  | DimensionToken
  | FontFamilyToken
  | FontWeightToken
  | DurationToken
  | CubicBezierToken
  | NumberToken
  | StrokeStyleToken
  | BorderToken
  | TransitionToken
  | ShadowToken
  | GradientToken
  | TypographyToken;
