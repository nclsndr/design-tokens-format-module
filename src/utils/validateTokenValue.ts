import { TokenType, TokenValue } from '../types/designTokenFormatModule.js';
import { matchIsAlias } from './matchIsAlias.js';
import {
  aliasSchema,
  tokenTypeAndValueSchemasMap,
  tokenTypeSchema,
} from './schemas.js';

export function validateTokenValue(
  tokenType: TokenType,
  tokenValue: TokenValue
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
