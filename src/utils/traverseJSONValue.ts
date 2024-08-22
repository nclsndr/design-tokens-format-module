import { JSONValue, JSONValuePath } from '../definitions/JSONSignatures.js';

export function traverseJSONValue(
  JSONValue: JSONValue,
  callback: (data: JSONValue, path: JSONValuePath) => boolean | void,
  path: JSONValuePath = [],
) {
  if (JSONValue === undefined) throw new Error('JSONValue is undefined');
  const shouldDive = callback(JSONValue, path) ?? true;
  if (!shouldDive) return;
  if (JSONValue !== null && typeof JSONValue === 'object') {
    if (Array.isArray(JSONValue)) {
      JSONValue.forEach((item, i) => {
        traverseJSONValue(item, callback, [...path, i]);
      });
    } else {
      Object.keys(JSONValue).forEach((key) => {
        traverseJSONValue(JSONValue[key], callback, [...path, key]);
      });
    }
  }
}
