import { JSONPath } from './JSONPath.js';
import { TokenTypeName } from './tokenTypeNames.js';
import { JSONValuePath } from '../utils/JSONDefinitions.js';

export type AnalyzedValue<Raw = unknown> = {
  raw: Raw;
  toReferences: Array<{ to: JSONValuePath }>;
};

export type AnalyzedToken<
  Type extends TokenTypeName = TokenTypeName,
  Value = unknown,
> = {
  path: JSONPath;
  resolvedType: Type;
  type: Type | undefined;
  value: AnalyzedValue<Value>;
  description: string | undefined;
  extensions: Record<string, any> | undefined;
};
