import { Result } from '@swan-io/boxed';
import { JSONObject } from '../utils/JSONDefinitions.js';
import { ValidationError } from '../utils/validationError.js';

export function parseTreeNode(
  value: unknown,
  ctx: { varName: string },
): Result<JSONObject, ValidationError[]> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        message: `${ctx.varName} must be an object. Got "${Array.isArray(value) ? 'array' : typeof value}".`,
      }),
    ]);
  }
  return Result.Ok(value as JSONObject);
}

export function parseTreeNodeExtensions(
  value: unknown,
  ctx: { varName: string },
): Result<JSONObject, ValidationError[]> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return Result.Error([
      new ValidationError({
        type: 'Type',
        message: `${ctx.varName} must be an object. Got "${typeof value}".`,
      }),
    ]);
  }
  return Result.Ok(value as JSONObject);
}

export function parseTreeNodeDescription(
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
