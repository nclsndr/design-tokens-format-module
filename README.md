# Design Tokens Format Module

*— A Typescript implementation of the [Design Tokens Format Module](https://design-tokens.github.io/community-group/format/) specification along with some utility functions*

### Abstract

This repository aims to provide comprehensive tooling to work with the Design Tokens Format Module specification when it comes to parse, validate, resolve aliasing and (maybe) manage design token files.

> ⚠️ Please note, neither the DTCG specification nor this library are stable yet.
> The DTCG specification is currently under draft phase and the library might integrate unstable APIs for the sake of research.

## Usage

### Installation

```bash
$ npm install design-tokens-format-module
```

### Parse design token input

#### Simple color token example

```typescript
import { parseDesignTokens, TokenTree } from "design-tokens-format-module";

const input: TokenTree = {
  'a-color': {
    $type: 'color',
    $value: '#000000',
    $description: 'This is a color',
  },
};
const result = parseDesignTokens(input);

// We expect result to be
const parsedTokens = {
  'a-color': {
    $type: 'color',
      $value: '#000000',
      $description: 'This is a color',
      _kind: 'token', 
      _path: ['a-color'],
  }
};
```

#### Colors with aliasing

```typescript
import { parseDesignTokens, TokenTree } from "design-tokens-format-module";

const input = {
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
} as const;
const result = parseDesignTokens(input);

// We expect result to be
const parsedTokens = {
  colors: {
    $type: 'color',
    _kind: 'group',
    _path: ['colors'],
    primary: {
      $type: 'color',
      $value: '#000000',
      $description: 'This is a primary color',
      _kind: 'token',
      _path: ['colors', 'primary'],
    },
    secondary: {
      $type: 'color',
      $value: {
        $type: 'color',
        $value: '#000000',
        $description: 'This is a primary color',
        _kind: 'alias',
        _path: ['colors', 'primary'],
        _name: 'primary',
      },
      _kind: 'token',
      _path: ['colors', 'secondary'],
    },
  },
};
```

## API


### Token tree

The `TokenTree` is the JSON Object data structure that represents the entire design tokens document.

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

## Roadmap

- [x] Implement the latest specification Typescript type definition
- [x] Add a parse function to traverse any given token tree
- [x] Resolve aliases
- [x] Add validation logic for all known token types
- [ ] Expose validation only API
- [ ] Expose parse API with options for alias resolution and metadata population
- [ ] Expose proper types for external consumers




