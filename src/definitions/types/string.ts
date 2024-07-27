import { Result } from '@swan-io/boxed';

import { ValidationError } from '../../utils/validationError.js';
import { WithAliasValueSignature } from '../AliasSignature.js';
import { TokenSignature } from '../TokenSignature.js';
import { AnalyzedValue } from '../AnalyzedToken.js';
import { withAlias } from '../alias.js';
import { AnalyzerContext } from '../AnalyzerContext.js';

export type StringRawValue = string;

export type StringToken = TokenSignature<
  'string',
  WithAliasValueSignature<StringRawValue>
>;

export function parseRawStringValue(
  value: unknown,
  ctx: AnalyzerContext,
): Result<AnalyzedValue<string>, ValidationError[]> {
  if (typeof value !== 'string') {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        path: ctx.path.array,
        message: `${ctx.varName} must be a string. Got "${typeof value}".`,
      }),
    ]);
  }
  return Result.Ok({
    raw: value,
    toReferences: [],
  });
}

export const parseAliasableStringValue = withAlias(parseRawStringValue);
