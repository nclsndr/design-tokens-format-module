import type { JSONObject, JSONValue } from './JSONSignatures.js';

export type DeprecatedValue = boolean | string;

/**
 * JSON Pointer reference (RFC 6901), used by the format module `$ref`.
 *
 * Note: spec examples use internal pointers like "#/path/to/node".
 * TODO @Nico consider allowing full URI refs if spec expands beyond JSON Pointers.
 */
export type JSONPointer = `#/${string}`;

type BaseSignature<Type extends string> = {
  $type?: Type;
  $deprecated?: DeprecatedValue;
  $description?: string;
  $extensions?: JSONObject;
};

type ValueSignature<Type extends string, Value extends JSONValue> = BaseSignature<Type> & {
  $value: Value;
  $ref?: undefined;
};

type RefSignature<Type extends string> = BaseSignature<Type> & {
  $ref: JSONPointer;
  $value?: undefined;
};

export type TokenSignature<Type extends string, Value extends JSONValue> =
  | ValueSignature<Type, Value>
  | RefSignature<Type>;
