import { Result } from '@swan-io/boxed';

import { ValidationError } from '../../utils/validationError.js';
import { withAlias } from '../alias.js';
import { TokenSignature } from '../TokenSignature.js';
import { WithAliasValueSignature } from '../AliasSignature.js';
import { AnalyzedValue } from '../AnalyzedToken.js';
import { AnalyzerContext } from '../AnalyzerContext.js';

export type NumberRawValue = number;

export type NumberToken = TokenSignature<
  'number',
  WithAliasValueSignature<NumberRawValue>
>;

export function parseNumberRawValue(
  value: unknown,
  ctx: AnalyzerContext,
): Result<AnalyzedValue<number>, ValidationError[]> {
  if (typeof value !== 'number') {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        path: ctx.path.array,
        message: `${ctx.varName} must be a number. Got "${typeof value}".`,
      }),
    ]);
  }
  return Result.Ok({
    raw: value,
    toReferences: [],
  });
}

export const parseAliasableNumberValue = withAlias(parseNumberRawValue);
