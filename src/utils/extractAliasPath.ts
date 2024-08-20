import { ALIAS_PATH_SEPARATOR, AliasValue } from '../definitions/Alias.js';

function makeExtractAliasPath(hasString: boolean) {
  return function extractAliasPath(aliasValue: AliasValue) {
    const stringPath = aliasValue.slice(1).slice(0, -1);
    return hasString ? stringPath : stringPath.split(ALIAS_PATH_SEPARATOR);
  };
}

export const extractAliasPathAsString = makeExtractAliasPath(true);
export const extractAliasPathAsArray = makeExtractAliasPath(false);
