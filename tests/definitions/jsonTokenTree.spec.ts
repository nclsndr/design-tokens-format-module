import { describe, it, expect } from 'vitest';

import { JSONTokenTree } from '../../src/definitions/JSONTokenTree.js';

describe('JSONTokenTree', () => {
  it('should accept a literal token tree', () => {
    const tree: JSONTokenTree = {
      colors: {
        $type: 'color',
        blue: {
          $value: '#0000ff',
        },
        lighten: {
          blue: {
            $value: '{colors.blue}',
          },
        },
      },
      red: {
        $type: 'color',
        $value: {
          colorSpace: 'srgb',
          components: [0, 0, 0],
        },
      },
    };

    expect(tree).toBeDefined();
  });
  it('should accept any of the token values when $type is not provided at the token level', () => {
    const tree: JSONTokenTree = {
      colors: {
        $type: 'color',
        blue: {
          $value: 'an invalid value',
        },
      },
      // @ts-expect-error
      red: {
        $type: 'color',
        $value: 'an invalid value',
      },
    };

    expect(tree).toBeDefined();
  });
  it('should accept a description and extensions at the root level', () => {
    const tree: JSONTokenTree = {
      $description: 'A description of the token tree',
      $extensions: {
        'com.example': true,
      },
    };

    expect(tree).toBeDefined();
  });
  it('should accept a token at the root level', () => {
    const tree: JSONTokenTree = {
      $type: 'color',
      $value: {
        colorSpace: 'srgb',
        components: [0, 0, 0],
        alpha: 1,
        hex: '#000000',
      },
    };

    expect(tree).toBeDefined();
  });
});
