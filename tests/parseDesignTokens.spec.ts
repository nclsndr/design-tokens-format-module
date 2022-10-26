import { describe, it, expect } from 'vitest';

import { TokenTree } from '../src/types/designTokenFormatModule.js';
import { parseDesignTokens, resolveAlias } from '../src/parseDesignTokens.js';

describe.concurrent('parseDesignTokens', () => {
  it('Should take empty object', () => {
    const result = parseDesignTokens({});
    expect(result).toEqual({});
  });
  it('Should return a nested empty object', () => {
    const input: TokenTree = {
      aKey: {
        extraKey: {},
      },
    };
    const result = parseDesignTokens(input);
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
  it('Should ignore any non-object key on a group', () => {
    const input: any = {
      colors: {
        $type: 'color',
        someObject: {
          isValidGroup: false,
        },
        someString: 'someString',
        someNumber: 42,
        someBoolean: true,
        someNull: null,
        someArray: [1, 2, 3],
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      colors: {
        $type: 'color',
        _kind: 'group',
        _path: ['colors'],
        someObject: {
          $type: 'color',
          _kind: 'group',
          _path: ['colors', 'someObject'],
        },
      },
    };
    expect(result).toEqual(output);
  });
  it('Should ignore extra keys on a token', () => {
    const input: any = {
      'a-color': {
        $type: 'color',
        $value: '#000000',
        'some-extra-key': 'some-extra-value',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'a-color': {
        $type: 'color',
        $value: '#000000',
        _kind: 'token',
        _path: ['a-color'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should fail parsing when group name contains "."', () => {
    const input = {
      'a.key': {},
    };
    expect(() => {
      parseDesignTokens(input);
    }).toThrowError(`[
  {
    "code": "custom",
    "message": "Token or Group name cannot contain \\".\\", \\"{\\" and \\"}\\"",
    "path": []
  }
]`);
  });
  it('Should fail parsing when token name contains "."', () => {
    const input = {
      colors: {
        $type: 'color',
        'a.key': {
          $value: '#000000',
        },
      },
    } as const;
    expect(() => {
      parseDesignTokens(input);
    }).toThrowError(`[
  {
    "code": "custom",
    "message": "Token or Group name cannot contain \\".\\", \\"{\\" and \\"}\\"",
    "path": []
  }
]`);
  });

  it('Should deduce JSON type of null', () => {
    const input: TokenTree = {
      'null-token': {
        $value: null,
        $description: 'This is a null value',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'null-token': {
        $type: 'null',
        $value: null,
        $description: 'This is a null value',
        _kind: 'token',
        _path: ['null-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should deduce JSON type of string', () => {
    const input: TokenTree = {
      'string-token': {
        $value: 'string',
        $description: 'This is a string value',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'string-token': {
        $type: 'string',
        $value: 'string',
        $description: 'This is a string value',
        _kind: 'token',
        _path: ['string-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should deduce JSON type of boolean', () => {
    const input: TokenTree = {
      'boolean-token': {
        $value: true,
        $description: 'This is a boolean value',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'boolean-token': {
        $type: 'boolean',
        $value: true,
        $description: 'This is a boolean value',
        _kind: 'token',
        _path: ['boolean-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should deduce JSON type of custom object', () => {
    const input: TokenTree = {
      'object-literal-token': {
        $value: { dope: true, array: [1, 2, 3], object: { key: 'ok' } },
        $description: 'This is a custom object value',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'object-literal-token': {
        $type: 'object',
        $value: { dope: true, array: [1, 2, 3], object: { key: 'ok' } },
        $description: 'This is a custom object value',
        _kind: 'token',
        _path: ['object-literal-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should deduce JSON type of custom array', () => {
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
    const result = parseDesignTokens(input);
    const output = {
      'some-token': {
        $type: 'color',
        $value: '#000000',
        _kind: 'token',
        _path: ['some-token'],
      },
      'array-value-token': {
        $type: 'array',
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
  it('Should infer a JSON String $type if not given otherwise', () => {
    const input = {
      'string-token': {
        $value: 'a value',
      },
    } as const;
    const result = parseDesignTokens(input);
    const output = {
      'string-token': {
        $type: 'string',
        $value: 'a value',
        _kind: 'token',
        _path: ['string-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should infer a JSON Number $type if not given otherwise', () => {
    const input = {
      'number-token': {
        $value: 1,
      },
    } as const;
    const result = parseDesignTokens(input);
    const output = {
      'number-token': {
        $type: 'number',
        $value: 1,
        _kind: 'token',
        _path: ['number-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should infer a JSON Boolean $type if not given otherwise', () => {
    const input = {
      'boolean-token': {
        $value: true,
      },
    } as const;
    const result = parseDesignTokens(input);
    const output = {
      'boolean-token': {
        $type: 'boolean',
        $value: true,
        _kind: 'token',
        _path: ['boolean-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should infer a JSON Null $type if not given otherwise', () => {
    const input = {
      'null-token': {
        $value: null,
      },
    } as const;
    const result = parseDesignTokens(input);
    const output = {
      'null-token': {
        $type: 'null',
        $value: null,
        _kind: 'token',
        _path: ['null-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should infer a JSON Object $type if not given otherwise', () => {
    const input = {
      'object-literal-token': {
        $value: {},
      },
    } as const;
    const result = parseDesignTokens(input);
    const output = {
      'object-literal-token': {
        $type: 'object',
        $value: {},
        _kind: 'token',
        _path: ['object-literal-token'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should infer a JSON Array $type if not given otherwise', () => {
    const input = {
      'array-literal-token': {
        $value: [],
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'array-literal-token': {
        $type: 'array',
        $value: [],
        _kind: 'token',
        _path: ['array-literal-token'],
      },
    };
    expect(result).toEqual(output);
  });

  it('Should parse a color token', () => {
    const input: TokenTree = {
      'a-color': {
        $type: 'color',
        $value: '#000000',
        $description: 'This is a color',
      },
    };
    const result = parseDesignTokens(input);
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
  it('Should parse a dimension token', () => {
    const input: TokenTree = {
      'dimension-basis': {
        $type: 'dimension',
        $value: '3px',
        $description: 'This is a dimension',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'dimension-basis': {
        $type: 'dimension',
        $value: '3px',
        $description: 'This is a dimension',
        _kind: 'token',
        _path: ['dimension-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse a string based fontFamily token', () => {
    const input: TokenTree = {
      'fontFamily-basis': {
        $type: 'fontFamily',
        $value: 'Arial',
        $description: 'This is a fontFamily',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'fontFamily-basis': {
        $type: 'fontFamily',
        $value: 'Arial',
        $description: 'This is a fontFamily',
        _kind: 'token',
        _path: ['fontFamily-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse a string[] based fontFamily token', () => {
    const input: TokenTree = {
      'fontFamily-basis': {
        $type: 'fontFamily',
        $value: ['Arial', 'sans-serif'],
        $description: 'This is a fontFamily',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'fontFamily-basis': {
        $type: 'fontFamily',
        $value: ['Arial', 'sans-serif'],
        $description: 'This is a fontFamily',
        _kind: 'token',
        _path: ['fontFamily-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse a string based fontWeight token', () => {
    const input: TokenTree = {
      'fontWeight-basis': {
        $type: 'fontWeight',
        $value: 'light',
        $description: 'This is a fontWeight',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'fontWeight-basis': {
        $type: 'fontWeight',
        $value: 'light',
        $description: 'This is a fontWeight',
        _kind: 'token',
        _path: ['fontWeight-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse a number based fontWeight token', () => {
    const input: TokenTree = {
      'fontWeight-basis': {
        $type: 'fontWeight',
        $value: 200,
        $description: 'This is a fontWeight',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'fontWeight-basis': {
        $type: 'fontWeight',
        $value: 200,
        $description: 'This is a fontWeight',
        _kind: 'token',
        _path: ['fontWeight-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse a duration token', () => {
    const input: TokenTree = {
      'duration-basis': {
        $type: 'duration',
        $value: '200ms',
        $description: 'This is a duration',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'duration-basis': {
        $type: 'duration',
        $value: '200ms',
        $description: 'This is a duration',
        _kind: 'token',
        _path: ['duration-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse a cubicBezier token', () => {
    const input: TokenTree = {
      'cubicBezier-basis': {
        $type: 'cubicBezier',
        $value: [0.3, 2, 0.5, 3],
        $description: 'This is a cubicBezier',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'cubicBezier-basis': {
        $type: 'cubicBezier',
        $value: [0.3, 2, 0.5, 3],
        $description: 'This is a cubicBezier',
        _kind: 'token',
        _path: ['cubicBezier-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse a shadow token', () => {
    const input: TokenTree = {
      'shadow-basis': {
        $type: 'shadow',
        $value: {
          color: '#000000',
          offsetX: '1px',
          offsetY: '1px',
          blur: '3px',
          spread: '4px',
        },
        $description: 'This is a shadow',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'shadow-basis': {
        $type: 'shadow',
        $value: {
          color: '#000000',
          offsetX: '1px',
          offsetY: '1px',
          blur: '3px',
          spread: '4px',
        },
        $description: 'This is a shadow',
        _kind: 'token',
        _path: ['shadow-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse a string based strokeStyle token', () => {
    const input: TokenTree = {
      'strokeStyle-basis': {
        $type: 'strokeStyle',
        $value: 'solid',
        $description: 'This is a strokeStyle',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'strokeStyle-basis': {
        $type: 'strokeStyle',
        $value: 'solid',
        $description: 'This is a strokeStyle',
        _kind: 'token',
        _path: ['strokeStyle-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse an object based strokeStyle token', () => {
    const input: TokenTree = {
      'strokeStyle-basis': {
        $type: 'strokeStyle',
        $value: {
          dashArray: ['1px'],
          lineCap: 'round',
        },
        $description: 'This is a strokeStyle',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'strokeStyle-basis': {
        $type: 'strokeStyle',
        $value: {
          dashArray: ['1px'],
          lineCap: 'round',
        },
        $description: 'This is a strokeStyle',
        _kind: 'token',
        _path: ['strokeStyle-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse a border token', () => {
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
    const result = parseDesignTokens(input);
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
  it('Should parse a transition token', () => {
    const input: TokenTree = {
      'transition-basis': {
        $type: 'transition',
        $value: {
          duration: '100ms',
          delay: '0ms',
          timingFunction: [0.3, 2, 0.5, 3],
        },
        $description: 'This is a transition',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'transition-basis': {
        $type: 'transition',
        $value: {
          duration: '100ms',
          delay: '0ms',
          timingFunction: [0.3, 2, 0.5, 3],
        },
        $description: 'This is a transition',
        _kind: 'token',
        _path: ['transition-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse a gradient token', () => {
    const input: TokenTree = {
      'gradient-basis': {
        $type: 'gradient',
        $value: [
          {
            color: '#000000',
            position: 0,
          },
          { color: '#DD5511', position: 0.8 },
        ],
        $description: 'This is a gradient',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'gradient-basis': {
        $type: 'gradient',
        $value: [
          {
            color: '#000000',
            position: 0,
          },
          { color: '#DD5511', position: 0.8 },
        ],
        $description: 'This is a gradient',
        _kind: 'token',
        _path: ['gradient-basis'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should parse a typography token', () => {
    const input: TokenTree = {
      'typography-basis': {
        $type: 'typography',
        $value: {
          fontFamily: 'Arial',
          fontSize: '12px',
          fontWeight: 'light',
          letterSpacing: '0',
          lineHeight: '0',
        },
        $description: 'This is a typography',
      },
    };
    const result = parseDesignTokens(input);
    const output = {
      'typography-basis': {
        $type: 'typography',
        $value: {
          fontFamily: 'Arial',
          fontSize: '12px',
          fontWeight: 'light',
          letterSpacing: '0',
          lineHeight: '0',
        },
        $description: 'This is a typography',
        _kind: 'token',
        _path: ['typography-basis'],
      },
    };
    expect(result).toEqual(output);
  });

  it('Should parse a group of colors', () => {
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
    const result = parseDesignTokens(input);
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
  it('Should keep $description of a group', () => {
    const input = {
      colors: {
        $type: 'color',
        $description: 'This is a group of colors',
      },
    } as const;

    const result = parseDesignTokens(input);
    const output = {
      colors: {
        $type: 'color',
        $description: 'This is a group of colors',
        _kind: 'group',
        _path: ['colors'],
      },
    };
    expect(result).toEqual(output);
  });
  it('Should keep $description and $extensions of a token', () => {
    const input = {
      'a-color': {
        $type: 'color',
        $value: '#000000',
        $description: 'This is a color token',
        $extensions: { 'com.nclsndr.customValue': 'some-value' },
      },
    } as const;

    const result = parseDesignTokens(input);
    const output = {
      'a-color': {
        $type: 'color',
        $value: '#000000',
        $description: 'This is a color token',
        $extensions: { 'com.nclsndr.customValue': 'some-value' },
        _kind: 'token',
        _path: ['a-color'],
      },
    };
    expect(result).toEqual(output);
  });

  it('Should resolve a simple alias', () => {
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
    const result = parseDesignTokens(input);

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
  it('Should resolve a token $type based on its alias', () => {
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
    const result = parseDesignTokens(input);
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
  it('Should fail resolving a token $type based on its alias when not identical', () => {
    const input = {
      'base-colors': {
        $type: 'string',
        $value: 'a custom value',
      },
      'another-color': {
        $type: 'color',
        $value: '{base-colors}',
      },
    } as const;

    expect(() => parseDesignTokens(input)).toThrowError(
      'Type mismatch: color !== string at path "another-color"'
    );
  });
  it('Should resolve 6 aliases depth', () => {
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
        fifth: {
          $value: '{colors.fourth}',
        },
        sixth: {
          $value: '{colors.fifth}',
        },
      },
    } as const;
    const result = parseDesignTokens(input);
    expect(result).toEqual({
      colors: {
        $type: 'color',
        _kind: 'group',
        _path: ['colors'],
        fifth: {
          $type: 'color',
          $value: {
            $type: 'color',
            $value: {
              $type: 'color',
              $value: {
                $type: 'color',
                $value: {
                  $description: 'This is a primary color',
                  $type: 'color',
                  $value: '#000000',
                  _kind: 'alias',
                  _name: 'primary',
                  _path: ['colors', 'primary'],
                },
                _kind: 'alias',
                _name: 'secondary',
                _path: ['colors', 'secondary'],
              },
              _kind: 'alias',
              _name: 'tertiary',
              _path: ['colors', 'tertiary'],
            },
            _kind: 'alias',
            _name: 'fourth',
            _path: ['colors', 'fourth'],
          },
          _kind: 'token',
          _path: ['colors', 'fifth'],
        },
        fourth: {
          $type: 'color',
          $value: {
            $type: 'color',
            $value: {
              $type: 'color',
              $value: {
                $description: 'This is a primary color',
                $type: 'color',
                $value: '#000000',
                _kind: 'alias',
                _name: 'primary',
                _path: ['colors', 'primary'],
              },
              _kind: 'alias',
              _name: 'secondary',
              _path: ['colors', 'secondary'],
            },
            _kind: 'alias',
            _name: 'tertiary',
            _path: ['colors', 'tertiary'],
          },
          _kind: 'token',
          _path: ['colors', 'fourth'],
        },
        primary: {
          $description: 'This is a primary color',
          $type: 'color',
          $value: '#000000',
          _kind: 'token',
          _path: ['colors', 'primary'],
        },
        secondary: {
          $type: 'color',
          $value: {
            $description: 'This is a primary color',
            $type: 'color',
            $value: '#000000',
            _kind: 'alias',
            _name: 'primary',
            _path: ['colors', 'primary'],
          },
          _kind: 'token',
          _path: ['colors', 'secondary'],
        },
        sixth: {
          $type: 'color',
          $value: {
            $type: 'color',
            $value: {
              $type: 'color',
              $value: {
                $type: 'color',
                $value: {
                  $type: 'color',
                  $value: {
                    $description: 'This is a primary color',
                    $type: 'color',
                    $value: '#000000',
                    _kind: 'alias',
                    _name: 'primary',
                    _path: ['colors', 'primary'],
                  },
                  _kind: 'alias',
                  _name: 'secondary',
                  _path: ['colors', 'secondary'],
                },
                _kind: 'alias',
                _name: 'tertiary',
                _path: ['colors', 'tertiary'],
              },
              _kind: 'alias',
              _name: 'fourth',
              _path: ['colors', 'fourth'],
            },
            _kind: 'alias',
            _name: 'fifth',
            _path: ['colors', 'fifth'],
          },
          _kind: 'token',
          _path: ['colors', 'sixth'],
        },
        tertiary: {
          $type: 'color',
          $value: {
            $type: 'color',
            $value: {
              $description: 'This is a primary color',
              $type: 'color',
              $value: '#000000',
              _kind: 'alias',
              _name: 'primary',
              _path: ['colors', 'primary'],
            },
            _kind: 'alias',
            _name: 'secondary',
            _path: ['colors', 'secondary'],
          },
          _kind: 'token',
          _path: ['colors', 'tertiary'],
        },
      },
    });
  });
  it('Should resolve a gradient with aliases', () => {
    const input = {
      'brand-primary': {
        $type: 'color',
        $value: '#99ff66',
      },
      'position-end': {
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
    const result = parseDesignTokens(input);
    const output = {
      'brand-primary': {
        $type: 'color',
        $value: '#99ff66',
        _kind: 'token',
        _path: ['brand-primary'],
      },
      'position-end': {
        $type: 'number',
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
              $type: 'number',
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
  it('Should fail resolving a non existing alias at top level', () => {
    const input = {
      color: {
        $type: 'color',
        $value: '{colors.primary}',
      },
    } as const;
    expect(() => parseDesignTokens(input)).toThrow(
      `Alias "${input.color.$value.slice(
        1,
        -1
      )}" not found in context: ${JSON.stringify(input)}`
    );
  });
  it('Should fail resolving circular referencing aliases', async () => {
    const input = {
      colors: {
        $type: 'color',
        primary: {
          $value: '{colors.secondary}',
        },
        secondary: {
          $value: '{colors.primary}',
        },
      },
    } as const;

    expect(() => parseDesignTokens(input)).toThrow(
      'Maximum call stack size exceeded'
    );
  });

  it('Should fail resolving a token with an invalid $type', () => {
    const input = {
      'invalid-token': {
        $type: 'invalid',
        $value: 0,
      },
    } as const;
    expect(() => parseDesignTokens(input as any)).toThrow(`invalid_union`);
  });
  it('Should fail resolving an invalid color type with number value', () => {
    const input = {
      'primary-color': {
        $type: 'color',
        $value: 12,
      },
    } as const;
    expect(() => parseDesignTokens(input)).toThrow(
      `Expected string, received number`
    );
  });
  it('Should fail resolving an invalid border type with invalid value', () => {
    const input = {
      'border-basis': {
        $type: 'border',
        $value: {
          color: 12,
        },
      },
    } as const;
    expect(() => parseDesignTokens(input)).toThrow(
      `Expected string, received number`
    );
  });

  it('Should work with example https://design-tokens.github.io/community-group/format/#example-advanced-composite-token-example', () => {
    const results = parseDesignTokens({
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

describe.concurrent('resolveAlias', () => {
  it('Should resolve a simple alias', () => {
    const rawAlias = '{entry}';
    const context = {
      entry: {
        $type: 'color',
        $value: '#000000',
      },
    } as const;
    const results = resolveAlias(rawAlias, context);
    expect(results).toEqual({
      ...context.entry,
      _kind: 'alias',
      _name: 'entry',
      _path: ['entry'],
    });
  });
  it('Should resolve a nested alias', () => {
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
    const results = resolveAlias(rawAlias, context);
    expect(results).toEqual({
      $type: 'color',
      $value: {
        $type: 'color',
        $value: '#000000',
        _kind: 'alias',
        _path: ['first'],
        _name: 'first',
      },
      _kind: 'alias',
      _path: ['second'],
      _name: 'second',
    });
  });
  it('Should fail trying to access to an undefined alias', () => {
    const rawAlias = '{}';
    const context = {};
    expect(() => resolveAlias(rawAlias, context)).toThrow(
      `Alias "${rawAlias.slice(1, -1)}" not found in context: ${JSON.stringify(
        context
      )}`
    );
  });
});
