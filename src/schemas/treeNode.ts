import { withBaseURI } from './internals/withBaseURI.js';
import { tokenTypeNames } from '../definitions/tokenTypes.js';

export const tokenTypeNameJSONSchema = {
  $id: withBaseURI('/treeNode/tokenTypeName'),
  title: 'Token type',
  type: 'string',
  enum: tokenTypeNames,
};

export const descriptionJSONSchema = {
  $id: withBaseURI('/treeNode/description'),
  title: 'Description',
  type: 'string',
};

export const extensionsJSONSchema = {
  $id: withBaseURI('/treeNode/extensions'),
  title: 'Extensions',
  type: 'object',
};
