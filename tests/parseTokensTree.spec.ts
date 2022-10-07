import { describe, it, expect } from 'vitest';

import { TokenTree } from '../src/types/dtcg.js';
import { parseTokensTree } from '../src/parseTokensTree.js';

describe.concurrent('parseTokensTree', () => {
  it('should take empty object', () => {
    const result = parseTokensTree({});
    expect(result).toEqual({});
  });
  it('should return a nested empty object', () => {
    const input: TokenTree = {
      aKey: {
        extraKey: {},
      },
    };
    const result = parseTokensTree(input);
    const output = {
      aKey: {
        _kind: 'group',
        _path: ['aKey'],
        extraKey: {
          _kind: 'group',
          _path: ['aKey', 'extraKey'],
        },
      },
    };
    expect(result).toEqual(output);
  });
  it('should deduce JSON type of null', () => {
    const input: TokenTree = {
      'null-token': {
        $value: null,
        $description: 'This is a null value',
      },
    };
    const result = parseTokensTree(input);
    const output = {
      'null-token': {
        $type: 'Null',
        $value: null,
        $description: 'This is a null value',
        _kind: 'token',
        _path: ['null-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('should deduce JSON type of string', () => {
    const input: TokenTree = {
      'string-token': {
        $value: 'string',
        $description: 'This is a string value',
      },
    };
    const result = parseTokensTree(input);
    const output = {
      'string-token': {
        $type: 'String',
        $value: 'string',
        $description: 'This is a string value',
        _kind: 'token',
        _path: ['string-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('should deduce JSON type of boolean', () => {
    const input: TokenTree = {
      'boolean-token': {
        $value: true,
        $description: 'This is a boolean value',
      },
    };
    const result = parseTokensTree(input);
    const output = {
      'boolean-token': {
        $type: 'Boolean',
        $value: true,
        $description: 'This is a boolean value',
        _kind: 'token',
        _path: ['boolean-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('should deduce JSON type of custom object', () => {
    const input: TokenTree = {
      'object-literal-token': {
        $value: { dope: true, array: [1, 2, 3], object: { key: 'ok' } },
        $description: 'This is a custom object value',
      },
    };
    const result = parseTokensTree(input);
    const output = {
      'object-literal-token': {
        $type: 'Object',
        $value: { dope: true, array: [1, 2, 3], object: { key: 'ok' } },
        $description: 'This is a custom object value',
        _kind: 'token',
        _path: ['object-literal-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('should deduce JSON type of custom array', () => {
    const input: TokenTree = {
      'some-token': {
        $type: 'color',
        $value: '#000000',
      },
      'array-value-token': {
        $value: [{ dope: true }, '{some-token}', [1, 2, 3]],
        $description: 'This is a custom array of objects value',
      },
    };
    const result = parseTokensTree(input);
    const output = {
      'some-token': {
        $type: 'color',
        $value: '#000000',
        _kind: 'token',
        _path: ['some-token'],
      },
      'array-value-token': {
        $type: 'Array',
        $value: [
          { dope: true },
          {
            $type: 'color',
            $value: '#000000',
            _kind: 'alias',
            _name: 'some-token',
            _path: ['some-token'],
          },
          [1, 2, 3],
        ],
        $description: 'This is a custom array of objects value',
        _kind: 'token',
        _path: ['array-value-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('should parseTokensTree of a color', () => {
    const input: TokenTree = {
      'a-color': {
        $type: 'color',
        $value: '#000000',
        $description: 'This is a color',
      },
    };
    const result = parseTokensTree(input);
    const output = {
      'a-color': {
        $type: 'color',
        $value: '#000000',
        $description: 'This is a color',
        _kind: 'token',
        _path: ['a-color'],
      },
    };
    expect(result).toEqual(output);
  });
  it('should parseTokensTree of a border', () => {
    const input: TokenTree = {
      'border-basis': {
        $type: 'border',
        $value: {
          color: '#36363600',
          width: '3px',
          style: 'solid',
        },
        $description: 'This is a border',
      },
    };
    const result = parseTokensTree(input);
    const output = {
      'border-basis': {
        $type: 'border',
        $value: {
          color: '#36363600',
          width: '3px',
          style: 'solid',
        },
        $description: 'This is a border',
        _kind: 'token',
        _path: ['border-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('should parseTokensTree of a group of colors', () => {
    const input = {
      colors: {
        $type: 'color',
        primary: {
          $value: '#000000',
          $description: 'This is a primary color',
        },
        secondary: {
          $value: '#ffffff',
        },
      },
    } as const;
    const result = parseTokensTree(input);
    const output = {
      colors: {
        $type: 'color',
        _kind: 'group',
        _path: ['colors'],
        primary: {
          $type: 'color',
          $value: '#000000',
          $description: 'This is a primary color',
          _kind: 'token',
          _path: ['colors', 'primary'],
        },
        secondary: {
          $type: 'color',
          $value: '#ffffff',
          _kind: 'token',
          _path: ['colors', 'secondary'],
        },
      },
    };
    expect(result).toEqual(output);
  });
  it('Should infer a JSON String $type if not given otherwise', async () => {
    const input = {
      'string-token': {
        $value: 'a value',
      },
    } as const;
    const result = parseTokensTree(input);
    const output = {
      'string-token': {
        $type: 'String',
        $value: 'a value',
        _kind: 'token',
        _path: ['string-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should infer a JSON Number $type if not given otherwise', async () => {
    const input = {
      'number-token': {
        $value: 1,
      },
    } as const;
    const result = parseTokensTree(input);
    const output = {
      'number-token': {
        $type: 'Number',
        $value: 1,
        _kind: 'token',
        _path: ['number-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should infer a JSON Boolean $type if not given otherwise', async () => {
    const input = {
      'boolean-token': {
        $value: true,
      },
    } as const;
    const result = parseTokensTree(input);
    const output = {
      'boolean-token': {
        $type: 'Boolean',
        $value: true,
        _kind: 'token',
        _path: ['boolean-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should infer a JSON Null $type if not given otherwise', async () => {
    const input = {
      'null-token': {
        $value: null,
      },
    } as const;
    const result = parseTokensTree(input);
    const output = {
      'null-token': {
        $type: 'Null',
        $value: null,
        _kind: 'token',
        _path: ['null-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should infer a JSON Object $type if not given otherwise', async () => {
    const input = {
      'object-literal-token': {
        $value: {},
      },
    } as const;
    const result = parseTokensTree(input);
    const output = {
      'object-literal-token': {
        $type: 'Object',
        $value: {},
        _kind: 'token',
        _path: ['object-literal-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should infer a JSON Array $type if not given otherwise', async () => {
    const input = {
      'array-literal-token': {
        $value: [],
      },
    };
    const result = parseTokensTree(input);
    const output = {
      'array-literal-token': {
        $type: 'Array',
        $value: [],
        _kind: 'token',
        _path: ['array-literal-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('should resolve a simple alias', () => {
    const input = {
      colors: {
        $type: 'color',
        primary: {
          $value: '#000000',
          $description: 'This is a primary color',
        },
        secondary: {
          $value: '{colors.primary}',
        },
      },
    } as const;
    const result = parseTokensTree(input);

    const output = {
      colors: {
        $type: 'color',
        _kind: 'group',
        _path: ['colors'],
        primary: {
          $type: 'color',
          $value: '#000000',
          $description: 'This is a primary color',
          _kind: 'token',
          _path: ['colors', 'primary'],
        },
        secondary: {
          $type: 'color',
          $value: {
            $type: 'color',
            $value: '#000000',
            $description: 'This is a primary color',
            _kind: 'alias',
            _path: ['colors', 'primary'],
            _name: 'primary',
          },
          _kind: 'token',
          _path: ['colors', 'secondary'],
        },
      },
    };
    expect(result).toEqual(output);
  });
  it('should resolve a token $type based on its alias', () => {
    const input = {
      'base-colors': {
        $type: 'color',
        primary: {
          $value: '#000000',
          $description: 'This is a primary color',
        },
      },
      'another-color': {
        $value: '{base-colors.primary}',
      },
    } as const;
    const result = parseTokensTree(input);
    const output = {
      'base-colors': {
        $type: 'color',
        _kind: 'group',
        _path: ['base-colors'],
        primary: {
          $type: 'color',
          $value: '#000000',
          $description: 'This is a primary color',
          _kind: 'token',
          _path: ['base-colors', 'primary'],
        },
      },
      'another-color': {
        $type: 'color',
        $value: {
          $type: 'color',
          $value: '#000000',
          $description: 'This is a primary color',
          _kind: 'alias',
          _path: ['base-colors', 'primary'],
          _name: 'primary',
        },
        _kind: 'token',
        _path: ['another-color'],
      },
    };
    expect(result).toEqual(output);
  });
  it('should fail resolving a token $type based on its alias when not identical', () => {
    const input = {
      'base-colors': {
        $type: 'String',
        $value: 'a custom value',
      },
      'another-color': {
        $type: 'color',
        $value: '{base-colors}',
      },
    } as const;

    expect(() => parseTokensTree(input)).toThrowError('Type mismatch: color !== String at path "another-color"')
  });
  it('should resolve 6 aliases depth', () => {
    const input = {
      colors: {
        $type: 'color',
        primary: {
          $value: '#000000',
          $description: 'This is a primary color',
        },
        secondary: {
          $value: '{colors.primary}',
        },
        tertiary: {
          $value: '{colors.secondary}',
        },
        fourth: {
          $value: '{colors.tertiary}',
        },
        fith: {
          $value: '{colors.fourth}',
        },
        sixth: {
          $value: '{colors.fith}',
        },
      },
    } as const;
    const result = parseTokensTree(input);
    expect(result).toMatchSnapshot();
  });
  it('should resolve a gradient with aliases', () => {
    const input = {
      'brand-primary': {
        $type: 'color',
        $value: '#99ff66',
      },
      'position-end': {
        $type: 'Number',
        $value: 1,
      },
      'brand-in-the-middle': {
        $type: 'gradient',
        $value: [
          {
            color: '#000000',
            position: 0,
          },
          {
            color: '{brand-primary}',
            position: 0.5,
          },
          {
            color: '#000000',
            position: '{position-end}',
          },
        ],
      },
    } as const;
    const result = parseTokensTree(input);
    const output = {
      'brand-primary': {
        $type: 'color',
        $value: '#99ff66',
        _kind: 'token',
        _path: ['brand-primary'],
      },
      'position-end': {
        $type: 'Number',
        $value: 1,
        _kind: 'token',
        _path: ['position-end'],
      },
      'brand-in-the-middle': {
        $type: 'gradient',
        $value: [
          {
            color: '#000000',
            position: 0,
          },
          {
            color: {
              $type: 'color',
              $value: '#99ff66',
              _kind: 'alias',
              _path: ['brand-primary'],
              _name: 'brand-primary',
            },
            position: 0.5,
          },
          {
            color: '#000000',
            position: {
              $type: 'Number',
              $value: 1,
              _kind: 'alias',
              _path: ['position-end'],
              _name: 'position-end',
            },
          },
        ],
        _kind: 'token',
        _path: ['brand-in-the-middle'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should fail resolving a non existing alias at top level', async () => {
    const input = {
      color: {
        $type: 'color',
        $value: '{colors.primary}',
      },
    } as const;
    expect(() => parseTokensTree(input)).toThrow(
      `Alias "${input.color.$value.slice(
        1,
        -1
      )}" not found in context: ${JSON.stringify(input)}`
    );
  });
  it('Should fail resolving a token with an invalid $type', async () => {
    const input = {
      'invalid-token': {
        $type: 'invalid',
        $value: 0,
      },
    } as const;
    expect(() => parseTokensTree(input as any)).toThrow(`invalid_union`);
  });
  it('Should fail resolving an invalid color type with number value', async () => {
    const input = {
      'primary-color': {
        $type: 'color',
        $value: 12,
      },
    } as const;
    expect(() => parseTokensTree(input)).toThrow(
      `Expected string, received number`
    );
  });
  it('Should fail resolving an invalid border type with invalid value', async () => {
    const input = {
      'border-basis': {
        $type: 'border',
        $value: {
          color: 12,
        },
      },
    } as const;
    expect(() => parseTokensTree(input)).toThrow(
      `Expected string, received number`
    );
  });

  it('Should work with example https://design-tokens.github.io/community-group/format/#example-advanced-composite-token-example', async () => {
    const results = parseTokensTree({
      space: {
        small: {
          $type: 'dimension',
          $value: '0.5rem',
        },
      },

      color: {
        'shadow-050': {
          $type: 'color',
          $value: '#00000088',
        },
      },

      shadow: {
        medium: {
          $type: 'shadow',
          $description:
            'A composite token where some sub-values are references to tokens that have the correct type and others are explicit values',
          $value: {
            color: '{color.shadow-050}',
            offsetX: '{space.small}',
            offsetY: '{space.small}',
            blur: '1.5rem',
            spread: '0rem',
          },
        },
      },

      component: {
        card: {
          'box-shadow': {
            $description:
              'This token is an alias for the composite token {shadow.medium}',
            $value: '{shadow.medium}',
          },
        },
      },
    });

    expect(results).toEqual({
      space: {
        _kind: 'group',
        _path: ['space'],
        small: {
          $type: 'dimension',
          $value: '0.5rem',
          _kind: 'token',
          _path: ['space', 'small'],
        },
      },
      color: {
        _kind: 'group',
        _path: ['color'],
        'shadow-050': {
          $type: 'color',
          $value: '#00000088',
          _kind: 'token',
          _path: ['color', 'shadow-050'],
        },
      },
      shadow: {
        _kind: 'group',
        _path: ['shadow'],
        medium: {
          $type: 'shadow',
          $value: {
            color: {
              $type: 'color',
              $value: '#00000088',
              _kind: 'alias',
              _path: ['color', 'shadow-050'],
              _name: 'shadow-050',
            },
            offsetX: {
              $type: 'dimension',
              $value: '0.5rem',
              _kind: 'alias',
              _path: ['space', 'small'],
              _name: 'small',
            },
            offsetY: {
              $type: 'dimension',
              $value: '0.5rem',
              _kind: 'alias',
              _path: ['space', 'small'],
              _name: 'small',
            },
            blur: '1.5rem',
            spread: '0rem',
          },
          $description:
            'A composite token where some sub-values are references to tokens that have the correct type and others are explicit values',
          _kind: 'token',
          _path: ['shadow', 'medium'],
        },
      },
      component: {
        _kind: 'group',
        _path: ['component'],
        card: {
          _kind: 'group',
          _path: ['component', 'card'],
          'box-shadow': {
            $type: 'shadow',
            $value: {
              $type: 'shadow',
              $value: {
                color: {
                  $type: 'color',
                  $value: '#00000088',
                  _kind: 'alias',
                  _path: ['color', 'shadow-050'],
                  _name: 'shadow-050',
                },
                offsetX: {
                  $type: 'dimension',
                  $value: '0.5rem',
                  _kind: 'alias',
                  _path: ['space', 'small'],
                  _name: 'small',
                },
                offsetY: {
                  $type: 'dimension',
                  $value: '0.5rem',
                  _kind: 'alias',
                  _path: ['space', 'small'],
                  _name: 'small',
                },
                blur: '1.5rem',
                spread: '0rem',
              },
              $description:
                'A composite token where some sub-values are references to tokens that have the correct type and others are explicit values',
              _kind: 'alias',
              _path: ['shadow', 'medium'],
              _name: 'medium',
            },
            $description:
              'This token is an alias for the composite token {shadow.medium}',
            _kind: 'token',
            _path: ['component', 'card', 'box-shadow'],
          },
        },
      },
    });
  });
});
