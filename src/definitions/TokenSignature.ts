import { TokenTypeName } from './tokenTypeNames.js';
import { JSONObject, JSONValue } from '../utils/JSONDefinitions.js';

export type TokenSignature<
  Type extends TokenTypeName = TokenTypeName,
  Value extends JSONValue = JSONValue,
> = {
  $value: Value;
  $type: Type;
  $description?: string;
  $extensions?: JSONObject;
};

export function matchIsTokenSignature(value: unknown): value is TokenSignature {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    '$value' in value
  );
}
