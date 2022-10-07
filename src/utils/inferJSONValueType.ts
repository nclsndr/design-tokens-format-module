import { JSONTokenType } from '../types/dtcg.js';

export function inferJSONValueType(value: unknown): JSONTokenType {
  if (value === null) {
    return 'Null';
  } else if (Array.isArray(value)) {
    return 'Array';
  } else if (typeof value === 'object') {
    return 'Object';
  } else if (typeof value === 'string') {
    return 'String';
  } else if (typeof value === 'number') {
    return 'Number';
  } else if (typeof value === 'boolean') {
    return 'Boolean';
  } else {
    throw new Error(`Unexpected value type: ${typeof value}`);
  }
}
