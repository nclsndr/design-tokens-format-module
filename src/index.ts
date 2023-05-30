import { matchIsAlias } from './definitions/internals/alias.js';

export { parseDesignTokens } from './parseDesignTokens.js';
export { validateDesignTokenValue } from './utils/validateDesignTokenValue.js';
export { validateDesignTokenAndGroupName } from './utils/validateDesignTokenAndGroupName.js';

export const matchIsDesignTokenAlias = matchIsAlias;

export * from './types/index.js';
