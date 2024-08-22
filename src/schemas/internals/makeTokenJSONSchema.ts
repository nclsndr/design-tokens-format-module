import type { TokenTypeName } from '../../definitions/tokenTypes.js';
import { withBaseURI } from './withBaseURI.js';
import { capitalize } from '../../utils/capitalize.js';

export function makeTokenJSONSchema({
  tokenType,
  description,
}: {
  tokenType: TokenTypeName;
  description: string;
}) {
  return {
    $id: withBaseURI(`/tokens/${tokenType}`),
    title: `${capitalize(tokenType)} token`,
    description,
    type: 'object',
    properties: {
      $type: { type: 'string', pattern: `^${tokenType}$` },
      $value: { $ref: withBaseURI(`/tokens/${tokenType}/value`) },
      $description: { $ref: withBaseURI('/treeNode/description') },
      $extensions: { $ref: withBaseURI('/treeNode/extensions') },
    },
    required: ['$value'],
    additionalProperties: false,
  };
}
