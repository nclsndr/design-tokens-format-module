import { Result } from '@swan-io/boxed';

import { ValidationError } from '../utils/validationError.js';
import { AliasValueSignature } from './AliasSignature.js';
import { AnalyzedValue } from './AnalyzedToken.js';
import { captureAliasPath } from './captureAliasPath.js';
import { JSONPath } from './JSONPath.js';
import { AnalyzerContext } from './AnalyzerContext.js';

export function validateAliasValue(
  value: unknown,
  ctx: AnalyzerContext,
): Result<AliasValueSignature, ValidationError[]> {
  if (typeof value !== 'string') {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        path: ctx.path.array,
        message: `${ctx.varName} alias must be a string. Got "${typeof value}".`,
      }),
    ]);
  }
  if (!value.startsWith('{') || !value.endsWith('}')) {
    return Result.Error([
      new ValidationError({
        type: 'Value',
        path: ctx.path.array,
        message: `${ctx.varName} must be wrapped in curly braces to form an alias reference, like: "{my.alias}". Got "${value}".`,
      }),
    ]);
  }
  return Result.Ok(value as AliasValueSignature);
}

export function withAlias<R extends AnalyzedValue, E extends ValidationError[]>(
  parser: (value: unknown, ctx: AnalyzerContext) => Result<R, E>,
): (
  value: unknown,
  ctx: AnalyzerContext,
) => Result<R | AnalyzedValue<AliasValueSignature>, E | ValidationError[]> {
  return (value: unknown, ctx: AnalyzerContext) =>
    validateAliasValue(value, ctx)
      .map((value) => ({
        raw: value,
        toReferences: captureAliasPath(value).match({
          Some: (path) => [{ to: path }],
          None: () => [],
        }),
      }))
      .flatMapError((aliasErrors) =>
        parser(value, ctx)
          // .map()
          .mapError((parserErrors) =>
            parserErrors.length > 0 ? parserErrors : aliasErrors,
          ),
      );
}
