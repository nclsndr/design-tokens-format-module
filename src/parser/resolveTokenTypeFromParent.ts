import { JSONObject, JSONValuePath } from '../utils/JSONDefinitions.js';
import { Result } from '@swan-io/boxed';
import {
  matchIsTokenTypeName,
  TokenTypeName,
} from '../definitions/tokenTypeNames.js';
import { ValidationError } from '../utils/validationError.js';
import { getJSONValue } from '../utils/getJSONValue.js';

export function resolveTokenTypeFromParent(
  tokenTree: JSONObject,
  path: JSONValuePath,
  originalPath: JSONValuePath = path,
): Result<TokenTypeName, Array<ValidationError>> {
  const result = getJSONValue(tokenTree, path);
  if (typeof result !== 'object') {
    return Result.Error([
      new ValidationError({
        type: 'Value',
        path,
        message: `Could not resolve $type for token at path: "${originalPath.join('.')}".`,
      }),
    ]);
  } else if (result && typeof result === 'object' && '$type' in result) {
    if (matchIsTokenTypeName(result.$type)) {
      return Result.Ok(result.$type);
    } else {
      return Result.Error([
        new ValidationError({
          type: 'Value',
          path,
          message: `Invalid $type "${result.$type}" for token at path: "${originalPath.join('.')}".`,
        }),
      ]);
    }
  }

  const nextParentPath = path.slice(0, -1);
  if (path.length === 0 && nextParentPath.length === 0) {
    return Result.Error([
      new ValidationError({
        type: 'Value',
        path,
        message: `Could not resolve $type up to root for token at path: "${originalPath.join('.')}".`,
      }),
    ]);
  }
  return resolveTokenTypeFromParent(tokenTree, nextParentPath, originalPath);
}
