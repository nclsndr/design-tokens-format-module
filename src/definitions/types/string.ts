import { Result } from '@swan-io/boxed';

import { ValidationError } from '../../utils/validationError.js';
import { WithAliasValueSignature } from '../AliasValueSignature.js';
import { TokenSignature } from '../TokenSignature.js';

export type StringRawValue = string;

export type StringToken = TokenSignature<
  'string',
  WithAliasValueSignature<StringRawValue>
>;

export function parseAliasableStringValue(
  value: unknown,
  ctx: { varName: string },
): Result<string, ValidationError[]> {
  if (typeof value !== 'string') {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        message: `${ctx.varName} must be a string. Got "${typeof value}".`,
      }),
    ]);
  }
  return Result.Ok(value);
}
