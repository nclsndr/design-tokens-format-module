export type JSONPrimitiveValue = string | number | boolean | null;
export type JSONObject = {
  [name: string]: JSONValue;
};
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitiveValue | JSONArray | JSONObject;

export type JSONValuePath = Array<string | number>;

export namespace JSON {
  export type Value = JSONValue;
  export type Object = JSONObject;
  export type Array = JSONArray;
  export type Primitive = string | number | boolean | null;
  export type ValuePath = JSONValuePath;
}
