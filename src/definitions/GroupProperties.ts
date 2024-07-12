import type { JSONObject } from './JSONSignatures.js';
import type { TokenTypeName } from './tokenTypes.js';

export type GroupProperties = {
  $type?: TokenTypeName;
  $description?: string;
  $extensions?: JSONObject;
};
