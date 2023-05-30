import {
  borderDefinition,
  colorDefinition,
  cubicBezierDefinition,
  dimensionDefinition,
  durationDefinition,
  fontFamilyDefinition,
  fontWeightDefinition,
  gradientDefinition,
  shadowDefinition,
  strokeStyleDefinition,
  transitionDefinition,
  typographyDefinition,
} from './schemas.js';
import { DesignTokenSchema } from './internals/designTokenSchema.js';
import { z } from 'zod';

export const designTokenDefinitions = [
  colorDefinition,
  dimensionDefinition,
  fontFamilyDefinition,
  fontWeightDefinition,
  durationDefinition,
  cubicBezierDefinition,
  strokeStyleDefinition,
  shadowDefinition,
  borderDefinition,
  transitionDefinition,
  gradientDefinition,
  typographyDefinition,
] as const;

export const designTokenDefinitionsMap = Object.freeze(
  designTokenDefinitions.reduce((acc, definition) => {
    acc[definition.type] = definition;
    return acc;
  }, {} as { [k in DesignTokenDefinition['type']]: DesignTokenDefinition })
);

export type DesignTokenDefinition = typeof designTokenDefinitions[number];

export type PickDesignTokenDefinition<Type> =
  Type extends DesignTokenDefinition['type']
    ? Extract<DesignTokenDefinition, { type: Type }>
    : never;

type DistributeDefinitions<
  Def,
  WithAliases extends boolean = true
> = Def extends {
  type: infer Type;
  aliasableValueZodSchema: infer AliasableSchema extends z.ZodSchema;
  rawValueZodSchema: infer RawSchema extends z.ZodSchema;
}
  ? Type extends string
    ? WithAliases extends true
      ? DesignTokenSchema<Type, z.infer<AliasableSchema>>
      : DesignTokenSchema<Type, z.infer<RawSchema>>
    : never
  : never;

export type DesignToken<WithAliases extends boolean = true> =
  DistributeDefinitions<DesignTokenDefinition, WithAliases>;

export type PickDesignToken<
  Type,
  WithAliases extends boolean = true
> = Type extends DesignToken['$type']
  ? Extract<DesignToken, { $type: Type }>
  : never;
