import { Result } from '@swan-io/boxed';

import { ValidationError } from '../utils/validationError.js';
import { AliasValueSignature } from './AliasValueSignature.js';

export const ALIAS_SEPARATOR = '.';

export function parseAliasValue(
  value: unknown,
  ctx: { varName: string },
): Result<AliasValueSignature, ValidationError[]> {
  if (typeof value !== 'string') {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        message: `${ctx.varName} alias must be a string. Got "${typeof value}".`,
      }),
    ]);
  }
  if (!value.startsWith('{') || !value.endsWith('}')) {
    return Result.Error([
      new ValidationError({
        type: 'Value',
        message: `${ctx.varName} must be wrapped in curly braces to form an alias reference, like: "{my.alias}". Got "${value}".`,
      }),
    ]);
  }
  return Result.Ok(value as AliasValueSignature);
}

export function withAlias<R, E extends ValidationError[]>(
  parser: (value: unknown, ctx: { varName: string }) => Result<R, E>,
): (
  value: unknown,
  ctx: { varName: string },
) => Result<R | AliasValueSignature, E | ValidationError[]> {
  return (value: unknown, ctx: { varName: string }) =>
    parser(value, ctx).flatMapError((errors) =>
      parseAliasValue(value, ctx).mapError(
        // take parser errors first, then alias errors - avoiding duplicates
        (aliasErrors) => (errors.length > 0 ? errors : aliasErrors),
      ),
    );
}
