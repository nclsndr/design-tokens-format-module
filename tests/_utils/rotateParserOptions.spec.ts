import { describe, expect, it, afterEach, vi } from 'vitest';

import {
  generateParserOptions,
  rotateParserOptions,
  // @ts-ignore - function is non rootDir on purpose
} from './rotateParserOptions.js';

describe.concurrent('generateParserOptions', () => {
  it('Should rotate all default keys', async () => {
    const allOptions = generateParserOptions();
    expect(allOptions).toEqual([
      {
        resolveAliases: false,
        publishMetadata: false,
      },
      {
        resolveAliases: true,
        publishMetadata: false,
      },
      {
        resolveAliases: false,
        publishMetadata: true,
      },
      {
        resolveAliases: true,
        publishMetadata: true,
      },
    ]);
  });
  it('Should rotate custom keys', async () => {
    const allOptions = generateParserOptions(
      // @ts-ignore
      ['one', 'two', 'three']
    );
    expect(allOptions).toEqual([
      { one: false, two: false, three: false },
      { one: true, two: false, three: false },
      { one: false, two: true, three: false },
      { one: true, two: true, three: false },
      { one: false, two: false, three: true },
      { one: true, two: false, three: true },
      { one: false, two: true, three: true },
      { one: true, two: true, three: true },
    ]);
  });
  it('Should rotate with fixed values', async () => {
    const allOptions = generateParserOptions(
      // @ts-ignore
      ['one', 'two', 'three'],
      { one: true }
    );
    expect(allOptions).toEqual([
      { one: true, two: false, three: false },
      { one: true, two: true, three: false },
      { one: true, two: false, three: true },
      { one: true, two: true, three: true },
    ]);
  });
});

describe.concurrent('rotateParserOptions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('Should rotate all default keys', async () => {
    const mockFn = vi.fn();
    const allOptions = generateParserOptions();
    const expectedOccurrences = allOptions.length;
    const occurrences = rotateParserOptions(mockFn);
    expect(occurrences).toEqual(expectedOccurrences);
    expect(mockFn).toHaveBeenCalledTimes(expectedOccurrences);
  });
  it('Should rotate with one forced key', async () => {
    const mockFn = vi.fn();
    const allOptions = generateParserOptions(
      ['resolveAliases', 'publishMetadata'],
      {
        resolveAliases: true,
      }
    );
    const expectedOccurrences = allOptions.length;

    const occurrences = rotateParserOptions(mockFn, {
      resolveAliases: true,
    });
    expect(occurrences).toEqual(expectedOccurrences);
    expect(mockFn).toHaveBeenCalledTimes(expectedOccurrences);
  });
});
