import { z, ZodType } from 'zod';
import {
  borderValueSchema,
  colorValueSchema,
  cubicBezierValueSchema,
  dimensionValueSchema,
  durationValueSchema,
  fontFamilyValueSchema,
  fontWeightValueSchema,
  gradientValueSchema,
  shadowValueSchema,
  strokeStyleValueSchema,
  transitionValueSchema,
  typographyValueSchema,
} from '../definitions/schemas.js';

export const tokenTypeSchema = z.union(
  [
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
export const tokenTypeAndValueSchemasMap: Record<
  z.infer<typeof tokenTypeSchema>,
  ZodType
> = {
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
export const tokenAndGroupNameSchema = z
  .string()
  .refine(
    (value) =>
      !(value.includes('.') || value.includes('{') || value.includes('}')),
    {
      message: 'Token or Group name cannot contain ".", "{" and "}"',
    }
  );
