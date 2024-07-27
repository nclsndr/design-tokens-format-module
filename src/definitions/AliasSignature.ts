export type AliasValueSignature = `{${string}}`;

export type WithAliasValueSignature<T> = T | AliasValueSignature;

export const ALIAS_SEPARATOR = '.';
