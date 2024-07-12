import { describe, it, expect } from 'vitest';
import { parseGroup } from '../../src/definitions/group';

describe('parseGroup', () => {
  it('should parse a group definition with description and extensions values', () => {
    const tree = {
      $description: 'A group of colors',
      $extensions: {
        'com.nclsndr.usage': 'background',
      },
      blue: {
        $value: '#0000ff',
        $type: 'color',
      },
    };

    const result = parseGroup(tree, { varName: 'aGroup' });

    expect(result.isOk()).toBe(true);
    expect(result.isOk() && result.get()).toStrictEqual({
      $description: 'A group of colors',
      $extensions: {
        'com.nclsndr.usage': 'background',
      },
    });
  });
  it('should fail when description is not a string', () => {
    const tree = {
      $type: 8,
      $description: 42,
      $extensions: {
        'com.nclsndr.usage': 'background',
      },
    };

    const result = parseGroup(tree, { varName: 'aGroup' });

    expect(result.isError()).toBe(true);
    expect(result.isError() && result.getError()).toHaveLength(1);
    expect(result.isError() && result.getError()[0].message).toBe(
      'aGroup.$description must be a string. Got "number".',
    );
  });
});
