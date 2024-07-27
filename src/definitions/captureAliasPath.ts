import { Option } from '@swan-io/boxed';
import { JSONValuePath } from '../utils/JSONDefinitions.js';
import { ALIAS_SEPARATOR } from './AliasSignature.js';

export function captureAliasPath(value: unknown): Option<JSONValuePath> {
  if (typeof value !== 'string') {
    return Option.None();
  }
  if (!value.startsWith('{') || !value.endsWith('}')) {
    return Option.None();
  }
  let cleanPath = value;
  if (value.startsWith('{')) {
    cleanPath = value.slice(1);
  }
  if (value.endsWith('}')) {
    cleanPath = cleanPath.slice(0, -1);
  }
  return Option.Some(cleanPath.split(ALIAS_SEPARATOR));
}
