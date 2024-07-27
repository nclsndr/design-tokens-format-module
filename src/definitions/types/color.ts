import { withAlias } from '../alias.js';
import { Result } from '@swan-io/boxed';
import { ValidationError } from '../../utils/validationError.js';
import { TokenSignature } from '../TokenSignature.js';
import { WithAliasValueSignature } from '../AliasSignature.js';
import { AnalyzedValue } from '../AnalyzedToken.js';
import { AnalyzerContext } from '../AnalyzerContext.js';

export type ColorRawValue = `#${string}`;

export type ColorToken = TokenSignature<
  'color',
  WithAliasValueSignature<ColorRawValue>
>;

export const hexadecimalColorValuePattern =
  '^#(?:[0-9A-Fa-f]{8}|[0-9A-Fa-f]{6})$';

export function parseColorStringRawValue(
  value: unknown,
  ctx: AnalyzerContext,
): Result<AnalyzedValue<ColorRawValue>, ValidationError[]> {
  if (typeof value !== 'string') {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        path: ctx.path.array,
        message: `${ctx.varName} must be a string. Got "${typeof value}".`,
      }),
    ]);
  }
  if (!value.match(hexadecimalColorValuePattern)) {
    return Result.Error([
      new ValidationError({
        type: 'Value',
        path: ctx.path.array,
        message: `${ctx.varName} must start with "#" and have a length of 6 or 8. Got: "${value}".`,
      }),
    ]);
  }
  return Result.Ok({
    raw: value as ColorRawValue,
    toReferences: [],
  });
}

export const parseAliasableColorStringValue = withAlias(
  parseColorStringRawValue,
);
