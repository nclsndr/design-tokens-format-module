# Design Tokens Format Module

*— A TypeScript implementation of the [Design Tokens Format Module](https://tr.designtokens.org/format/) specification along with some utility functions*

## Abstract

This packages aims to provide the most agnostic JavaScript/TypeScript definitions from the [Design Tokens Format Module](https://tr.designtokens.org/format/) specification, for library developers and tooling creators.

Join the conversation on the [W3C Design Tokens Community Group](https://github.com/design-tokens/community-group) repository.

> ⚠️ Please note, the DTCG specification is NOT stable yet, breaking changes might occur in the future.

## Installation

### Using npm

```bash
npm install design-tokens-format-module
```

### Using yarn

```bash
yarn add design-tokens-format-module
```

### Using pnpm

```bash
pnpm add design-tokens-format-module
```

## Usage

This module provides all the type definitions and the most basic helpers required to work with a JSON design token tree.

### Token tree

Constrain a JSON object that represents a design token tree.

```typescript
import { JSONTokenTree } from 'design-tokens-format-module';

const tokenTree = {
  color: {
    primary: {
      $type: 'color',
      $value: '#000000',
    },
  },
  spacing: {
    small: {
      $type: 'dimension',
      $value: {
        value: 8,
        unit: 'px',
      },
    },
  },
} satisfies JSONTokenTree;
```

### Design Token

Each design token type is available as a TypeScript namespace.

```typescript
import {
  Color // Dimension, FontFamily... 
} from 'design-tokens-format-module';

declare function parseColorToken(token: unknown): Color.Token;
declare function parseColorValue(tokens: unknown): Color.Value;
declare function matchIsColorTokenTypeName(
  name: string,
): name is Color.TypeName;
```

#### Design token type names

All token type names are available as a constant.

```typescript
import { tokenTypeNames } from 'design-tokens-format-module';

for(const tokenTypeName of tokenTypeNames) {
  // color, dimension...
}
```

### All token types

All token type signatures are available within a type union.

```typescript
import { DesignToken } from 'design-tokens-format-module';

declare function parseDesignToken(token: unknown): DesignToken;
```

### Matchers

JSON values can be evaluated against the token signature

```typescript
import { matchIsToken, matchIsTokenTypeName, matchIsAliasValue } from 'design-tokens-format-module';

function validateToken(token: unknown) {
  if (matchIsToken(token)) {
    const isValidType = matchIsTokenTypeName(token.$type ?? '');
    if(matchIsAliasValue(token.$value)) {
      // ...
    }
  }
  // ...
}
```

### Alias utils

Alias values can be validated and parsed.

```ts
import { captureAliasPath } from 'design-tokens-format-module';

const result = captureAliasPath('{path.to.token}');

if(result.status === 'ok') {
  result.value // string[]
} else {
  switch (result.error.tag) {
    case 'TYPE_ERROR': {
      result.error.message // Expected a string value. Got [x].
      break;
    }
    case 'FORMAT_ERROR': {
      result.error.message // Expected an alias value. Got [x].
      break;
    }
  }
}
```

### Enum-like constants

Some token types have a fixed set of values. These are available as constants.

```typescript
import { fontWeightValues, strokeStyleStringValues, strokeStyleLineCapValues } from 'design-tokens-format-module';
```

## Previous versions

The packages goal has shifted from being a generic parser — which requires way more feedback — to a reliable source of truth for the DTCG implementations in the JavaScript land.

> The features and APIs available before version 0.9.0 has been relocated to a [new location](https://github.com/nclsndr/design-tokens-tools/tree/main/packages/w3c-design-tokens-parser) where they get revamped and improved.

## Contributing

If you find any typos, errors, or additional improvements, feel free to contribute to the project.

### Development

Install dependencies.

```bash
npm install
```

Run test in watch mode.

```bash
npm run test
```

Please add tests to cover the new functionality or bug fix you are working upon.

### Before opening a PR

We expect the tests and the build to pass for a PR to be reviewed and merged.

```bash
npm run test --run
```

```bash
npm run build
```

## API

### `AliasValue` (type)

```ts
type AliasValue = `{${string}}`;
```

### `Json` (namespace)

```ts
namespace Json {
  export type Value = JSONValue;
  export type Object = JSONObject;
  export type Array = JSONArray;
  export type Primitive = string | number | boolean | null;
}
```
### JSONTokenTree (type)

```ts
type JSONTokenTree = {
  [key: string]: DesignToken | JSONTokenTree | GroupProperties;
} & GroupProperties;
```

### `Color`,`Dimension`, ... (namespace)

```ts
namespace TokenTypeName {
  export type TypeName = TypeName;
  export type Value = Value;
  export type Token = Token;
}
```

### `DesignToken` (type)

```ts
type DesignToken =
  | ColorToken
  | DimensionToken
  // | ...
```

### `TokenTypeName` (type)

```ts
type TokenTypeName = 
  | 'color'
  | 'dimension'
  // | ... 
```


### `captureAliasPath` (function)

```ts
const CAPTURE_ALIAS_PATH_ERRORS = {
  TYPE_ERROR: 'Expected a string value.',
  // ...
} as const;

type ValidationError = {
  [k in keyof Writable<typeof CAPTURE_ALIAS_PATH_ERRORS>]?: {
    message: string;
  };
};

type Result<T, E> =
  | {
  status: 'ok';
  value: T;
  error?: undefined;
}
  | {
  status: 'error';
  error: E;
  value?: undefined;
};

declare function captureAliasPath(
  value: unknown,
): Result<Array<string>, ValidationError>;
declare function captureAliasPath<AsString extends boolean | undefined>(
  value: unknown,
  asString: AsString,
): Result<AsString extends true ? string : Array<string>, ValidationError>;
```

Usage

```ts
const result = captureAliasPath('{path.to.token}');

if(result.status === 'ok') {
  result.value // string[]
} else {
  switch (result.error.tag) {
    case 'TYPE_ERROR': {
      result.error.message // Expected a string value. Got [x].
      break;
    }
    case 'FORMAT_ERROR': {
      result.error.message // Expected an alias value. Got [x].
      break;
    }
  }
}
```


### `matchIsAliasValue` (function)

```ts
declare function matchIsAliasValue(candidate: unknown): candidate is AliasValue;
```

### `matchIsGroup` (function)

```ts
declare function matchIsGroup(candidate: unknown): candidate is JSONTokenTree;
```

### `matchIsToken` (function)

```ts
declare function matchIsToken(candidate: unknown): candidate is DesignToken;
```

### `matchIsTokenTypeName` (function)

```ts
declare function matchIsTokenTypeName(candidate: unknown): candidate is TokenTypeName;
```


### `ALIAS_PATH_SEPARATOR` (constant)

```ts
const ALIAS_PATH_SEPARATOR = '.';
```

### `tokenTypeNames` (constant)

```ts
const tokenTypeNames = [
  'color',
  'dimension',
  // ...
] as const;
```

### `fontWeightValues` (constant)

```ts
const fontWeightValues = [
  100,
  'thin',
  'hairline',
  // ...
] as const;
```

### `strokeStyleStringValues` (constant)

```ts
const strokeStyleStringValues = [
  'solid',
  'dashed',
  // ...
] as const;
```

### `strokeStyleLineCapValues` (constant)

```ts
const strokeStyleLineCapValues = [
  'round',
  'butt',
  // ...
] as const;
```
