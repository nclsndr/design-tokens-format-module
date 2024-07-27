import { parseTreeNode } from '../definitions/tree.js';
import { traverseJSONValue } from '../utils/traverseJSONValue.js';
import { matchIsTokenSignature } from '../definitions/TokenSignature.js';
import { matchIsGroupSignature } from '../definitions/GroupSignature.js';
import { JSONPath } from '../definitions/JSONPath.js';
import {
  parseTokenTypeName,
  TokenTypeName,
} from '../definitions/tokenTypeNames.js';
import { parseRawToken } from '../definitions/index.js';
import { Result } from '@swan-io/boxed';
import { ValidationError } from '../utils/validationError.js';
import { parseGroup } from '../definitions/group.js';
import { AnalyzedToken } from '../definitions/AnalyzedToken.js';
import { resolveTokenTypeFromParent } from './resolveTokenTypeFromParent.js';
import { AnalyzedGroup } from '../definitions/AnalyzedGroup.js';
import { FORMATTING_CHARACTER_FOR_DEBUG } from '../definitions/formatting.js';

export type AnalyzedTokenResult = Result<AnalyzedToken, Array<ValidationError>>;
export type AnalyzedGroupResult = Result<AnalyzedGroup, Array<ValidationError>>;

export function analyzeJSONTree(tokenTree: unknown) {
  return parseTreeNode(tokenTree, { varName: 'tokenTree' }).flatMap(
    (jsonObject) => {
      const analyzedTokens: Array<AnalyzedTokenResult> = [];
      const analyzedGroups: Array<AnalyzedGroupResult> = [];

      traverseJSONValue(jsonObject, (value, rawPath) => {
        const path = new JSONPath(rawPath);

        if (matchIsTokenSignature(value)) {
          let resolvedTypeResult: Result<TokenTypeName, Array<ValidationError>>;
          if (value.$type) {
            resolvedTypeResult = parseTokenTypeName(value.$type, {
              allowUndefined: false,
              path,
              varName: `token: ${path.array.join(FORMATTING_CHARACTER_FOR_DEBUG)}`,
            });
          } else {
            resolvedTypeResult = resolveTokenTypeFromParent(
              jsonObject,
              path.parent,
            );
          }

          analyzedTokens.push(
            resolvedTypeResult.flatMap((resolvedType) =>
              parseRawToken(value, {
                varName: `token: ${path.array.join(FORMATTING_CHARACTER_FOR_DEBUG)}`,
                resolvedType,
                path,
              }),
            ),
          );

          return false;
        } else if (matchIsGroupSignature(value)) {
          analyzedGroups.push(
            parseGroup(value, {
              path,
              varName: `group: ${path.array.join(FORMATTING_CHARACTER_FOR_DEBUG)}`,
            }),
          );

          return true;
        }
        return false;
      });

      // Gather both valid and errored results
      return Result.Ok({
        analyzedTokens: analyzedTokens.reduce<
          [Array<AnalyzedToken>, Array<ValidationError>]
        >(
          (acc, res) => {
            res.isOk()
              ? acc[0].push(res.get())
              : acc[1].push(...res.getError());
            return acc;
          },
          [[], []],
        ),
        analyzedGroups: analyzedGroups.reduce<
          [Array<AnalyzedGroup>, Array<ValidationError>]
        >(
          (acc, res) => {
            res.isOk()
              ? acc[0].push(res.get())
              : acc[1].push(...res.getError());
            return acc;
          },
          [[], []],
        ),
      });
    },
  );
}
