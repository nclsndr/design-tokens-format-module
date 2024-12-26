import type { JSONObject, JSONValue } from './JSONSignatures.js';

export type TokenSignature<Type extends string, Value extends JSONValue> = {
  $value: Value;
  $type?: Type;
  $deprecated?: boolean | string;
  $description?: string;
  $extensions?: JSONObject;
};
