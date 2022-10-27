import {
  DesignTokenAlias,
  FontWeightNomenclature,
  JSONObjectValue,
  DesignTokenType,
} from './designTokenFormatModule.js';

export type ConcreteDesignTokenAlias<
  A extends boolean = false,
  M extends boolean = false
> = {
  $description?: string;
} & M extends true
  ? {
      _kind: 'alias';
      _name: string | null;
      _path: Array<string>;
    }
  : {} & ConcreteDesignTokenTypeValueGuard<A, M>;

type ConcreteJSONStringValue<
  S extends string = string,
  A extends boolean = false,
  M extends boolean = false
> = S | A extends true ? ConcreteDesignTokenAlias<A, M> : DesignTokenAlias;
type ConcreteJSONNumberValue<
  A extends boolean = false,
  M extends boolean = false
> = number | A extends true ? ConcreteDesignTokenAlias<A, M> : DesignTokenAlias;
type ConcreteJSONBooleanValue<
  A extends boolean = false,
  M extends boolean = false
> = boolean | A extends true
  ? ConcreteDesignTokenAlias<A, M>
  : DesignTokenAlias;
type ConcreteJSONNullValue<
  A extends boolean = false,
  M extends boolean = false
> = null | A extends true ? ConcreteDesignTokenAlias<A, M> : DesignTokenAlias;
type ConcreteJSONObjectValue<
  A extends boolean = false,
  M extends boolean = false
> = { [k: number | string | symbol]: ConcreteJSONValue<A> } | A extends true
  ? ConcreteDesignTokenAlias<A, M>
  : DesignTokenAlias;
type ConcreteJSONArrayValue<
  A extends boolean = false,
  M extends boolean = false
> = Array<ConcreteJSONValue<A>> | A extends true
  ? ConcreteDesignTokenAlias<A, M>
  : DesignTokenAlias;
type ConcreteJSONValue<A extends boolean = false, M extends boolean = false> =
  | string
  | number
  | boolean
  | null
  | ConcreteJSONObjectValue<A, M>
  | ConcreteJSONArrayValue<A, M>
  | A extends true
  ? ConcreteDesignTokenAlias<A, M>
  : DesignTokenAlias;

type ConcreteColorValue<
  A extends boolean = false,
  M extends boolean = false
> = ConcreteJSONStringValue<`#${string}`>;
type ConcreteDimensionValue<
  A extends boolean = false,
  M extends boolean = false
> = ConcreteJSONStringValue<string, A, M>;
type ConcreteFontFamilyValue<
  A extends boolean = false,
  M extends boolean = false
> = ConcreteJSONStringValue<string, A, M> | ConcreteJSONArrayValue<A, M>;
type ConcreteFontWeightValue<
  A extends boolean = false,
  M extends boolean = false
> =
  | ConcreteJSONNumberValue<A, M> // [1-1000]
  | FontWeightNomenclature[keyof FontWeightNomenclature]['value'];
type ConcreteDurationValue<
  A extends boolean = false,
  M extends boolean = false
> = ConcreteJSONStringValue<`${number}ms`, A, M>;
type ConcreteCubicBezierValue<
  A extends boolean = false,
  M extends boolean = false
> = [P1x: number, P1y: number, P2x: number, P2y: number] | A extends true
  ? ConcreteDesignTokenAlias<A, M>
  : DesignTokenAlias;

type ConcreteStrokeValue<
  A extends boolean = false,
  M extends boolean = false
> =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'outset'
  | 'inset'
  | {
      dashArray: ConcreteJSONArrayValue;
      lineCap: 'round' | 'butt' | 'square' | A extends true
        ? ConcreteDesignTokenAlias<A, M>
        : DesignTokenAlias;
    }
  | A extends true
  ? ConcreteDesignTokenAlias<A, M>
  : DesignTokenAlias;

type ConcreteDesignTokenTypeValueGuard<
  A extends boolean = false,
  M extends boolean = false
> =
  | {
      $type: 'string';
      $value: ConcreteJSONStringValue<string, A, M>;
    }
  | {
      $type: 'number';
      $value: ConcreteJSONNumberValue<A, M>;
    }
  | {
      $type: 'boolean';
      $value: ConcreteJSONBooleanValue<A, M>;
    }
  | {
      $type: 'null';
      $value: ConcreteJSONNullValue<A, M>;
    }
  | {
      $type: 'object';
      $value: ConcreteJSONObjectValue<A, M>;
    }
  | {
      $type: 'array';
      $value: ConcreteJSONArrayValue<A, M>;
    }
  | {
      $type: 'color';
      $value: ConcreteColorValue<A, M>;
    }
  | {
      $type: 'dimension';
      $value: ConcreteDimensionValue<A, M>;
    }
  | {
      $type: 'fontFamily';
      $value: ConcreteFontFamilyValue<A, M>;
    }
  | {
      $type: 'fontWeight';
      $value: ConcreteFontWeightValue<A, M>;
    }
  | {
      $type: 'duration';
      $value: ConcreteDurationValue<A, M>;
    }
  | {
      $type: 'cubicBezier';
      $value: ConcreteCubicBezierValue<A, M>;
    }
  | {
      $type: 'shadow';
      $value:
        | {
            color: ConcreteColorValue<A, M>;
            offsetX: ConcreteDimensionValue<A, M>;
            offsetY: ConcreteDimensionValue<A, M>;
            blur: ConcreteDimensionValue<A, M>;
            spread: ConcreteDimensionValue<A, M>;
          }
        | A extends true
        ? ConcreteDesignTokenAlias<A, M>
        : DesignTokenAlias;
    }
  | {
      $type: 'strokeStyle';
      $value: ConcreteStrokeValue<A, M>;
    }
  | {
      $type: 'border';
      $value:
        | {
            color: ConcreteColorValue<A, M>;
            width: ConcreteDimensionValue<A, M>;
            style: ConcreteStrokeValue<A, M>;
          }
        | A extends true
        ? ConcreteDesignTokenAlias<A, M>
        : DesignTokenAlias;
    }
  | {
      $type: 'transition';
      $value:
        | {
            duration: ConcreteDurationValue<A, M>;
            delay: ConcreteDurationValue<A, M>;
            timingFunction: ConcreteCubicBezierValue<A, M>;
          }
        | A extends true
        ? ConcreteDesignTokenAlias<A, M>
        : DesignTokenAlias;
    }
  | {
      $type: 'gradient';
      $value:
        | Array<{
            color: ConcreteColorValue<A, M>;
            position: ConcreteJSONNumberValue<A, M>;
          }>
        | A extends true
        ? ConcreteDesignTokenAlias<A, M>
        : DesignTokenAlias;
    }
  | {
      $type: 'typography';
      $value:
        | {
            fontFamily: ConcreteFontFamilyValue<A, M>;
            fontSize: ConcreteDimensionValue<A, M>;
            fontWeight: ConcreteFontWeightValue<A, M>;
            letterSpacing: ConcreteDimensionValue<A, M>;
            lineHeight: ConcreteJSONStringValue<string, A, M>;
          }
        | A extends true
        ? ConcreteDesignTokenAlias<A, M>
        : DesignTokenAlias;
    };

export type ConcreteDesignToken<
  A extends boolean = false,
  M extends boolean = false
> = {
  // Token
  $description?: string;
  $extensions?: JSONObjectValue;
} & M extends true
  ? {
      _kind: 'token';
      _path: Array<string>;
    }
  : {} & ConcreteDesignTokenTypeValueGuard<A, M>;
type ConcreteDesignTokenGroup<
  A extends boolean = false,
  M extends boolean = false
> = {
  // Group
  $type?: DesignTokenType;
  $description?: string;
  // $value: never
} & M extends true
  ? {
      _kind: 'group';
      _path: Array<string>;
    }
  : {};
export type ConcreteDesignTokenTree<
  A extends boolean = boolean, // ResolveAlias
  M extends boolean = boolean // PublishMetadata
> = {
  [name: string]:
    | ConcreteDesignToken<A, M>
    | ConcreteDesignTokenGroup<A, M>
    | ConcreteDesignTokenTree<A, M>;
};
