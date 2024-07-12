import { JSONTokenTree } from '../definitions/JSONTokenTree.js';

export function matchIsGroup(value: unknown): value is JSONTokenTree {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !('$value' in value)
  );
}
