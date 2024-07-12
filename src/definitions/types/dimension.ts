import { Result } from '@swan-io/boxed';

import { ValidationError } from '../../utils/validationError.js';
import { withAlias } from '../alias.js';
import { TokenSignature } from '../TokenSignature.js';
import { WithAliasValueSignature } from '../AliasValueSignature.js';

export type DimensionRawValue = `${number}px` | `${number}rem`;

export type DimensionToken = TokenSignature<
  'dimension',
  WithAliasValueSignature<DimensionRawValue>
>;

export const dimensionValuePattern = '^(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:px|rem)$';

export function parseDimensionStringRawValue(
  value: unknown,
  ctx: { varName: string },
): Result<DimensionRawValue, ValidationError[]> {
  if (typeof value !== 'string') {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        message: `${ctx.varName} must be a string. Got "${typeof value}".`,
      }),
    ]);
  }
  if (!value.match(dimensionValuePattern)) {
    return Result.Error([
      new ValidationError({
        type: 'Value',
        message: `${ctx.varName} must be a number followed by "px" or "rem". Got: "${value}".`,
      }),
    ]);
  }
  return Result.Ok(value as DimensionRawValue);
}

export const parseAliasableDimensionValue = withAlias(
  parseDimensionStringRawValue,
);
