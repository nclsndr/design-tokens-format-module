import { Result } from '@swan-io/boxed';

import { ValidationError } from '../utils/validationError.js';
import { parseTokenTypeName, TokenTypeName } from './tokenTypeNames.js';
import {
  parseTreeNode,
  parseTreeNodeDescription,
  parseTreeNodeExtensions,
} from './tree.js';
import { parseAliasableStringValue } from './types/string.js';
import { parseAliasableNumberValue } from './types/number.js';
import { parseAliasableColorStringValue } from './types/color.js';
import { parseAliasableDimensionValue } from './types/dimension.js';
import { JSONObject } from '../utils/JSONDefinitions.js';
import { AnalyzedToken, AnalyzedValue } from './AnalyzedToken.js';
import { AnalyzerContext } from './AnalyzerContext.js';

export function getTokenValueParser(
  type: string,
): (
  value: unknown,
  ctx: AnalyzerContext,
) => Result<AnalyzedValue, Array<ValidationError>> {
  switch (type) {
    case 'number':
      return parseAliasableNumberValue;
    case 'string':
      return parseAliasableStringValue;
    case 'color':
      return parseAliasableColorStringValue;
    case 'dimension':
      return parseAliasableDimensionValue;
    default: {
      return (_, ctx) =>
        Result.Error([
          new ValidationError({
            type: 'Value',
            path: ctx.path.array,
            message: `Unknown $type value: "${type}".`,
          }),
        ]);
    }
  }
}

export function parseRawToken(
  value: JSONObject,
  ctx: {
    resolvedType: TokenTypeName;
  } & AnalyzerContext,
): Result<AnalyzedToken, Array<ValidationError>> {
  return parseTreeNode(value, ctx).flatMap((node) => {
    const {
      $type, // only  for destructuring, ctx.resolvedType is used instead
      $value,
      $description,
      $extensions,
      ...rest
    } = node;

    // Accumulates validation errors
    const validationErrors: Array<ValidationError> = [];

    // No extra properties allowed
    if (Object.keys(rest).length > 0) {
      validationErrors.push(
        new ValidationError({
          type: 'Value',
          path: ctx.path.array,
          message: `${ctx.varName} has unexpected properties: ${Object.entries(
            rest,
          )
            .map(([k, v]) => `"${k}": ${JSON.stringify(v)}`)
            .join(', ')}.`,
        }),
      );
    }

    return Result.all([
      parseTokenTypeName(ctx.resolvedType, {
        allowUndefined: false,
        varName: `${ctx.varName}.$type`,
        path: ctx.path,
      })
        .tapError((e) => validationErrors.push(...e))
        .flatMap((type) =>
          getTokenValueParser(type)($value, {
            varName: `${ctx.varName}.$value`,
            path: ctx.path,
          })
            .map((value) => ({ type, value }))
            .tapError((e) => validationErrors.push(...e)),
        ),
      parseTreeNodeDescription($description, {
        varName: `${ctx.varName}.$description`,
      }).tapError((e) => validationErrors.push(...e)),
      parseTreeNodeExtensions($extensions, {
        varName: `${ctx.varName}.$extensions`,
      }).tapError((e) => validationErrors.push(...e)),
    ])
      .flatMap(([{ type, value }, description, extensions]) => {
        return Result.Ok({
          path: ctx.path,
          resolvedType: ctx.resolvedType,
          type,
          value,
          description,
          extensions,
        });
      })
      .flatMapError(() => Result.Error(validationErrors));
  });
}
