import { describe, it, expect } from 'vitest';
import { hashTokenValue } from '../../src/utils/hashTokenValue.js';

describe('hashTokenValue', () => {
  it('Should hash null', () => {
    const result = hashTokenValue(null);
    expect(result).toMatchInlineSnapshot(
      '"2be88ca4242c76e8253ac62474851065032d6833"'
    );
  });
  it('Should hash a string value', () => {
    const result = hashTokenValue('a string value');
    expect(result).toMatchInlineSnapshot(
      '"95c8feb26ea6cba8d2ae1832253e377e8778a2ca"'
    );
  });
  it('Should hash a number value', () => {
    const result = hashTokenValue('a number value');
    expect(result).toMatchInlineSnapshot(
      '"a0277fa810727dfa0bc65218a72724d8265ba4ea"'
    );
  });
  it('Should hash a object literal value', () => {
    const result = hashTokenValue({ dope: true });
    expect(result).toMatchInlineSnapshot(
      '"64d620a8d52320548f399e2ae5d1fad740aa7e6d"'
    );
  });
  it('Should hash a array value', () => {
    const result = hashTokenValue([1, 2, 3]);
    expect(result).toMatchInlineSnapshot(
      '"9ef50cc82ae474279fb8e82896142702bccbb33a"'
    );
  });
  it('Should hash two values', () => {
    const result = hashTokenValue('one', 'two');
    expect(result).toMatchInlineSnapshot('"7fc87660c49692a9b11b02cb23cc478771ca3e3f"');
  });
});
