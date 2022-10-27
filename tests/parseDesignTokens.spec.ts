import { describe, it, expect } from 'vitest';

// @ts-ignore - function is non rootDir on purpose
import { rotateParserOptions } from './_utils/rotateParserOptions.js';

import { DesignTokenTree } from '../src/types/designTokenFormatModule.js';
import {
  ParseDesignTokensOptions,
  parseDesignTokens,
} from '../src/parseDesignTokens.js';

describe.concurrent('parseDesignTokens all `parserOptions` variants', () => {
  // const times = rotateParserOptions((parserOptions) => {});
  // expect.assertions(times);

  it('Should take empty object', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {};
      const result = parseDesignTokens(input, parserOptions);
      expect(result).toEqual(input);
    });

    expect.assertions(times);
  });
  it('Should return a nested empty object', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        aKey: {
          extraKey: {},
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        aKey: {
          // Publish metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'group',
            _path: ['aKey'],
          }),
          extraKey: {
            // Publish metadata
            ...(parserOptions.publishMetadata && {
              _kind: 'group',
              _path: ['aKey', 'extraKey'],
            }),
          },
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should fail parsing when group name contains "."', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        'a.key': {},
      };
      expect(() => {
        parseDesignTokens(input, parserOptions);
      }).toThrowError(`[
  {
    "code": "custom",
    "message": "Token or Group name cannot contain \\".\\", \\"{\\" and \\"}\\"",
    "path": []
  }
]`);
    });

    expect.assertions(times);
  });
  it('Should fail parsing when token name contains "."', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        colors: {
          $type: 'color',
          'a.key': {
            $value: '#000000',
          },
        },
      } as const;
      expect(() => {
        parseDesignTokens(input, parserOptions);
      }).toThrowError(`[
  {
    "code": "custom",
    "message": "Token or Group name cannot contain \\".\\", \\"{\\" and \\"}\\"",
    "path": []
  }
]`);
    });
    expect.assertions(times);
  });
  it('Should ignore any non-object key on a group', () => {
    const times = rotateParserOptions((parserOptions) => {
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
      const result = parseDesignTokens(input, parserOptions);
      expect(result['colors']).not.contains({
        someString: 'someString',
        someNumber: 42,
        someBoolean: true,
        someNull: null,
        someArray: [1, 2, 3],
      });
    });

    expect.assertions(times);
  });
  it('Should ignore extra keys on a token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: any = {
        'a-color': {
          $type: 'color',
          $value: '#000000',
          'some-extra-key': 'some-extra-value',
        },
      };
      const result = parseDesignTokens(input, parserOptions);

      expect((result['a-color'] as any).$type).toBe('color');
      expect((result['a-color'] as any).$value).toBe('#000000');
      expect(result['a-color']).not.contains({
        'some-extra-key': 'some-extra-value',
      });
    });
    expect.assertions(times * 3);
  });

  it('Should deduce JSON type of null', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'null-token': {
          $value: null,
          $description: 'This is a null value',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'null-token': {
          $type: 'null',
          $value: null,
          $description: 'This is a null value',

          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['null-token'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should deduce JSON type of string', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'string-token': {
          $value: 'string',
          $description: 'This is a string value',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'string-token': {
          $type: 'string',
          $value: 'string',
          $description: 'This is a string value',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['string-token'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should deduce JSON type of boolean', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'boolean-token': {
          $value: true,
          $description: 'This is a boolean value',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'boolean-token': {
          $type: 'boolean',
          $value: true,
          $description: 'This is a boolean value',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['boolean-token'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should deduce JSON type of custom object', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'object-literal-token': {
          $value: { dope: true, array: [1, 2, 3], object: { key: 'ok' } },
          $description: 'This is a custom object value',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'object-literal-token': {
          $type: 'object',
          $value: { dope: true, array: [1, 2, 3], object: { key: 'ok' } },
          $description: 'This is a custom object value',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['object-literal-token'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should deduce JSON type of custom array with alias', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'array-value-token': {
          $value: [{ dope: true }, [1, 2, 3]],
          $description: 'This is a custom array of objects value',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'array-value-token': {
          $type: 'array',
          $value: [{ dope: true }, [1, 2, 3]],
          $description: 'This is a custom array of objects value',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['array-value-token'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });

  it('Should infer a JSON String $type if not given otherwise', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        'string-token': {
          $value: 'a value',
        },
      } as const;
      const result = parseDesignTokens(input, parserOptions);
      expect(result['string-token']).contains({
        $type: 'string',
        $value: 'a value',
      });
    });
    expect.assertions(times);
  });
  it('Should infer a JSON Number $type if not given otherwise', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        'number-token': {
          $value: 1,
        },
      } as const;
      const result = parseDesignTokens(input, parserOptions);
      expect(result['number-token']).contains({
        $type: 'number',
        $value: 1,
      });
    });
    expect.assertions(times);
  });
  it('Should infer a JSON Boolean $type if not given otherwise', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        'boolean-token': {
          $value: true,
        },
      } as const;
      const result = parseDesignTokens(input, parserOptions);
      expect(result['boolean-token']).contains({
        $type: 'boolean',
        $value: true,
      });
    });
    expect.assertions(times);
  });
  it('Should infer a JSON Null $type if not given otherwise', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        'null-token': {
          $value: null,
        },
      } as const;
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'null-token': {
          $type: 'null',
          $value: null,
          _kind: 'token',
          _path: ['null-token'],
        },
      };
      expect(result['null-token']).contains({
        $type: 'null',
        $value: null,
      });
    });
    expect.assertions(times);
  });
  it('Should infer a JSON Object $type if not given otherwise', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        'object-literal-token': {
          $value: {},
        },
      } as const;
      const result = parseDesignTokens(input, parserOptions);
      expect(result['object-literal-token']).toEqual(
        expect.objectContaining({
          $type: 'object',
          $value: expect.any(Object),
        })
      );
    });
    expect.assertions(times);
  });
  it('Should infer a JSON Array $type if not given otherwise', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        'array-literal-token': {
          $value: [],
        },
      };
      const result = parseDesignTokens(input, parserOptions);

      expect(result['array-literal-token']).toEqual(
        expect.objectContaining({
          $type: 'array',
          $value: expect.any(Array),
        })
      );
    });
    expect.assertions(times);
  });

  it('Should parse a color token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'a-color': {
          $type: 'color',
          $value: '#000000',
          $description: 'This is a color',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'a-color': {
          $type: 'color',
          $value: '#000000',
          $description: 'This is a color',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['a-color'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a dimension token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'dimension-basis': {
          $type: 'dimension',
          $value: '3px',
          $description: 'This is a dimension',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'dimension-basis': {
          $type: 'dimension',
          $value: '3px',
          $description: 'This is a dimension',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['dimension-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a string based fontFamily token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'fontFamily-basis': {
          $type: 'fontFamily',
          $value: 'Arial',
          $description: 'This is a fontFamily',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'fontFamily-basis': {
          $type: 'fontFamily',
          $value: 'Arial',
          $description: 'This is a fontFamily',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['fontFamily-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a string[] based fontFamily token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'fontFamily-basis': {
          $type: 'fontFamily',
          $value: ['Arial', 'sans-serif'],
          $description: 'This is a fontFamily',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'fontFamily-basis': {
          $type: 'fontFamily',
          $value: ['Arial', 'sans-serif'],
          $description: 'This is a fontFamily',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['fontFamily-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a string based fontWeight token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'fontWeight-basis': {
          $type: 'fontWeight',
          $value: 'light',
          $description: 'This is a fontWeight',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'fontWeight-basis': {
          $type: 'fontWeight',
          $value: 'light',
          $description: 'This is a fontWeight',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['fontWeight-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a number based fontWeight token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'fontWeight-basis': {
          $type: 'fontWeight',
          $value: 200,
          $description: 'This is a fontWeight',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'fontWeight-basis': {
          $type: 'fontWeight',
          $value: 200,
          $description: 'This is a fontWeight',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['fontWeight-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a duration token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'duration-basis': {
          $type: 'duration',
          $value: '200ms',
          $description: 'This is a duration',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'duration-basis': {
          $type: 'duration',
          $value: '200ms',
          $description: 'This is a duration',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['duration-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a cubicBezier token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'cubicBezier-basis': {
          $type: 'cubicBezier',
          $value: [0.3, 2, 0.5, 3],
          $description: 'This is a cubicBezier',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'cubicBezier-basis': {
          $type: 'cubicBezier',
          $value: [0.3, 2, 0.5, 3],
          $description: 'This is a cubicBezier',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['cubicBezier-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a shadow token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
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
      const result = parseDesignTokens(input, parserOptions);
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
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['shadow-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a string based strokeStyle token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'strokeStyle-basis': {
          $type: 'strokeStyle',
          $value: 'solid',
          $description: 'This is a strokeStyle',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'strokeStyle-basis': {
          $type: 'strokeStyle',
          $value: 'solid',
          $description: 'This is a strokeStyle',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['strokeStyle-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse an object based strokeStyle token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
        'strokeStyle-basis': {
          $type: 'strokeStyle',
          $value: {
            dashArray: ['1px'],
            lineCap: 'round',
          },
          $description: 'This is a strokeStyle',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'strokeStyle-basis': {
          $type: 'strokeStyle',
          $value: {
            dashArray: ['1px'],
            lineCap: 'round',
          },
          $description: 'This is a strokeStyle',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['strokeStyle-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a border token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
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
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'border-basis': {
          $type: 'border',
          $value: {
            color: '#36363600',
            width: '3px',
            style: 'solid',
          },
          $description: 'This is a border',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['border-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a transition token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
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
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'transition-basis': {
          $type: 'transition',
          $value: {
            duration: '100ms',
            delay: '0ms',
            timingFunction: [0.3, 2, 0.5, 3],
          },
          $description: 'This is a transition',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['transition-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a gradient token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
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
      const result = parseDesignTokens(input, parserOptions);
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
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['gradient-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should parse a typography token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input: DesignTokenTree = {
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
      const result = parseDesignTokens(input, parserOptions);
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
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['typography-basis'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });

  it('Should parse a group of colors', () => {
    const times = rotateParserOptions((parserOptions) => {
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
      const result = parseDesignTokens(input, parserOptions);
      const output = {
        colors: {
          $type: 'color',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'group',
            _path: ['colors'],
          }),
          primary: {
            $type: 'color',
            $value: '#000000',
            $description: 'This is a primary color',
            // If publishing extra metadata
            ...(parserOptions.publishMetadata && {
              _kind: 'token',
              _path: ['colors', 'primary'],
            }),
          },
          secondary: {
            $type: 'color',
            $value: '#ffffff',
            // If publishing extra metadata
            ...(parserOptions.publishMetadata && {
              _kind: 'token',
              _path: ['colors', 'secondary'],
            }),
          },
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should keep $description of a group', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        colors: {
          $type: 'color',
          $description: 'This is a group of colors',
        },
      } as const;

      const result = parseDesignTokens(input, parserOptions);
      const output = {
        colors: {
          $type: 'color',
          $description: 'This is a group of colors',
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'group',
            _path: ['colors'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
  });
  it('Should keep $description and $extensions of a token', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        'a-color': {
          $type: 'color',
          $value: '#000000',
          $description: 'This is a color token',
          $extensions: { 'com.nclsndr.customValue': 'some-value' },
        },
      } as const;

      const result = parseDesignTokens(input, parserOptions);
      const output = {
        'a-color': {
          $type: 'color',
          $value: '#000000',
          $description: 'This is a color token',
          $extensions: { 'com.nclsndr.customValue': 'some-value' },
          // If publishing extra metadata
          ...(parserOptions.publishMetadata && {
            _kind: 'token',
            _path: ['a-color'],
          }),
        },
      };
      expect(result).toEqual(output);
    });
    expect.assertions(times);
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
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        'primary-color': {
          $type: 'color',
          $value: 12,
        },
      } as const;
      expect(() => parseDesignTokens(input, parserOptions)).toThrow(
        `Expected string, received number`
      );
    });
    expect.assertions(times);
  });
  it('Should fail resolving an invalid border type with invalid value', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        'border-basis': {
          $type: 'border',
          $value: {
            color: 12,
          },
        },
      } as const;
      expect(() => parseDesignTokens(input, parserOptions)).toThrow(
        `Expected string, received number`
      );
    });
    expect.assertions(times);
  });

  it('Should fail resolving a non existing alias at top level', () => {
    const times = rotateParserOptions((parserOptions) => {
      const input = {
        color: {
          $type: 'color',
          $value: '{colors.primary}',
        },
      } as const;
      expect(() => parseDesignTokens(input, parserOptions)).toThrow(
        `Alias "${input.color.$value.slice(
          1,
          -1
        )}" not found in context: ${JSON.stringify(input, null, 2)}`
      );
    });
    expect.assertions(times);
  });
  it('Should fail resolving circular referencing aliases ON `parserOptions.resolveAliases: true`', async () => {
    const times = rotateParserOptions(
      (parserOptions) => {
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

        expect(() => parseDesignTokens(input, parserOptions)).toThrow(
          'Maximum call stack size exceeded'
        );
      },
      { resolveAliases: true }
    );
    expect.assertions(times);
  });

  it.todo('Should fail resolving circular referencing aliases', async () => {
    const times = rotateParserOptions((parserOptions) => {
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

      try {
        const rr = parseDesignTokens(input, parserOptions);
        // TODO @Nico: NO CONSOLE
        console.log('parserOptions:', parserOptions);
        console.log('rr:', rr);
      } catch (error) {
        // TODO @Nico: NO CONSOLE
        console.log('error:', error);
      }

      expect(() => parseDesignTokens(input, parserOptions)).toThrow(
        'Maximum call stack size exceeded'
      );
    });
    expect.assertions(times);
  });
});

describe.concurrent(
  'parseDesignTokens with options `publishMetadata: true` and `resolveAliases: true`',
  () => {
    const parserOptions: ParseDesignTokensOptions<true, true> = {
      resolveAliases: true,
      publishMetadata: true,
    };

    it('Should deduce JSON type of custom array with alias', () => {
      const input: DesignTokenTree = {
        'some-token': {
          $type: 'color',
          $value: '#000000',
        },
        'array-value-token': {
          $value: [{ dope: true }, '{some-token}', [1, 2, 3]],
          $description: 'This is a custom array of objects value',
        },
      };
      const result = parseDesignTokens(input, parserOptions);
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
      const result = parseDesignTokens(input, parserOptions);

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
      const result = parseDesignTokens(input, parserOptions);
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

      expect(() => parseDesignTokens(input, parserOptions)).toThrowError(
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
      const result = parseDesignTokens(input, parserOptions);
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
      const result = parseDesignTokens(input, parserOptions);
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

    it('Should work with example https://design-tokens.github.io/community-group/format/#example-advanced-composite-token-example', () => {
      const input = {
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
      } as const;
      const results = parseDesignTokens(input, parserOptions);

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
  }
);

describe.concurrent(
  'parseDesignTokens with options `publishMetadata: false` and `resolveAliases: false`',
  () => {
    const parserOptions: ParseDesignTokensOptions<false, false> = {
      resolveAliases: false,
      publishMetadata: false,
    };

    it('Should leave a simple alias untouched', () => {
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
      const result = parseDesignTokens(input, parserOptions);

      const output = {
        colors: {
          $type: 'color',
          primary: {
            $type: 'color',
            $value: '#000000',
            $description: 'This is a primary color',
          },
          secondary: {
            $type: 'color',
            $value: '{colors.primary}',
          },
        },
      };
      expect(result).toEqual(output);
    });
  }
);
