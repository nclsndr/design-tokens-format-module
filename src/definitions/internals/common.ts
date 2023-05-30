import { z } from 'zod';

import { ALIAS_SEPARATOR } from './alias.js';

export const commonNodePropertiesSchema = z.object({
  $description: z.string().optional(),
  $extensions: z.record(z.unknown()).optional(),
});

export function validateCommonNodeProperties(candidate: unknown) {
  return commonNodePropertiesSchema.parse(candidate);
}

export type CommonNodePropertiesSchema = typeof commonNodePropertiesSchema;
export type CommonNodeProperties = z.infer<typeof commonNodePropertiesSchema>;

export const designTokenNameSchema = z
  .string()
  .min(1)
  .refine((value) => {
    return !value.includes(ALIAS_SEPARATOR);
  });
export function validateDesignTokenName(candidate: unknown) {
  return designTokenNameSchema.parse(candidate);
}
