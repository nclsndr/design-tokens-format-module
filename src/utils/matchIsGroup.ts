import { JSONTokenTree } from '../definitions/JSONTokenTree.js';

export function matchIsGroup(value: unknown): value is JSONTokenTree {
  if (typeof value !== 'object') {
    return false;
  }
  if (value === null) {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }

  // A group never has a $value at the group-level
  if ('$value' in value) {
    return false;
  }

  // Disambiguate from "reference tokens" ({ "$ref": "#/path" })
  if ('$ref' in value) {
    const keys = Object.keys(value as Record<string, unknown>);
    const hasNonDollarKey = keys.some((k) => k.startsWith('$') === false);
    if (hasNonDollarKey === false) {
      return false;
    }
  }

  return true;
}
