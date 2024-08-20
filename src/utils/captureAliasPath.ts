import {
  extractAliasPathAsArray,
  extractAliasPathAsString,
} from './extractAliasPath.js';
import { matchIsAliasValue } from './matchIsAliasValue.js';

export const CAPTURE_ALIAS_PATH_ERRORS = [
  'TYPE_ERROR',
  'FORMAT_ERROR',
] as const;

type ValidationError = {
  tag: (typeof CAPTURE_ALIAS_PATH_ERRORS)[number];
  message: string;
};

type Result<T, E> =
  | {
      status: 'ok';
      value: T;
    }
  | {
      status: 'error';
      error: E;
    };

export function captureAliasPath(
  value: unknown,
): Result<Array<string>, ValidationError>;
export function captureAliasPath<AsString extends boolean | undefined>(
  value: unknown,
  asString: AsString,
): Result<AsString extends true ? string : Array<string>, ValidationError>;
export function captureAliasPath<AsString extends boolean | undefined>(
  value: unknown,
  asString?: AsString,
): Result<string | Array<string>, ValidationError> {
  if (typeof value !== 'string') {
    return {
      status: 'error',
      error: {
        tag: 'TYPE_ERROR',
        message: `Expected a string value. Got ${typeof value}.`,
      },
    };
  }

  if (!matchIsAliasValue(value)) {
    return {
      status: 'error',
      error: {
        tag: 'FORMAT_ERROR',
        message: `Expected a string value enclosed in curly braces, using dot notation: {path.to.token}. Got ${JSON.stringify(value)}.`,
      },
    };
  }

  return {
    status: 'ok',
    value: (asString !== true
      ? extractAliasPathAsArray(value)
      : extractAliasPathAsString(value)) as any,
  };
}
