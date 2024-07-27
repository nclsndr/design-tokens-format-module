import { Result } from '@swan-io/boxed';

import {
  parseTreeNode,
  parseTreeNodeDescription,
  parseTreeNodeExtensions,
} from './tree.js';
import { ValidationError } from '../utils/validationError.js';
import { parseTokenTypeName } from './tokenTypeNames.js';
import { AnalyzedGroup } from './AnalyzedGroup.js';
import { AnalyzerContext } from './AnalyzerContext.js';

export function parseGroup(
  value: object,
  ctx: AnalyzerContext,
): Result<AnalyzedGroup, Array<ValidationError>> {
  return parseTreeNode(value, ctx).flatMap((node) => {
    const { $type, $description, $extensions, ...rest } = node;

    const validationErrors: ValidationError[] = [];

    return Result.all([
      parseTokenTypeName($type, {
        allowUndefined: true,
        varName: `${ctx.varName}.$type`,
        path: ctx.path,
      }).tapError((e) => validationErrors.push(...e)),
      parseTreeNodeDescription($description, {
        varName: `${ctx.varName}.$description`,
      }).tapError((e) => validationErrors.push(...e)),
      parseTreeNodeExtensions($extensions, {
        varName: `${ctx.varName}.$extensions`,
      }).tapError((e) => validationErrors.push(...e)),
    ])
      .flatMap(([type, description, extensions]) => {
        return Result.Ok({
          path: ctx.path,
          tokenType: type,
          childrenCount: Object.keys(rest).length,
          description,
          extensions,
        });
      })
      .flatMapError((e) => {
        return Result.Error(validationErrors);
      });
  });
}
