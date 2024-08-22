import { traverseJSONValue } from '../utils/traverseJSONValue.js';
import { allJSONSchemas } from './all.js';

const allJSONSchemasMap = new Map(
  allJSONSchemas.map((schema) => [schema.$id, schema]),
);

function resolveRef(ref: string) {
  const [base] = ref.split('#/');
  const foundSchema = allJSONSchemasMap.get(base);
  if (!foundSchema) {
    throw new Error(`Schema with $id ${ref} not found`);
  }
  return foundSchema;
}

function collectRefs(schema: any, initialRefIds: Set<string> = new Set()) {
  traverseJSONValue(schema, (value, path) => {
    if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      '$ref' in value &&
      typeof value.$ref === 'string'
    ) {
      collectRefs(resolveRef(value.$ref), initialRefIds).forEach((ref) => {
        initialRefIds.add(ref);
      });
      initialRefIds.add(value.$ref);
      return false;
    }
    return true;
  });

  return initialRefIds;
}

export function generateStandaloneSchema(schema: any) {
  const $defs = Array.from(collectRefs(schema)).map(($id) => resolveRef($id));

  return {
    ...schema,
    $defs,
  };
}
