# Design Tokens Format Module

*— A Typescript implementation of the [Design Tokens Format Module](https://design-tokens.github.io/community-group/format/) specification along with some utility functions*

### Abstract

This repository aims to provide comprehensive tooling to work with the Design Tokens Format Module specification when it comes to parse, validate, resolve aliasing and (maybe) manage design token files.

> ⚠️ Please note, neither the DTCG specification nor this library are stable yet.
> The DTCG specification is currently under draft phase and the library might integrate unstable APIs for the sake of research.

## Introducing Design Tokens

According to the DTCG, Design Tokens are described using a JSON object made of arbitrary nested `groups`, organizing `tokens`.

While `tokens` are responsible to carry the actual value (`$value`), we also distinguish `aliases` that help reference another token within the same JSON object using the `{dot.path}` notation.

> The DTCG does not give a name (yet?) to this very JSON object. For the sake of clarity, the library refers to it as `DesignTokenTree`.

### The Design Token Tree

At the top level definition we encounter the `DesignTokenTree`. A simple recursive structure allowing deep group nesting where Design Tokens can be defined.

```typescript
type DesignTokenTree = {
  [name: string]: DesignToken | DesignTokenGroup | DesignTokenTree;
};
```

```json
{
  "colors": {
    "primary": {
      "$type": "color",
      "$value": "#ff0000"
    }
  }
}
```

### The Design Token Group

A `DesignTokenGroup` is a simple object that can be used to group Design Tokens together. It is used to provide an arbitrary semantic meaning to a set of Design Tokens.

It can also define a `$type` property, which will be inherited by all Design Tokens within the group.

```typescript
export type DesignTokenGroup = {
  $type?: DesignTokenType;
  $description?: string;
};
```

```json
{
  "some": {
    "nested": {
      "groups": {}
    }
  }
}
```

### the (actual) Design Token

A Design Token is recognized by the presence of a `$value` property. It can be a simple primitive value, a complex object or an alias to another token of the same type.

The type must be specified most of the time, but the library will try to infer against `JSONTypeName` from the value if not specified.

```typescript
export type DesignToken = {
  $value: DesignTokenValue;
  $type?: DesignTokenType;
  $description?: string;
  $extensions?: JSONValue;
};
```

```json
{
  "border-default": {
    "$type": "border",
    "$value": {
      "width": "1px",
      "style": "solid",
      "color": "#000000"
    }
  }
}
```

#### Design Token types

The DTCG specification defines a set of Design Token types that can be used to describe the value of a Design Token. The library provides a set of constants to use as `$type` value.

As of today (Oct 2022), the following types are supported:

```typescript
type DesignTokenType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'object'
  | 'array'
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'shadow'
  | 'strokeStyle'
  | 'border'
  | 'transition'
  | 'gradient'
  | 'typography'
```

_More details in the API section down below 👇_

### Design Token Alias

The `DesignTokenAlias` is a special type of Design Token that references another token within the same Design Token Tree using the `{dot.path}` notation.

```typescript
type DesignTokenAlias = `{${string}}`;
```

```json
{
    "color": {
        "primary": {
        "base": {
            "$type": "color",
            "$value": "#ff0000"
        },
        "light": {
            "$type": "color",
            "$value": "{color.primary.base}"
        }
        }
    }
}
```

### (Smart) `$type` resolution

To avoid having to specify the `$type` Design Token of a given Group, the DTCG allows to define group-level `$types`.

```json
{
  "colors": {
    "$type": "color",
    "primary": {
      "$value": "#ff0000"
    },
    "secondary": {
      "$value": "#00ff00"
    }
  }
}
```


## Usage

### Installation

```bash
$ npm install design-tokens-format-module
```

### Validate a Design Token Tree

The first usage of the parser is to validate a Design Token Tree against the DTCG specification.

```typescript
import { DesignTokenTree } from "design-tokens-format-module";

const tokens: DesignTokenTree = {
  "colors": {
    "$type": "color",
    "primary": {
      "$value": "#ff0000"
    }
  }
};

const parsedTokens = parseDesignTokenTree(tokens);
```

This outputs almost the same structure: 
    
```json5
// parsedTokens =
{
  "colors": {
    "$type": "color",
    "primary": {
      "$type": "color", // <-- Resolved from the group-level $type
      "$value": "#ff0000"
    }
  }
}
```

But where `tokens` was a `DesignTokenTree`, `parsedTokens` is now a `ConcreteDesignTokenTree`.

This is a special type of `DesignTokenTree` that has been validated against the DTCG specification and defines only valid `$type<>$value` combinations.
Hence the library provides the `ConcreteDesignTokenTypeValueGuard` type offering type safety in consumer code.

### Resolve aliases

In order to fully validate the tree and make it ready for further serialization operations, the parser takes an optional `resolveAliases` parameter that will resolve all aliases in the tree.

```typescript
import { parseDesignTokens, DesignTokenTree } from "design-tokens-format-module";

const tokens: DesignTokenTree = {
  colors: {
    $type: 'color',
    primary: {
      $value: '#000000',
      $description: 'This is a primary color',
    },
    secondary: {
      $value: '{colors.primary}',
    },
  },
};
const parsedTokens = parseDesignTokens(tokens, { resolveAliases: true });
```

`parsedTokens.colors.secondary` now holds the content of its alias.

```json5
// parsedTokens =
{
  "colors": {
    "$type": "color",
    "primary": {
      "$type": "color",
      "$value": "#000000",
      "$description": "This is a primary color"
    },
    "secondary": {
      "$type": "color",
      "$value": {
        "$type": "color",
        "$value": "#000000",
        "$description": "This is a primary color"
      }
    }
  }
}
```

### Additional metadata

Along the development of this library, some metadata information, such as the path to a design token or the kind of a tree node.
the parser takes an optional `publishMetadata` parameter that will add metadata to the concrete tree.

Additions are:
- `_kind` property on each node (`'group' | 'token' | 'alias'`)
- `_path` property on each node (`Array<string>`)
- `_name` property on `ConcreteDesignTokenAlias` only to reference the original name of the alias


```typescript
import { parseDesignTokens, DesignTokenTree } from "design-tokens-format-module";

const input: DesignTokenTree = {
  'a-color': {
    $type: 'color',
    $value: '#000000',
    $description: 'This is a color',
  },
};
const parsedTokens = parseDesignTokens(input, { publishMetadata: true });
```

`parsedTokens` has now `_` prefixed properties.

```json5
// parsedTokens =
{
  "a-color": {
    "$type": "color",
    "$value": "#000000",
    "$description": "This is a color",
    "_kind": "token",
    "_path": ["a-color"]
  }
}

```

#### A full example with aliases and metadata

```typescript
import { parseDesignTokens, DesignTokenTree } from "design-tokens-format-module";

const tokens: DesignTokenTree = {
  colors: {
    $type: 'color',
    primary: {
      $value: '#000000',
      $description: 'This is a primary color',
    },
    secondary: {
      $value: '{colors.primary}',
    },
  },
};
const parsedTokens = parseDesignTokens(tokens, { resolveAliases: true, publishMetadata: true });
```

```json5
// parsedTokens =
{
  "colors": {
    "$type": "color",
    "_kind": "group",
    "_path": ["colors"],
    "primary": {
      "$type": "color",
      "$value": "#000000",
      "$description": "This is a primary color",
      "_kind": "token",
      "_path": ["colors", "primary"]
    },
    "secondary": {
      "$type": "color",
      "$value": {
        "$type": "color",
        "$value": "#000000",
        "$description": "This is a primary color",
        "_kind": "alias",
        "_path": ["colors", "primary"],
        "_name": "primary" // <-- The original name of the alias
      },
      "_kind": "token",
      "_path": ["colors", "secondary"]
    }
  }
}
```

## API


### Token tree

The `DesignTokenTree` is the JSON Object data structure that represents the entire design tokens document.

```typescript
type TokenTree = {
  [name: string]: DesignToken | TokenGroup | TokenTree;
};
```

At each level of the token tree, we can have either an actual design token, a token group or yet another token tree, recursively.

#### Aliasing

In order to avoid duplication of declarations, a DesignToken can reference another DesignToken using the `$value` property and the `{token.path}` syntax.

```typescript
type Alias = `{${string}}` // e.g. {colors.primary}
```

### Token types

We distinguish 3 categories of design tokens:
- JSON values (string, number, boolean, ...)
- Primitive Design Tokens (color, duration, ...)
- Composite Design Tokens (border, shadow, ...)

#### JSON types

They are the only types we might infer if not provided explicitly in the given `TokenTree`.

```typescript
type JSONTokenType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object'
```

#### Color

type name: `'color'`

```typescript
type ColorValue = `#${string}` | Alias
```

#### Dimension

type name: `'dimension'`

```typescript
type DimensionValue = string | Alias; // 1px | 1rem | 1vh ...
```

#### Font Family

type name: `'fontFamily'`

```typescript
type FontFamilyValue = string | string[] | Alias; // "Helvetica" | ["Helvetica", "Arial", sans-serif]
```

#### Font Weight

type name: `'fontWeight'`

```typescript
type FontWeightValue =
  | number // [1-1000]
  | FontWeightNomenclature[keyof FontWeightNomenclature]['value'] // 'thin' | 'hairline' | 'extra-light' | 'ultra-light' | 'light' | 'normal' | 'regular' | 'book' | 'medium' | 'semi-bold' | 'demi-bold' | 'bold' | 'extra-bold' | 'ultra-bold' | 'black' | 'heavy' | 'extra-black' | 'ultra-black'
  | Alias;
```

#### Duration

type name: `'duration'`

```typescript
type DurationValue = `${number}ms` | Alias; // 100ms
```

#### Cubic Bezier

type name: `'cubicBezier'`

```typescript
type CubicBezierValue =
  | [P1x: number, P1y: number, P2x: number, P2y: number]
  | Alias;
```

#### Shadow

type name: `'shadow'`

```typescript
type ShadowValue =
  | {
  color: ColorValue;
  offsetX: DimensionValue;
  offsetY: DimensionValue;
  blur: DimensionValue;
  spread: DimensionValue;
}
  | Alias;
```

#### Stroke Style

type name: `'strokeStyle'`

```typescript
type StrokeStyleValue =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'outset'
  | 'inset'
  | {
  dashArray: DimensionValue[];
  lineCap: 'round' | 'butt' | 'square';
}
  | Alias;
```

#### Border

type name: `'border'`

```typescript
type BorderValue =
  | {
  color: ColorValue;
  width: DimensionValue;
  style: StrokeStyleValue;
}
  | Alias;
```

#### Transition

type name: `'transition'`

```typescript
type TransitionValue =
  | {
  duration: DurationValue;
  delay: DurationValue;
  timingFunction: CubicBezierValue;
}
  | Alias;
```

#### Gradient

type name: `'gradient'`

```typescript
type GradientValue =
  | Array<{
  color: ColorValue;
  position: JSONNumberValue;
}>
  | Alias;
```

#### Typography

type name: `'typography'`

```typescript
type TypographyValue =
  | {
  fontFamily: FontFamilyValue;
  fontSize: DimensionValue;
  fontWeight: FontWeightValue;
  letterSpacing: DimensionValue;
  lineHeight: JSONStringValue;
}
  | Alias;
```

### Utility functions

#### parseDesignTokens

```
parseDesignTokens(input: TokenTree): ConcreteTokenTree
```

The function handles :
- Validation of the input against the Design Token spec
- Resolution of aliases
- Resolution of the `$type` field for any token
- Population of `_` prefixed metadata

> ⚠️ Limitation: The detection of circular aliasing does not work without `parserOptions.resolveAliases` set to `true`.


#### validateDesignTokenValue

#### validateDesignTokenAndGroupName

### Types

#### JSONTypeName


## Roadmap

- [x] Implement the latest specification Typescript type definition
- [x] Add a parse function to traverse any given token tree
- [x] Resolve aliases
- [x] Add validation logic for all known token types
- [ ] Expose validation only API
- [ ] Expose parse API with options for alias resolution and metadata population
- [ ] Expose proper types for external consumers
- [ ] Add support for circular aliasing detection when not resolving aliases




