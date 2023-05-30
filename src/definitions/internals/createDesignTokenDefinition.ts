import { z } from 'zod';
import {
  createDesignTokenSchema,
  DesignTokenZodSchema,
} from './designTokenSchema.js';

type DesignTokenDefinition<
  Type extends string,
  AliasableSchema extends z.ZodSchema<any>,
  RawSchema extends z.ZodSchema<any>
> = {
  type: Type;
  aliasableValueZodSchema: AliasableSchema;
  rawValueZodSchema: RawSchema;
  aliasableTokenZodSchema: DesignTokenZodSchema<Type, AliasableSchema>;
  rawTokenZodSchema: DesignTokenZodSchema<Type, RawSchema>;
};

export function createDesignTokenDefinition<
  Type extends string,
  AliasableSchema extends z.ZodSchema<any>,
  RawSchema extends z.ZodSchema<any>
>(candidate: {
  type: Type;
  aliasableValueZodSchema: AliasableSchema;
  rawValueZodSchema: RawSchema;
}): DesignTokenDefinition<Type, AliasableSchema, RawSchema> {
  return {
    type: candidate.type,
    aliasableValueZodSchema: candidate.aliasableValueZodSchema,
    rawValueZodSchema: candidate.rawValueZodSchema,
    aliasableTokenZodSchema: createDesignTokenSchema(
      candidate.type,
      candidate.aliasableValueZodSchema
    ),
    rawTokenZodSchema: createDesignTokenSchema(
      candidate.type,
      candidate.rawValueZodSchema
    ),
  };
}
