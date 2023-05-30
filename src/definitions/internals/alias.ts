import { z } from 'zod';

export const ALIAS_SEPARATOR = '.';

export const aliasSignatureSchema = z
  .string()
  .startsWith('{')
  .endsWith('}') as z.ZodType<`{${string}}`, z.ZodTypeDef, `{${string}}`>;

export type AliasSignatureSchema = typeof aliasSignatureSchema;
export type AliasSignature = z.infer<typeof aliasSignatureSchema>;

export function makeUnionWithAliasSchema<T>(schema: z.ZodSchema<T>) {
  return z.union([schema, aliasSignatureSchema]);
}

export function matchIsAlias(value: unknown): value is AliasSignature {
  return (
    typeof value === 'string' && value.startsWith('{') && value.endsWith('}')
  );
}

export function stripAliasSignature(value: AliasSignature) {
  return value.slice(1, -1);
}
