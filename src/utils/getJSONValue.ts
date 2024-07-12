import {
  JSONArray,
  JSONObject,
  JSONValue,
  JSONValuePath,
} from './JSONDefinitions.js';

export function getJSONValue(
  object: JSONArray | JSONObject,
  path: JSONValuePath,
): JSONValue | undefined {
  for (let p = 0; p < path.length; p++) {
    // @ts-expect-error
    const maybeValue = object[path[p]];
    object = maybeValue ? maybeValue : undefined;
  }
  return object;
}
