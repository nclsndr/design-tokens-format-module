import { z } from 'zod';

import { makeUnionWithAliasSchema } from './internals/alias.js';
import { createDesignTokenDefinition } from './internals/createDesignTokenDefinition.js';
import {
  borderTypeName,
  colorTypeName,
  cubicBezierTypeName,
  dimensionTypeName,
  durationTypeName,
  fontFamilyTypeName,
  fontWeightTypeName,
  gradientTypeName,
  shadowTypeName,
  strokeStyleTypeName,
  transitionTypeName,
  typographyTypeName,
} from './tokenTypeNames.js';

export const colorRawValueSchema = z.string().startsWith('#') as z.ZodType<
  `#${string}`,
  z.ZodTypeDef,
  `#${string}`
>;
export const colorValueSchema = makeUnionWithAliasSchema(colorRawValueSchema);
export const colorDefinition = createDesignTokenDefinition({
  type: colorTypeName,
  aliasableValueZodSchema: colorValueSchema,
  rawValueZodSchema: colorRawValueSchema,
});

export const dimensionRawValueSchema = z.union([
  z.string().endsWith('px'),
  z.string().endsWith('rem'),
]) as z.ZodType<
  `${string}px` | `${string}rem`,
  z.ZodTypeDef,
  `${string}px` | `${string}rem`
>;
export const dimensionValueSchema = makeUnionWithAliasSchema(
  dimensionRawValueSchema
);
export const dimensionDefinition = createDesignTokenDefinition({
  type: dimensionTypeName,
  aliasableValueZodSchema: dimensionValueSchema,
  rawValueZodSchema: dimensionRawValueSchema,
});

export const fontFamilyRawValueSchema = z.union([
  z.string(),
  z.array(makeUnionWithAliasSchema(z.string())),
]);
export const fontFamilyValueSchema = makeUnionWithAliasSchema(
  fontFamilyRawValueSchema
);
export const fontFamilyDefinition = createDesignTokenDefinition({
  type: fontFamilyTypeName,
  aliasableValueZodSchema: fontFamilyValueSchema,
  rawValueZodSchema: fontFamilyRawValueSchema,
});

export const fontWeightNomenclatureSchema = z.union([
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
export const fontWeightRawValueSchema = z.union([
  z.number().min(1).max(1000),
  fontWeightNomenclatureSchema,
]);
export const fontWeightValueSchema = makeUnionWithAliasSchema(
  fontWeightRawValueSchema
);
export const fontWeightDefinition = createDesignTokenDefinition({
  type: fontWeightTypeName,
  aliasableValueZodSchema: fontWeightValueSchema,
  rawValueZodSchema: fontWeightRawValueSchema,
});

export const durationRawValueSchema = z.string().endsWith('ms') as z.ZodType<
  `${string}ms`,
  z.ZodTypeDef,
  `${string}ms`
>;
export const durationValueSchema = makeUnionWithAliasSchema(
  durationRawValueSchema
);
export const durationDefinition = createDesignTokenDefinition({
  type: durationTypeName,
  aliasableValueZodSchema: durationValueSchema,
  rawValueZodSchema: durationRawValueSchema,
});

export const cubicBezierRawValueSchema = z.tuple([
  z.number().min(0).max(1),
  z.number(),
  z.number().min(0).max(1),
  z.number(),
]);
export const cubicBezierValueSchema = makeUnionWithAliasSchema(
  cubicBezierRawValueSchema
);
export const cubicBezierDefinition = createDesignTokenDefinition({
  type: cubicBezierTypeName,
  aliasableValueZodSchema: cubicBezierValueSchema,
  rawValueZodSchema: cubicBezierRawValueSchema,
});

export const strokeStyleRawValueSchema = z.union([
  z.literal('solid'),
  z.literal('dashed'),
  z.literal('dotted'),
  z.literal('double'),
  z.literal('groove'),
  z.literal('ridge'),
  z.literal('outset'),
  z.literal('inset'),
  z.object({
    dashArray: z.array(dimensionRawValueSchema),
    lineCap: z.union([
      z.literal('round'),
      z.literal('butt'),
      z.literal('square'),
    ]),
  }),
]);
export const strokeStyleValueSchema = z.union([
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
export const strokeStyleDefinition = createDesignTokenDefinition({
  type: strokeStyleTypeName,
  aliasableValueZodSchema: strokeStyleValueSchema,
  rawValueZodSchema: strokeStyleRawValueSchema,
});

// Composite token value types
export const shadowRawValueSchema = z.object({
  color: colorRawValueSchema,
  offsetX: dimensionRawValueSchema,
  offsetY: dimensionRawValueSchema,
  blur: dimensionRawValueSchema,
  spread: dimensionRawValueSchema,
});
export const shadowValueSchema = makeUnionWithAliasSchema(
  z.object({
    color: colorValueSchema,
    offsetX: dimensionValueSchema,
    offsetY: dimensionValueSchema,
    blur: dimensionValueSchema,
    spread: dimensionValueSchema,
  })
);
export const shadowDefinition = createDesignTokenDefinition({
  type: shadowTypeName,
  aliasableValueZodSchema: shadowValueSchema,
  rawValueZodSchema: shadowRawValueSchema,
});

export const borderRawValueSchema = z.object({
  color: colorRawValueSchema,
  width: dimensionRawValueSchema,
  style: strokeStyleRawValueSchema,
});
export const borderValueSchema = makeUnionWithAliasSchema(
  z.object({
    color: colorValueSchema,
    width: dimensionValueSchema,
    style: strokeStyleValueSchema,
  })
);
export const borderDefinition = createDesignTokenDefinition({
  type: borderTypeName,
  aliasableValueZodSchema: borderValueSchema,
  rawValueZodSchema: borderRawValueSchema,
});

export const transitionRawValueSchema = z.object({
  duration: durationRawValueSchema,
  delay: durationRawValueSchema,
  timingFunction: cubicBezierRawValueSchema,
});
export const transitionValueSchema = makeUnionWithAliasSchema(
  z.object({
    duration: durationValueSchema,
    delay: durationValueSchema,
    timingFunction: cubicBezierValueSchema,
  })
);
export const transitionDefinition = createDesignTokenDefinition({
  type: transitionTypeName,
  aliasableValueZodSchema: transitionValueSchema,
  rawValueZodSchema: transitionRawValueSchema,
});

export const gradientRawValueSchema = z.array(
  z.object({
    color: colorRawValueSchema,
    position: z.number(),
  })
);
export const gradientValueSchema = makeUnionWithAliasSchema(
  z.array(
    makeUnionWithAliasSchema(
      z.object({
        color: colorValueSchema,
        position: z.number(),
      })
    )
  )
);
export const gradientDefinition = createDesignTokenDefinition({
  type: gradientTypeName,
  aliasableValueZodSchema: gradientValueSchema,
  rawValueZodSchema: gradientRawValueSchema,
});

export const typographyRawValueSchema = z.object({
  fontFamily: fontFamilyRawValueSchema,
  fontSize: dimensionRawValueSchema,
  fontWeight: fontWeightRawValueSchema,
  letterSpacing: dimensionRawValueSchema,
  lineHeight: z.string(),
});
export const typographyValueSchema = makeUnionWithAliasSchema(
  z.object({
    fontFamily: fontFamilyValueSchema,
    fontSize: dimensionValueSchema,
    fontWeight: fontWeightValueSchema,
    letterSpacing: dimensionValueSchema,
    lineHeight: z.string(),
  })
);
export const typographyDefinition = createDesignTokenDefinition({
  type: typographyTypeName,
  aliasableValueZodSchema: typographyValueSchema,
  rawValueZodSchema: typographyRawValueSchema,
});
