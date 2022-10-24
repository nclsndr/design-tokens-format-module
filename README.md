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




