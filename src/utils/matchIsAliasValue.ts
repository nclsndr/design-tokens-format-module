import { AliasValue } from '../definitions/Alias.js';

export function matchIsAliasValue(candidate: unknown): candidate is AliasValue {
  return (
    typeof candidate === 'string' &&
    candidate.startsWith('{') &&
    candidate.endsWith('}')
  );
}
