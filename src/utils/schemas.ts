import { z, ZodType } from 'zod';

export const JSONTokenTypeNameSchema = z.union(
  [
    z.literal('String'),
    z.literal('Number'),
    z.literal('Boolean'),
    z.literal('Null'),
    z.literal('Object'),
    z.literal('Array'),
  ],
  {
    required_error: 'Invalid token type provided',
    invalid_type_error: 'Invalid token type provided',
  }
);

export const tokenTypeSchema = z.union(
  [
    JSONTokenTypeNameSchema,
    z.literal('color'),
    z.literal('dimension'),
    z.literal('fontFamily'),
    z.literal('fontWeight'),
    z.literal('duration'),
    z.literal('cubicBezier'),
    z.literal('shadow'),
    z.literal('strokeStyle'),
    z.literal('border'),
    z.literal('transition'),
    z.literal('gradient'),
    z.literal('typography'),
  ],
  {
    required_error: 'Invalid token type provided',
    invalid_type_error: 'Invalid token type provided',
  }
);

const fontWeightNomenclatureSchema = z.union([
  z.literal('thin'),
  z.literal('hairline'),
  z.literal('extra-light'),
  z.literal('ultra-light'),
  z.literal('light'),
  z.literal('normal'),
  z.literal('regular'),
  z.literal('book'),
  z.literal('medium'),
  z.literal('semi-bold'),
  z.literal('demi-bold'),
  z.literal('bold'),
  z.literal('extra-bold'),
  z.literal('ultra-bold'),
  z.literal('black'),
  z.literal('heavy'),
  z.literal('extra-black'),
  z.literal('ultra-black'),
]);

export const aliasSchema = z.string().startsWith('{').endsWith('}');

// JSON token value types
const JSONStringSchema = z.union([z.string(), aliasSchema]);
const JSONNumberSchema = z.union([z.number(), aliasSchema]);
const JSONBooleanSchema = z.union([z.boolean(), aliasSchema]);
const JSONNullSchema = z.union([z.null(), aliasSchema]);
const literalSchema = z.union([
  JSONStringSchema,
  JSONNumberSchema,
  JSONBooleanSchema,
  JSONNullSchema,
]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const JSONSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(JSONSchema), z.record(JSONSchema)])
);
const JSONArraySchema = z.array(JSONSchema);
const JSONObjectSchema = z.record(JSONSchema);

// Primitive token value types
const colorValueSchema = z.union([z.string().startsWith('#'), aliasSchema]);
const dimensionValueSchema = z.union([z.string(), aliasSchema]);
const fontFamilyValueSchema = z.union([z.string(), aliasSchema]);
const fontWeightValueSchema = z.union([
  z.number().min(1).max(1000),
  fontWeightNomenclatureSchema,
]);
const durationValueSchema = z.union([z.string().endsWith('ms'), aliasSchema]);
const cubicBezierValueSchema = z.union([
  z.tuple([
    z.number().min(0).max(1),
    z.number(),
    z.number().min(0).max(1),
    z.number(),
  ]),
  aliasSchema,
]);

// Composite token value types
const shadowValueSchema = z.union([
  z.object({
    color: colorValueSchema,
    offsetX: dimensionValueSchema,
    offsetY: dimensionValueSchema,
    blur: dimensionValueSchema,
    spread: dimensionValueSchema,
  }),
  aliasSchema,
]);
const strokeStyleValueSchema = z.union([
  z.literal('solid'),
  z.literal('dashed'),
  z.literal('dotted'),
  z.literal('double'),
  z.literal('groove'),
  z.literal('ridge'),
  z.literal('outset'),
  z.literal('inset'),
  z.object({
    dashArray: z.array(dimensionValueSchema),
    lineCap: z.union([
      z.literal('round'),
      z.literal('butt'),
      z.literal('square'),
    ]),
  }),
]);
const borderValueSchema = z.union([
  z.object({
    color: colorValueSchema,
    width: dimensionValueSchema,
    style: strokeStyleValueSchema,
  }),
  aliasSchema,
]);
const transitionValueSchema = z.union([
  z.object({
    duration: durationValueSchema,
    delay: durationValueSchema,
    timingFunction: cubicBezierValueSchema,
  }),
  aliasSchema,
]);
const gradientValueSchema = z.union([
  z.array(
    z.object({
      color: colorValueSchema,
      position: JSONNumberSchema,
    })
  ),
  aliasSchema,
]);
const typographyValueSchema = z.union([
  z.object({
    fontFamily: fontFamilyValueSchema,
    fontSize: dimensionValueSchema,
    fontWeight: fontWeightValueSchema,
    letterSpacing: dimensionValueSchema,
    lineHeight: JSONStringSchema,
  }),
  aliasSchema,
]);

export const tokenTypeAndValueSchemasMap: Record<
  z.infer<typeof tokenTypeSchema>,
  ZodType
> = {
  String: JSONStringSchema,
  Number: JSONNumberSchema,
  Boolean: JSONBooleanSchema,
  Null: JSONNullSchema,
  Object: JSONObjectSchema,
  Array: JSONArraySchema,
  color: colorValueSchema,
  dimension: dimensionValueSchema,
  fontFamily: fontFamilyValueSchema,
  fontWeight: fontWeightValueSchema,
  duration: durationValueSchema,
  cubicBezier: cubicBezierValueSchema,
  shadow: shadowValueSchema,
  strokeStyle: strokeStyleValueSchema,
  border: borderValueSchema,
  transition: transitionValueSchema,
  gradient: gradientValueSchema,
  typography: typographyValueSchema,
};
