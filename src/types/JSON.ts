export type JSONString = string;
export type JSONNumber = number;
export type JSONBoolean = boolean;
export type JSONNull = null;
export type JSONArray = Array<JSONValue>;
export type JSONObject = { [key: string | number | symbol]: JSONValue };
export type JSONValue =
  | JSONString
  | JSONNumber
  | JSONBoolean
  | JSONNull
  | JSONObject
  | JSONArray;
