import {
  DesignTokenType,
  DesignTokenValue,
} from '../types/designTokenFormatModule.js';
import { matchIsAlias } from './matchIsAlias.js';
import {
  aliasSchema,
  tokenTypeAndValueSchemasMap,
  tokenTypeSchema,
} from './schemas.js';

export function validateDesignTokenValue(
  tokenType: DesignTokenType,
  tokenValue: DesignTokenValue
) {
  if (matchIsAlias(tokenValue)) {
    return aliasSchema.parse(tokenValue);
  }
  const validatedTokenType = tokenTypeSchema.parse(tokenType);
  const validator = tokenTypeAndValueSchemasMap[validatedTokenType];
  if (!validator) {
    throw new Error(
      `No validator found for token type "${validatedTokenType}"`
    );
  }
  return validator.parse(tokenValue);
}
