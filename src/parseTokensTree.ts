import allLodash from 'lodash';

import {
  JSONObjectValue,
  TokenTree,
  TokenType,
  TokenValue,
} from './types/dtcg.js';
import { ConcreteTokenTree } from './types/concreteTree.js';
import { matchIsAlias } from './utils/matchIsAlias.js';
import { validateTokenValue } from './utils/validateTokenValue.js';
import { inferJSONValueType } from './utils/inferJSONValueType.js';

const { get } = allLodash;

function resolveAlias(
  rawAlias: string,
  parent?: TokenTree,
  context?: TokenTree
) {
  // rawAlias is like {colors.primary}
  const alias = rawAlias.slice(1, -1);
  const currentPath = alias.split('.');
  const foundEntry = get(context, alias) as TokenTree;
  if (foundEntry) {
    const currentKey = alias.split('.').pop();
    const parentPath = alias.split('.').slice(0, -1).join('.');
    const maybeParent =
      parentPath.length > 0
        ? (get(context, parentPath) as TokenTree)
        : undefined;

    const result = parseTokensTree(
      currentKey ? { [currentKey]: foundEntry } : {},
      maybeParent,
      context,
      currentPath
    ) as TokenTree;
    const formatted = Object.values(result)[0];

    return {
      ...formatted,
      _kind: 'alias' as const,
      _name: currentKey ?? null,
      _path: currentPath,
    };
  } else {
    throw new Error(
      `Alias "${alias}" not found in context: ${JSON.stringify(context)}`
    );
  }
}

function resolveObjectValue(
  value: Omit<TokenValue, string | symbol | number>,
  parent?: TokenTree,
  context?: TokenTree,
  path: Array<string> = []
): { [key: string]: TokenValue } {
  return Object.entries(value).reduce((acc, [key, value]) => {
    const currentPath = path.concat(key);
    if (matchIsAlias(value)) {
      return {
        ...acc,
        [key]: resolveAlias(value as string, parent, context),
      };
    } else if (Array.isArray(value)) {
      return {
        ...acc,
        [key]: resolveArrayValue(value, parent, context, currentPath),
      };
    } else if (value !== null && typeof value === 'object') {
      return {
        ...acc,
        [key]: resolveObjectValue(value, parent, context, currentPath),
      };
    } else {
      return {
        ...acc,
        [key]: value,
      };
    }
  }, {});
}

function resolveArrayValue(
  value: TokenValue[],
  parent?: TokenTree,
  context?: TokenTree,
  path: Array<string> = []
): TokenValue[] {
  return value.map((item, i) => {
    const currentPath = path.concat(`[${i}]`);
    if (matchIsAlias(item)) {
      return resolveAlias(item as string, parent, context);
    } else if (Array.isArray(item)) {
      return resolveArrayValue(item, parent, context, currentPath);
    } else if (item !== null && typeof item === 'object') {
      return resolveObjectValue(item, parent, context, currentPath);
    }

    return item;
  });
}

export function parseTokensTree(
  tokens: TokenTree,
  parent?: TokenTree,
  context?: TokenTree,
  path: Array<string> = []
): ConcreteTokenTree {
  if (!context) {
    context = tokens;
  }

  return Object.entries(tokens).reduce((acc, [name, value]) => {
    const { $type, $description, $value, $extensions, ...rest } = value as {
      $type?: TokenType;
      $description?: string;
      $value?: TokenValue;
      $extensions?: JSONObjectValue;
    };
    const currentPath = path.concat(name);

    let maybeType: TokenType | undefined;
    if ($type) {
      maybeType = $type;
    } else if (parent && parent.$type) {
      // From direct parent if exists
      maybeType = parent.$type as TokenType;
    }

    // A Token has a $value
    if ($value !== undefined) {
      const isAlias = matchIsAlias($value);

      let finalValue: TokenValue = $value;
      if (isAlias) {
        finalValue = resolveAlias($value as string, parent, context);
      } else if (Array.isArray($value)) {
        finalValue = resolveArrayValue($value, parent, context, currentPath);
      } else if ($value !== null && typeof $value === 'object') {
        finalValue = resolveObjectValue($value, parent, context, currentPath);
      }

      if (
        isAlias &&
        finalValue !== null &&
        typeof finalValue === 'object' &&
        '$type' in finalValue
      ) {
        if(maybeType === undefined) {
          maybeType = finalValue.$type as TokenType;
        } else if (maybeType !== finalValue.$type) {
          throw new Error(
            `Type mismatch: ${maybeType} !== ${finalValue.$type} at path "${currentPath.join('.')}"`
          );
        }
      }

      // We expect the process to have resolved the token $type at this stage
      if (maybeType === undefined) {
        maybeType = inferJSONValueType($value);
      }
      validateTokenValue(maybeType, $value);

      return {
        ...acc,
        [name]: {
          $type: maybeType,
          $value: finalValue,
          ...($description ? { $description } : {}),
          _kind: 'token' as const,
          _path: currentPath,
        },
      };
    } else {
      // A Group has NOT a $value
      const merged = Object.entries(rest).reduce(
        (acc, [k, v]) => ({
          ...acc,
          ...parseTokensTree(
            { [k]: v } as TokenTree,
            value as TokenTree,
            context,
            currentPath
          ),
        }),
        {}
      ) as TokenTree;
      return {
        ...acc,
        [name]: {
          ...(maybeType ? { $type: maybeType } : {}),
          ...($description ? { $description } : {}),
          ...($extensions ? { $extensions } : {}),
          _kind: 'group' as const,
          _path: currentPath,
          ...merged,
        },
      };
    }
  }, {});
}
