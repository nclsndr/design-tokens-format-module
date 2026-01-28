import { TokenSignature } from '../definitions/TokenSignature.js';
import { TokenTypeName } from '../definitions/tokenTypes.js';
import { JSONValue } from '../definitions/JSONSignatures.js';

export function matchIsToken(
  value: unknown,
): value is TokenSignature<TokenTypeName, JSONValue> {
  if (typeof value !== 'object') {
    return false;
  }
  if (value === null) {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }

  // Standard token: object with a $value
  if ('$value' in value) {
    return true;
  }

  // Reference token: object with a $ref and only $-prefixed keys
  if (!('$ref' in value)) {
    return false;
  }

  const keys = Object.keys(value as Record<string, unknown>);
  const hasNonDollarKey = keys.some((k) => k.startsWith('$') === false);
  return hasNonDollarKey === false;
}
