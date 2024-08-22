import { withBaseURI } from './internals/withBaseURI.js';

export const groupJSONSchema = {
  $id: withBaseURI('/group'),
  type: 'object',
  properties: {
    $type: { $ref: withBaseURI('/treeNode/tokenTypeName') },
    $description: { $ref: withBaseURI('/treeNode/description') },
    $extensions: { $ref: withBaseURI('/treeNode/extensions') },
  },
  additionalProperties: {
    $ref: withBaseURI('/tokenTree#/additionalProperties'),
  },
};
