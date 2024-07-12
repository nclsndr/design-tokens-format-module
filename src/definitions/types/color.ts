import { withAlias } from '../alias.js';
import { Result } from '@swan-io/boxed';
import { ValidationError } from '../../utils/validationError.js';
import { TokenSignature } from '../TokenSignature.js';
import { WithAliasValueSignature } from '../AliasValueSignature.js';

export type ColorRawValue = `#${string}`;

export type ColorToken = TokenSignature<
  'color',
  WithAliasValueSignature<ColorRawValue>
>;

export const hexadecimalColorValuePattern =
  '^#(?:[0-9A-Fa-f]{8}|[0-9A-Fa-f]{6})$';

export function parseColorStringRawValue(
  value: unknown,
  ctx: { varName: string },
): Result<ColorRawValue, ValidationError[]> {
  if (typeof value !== 'string') {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        message: `${ctx.varName} must be a string. Got "${typeof value}".`,
      }),
    ]);
  }
  if (!value.match(hexadecimalColorValuePattern)) {
    return Result.Error([
      new ValidationError({
        type: 'Value',
        message: `${ctx.varName} must start with "#" and have a length of 6 or 8. Got: "${value}".`,
      }),
    ]);
  }
  return Result.Ok(value as ColorRawValue);
}

export const parseAliasableColorStringValue = withAlias(
  parseColorStringRawValue,
);
