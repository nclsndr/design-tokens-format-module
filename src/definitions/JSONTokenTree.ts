import type { DesignToken } from './tokenTypes.js';
import type { GroupProperties } from './GroupProperties.js';

export type JSONTokenTree = {
  [key: string]: DesignToken | JSONTokenTree | GroupProperties;
} & GroupProperties;
