import { createHash } from 'node:crypto';

import { JSONValue } from '../types/JSON.js';

export function hashTokenValue(...values: Array<JSONValue>) {
  const shasum = createHash('sha1');
  shasum.update(Buffer.from(values.map((v) => JSON.stringify(v)).join('')));
  return shasum.digest('hex');
}
