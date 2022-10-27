import { JSONTypeName } from '../types/designTokenFormatModule.js';

export function inferJSONValueType(value: unknown): JSONTypeName {
  if (value === null) {
    return 'null';
  } else if (Array.isArray(value)) {
    return 'array';
  } else if (typeof value === 'object') {
    return 'object';
  } else if (typeof value === 'string') {
    return 'string';
  } else if (typeof value === 'number') {
    return 'number';
  } else if (typeof value === 'boolean') {
    return 'boolean';
  } else {
    throw new Error(`Unexpected type "${typeof value}" of value "${value}"`);
  }
}
