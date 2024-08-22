import type { WithAliasValue } from './Alias.js';
import type { TokenSignature } from './TokenSignature.js';

// Type declaration following the https://tr.designtokens.org/format specification

// 8.1 Color
const colorTypeName = 'color';
type ColorTypeName = typeof colorTypeName;
type ColorValue = WithAliasValue<`#${string}`>;
type ColorToken = TokenSignature<ColorTypeName, ColorValue>;
export namespace Color {
  export type TypeName = ColorTypeName;
  export type Value = ColorValue;
  export type Token = ColorToken;
}

// 8.2 Dimension
const dimensionTypeName = 'dimension';
type DimensionTypeName = typeof dimensionTypeName;
type DimensionValue = WithAliasValue<`${number}px` | `${number}rem`>;
type DimensionToken = TokenSignature<DimensionTypeName, DimensionValue>;
export namespace Dimension {
  export type TypeName = DimensionTypeName;
  export type Value = DimensionValue;
  export type Token = DimensionToken;
}

// 8.3 Font Family
const fontFamilyTypeName = 'fontFamily';
type FontFamilyTypeName = typeof fontFamilyTypeName;
type FontFamilyValue = WithAliasValue<string | Array<string>>;
type FontFamilyToken = TokenSignature<FontFamilyTypeName, FontFamilyValue>;
export namespace FontFamily {
  export type TypeName = FontFamilyTypeName;
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
type FontWeightValue = WithAliasValue<
  (typeof fontWeightValues)[number] | number
>;
type FontWeightToken = TokenSignature<FontWeightTypeName, FontWeightValue>;
export namespace FontWeight {
  export type TypeName = FontWeightTypeName;
  export type Value = FontWeightValue;
  export type Token = FontWeightToken;
}

// 8.5 Duration
const durationTypeName = 'duration';
type DurationTypeName = typeof durationTypeName;
type DurationValue = WithAliasValue<`${number}ms` | `${number}s`>;
type DurationToken = TokenSignature<DurationTypeName, DurationValue>;
export namespace Duration {
  export type TypeName = DurationTypeName;
  export type Value = DurationValue;
  export type Token = DurationToken;
}

// 8.6 Cubic Bezier
const cubicBezierTypeName = 'cubicBezier';
type CubicBezierTypeName = typeof cubicBezierTypeName;
type CubicBezierValue = WithAliasValue<[number, number, number, number]>;
type CubicBezierToken = TokenSignature<CubicBezierTypeName, CubicBezierValue>;
export namespace CubicBezier {
  export type TypeName = CubicBezierTypeName;
  export type Value = CubicBezierValue;
  export type Token = CubicBezierToken;
}

// 8.7 Number
const numberTypeName = 'number';
type NumberTypeName = typeof numberTypeName;
type NumberValue = WithAliasValue<number>;
type NumberToken = TokenSignature<NumberTypeName, NumberValue>;
export namespace Number {
  export type TypeName = NumberTypeName;
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
type StrokeStyleValue = WithAliasValue<
  | (typeof strokeStyleStringValues)[number]
  | {
      dashArray: DimensionValue[];
      lineCap: (typeof strokeStyleLineCapValues)[number];
    }
>;
type StrokeStyleToken = TokenSignature<StrokeStyleTypeName, StrokeStyleValue>;
export namespace StrokeStyle {
  export type TypeName = StrokeStyleTypeName;
  export type Value = StrokeStyleValue;
  export type Token = StrokeStyleToken;
}

// 9.3 Border
const borderTypeName = 'border';
type BorderTypeName = typeof borderTypeName;
type BorderValue = WithAliasValue<{
  color: ColorValue;
  width: DimensionValue;
  style: StrokeStyleValue;
}>;
type BorderToken = TokenSignature<BorderTypeName, BorderValue>;
export namespace Border {
  export type TypeName = BorderTypeName;
  export type Value = BorderValue;
  export type Token = BorderToken;
}

// 9.4 Transition
const transitionTypeName = 'transition';
type TransitionTypeName = typeof transitionTypeName;
type TransitionValue = WithAliasValue<{
  duration: DurationValue;
  delay: DurationValue;
  timingFunction: CubicBezierValue;
}>;
type TransitionToken = TokenSignature<TransitionTypeName, TransitionValue>;
export namespace Transition {
  export type TypeName = TransitionTypeName;
  export type Value = TransitionValue;
  export type Token = TransitionToken;
}

// 9.5 Shadow
const shadowTypeName = 'shadow';
type ShadowTypeName = typeof shadowTypeName;
type ShadowValue = WithAliasValue<{
  color: ColorValue;
  offsetX: DimensionValue;
  offsetY: DimensionValue;
  blur: DimensionValue;
  spread: DimensionValue;
}>;
type ShadowToken = TokenSignature<ShadowTypeName, ShadowValue>;
export namespace Shadow {
  export type TypeName = ShadowTypeName;
  export type Value = ShadowValue;
  export type Token = ShadowToken;
}

// 9.6 Gradient
const gradientTypeName = 'gradient';
type GradientTypeName = typeof gradientTypeName;
type GradientValue = WithAliasValue<
  Array<{
    color: ColorValue;
    position: NumberValue;
  }>
>;
type GradientToken = TokenSignature<GradientTypeName, GradientValue>;
export namespace Gradient {
  export type TypeName = GradientTypeName;
  export type Value = GradientValue;
  export type Token = GradientToken;
}

// 9.7 Typography
const typographyTypeName = 'typography';
type TypographyTypeName = typeof typographyTypeName;
type TypographyValue = WithAliasValue<{
  fontFamily: FontFamilyValue;
  fontSize: DimensionValue;
  fontWeight: FontWeightValue;
  letterSpacing: DimensionValue;
  lineHeight: NumberValue;
}>;
type TypographyToken = TokenSignature<TypographyTypeName, TypographyValue>;
export namespace Typography {
  export type TypeName = TypographyTypeName;
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
