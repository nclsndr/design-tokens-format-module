import { z } from 'zod';
import { UnionToTuple } from '../utils/UnionToTuple.js';
import {
  DesignTokenDefinition,
  designTokenDefinitions,
} from './DesignToken.js';

type DistributeZodLiteral<T, Acc extends any[] = []> = T extends [
  infer Head extends string,
  ...infer Tail
]
  ? DistributeZodLiteral<Tail, [z.ZodLiteral<Head>, ...Acc]>
  : Acc;
type TokenTypesZodLiteralTuple = DistributeZodLiteral<
  UnionToTuple<DesignTokenDefinition['type']>
>;

export const designTokenTypeSchema = z.union(
  // @ts-expect-error - zod cannot keep track of never declared literals
  designTokenDefinitions.map((def) => z.literal(def.type)),
  {
    invalid_type_error: `Token type must be one of ${designTokenDefinitions
      .map((def) => def.type)
      .join(', ')}`,
    required_error: 'Token type is required',
  }
) as z.ZodUnion<TokenTypesZodLiteralTuple>;

export function validateDesignTokenType(type: unknown) {
  return designTokenTypeSchema.parse(type);
}

export type DesignTokenType = DesignTokenDefinition['type'];
