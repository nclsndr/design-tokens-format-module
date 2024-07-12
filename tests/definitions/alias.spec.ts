import { describe, it, expect } from 'vitest';
import { Result } from '@swan-io/boxed';

import { ValidationError } from '../../src/utils/validationError';
import { parseAliasValue, withAlias } from '../../src/definitions/alias';

describe.concurrent('alias', () => {
  describe.concurrent('parseAliasValue', () => {
    it('should parse a valid alias string value', () => {
      const result = parseAliasValue('{my.alias}', { varName: 'alias' });

      expect(result.isOk()).toBe(true);
      expect(result.isOk() && result.get()).toBe('{my.alias}');
    });
    it('should fail to parse without heading brace', () => {
      const result = parseAliasValue('my.alias}', { varName: 'Value' });

      expect(result.isError()).toBe(true);
      expect(result.isError() && result.getError()).toHaveLength(1);
      expect(result.isError() && result.getError()[0].message).toBe(
        'Value must be wrapped in curly braces to form an alias reference, like: "{my.alias}". Got "my.alias}".',
      );
    });
    it('should fail to parse without trailing brace', () => {
      const result = parseAliasValue('{my.alias', { varName: 'Value' });

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
        ctx: { varName: string },
      ): Result<any, ValidationError[]> {
        if (typeof value !== 'boolean') {
          return Result.Error([
            new ValidationError({
              type: 'Type',
              message: `${ctx.varName} must be a boolean. Got "${typeof value}".`,
            }),
          ]);
        }

        return Result.Ok(value);
      }

      const parseBool = withAlias(isBool);

      const result1 = parseBool('{my.alias}', { varName: 'alias' });

      expect(result1.isOk()).toBe(true);
      expect(result1.isOk() && result1.get()).toBe('{my.alias}');

      const result2 = parseBool(true, { varName: 'bool' });

      expect(result2.isOk()).toBe(true);
      expect(result2.isOk() && result2.get()).toBe(true);
    });
    it('should fail when the parsed data satisfy neither of the branches', () => {
      function isBool(
        value: unknown,
        ctx: { varName: string },
      ): Result<any, ValidationError[]> {
        if (typeof value !== 'boolean') {
          return Result.Error([
            new ValidationError({
              type: 'Type',
              message: `${ctx.varName} must be a boolean. Got "${typeof value}".`,
            }),
          ]);
        }

        return Result.Ok(value);
      }

      const parseBool = withAlias(isBool);

      const result1 = parseBool(42, { varName: 'alias' });

      expect(result1.isError()).toBe(true);
      expect(result1.isError() && result1.getError()).toHaveLength(2);

      const result2 = parseBool(42, { varName: 'bool' });

      expect(result2.isError()).toBe(true);
      expect(result2.isError() && result2.getError()).toHaveLength(2);
    });
  });
});
