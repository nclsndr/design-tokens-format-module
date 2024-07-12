import { describe, it, expect } from 'vitest';
import {
  analyzeTree,
  resolveTokenTypeFromParents,
} from '../../src/parser/analyzeTree';

describe.concurrent('resolveTokenTypeFromParents', () => {
  it('should resolve a type at a given path', () => {
    const tree = {
      aGroup: {
        blue: {
          $value: '#0000ff',
          $type: 'color',
        },
      },
    };

    const result = resolveTokenTypeFromParents(tree, ['aGroup', 'blue']);

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toBe('color');
  });
  it('should resolve a type from a given path to the closest parent with a type', () => {
    const tree = {
      aGroup: {
        $type: 'color',
        aSubGroup: {
          blue: {
            $value: '#0000ff',
          },
        },
      },
    };

    const result = resolveTokenTypeFromParents(tree, [
      'aGroup',
      'aSubGroup',
      'blue',
    ]);

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toBe('color');
  });
  it('should resolve a type at the root level', () => {
    const tree = {
      aGroup: {
        blue: {
          $value: '#0000ff',
        },
      },
      $type: 'color',
    };

    const result = resolveTokenTypeFromParents(tree, ['aGroup', 'blue']);

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toBe('color');
  });
  it('should fail when no type is found up to the root level', () => {
    const tree = {
      aGroup: {
        blue: {
          $value: '#0000ff',
        },
      },
    };

    const result = resolveTokenTypeFromParents(tree, ['aGroup', 'blue']);

    expect(result.isError()).toBe(true);
    expect(result.isError() && result.getError()).toHaveLength(1);
    expect(result.isError() && result.getError()[0].message).toBe(
      'Could not resolve $type up to root for token at path: "aGroup.blue".',
    );
  });
});

describe.concurrent('analyzeTree', () => {
  it('should parse a simple token tree with groups and tokens', () => {
    const tree = {
      someColors: {
        $type: 'color',
        red: {
          $type: 'color',
          $value: '#ff0000',
        },
        blue: {
          $value: '#0000ff',
        },
      },
      someNumbers: {
        $type: 'number',
        one: {
          $type: 'dimension',
          $value: '12px',
        },
        two: {
          $value: 44,
        },
      },
    };

    const result = analyzeTree(tree);

    // TODO @Nico: NO CONSOLE
    console.log('result:', result);
  });
});
