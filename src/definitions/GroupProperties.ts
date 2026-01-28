import type { JSONObject } from './JSONSignatures.js';
import type { TokenTypeName } from './tokenTypes.js';
import type { AliasValue } from './Alias.js';
import type { DeprecatedValue, JSONPointer } from './TokenSignature.js';

export type GroupProperties = {
  $type?: TokenTypeName;
  $description?: string;
  $deprecated?: DeprecatedValue;
  $extensions?: JSONObject;

  /**
   * Inheritance mechanism using alias syntax. See `$extends` examples in the spec.
   */
  $extends?: AliasValue;

  /**
   * Reference mechanism using JSON Pointer syntax. See `$ref` examples in the spec.
   */
  $ref?: JSONPointer;
};
