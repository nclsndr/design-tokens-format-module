import { groupJSONSchema } from './group.js';
import { aliasValueJSONSchema } from './alias.js';
import {
  descriptionJSONSchema,
  extensionsJSONSchema,
  tokenTypeNameJSONSchema,
} from './treeNode.js';
import { tokenTreeJSONSchema } from './tokenTree.js';
import { allTokenJSONSchemas, allTokenValueJSONSchemas } from './tokens.js';

export const allJSONSchemas = [
  tokenTypeNameJSONSchema,
  descriptionJSONSchema,
  extensionsJSONSchema,
  aliasValueJSONSchema,
  tokenTreeJSONSchema,
  groupJSONSchema,
  ...allTokenJSONSchemas,
  ...allTokenValueJSONSchemas,
];
