import { JSON_SCHEMA_BASE_URI } from '../constants.js';

export function withBaseURI(path: string) {
  if (path.startsWith('/') === false) {
    throw new Error(
      'Path must be absolute, thus starts with a forward slash (/).',
    );
  }
  return JSON_SCHEMA_BASE_URI + path;
}
