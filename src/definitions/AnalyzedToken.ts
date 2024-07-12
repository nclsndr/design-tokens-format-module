import { JSONPath } from './JSONPath.js';
import { TokenTypeName } from './tokenTypeNames.js';
import { TokenSignature } from './TokenSignature.js';

export type AnalyzedToken = {
  path: JSONPath;
  resolvedType: TokenTypeName;
  raw: TokenSignature;
};
