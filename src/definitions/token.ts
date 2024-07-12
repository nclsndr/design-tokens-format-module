import { Result } from '@swan-io/boxed';

import { ValidationError } from '../utils/validationError.js';
import { parseTokenTypeName } from './tokenTypeNames.js';
import {
  parseTreeNode,
  parseTreeNodeDescription,
  parseTreeNodeExtensions,
} from './tree.js';
import { parseAliasableStringValue } from './types/string.js';
import { parseAliasableNumberValue } from './types/number.js';
import { parseAliasableColorStringValue } from './types/color.js';
import { parseAliasableDimensionValue } from './types/dimension.js';
import { TokenSignature } from './TokenSignature.js';

export function getTokenValueParser(
  type: string,
): (
  value: unknown,
  ctx: { varName: string },
) => Result<any, ValidationError[]> {
  switch (type) {
    case 'number':
      return parseAliasableNumberValue;
    case 'string':
      return parseAliasableStringValue;
    case 'color':
      return parseAliasableColorStringValue;
    case 'dimension':
      return parseAliasableDimensionValue;
    default: {
      return () =>
        Result.Error([
          new ValidationError({
            type: 'Value',
            message: `Unknown $type value: "${type}".`,
          }),
        ]);
    }
  }
}

export function parseToken(
  value: object,
  ctx: { varName: string },
): Result<TokenSignature, ValidationError[]> {
  return parseTreeNode(value, ctx).flatMap((node) => {
    const { $type, $value, $description, $extensions, ...rest } = node;

    const validationErrors: ValidationError[] = [];

    // No extra properties allowed
    if (Object.keys(rest).length > 0) {
      validationErrors.push(
        new ValidationError({
          type: 'Value',
          message: `${ctx.varName} has unexpected properties: ${Object.entries(
            rest,
          )
            .map(([k, v]) => `"${k}": ${JSON.stringify(v)}`)
            .join(', ')}.`,
        }),
      );
    }

    if ($description) {
      parseTreeNodeDescription($description, {
        varName: `${ctx.varName}.$description`,
      }).tapError((e) => validationErrors.push(...e));
    }

    if ($extensions) {
      parseTreeNodeExtensions($extensions, {
        varName: `${ctx.varName}.$extensions`,
      }).tapError((e) => validationErrors.push(...e));
    }

    // Type and related value
    if (typeof $type === 'string') {
      parseTokenTypeName($type, { varName: `${ctx.varName}.$type` })
        .flatMap((type) =>
          getTokenValueParser(type)($value, {
            varName: `${ctx.varName}.$value`,
          }),
        )
        .tapError((e) => validationErrors.push(...e));
    } else {
      validationErrors.push(
        new ValidationError({
          type: 'Type',
          message: `${ctx.varName} must have a $type property.`,
        }),
      );
    }

    if (validationErrors.length > 0) {
      return Result.Error(validationErrors);
    }

    return Result.Ok(value as TokenSignature);
  });
}
