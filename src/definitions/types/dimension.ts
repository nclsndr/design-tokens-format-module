import { Result } from '@swan-io/boxed';

import { ValidationError } from '../../utils/validationError.js';
import { withAlias } from '../alias.js';
import { TokenSignature } from '../TokenSignature.js';
import { WithAliasValueSignature } from '../AliasSignature.js';
import { AnalyzedValue } from '../AnalyzedToken.js';
import { AnalyzerContext } from '../AnalyzerContext.js';

export type DimensionRawValue = `${number}px` | `${number}rem`;

export type DimensionToken = TokenSignature<
  'dimension',
  WithAliasValueSignature<DimensionRawValue>
>;

export const dimensionValuePattern = '^(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:px|rem)$';

export function parseDimensionStringRawValue(
  value: unknown,
  ctx: AnalyzerContext,
): Result<AnalyzedValue<DimensionRawValue>, ValidationError[]> {
  if (typeof value !== 'string') {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        path: ctx.path.array,
        message: `${ctx.varName} must be a string. Got "${typeof value}".`,
      }),
    ]);
  }
  if (!value.match(dimensionValuePattern)) {
    return Result.Error([
      new ValidationError({
        type: 'Value',
        path: ctx.path.array,
        message: `${ctx.varName} must be a number followed by "px" or "rem". Got: "${value}".`,
      }),
    ]);
  }
  return Result.Ok({
    raw: value as DimensionRawValue,
    toReferences: [],
  });
}

export const parseAliasableDimensionValue = withAlias(
  parseDimensionStringRawValue,
);
