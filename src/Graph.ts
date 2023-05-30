import dlv from 'dlv';

import {
  JSONValue,
  matchIsJSONValue,
  traverseValue,
} from './utils/traverseValue.js';
import {
  matchIsMinimalDesignToken,
  MinimalDesignToken,
} from './utils/matchIsMinimalDesignToken.js';
import {
  CommonNodeProperties,
  validateCommonNodeProperties,
  validateDesignTokenName,
} from './definitions/internals/common.js';
import {
  DesignTokenType,
  validateDesignTokenType,
} from './definitions/designTokenTypes.js';
import {
  designTokenDefinitionsMap,
  PickDesignToken,
  PickDesignTokenDefinition,
} from './definitions/DesignToken.js';
import { matchIsDesignTokenAlias } from './index.js';
import {
  matchIsAlias,
  stripAliasSignature,
} from './definitions/internals/alias.js';
import {
  deserializeTreePath,
  serializeTreePath,
} from './definitions/internals/treePath.js';

class Node {
  public readonly graph: Graph;
  public readonly path: string[];
  public readonly name: string;
  public readonly description: CommonNodeProperties['$description'];
  public readonly extensions: CommonNodeProperties['$extensions'];

  constructor(
    graph: Graph,
    path: string[],
    commonPropertiesCandidate: { $description?: unknown; $extensions?: unknown }
  ) {
    this.graph = graph;

    this.name = path.slice(-1)[0];
    validateDesignTokenName(this.name);
    this.path = path;

    const { $description, $extensions } = validateCommonNodeProperties(
      commonPropertiesCandidate
    );
    this.description = $description;
    this.extensions = $extensions;
  }
}

class Group extends Node {
  constructor(
    graph: Graph,
    path: string[],
    commonPropertiesCandidate: { [k: string]: unknown }
  ) {
    super(graph, path, commonPropertiesCandidate);
  }
}

class Token<Type extends DesignTokenType = DesignTokenType> extends Node {
  public readonly type: Type;
  public readonly value: PickDesignToken<Type>['$value'];
  public readonly definition: PickDesignTokenDefinition<Type>;
  private readonly references = new Map<string, Token>();
  constructor(graph: Graph, path: string[], rawToken: MinimalDesignToken) {
    super(graph, path, {
      $description: rawToken.$description,
      $extensions: rawToken.$extensions,
    });

    this.type = validateDesignTokenType(rawToken.$type) as Type;

    this.definition = designTokenDefinitionsMap[
      this.type
    ] as PickDesignTokenDefinition<Type>;

    this.value = this.definition.aliasableValueZodSchema.parse(rawToken.$value);

    traverseValue(this.value, (value, valuePath) => {
      if (matchIsAlias(value)) {
        const aliasPath = deserializeTreePath(stripAliasSignature(value));
        const token = this.graph.findOrRegisterTokenByPath(aliasPath);
        this.references.set(serializeTreePath(valuePath), token);
        return false;
      }
      return true;
    });
  }
}

export class Graph {
  private readonly initialTokens: JSONValue;
  private readonly groups = new Map<string, Group>();
  private readonly tokens = new Map<string, Token>();

  constructor(tokens: JSONValue) {
    if (!matchIsJSONValue(tokens)) {
      throw new Error('Tokens must be a JSON value');
    }
    this.initialTokens = tokens;

    traverseValue(tokens, (value, path) => {
      if (matchIsMinimalDesignToken(value)) {
        this.registerToken(path, new Token(this, path, value));
        return false;
      }
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        this.registerGroup(path, new Group(this, path, value));
        return true;
      }
      return true;
    });
  }
  registerGroup(path: string[], group: Group) {
    this.groups.set(serializeTreePath(path), group);
  }
  registerToken(path: string[], token: Token) {
    this.tokens.set(serializeTreePath(path), token);
  }

  findInInitialTokens(path: string[] | string): unknown {
    return dlv(this.initialTokens as object, path);
  }
  getTokenByPath(path: string[]) {
    return this.tokens.get(serializeTreePath(path));
  }
  findOrRegisterTokenByPath(path: string[]) {
    const maybeToken = this.getTokenByPath(path);
    if (maybeToken) return maybeToken;
    const maybeRawToken = this.findInInitialTokens(path);
    if (!maybeRawToken)
      throw new Error(
        `Could not find token at path ${serializeTreePath(path)}`
      );
    if (!matchIsMinimalDesignToken(maybeRawToken))
      throw new Error(
        `Found token at path ${serializeTreePath(
          path
        )} but it is not a valid token`
      );
    const token = new Token(this, path, maybeRawToken);
    this.registerToken(path, token);
    return token;
  }
}
