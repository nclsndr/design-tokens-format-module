export { type AliasValue, ALIAS_PATH_SEPARATOR } from './definitions/Alias.js';
export { type JSON } from './definitions/JSONSignatures.js';
export { type JSONTokenTree } from './definitions/JSONTokenTree.js';
export {
  type Color,
  type Dimension,
  type FontFamily,
  type FontWeight,
  type Duration,
  type CubicBezier,
  type Number,
  type StrokeStyle,
  type Border,
  type Transition,
  type Shadow,
  type Gradient,
  type Typography,
  // Aggregated types
  type DesignToken,
  type TokenTypeName,
  // Types list
  tokenTypeNames,
  // Enum-like values
  fontWeightValues,
  strokeStyleStringValues,
  strokeStyleLineCapValues,
} from './definitions/tokenTypes.js';

export { matchIsAliasValue } from './utils/matchIsAliasValue.js';
export { matchIsGroup } from './utils/matchIsGroup.js';
export { matchIsToken } from './utils/matchIsToken.js';
export { matchIsTokenTypeName } from './utils/matchIsTokenTypeName.js';
