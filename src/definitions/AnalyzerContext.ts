import { JSONPath } from './JSONPath.js';

export type AnalyzerContext = {
  varName: string;
  path: JSONPath;
};
