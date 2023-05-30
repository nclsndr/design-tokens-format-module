import {
  DesignTokenType,
  DesignTokenValue,
} from '../types/designTokenFormatModule.js';
import {
  aliasSignatureSchema,
  matchIsAlias,
} from '../definitions/internals/alias.js';
import {
  tokenTypeAndValueSchemasMap,
  tokenTypeSchema,
} from './schemas_legacy.js';

export function validateDesignTokenValue(
  tokenType: DesignTokenType,
  tokenValue: DesignTokenValue
) {
  if (matchIsAlias(tokenValue)) {
    return aliasSignatureSchema.parse(tokenValue);
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
