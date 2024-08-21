import { describe, it, expect, vi } from 'vitest';

import { traverseJSONValue } from '../../src/utils/traverseJSONValue.js';

describe('traverseJSONValue', () => {
  it('should traverse a string', () => {
    const callback = vi.fn();
    traverseJSONValue('hello', callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('hello', []);
  });
  it('should traverse a number', () => {
    const callback = vi.fn();
    traverseJSONValue(12, callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(12, []);
  });
  it('should traverse a boolean', () => {
    const callback = vi.fn();
    traverseJSONValue(true, callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(true, []);
  });
  it('should traverse an null', () => {
    const callback = vi.fn();
    traverseJSONValue(null, callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, []);
  });
  it('should deeply traverse an array of primitives', () => {
    const shouldDive = vi.fn(() => true);
    const callback = shouldDive;

    traverseJSONValue([1, 'two', true, null], callback);

    expect(callback).toHaveBeenCalledTimes(5);
    expect(callback).toHaveBeenCalledWith([1, 'two', true, null], []);
    expect(callback).toHaveBeenCalledWith(1, [0]);
    expect(callback).toHaveBeenCalledWith('two', [1]);
    expect(callback).toHaveBeenCalledWith(true, [2]);
    expect(callback).toHaveBeenCalledWith(null, [3]);
  });
  it('should deeply traverse an array of arrays and objects', () => {
    const shouldDive = vi.fn(() => true);
    const callback = shouldDive;

    traverseJSONValue([1, 'two', true, null, [1, 2], { a: true, 100: true }], callback);

    expect(callback).toHaveBeenCalledTimes(11);
    expect(callback).toHaveBeenCalledWith(
      [1, 'two', true, null, [1, 2], { a: true, 100: true }],
      [],
    );
    expect(callback).toHaveBeenCalledWith(1, [0]);
    expect(callback).toHaveBeenCalledWith('two', [1]);
    expect(callback).toHaveBeenCalledWith(true, [2]);
    expect(callback).toHaveBeenCalledWith(null, [3]);
    expect(callback).toHaveBeenCalledWith([1, 2], [4]);
    expect(callback).toHaveBeenCalledWith({ a: true, 100: true }, [5]);
    expect(callback).toHaveBeenCalledWith(1, [4, 0]);
    expect(callback).toHaveBeenCalledWith(2, [4, 1]);
    expect(callback).toHaveBeenCalledWith(true, [5, 'a']);
    expect(callback).toHaveBeenCalledWith(true, [5, '100']);
  });

  it('should deeply traverse an object of primitives if the callback returns void', () => {
    const shouldDive = vi.fn(() => {});
    const callback = shouldDive;

    traverseJSONValue({ a: 1, b: 'two', c: true, 100: null }, callback);

    expect(callback).toHaveBeenCalledTimes(5);
    expect(callback).toHaveBeenCalledWith({ a: 1, b: 'two', c: true, 100: null }, []);
    expect(callback).toHaveBeenCalledWith(1, ['a']);
    expect(callback).toHaveBeenCalledWith('two', ['b']);
    expect(callback).toHaveBeenCalledWith(true, ['c']);
    expect(callback).toHaveBeenCalledWith(null, ['100']);
  });
  it('should deeply traverse an object of primitives if the callback returns true', () => {
    const shouldDive = vi.fn(() => true);
    const callback = shouldDive;

    traverseJSONValue({ a: 1, b: 'two', c: true, d: null }, callback);

    expect(callback).toHaveBeenCalledTimes(5);
    expect(callback).toHaveBeenCalledWith({ a: 1, b: 'two', c: true, d: null }, []);
    expect(callback).toHaveBeenCalledWith(1, ['a']);
    expect(callback).toHaveBeenCalledWith('two', ['b']);
    expect(callback).toHaveBeenCalledWith(true, ['c']);
    expect(callback).toHaveBeenCalledWith(null, ['d']);
  });
  it('should shallow traverse an object of primitives if the callback returns false', () => {
    const shouldDiveAtOneLevelOfDepth = vi.fn((value, path) => {
      const depth = path.length;
      return depth < 1;
    });
    const callback = shouldDiveAtOneLevelOfDepth;

    traverseJSONValue({ a: { nested: { object: 'value' } } }, callback);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith({ a: { nested: { object: 'value' } } }, []);
    expect(callback).toHaveBeenCalledWith({ nested: { object: 'value' } }, ['a']);
  });
  it('should traverse an object based on the callback return value', () => {
    const given = {
      a: {
        isValid: true,
        value: {
          a1: {
            isValid: true,
          },
          a2: {
            isValid: false,
          },
        },
      },
      b: {
        isValid: false,
        value: {
          b1: {
            isValid: true,
          },
        },
      },
    };

    const spied = vi.fn((value, path) => {
      if (path.length === 0) return true;
      if (typeof value === 'object' && value !== null && 'isValid' in value) {
        return value.isValid as boolean;
      }
      return false;
    });

    traverseJSONValue(given, spied);

    expect(spied).toHaveBeenCalledTimes(5);
    expect(spied).toHaveBeenCalledWith(given, []);
    expect(spied).toHaveBeenCalledWith(given.a, ['a']);
    expect(spied).toHaveBeenCalledWith(given.a.isValid, ['a', 'isValid']);
    expect(spied).toHaveBeenCalledWith(given.a.value, ['a', 'value']);
    expect(spied).toHaveBeenCalledWith(given.b, ['b']);
  });

  it('should fail trying to traverse an undefined', () => {
    const callback = vi.fn();
    expect(() =>
      traverseJSONValue(
        // @ts-expect-error
        undefined,
        callback,
      ),
    ).toThrow('JSONValue is undefined');
  });
});
