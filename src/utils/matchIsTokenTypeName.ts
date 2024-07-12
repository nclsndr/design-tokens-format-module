import { TokenTypeName, tokenTypeNames } from '../definitions/tokenTypes.js';

export function matchIsTokenTypeName(value: unknown): value is TokenTypeName {
  return (
    typeof value === 'string' && tokenTypeNames.includes(value as TokenTypeName)
  );
}
