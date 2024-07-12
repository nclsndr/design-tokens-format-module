import { parseTreeNode } from '../definitions/tree.js';
import { traverseJSONValue } from '../utils/traverseJSONValue.js';
import { matchIsTokenSignature } from '../definitions/TokenSignature.js';
import {
  GroupProperties,
  matchIsGroupSignature,
} from '../definitions/GroupSignature.js';
import { JSONPath } from '../definitions/JSONPath.js';
import {
  matchIsTokenTypeName,
  TokenTypeName,
} from '../definitions/tokenTypeNames.js';
import { parseToken } from '../definitions/index.js';
import { Result } from '@swan-io/boxed';
import { ValidationError } from '../utils/validationError.js';
import { getJSONValue } from '../utils/getJSONValue.js';
import { JSONObject, JSONValuePath } from '../utils/JSONDefinitions.js';
import { parseGroup } from '../definitions/group.js';
import { AnalyzedToken } from '../definitions/AnalyzedToken.js';

export type AnalyzedGroup = {
  path: JSONPath;
  raw: GroupProperties;
};

export type AnalyzedTokenResult = Result<AnalyzedToken, Array<ValidationError>>;
export type AnalyzedGroupResult = Result<AnalyzedGroup, Array<ValidationError>>;

export function resolveTokenTypeFromParents(
  tokenTree: JSONObject,
  path: JSONValuePath,
  originalPath: JSONValuePath = path,
): Result<TokenTypeName, Array<ValidationError>> {
  const result = getJSONValue(tokenTree, path);
  if (typeof result !== 'object') {
    return Result.Error([
      new ValidationError({
        type: 'Value',
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
          message: `Invalid $type "${result.$type}" for token at path: "${originalPath.join('.')}".`,
        }),
      ]);
    }
  }

  const nextPath = path.slice(0, -1);
  if (path.length === 0 && nextPath.length === 0) {
    return Result.Error([
      new ValidationError({
        type: 'Value',
        message: `Could not resolve $type up to root for token at path: "${originalPath.join('.')}".`,
      }),
    ]);
  }
  return resolveTokenTypeFromParents(tokenTree, nextPath, originalPath);
}

export function analyzeTree(tokenTree: unknown) {
  return parseTreeNode(tokenTree, { varName: 'tokenTree' }).flatMap(
    (jsonObject) => {
      const analyzedTokens: Array<AnalyzedTokenResult> = [];
      const analyzedGroups: Array<AnalyzedGroupResult> = [];

      traverseJSONValue(jsonObject, (value, rawPath) => {
        const path = new JSONPath(rawPath);

        if (matchIsTokenSignature(value)) {
          let resolvedTypeResult: Result<TokenTypeName, any>;
          if (value.$type) {
            resolvedTypeResult = Result.Ok(value.$type);
          } else {
            resolvedTypeResult = resolveTokenTypeFromParents(
              jsonObject,
              path.parent,
            );
          }

          analyzedTokens.push(
            resolvedTypeResult.flatMap((resolvedType) =>
              parseToken(
                { ...value, $type: resolvedType },
                {
                  varName: `token: ${path.array.join('.')}`,
                },
              ).map((raw) => ({
                path,
                resolvedType,
                raw,
              })),
            ),
          );

          return false;
        } else if (matchIsGroupSignature(value)) {
          analyzedGroups.push(
            parseGroup(value, {
              varName: `group: ${path.array.join('.')}`,
            }).map((raw) => ({
              path,
              raw,
            })),
          );

          return true;
        }
        return false;
      });

      return Result.Ok({
        analyzedTokensResult: analyzedTokens
          .reduce<[Array<AnalyzedToken>, Array<ValidationError>]>(
            (acc, res) => {
              res.isOk()
                ? acc[0].push(res.get())
                : acc[1].push(...res.getError());
              return acc;
            },
            [[], []],
          )
          .reduce<Result<Array<AnalyzedToken>, Array<ValidationError>>>(
            (acc, c, i, xs) => {
              if (acc !== null) return acc;
              if (xs[1].length > 0) {
                // @ts-expect-error
                acc = Result.Error(xs[1]);
              } else {
                // @ts-expect-error
                acc = Result.Ok(xs[0]);
              }
              return acc;
            },
            null as any,
          ),
        analyzedGroupsResult: analyzedGroups
          .reduce<[Array<AnalyzedGroup>, Array<ValidationError>]>(
            (acc, res) => {
              res.isOk()
                ? acc[0].push(res.get())
                : acc[1].push(...res.getError());
              return acc;
            },
            [[], []],
          )
          .reduce<Result<Array<AnalyzedGroup>, Array<ValidationError>>>(
            (acc, c, i, xs) => {
              if (acc !== null) return acc;
              if (xs[1].length > 0) {
                // @ts-expect-error
                acc = Result.Error(xs[1]);
              } else {
                // @ts-expect-error
                acc = Result.Ok(xs[0]);
              }
              return acc;
            },
            null as any,
          ),
      });
    },
  );
}
