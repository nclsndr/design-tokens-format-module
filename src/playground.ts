const schemaBluePrint = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
};

export function makeSchema(
  schema: any,
  {
    dependencies = [],
  }: {
    dependencies?: any[];
  } = {},
) {
  const finalSchema = {
    ...schemaBluePrint,
    ...schema,
  };
  if (dependencies.length > 0) {
    finalSchema.$defs = dependencies[0];
  }
  return finalSchema;
}
