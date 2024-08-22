import { type TokenTypeName } from '../../definitions/tokenTypes.js';
import { capitalize } from '../../utils/capitalize.js';
import { withBaseURI } from './withBaseURI.js';

export function makeTokenValueJSONSchema({
  tokenType,
  description,
  rawValueSchema,
}: {
  tokenType: TokenTypeName;
  description: string;
  rawValueSchema: { [k: string]: any };
}) {
  const anyOf: any[] = [
    {
      $ref: withBaseURI('/alias/value'),
    },
  ];
  if ('anyOf' in rawValueSchema) {
    anyOf.push(...rawValueSchema.anyOf);
  } else {
    anyOf.push(rawValueSchema);
  }

  return {
    $id: withBaseURI(`/tokens/${tokenType}/value`),
    title: `${capitalize(tokenType)} value`,
    description: description,
    anyOf,
  };
}
