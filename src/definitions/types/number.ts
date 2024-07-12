import { Result } from '@swan-io/boxed';

import { ValidationError } from '../../utils/validationError.js';
import { withAlias } from '../alias.js';
import { TokenSignature } from '../TokenSignature.js';
import { WithAliasValueSignature } from '../AliasValueSignature.js';

export type NumberRawValue = number;

export type NumberToken = TokenSignature<
  'number',
  WithAliasValueSignature<NumberRawValue>
>;

export function parseNumberRawValue(
  value: unknown,
  ctx: { varName: string },
): Result<number, ValidationError[]> {
  if (typeof value !== 'number') {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        message: `${ctx.varName} must be a number. Got "${typeof value}".`,
      }),
    ]);
  }
  return Result.Ok(value);
}

export const parseAliasableNumberValue = withAlias(parseNumberRawValue);
