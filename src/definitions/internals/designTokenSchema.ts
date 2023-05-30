import { z } from 'zod';
import { commonNodePropertiesSchema } from './common.js';

export type DesignTokenSchema<
  Type extends string = string,
  Value extends unknown = unknown
> = {
  $type: Type;
  $value: Value;
  $description?: string;
  $extensions?: Record<string, unknown>;
};

export type DesignTokenZodSchema<
  Type extends string,
  Value extends z.Schema
> = z.ZodObject<
  {
    $type: z.ZodLiteral<Type>;
    $value: Value;
    $description: z.ZodOptional<z.ZodString>;
    $extensions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strict'
>;

export function createDesignTokenSchema<
  Type extends string,
  ValueSchema extends z.Schema
>(
  type: Type,
  valueSchema: ValueSchema
): DesignTokenZodSchema<Type, ValueSchema> {
  return z
    .object({
      $type: z.literal(type),
      $value: valueSchema,
    })
    .merge(commonNodePropertiesSchema)
    .strict();
}
