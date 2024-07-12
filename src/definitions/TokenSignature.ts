import type { JSONObject, JSONValue } from './JSONSignatures.js';

export type TokenSignature<Type extends string, Value extends JSONValue> = {
  $value: Value;
  $type?: Type;
  $description?: string;
  $extensions?: JSONObject;
};
