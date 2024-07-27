import { JSONPath } from './JSONPath.js';
import { TokenTypeName } from './tokenTypeNames.js';

export type AnalyzedGroup = {
  path: JSONPath;
  childrenCount: number;
  tokenType: TokenTypeName | undefined;
  description: string | undefined;
  extensions: Record<string, any> | undefined;
};
