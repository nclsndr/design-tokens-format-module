import { describe, expect, it } from 'vitest';

// @ts-ignore - function is non rootDir on purpose
import { rotateParserOptions } from './_utils/rotateParserOptions.js';

import { resolveAlias } from '../src/parseDesignTokens.js';

describe.concurrent('resolveAlias', () => {
  it('Should resolve a simple alias object on `options.resolveAliases: true`', () => {
    const times = rotateParserOptions(
      (parserOptions) => {
        const rawAlias = '{entry}';
        const context = {
          entry: {
            $type: 'color',
            $value: '#000000',
          },
        } as const;
        const results = resolveAlias(rawAlias, parserOptions, context);
        expect(results).toEqual({
          ...context.entry,
          // Publish metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'alias',
            _name: 'entry',
            _path: ['entry'],
          }),
        });
      },
      {
        resolveAliases: true,
      }
    );
    expect.assertions(times);
  });
  it('Should resolve a simple alias string on `options.resolveAliases: false`', () => {
    const times = rotateParserOptions(
      (parserOptions) => {
        const rawAlias = '{entry}';
        const context = {
          entry: {
            $type: 'color',
            $value: '#000000',
          },
        } as const;
        const results = resolveAlias(rawAlias, parserOptions, context);
        expect(results).toBe(rawAlias);
      },
      {
        resolveAliases: false,
      }
    );
    expect.assertions(times);
  });
  it('Should resolve a nested alias', () => {
    const times = rotateParserOptions(
      (parserOptions) => {
        const rawAlias = '{second}';
        const context = {
          first: {
            $type: 'color',
            $value: '#000000',
          },
          second: {
            $type: 'color',
            $value: '{first}',
          },
        } as const;
        const results = resolveAlias(rawAlias, parserOptions, context);
        expect(results).toEqual({
          $type: 'color',
          $value: {
            $type: 'color',
            $value: '#000000',
            // Publish metadata
            ...(parserOptions.publishMetadata && {
              _kind: 'alias',
              _path: ['first'],
              _name: 'first',
            }),
          },
          // Publish metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'alias',
            _path: ['second'],
            _name: 'second',
          }),
        });
      },
      {
        resolveAliases: true,
      }
    );
    expect.assertions(times);
  });
  it('Should fail trying to access to an undefined alias', () => {
    const times = rotateParserOptions(
      (parserOptions) => {
        const rawAlias = '{}';
        const context = {};
        expect(() => resolveAlias(rawAlias, parserOptions, context)).toThrow(
          `Alias "${rawAlias.slice(
            1,
            -1
          )}" not found in context: ${JSON.stringify(context)}`
        );
      },
      {
        resolveAliases: true,
      }
    );
    expect.assertions(times);
  });
});
