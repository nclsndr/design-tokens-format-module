import { withBaseURI } from './internals/withBaseURI.js';
import { allTokenJSONSchemas } from './tokens.js';

export const tokenTreeJSONSchema = {
  $id: withBaseURI('/tokenTree'),
  title: 'Token tree',
  type: 'object',
  additionalProperties: {
    anyOf: [
      ...allTokenJSONSchemas.map((s) => ({ $ref: s.$id })),
      {
        $ref: withBaseURI('/group'),
      },
    ],
  },
};
