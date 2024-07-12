import { Result } from '@swan-io/boxed';

import {
  parseTreeNode,
  parseTreeNodeDescription,
  parseTreeNodeExtensions,
} from './tree.js';
import { ValidationError } from '../utils/validationError.js';
import { GroupProperties } from './GroupSignature.js';
import { parseTokenTypeName } from './tokenTypeNames.js';

export function parseGroup(value: object, ctx: { varName: string }) {
  return parseTreeNode(value, ctx).flatMap((node) => {
    const { $type, $description, $extensions, ...rest } = node;

    const properties: GroupProperties = {};
    const validationErrors: ValidationError[] = [];

    if ($type) {
      parseTokenTypeName($type, { varName: `${ctx.varName}.$type` })
        .tapOk((v) => {
          properties.$type = v;
        })
        .tapError((e) => validationErrors.push(...e));
    }

    if ($description) {
      parseTreeNodeDescription($description, {
        varName: `${ctx.varName}.$description`,
      })
        .tapOk((v) => {
          properties.$description = v;
        })
        .tapError((e) => validationErrors.push(...e));
    }

    if ($extensions) {
      parseTreeNodeExtensions($extensions, {
        varName: `${ctx.varName}.$extensions`,
      })
        .tapOk((v) => {
          properties.$extensions = v;
        })
        .tapError((e) => validationErrors.push(...e));
    }

    if (validationErrors.length > 0) {
      return Result.Error(validationErrors);
    }

    return Result.Ok(properties);
  });
}
