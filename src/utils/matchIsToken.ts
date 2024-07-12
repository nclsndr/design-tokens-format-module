import { TokenSignature } from '../definitions/TokenSignature.js';
import { TokenTypeName } from '../definitions/tokenTypes.js';
import { JSONValue } from '../definitions/JSONSignatures.js';

export function matchIsToken(
  value: unknown,
): value is TokenSignature<TokenTypeName, JSONValue> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    '$value' in value
  );
}
