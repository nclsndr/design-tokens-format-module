import { ALIAS_SEPARATOR } from './alias.js';

export type TreePath = string[];

export function serializeTreePath(path: TreePath) {
  return path.join(ALIAS_SEPARATOR);
}

export function deserializeTreePath(path: string) {
  return path.split(ALIAS_SEPARATOR);
}
