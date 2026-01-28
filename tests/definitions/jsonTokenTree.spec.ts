import { describe, it, expect } from 'vitest';

import { JSONTokenTree } from '../../src/definitions/JSONTokenTree.js';

describe('JSONTokenTree', () => {
  it('should accept a literal token tree', () => {
    const tree: JSONTokenTree = {
      colors: {
        $type: 'color',
        blue: {
          $value: {
            colorSpace: 'srgb',
            components: [0, 0, 1],
            hex: '#0000ff',
          },
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
  it('should accept 2025.10 group properties ($deprecated, $extends, $ref) and $root', () => {
    const tree: JSONTokenTree = {
      colors: {
        $type: 'color',
        $deprecated: 'Legacy group',
        $extends: '{baseColors}',
        $ref: '#/some/other/group',
        $root: {
          $value: {
            colorSpace: 'srgb',
            components: [1, 0, 0],
          },
        },
      },
    };

    expect(tree).toBeDefined();
  });
  it('should accept any token value when no $type is provided on the token or its parent group', () => {
    const tree: JSONTokenTree = {
      misc: {
        any: { $value: 'any string' },
        // Since this token is untyped, it can match any token signature value union
        // (e.g. `fontFamily` allows strings).
        another: { $value: 123 },
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
  it('should accept $root tokens at the group level', () => {
    const tree: JSONTokenTree = {
      spacing: {
        $type: 'dimension',
        $root: { $value: { value: 16, unit: 'px' } },
        small: { $value: { value: 8, unit: 'px' } },
      },
    };

    expect(tree).toBeDefined();
  });
});
