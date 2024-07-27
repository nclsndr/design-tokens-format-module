import { Result } from '@swan-io/boxed';
import { ValidationError } from '../utils/validationError.js';
import { JSONValuePath } from '../utils/JSONDefinitions.js';
import { AnalyzerContext } from './AnalyzerContext.js';

export const numberTokenTypeName = 'number';
export type NumberTokenType = typeof numberTokenTypeName;

export const stringTokenTypeName = 'string';
export type StringTokenType = typeof stringTokenTypeName;

export const colorTokenTypeName = 'color';
export type ColorTokenType = typeof colorTokenTypeName;

export const dimensionTokenTypeName = 'dimension';
export type DimensionTokenType = typeof dimensionTokenTypeName;

export const tokenTypeNames = [
  numberTokenTypeName,
  stringTokenTypeName,
  colorTokenTypeName,
  dimensionTokenTypeName,
] as const;

export type TokenTypeName =
  | NumberTokenType
  | StringTokenType
  | ColorTokenType
  | DimensionTokenType;

export function matchIsTokenTypeName(value: unknown): value is TokenTypeName {
  return (
    typeof value === 'string' && tokenTypeNames.includes(value as TokenTypeName)
  );
}

export function parseTokenTypeName<AllowUndefined extends boolean = false>(
  value: unknown,
  ctx: { allowUndefined: AllowUndefined } & AnalyzerContext,
): Result<
  AllowUndefined extends false ? TokenTypeName : TokenTypeName | undefined,
  ValidationError[]
> {
  if (ctx.allowUndefined && value === undefined) {
    return Result.Ok(
      undefined as AllowUndefined extends false
        ? TokenTypeName
        : TokenTypeName | undefined,
    );
  }
  if (matchIsTokenTypeName(value)) {
    return Result.Ok(value);
  }
  return Result.Error([
    new ValidationError({
      type: 'Value',
      path: ctx.path.array,
      message: `${ctx.varName} must be a value among: ${tokenTypeNames.map((v) => `"${v}"`).join(', ')}. Got "${value}".`,
    }),
  ]);
}
