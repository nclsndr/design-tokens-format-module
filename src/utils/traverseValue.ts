export type JSONPrimitiveValue = string | number | boolean | null;
export type JSONObject = {
  [name: string]: JSONValue;
};
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitiveValue | JSONArray | JSONObject;

export function matchIsJSONValue(candidate: unknown): candidate is JSONValue {
  return (
    typeof candidate === 'string' ||
    typeof candidate === 'number' ||
    typeof candidate === 'boolean' ||
    candidate === null ||
    Array.isArray(candidate) ||
    (typeof candidate === 'object' && candidate !== null)
  );
}

export function traverseValue(
  value: unknown,
  callback: (data: JSONValue, path: Array<string>) => boolean | void,
  path: Array<string> = []
) {
  if (matchIsJSONValue(value)) {
    const shouldDive = callback(value, path) ?? true;
    if (!shouldDive) return;
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          traverseValue(item, callback, [...path, i + '']);
        });
      } else {
        Object.keys(value).forEach((key) => {
          traverseValue(value[key], callback, [...path, key]);
        });
      }
    }
  } else {
    throw new Error(
      `Invalid value: "${value}" of type "${typeof value}" at path "${path.join(
        '.'
      )}"`
    );
  }
}
