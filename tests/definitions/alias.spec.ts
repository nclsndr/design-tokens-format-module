import { describe, it, expect } from 'vitest';
import { Result } from '@swan-io/boxed';

import { ValidationError } from '../../src/utils/validationError';
import { validateAliasValue, withAlias } from '../../src/definitions/alias';
import { AnalyzedValue } from '../../src/definitions/AnalyzedToken';
import { JSONPath } from '../../src/definitions/JSONPath';
import { AnalyzerContext } from '../../src/definitions/AnalyzerContext';

describe.concurrent('alias', () => {
  describe.concurrent('parseAliasValue', () => {
    it('should parse a valid alias string value', () => {
      const result = validateAliasValue('{my.alias}', {
        varName: 'alias',
        path: JSONPath.fromJSONValuePath(['my', 'alias']),
      });

      expect(result.isOk()).toBe(true);
      expect(result.isOk() && result.get()).toBe('{my.alias}');
    });
    it('should fail to parse without heading brace', () => {
      const result = validateAliasValue('my.alias}', {
        varName: 'Value',
        path: JSONPath.fromJSONValuePath(['my', 'alias']),
      });

      expect(result.isError()).toBe(true);
      expect(result.isError() && result.getError()).toHaveLength(1);
      expect(result.isError() && result.getError()[0].message).toBe(
        'Value must be wrapped in curly braces to form an alias reference, like: "{my.alias}". Got "my.alias}".',
      );
    });
    it('should fail to parse without trailing brace', () => {
      const result = validateAliasValue('{my.alias', {
        varName: 'Value',
        path: JSONPath.fromJSONValuePath(['my', 'alias']),
      });

      expect(result.isError()).toBe(true);
      expect(result.isError() && result.getError()).toHaveLength(1);
      expect(result.isError() && result.getError()[0].message).toBe(
        'Value must be wrapped in curly braces to form an alias reference, like: "{my.alias}". Got "{my.alias".',
      );
    });
  });
  describe.concurrent('withAlias', () => {
    it('should wrap a parser to allow the union with alias signature', () => {
      function isBool(
        value: unknown,
        ctx: AnalyzerContext,
      ): Result<AnalyzedValue<boolean>, ValidationError[]> {
        if (typeof value !== 'boolean') {
          return Result.Error([
            new ValidationError({
              type: 'Type',
              path: ctx.path.array,
              message: `${ctx.varName} must be a boolean. Got "${typeof value}".`,
            }),
          ]);
        }

        return Result.Ok({
          raw: value,
          toReferences: [],
        });
      }

      const parseBool = withAlias(isBool);

      const result1 = parseBool('{my.alias}', {
        varName: 'alias',
        path: JSONPath.fromJSONValuePath(['alias']),
      });

      expect(result1.isOk()).toBe(true);
      expect(result1.isOk() && result1.get().raw).toEqual('{my.alias}');
      expect(result1.isOk() && result1.get().toReferences).toHaveLength(1);
      expect(result1.isOk() && result1.get().toReferences[0].to.string).toBe(
        'myalias',
      );

      const result2 = parseBool(true, {
        varName: 'bool',
        path: JSONPath.fromJSONValuePath(['bool']),
      });

      expect(result2.isOk()).toBe(true);
      expect(result2.isOk() && result2.get()).toStrictEqual({
        raw: true,
        toReferences: [],
      });
    });
    it('should fail when the parsed data satisfy neither of the branches', () => {
      function isBool(
        value: unknown,
        ctx: AnalyzerContext,
      ): Result<any, ValidationError[]> {
        if (typeof value !== 'boolean') {
          return Result.Error([
            new ValidationError({
              type: 'Type',
              path: ctx.path.array,
              message: `${ctx.varName} must be a boolean. Got "${typeof value}".`,
            }),
          ]);
        }

        return Result.Ok(value);
      }

      const parseBool = withAlias(isBool);

      const result1 = parseBool(42, {
        varName: 'aReferencingToken',
        path: JSONPath.fromJSONValuePath(['aReferencingToken']),
      });

      expect(result1.isError()).toBe(true);
      expect(result1.isError() && result1.getError()).toHaveLength(1);
      expect(result1.isError() && result1.getError()[0].message).toBe(
        'aReferencingToken must be a boolean. Got "number".',
      );

      const result2 = parseBool('a string', {
        varName: 'bool',
        path: JSONPath.fromJSONValuePath(['bool']),
      });

      expect(result2.isError()).toBe(true);
      expect(result2.isError() && result2.getError()).toHaveLength(1);
    });
  });
});
