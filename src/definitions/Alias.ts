export type AliasValue = `{${string}}`;

export type WithAliasValue<T> = T | AliasValue;

export const ALIAS_PATH_SEPARATOR = '.';
