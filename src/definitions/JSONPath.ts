import type { JSONValuePath } from '../utils/JSONDefinitions.js';

/**
 * A path is a sequence of strings and numbers that represent a path to a value in a JSON object.
 */
export class JSONPath {
  #array: JSONValuePath;
  #string: string;
  constructor(path: JSONValuePath) {
    this.#array = path;
    this.#string = path.join('');
  }

  get array() {
    return this.#array;
  }
  get string() {
    return this.#string;
  }
  get parent(): JSONValuePath {
    return this.#array.slice(0, -1);
  }
  set value(path: JSONValuePath) {
    this.#array = path;
    this.#string = path.join('');
  }

  toString() {
    return JSON.stringify({
      array: this.#array,
      string: this.#string,
    });
  }
  toJSON() {
    return {
      array: this.#array,
      string: this.#string,
    };
  }

  // Override console.log in Node.js environment
  [Symbol.for('nodejs.util.inspect.custom')](_depth: unknown, _opts: unknown) {
    return `Path{[${this.#array.map((v) => `"${v}"`).join(', ')}]}`;
  }
}
