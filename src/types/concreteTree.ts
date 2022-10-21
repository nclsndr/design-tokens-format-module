import { FontWeightNomenclature, JSONObjectValue, TokenType } from './dtcg.js';

export type ConcreteAliasUnit = {
  $description?: string;
  _kind: 'alias';
  _name: string | null;
  _path: Array<string>;
} & ConcreteTokenTypeValueGuard;

type ConcreteJSONStringValue<S extends string = string> = S | ConcreteAliasUnit;
type ConcreteJSONNumberValue = number | ConcreteAliasUnit;
type ConcreteJSONBooleanValue = boolean | ConcreteAliasUnit;
type ConcreteJSONNullValue = null | ConcreteAliasUnit;
type ConcreteJSONObjectValue =
  | { [k: number | string | symbol]: ConcreteJSONValue }
  | ConcreteAliasUnit;
type ConcreteJSONArrayValue = Array<ConcreteJSONValue> | ConcreteAliasUnit;
type ConcreteJSONValue =
  | string
  | number
  | boolean
  | null
  | ConcreteJSONObjectValue
  | ConcreteJSONArrayValue
  | ConcreteAliasUnit;

type ConcreteColorValue = ConcreteJSONStringValue<`#${string}`>;
type ConcreteDimensionValue = ConcreteJSONStringValue;
type ConcreteFontFamilyValue = ConcreteJSONStringValue | ConcreteJSONArrayValue;
type ConcreteFontWeightValue =
  | ConcreteJSONNumberValue // [1-1000]
  | FontWeightNomenclature[keyof FontWeightNomenclature]['value'];
type ConcreteDurationValue = ConcreteJSONStringValue<`${number}ms`>;
type ConcreteCubicBezierValue =
  | [P1x: number, P1y: number, P2x: number, P2y: number]
  | ConcreteAliasUnit;

type ConcreteStrokeValue =
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
      lineCap: 'round' | 'butt' | 'square' | ConcreteAliasUnit;
    }
  | ConcreteAliasUnit;

type ConcreteTokenTypeValueGuard =
  | {
      $type: 'String';
      $value: ConcreteJSONStringValue;
    }
  | {
      $type: 'Number';
      $value: ConcreteJSONNumberValue;
    }
  | {
      $type: 'Boolean';
      $value: ConcreteJSONBooleanValue;
    }
  | {
      $type: 'Null';
      $value: ConcreteJSONNullValue;
    }
  | {
      $type: 'Object';
      $value: ConcreteJSONObjectValue;
    }
  | {
      $type: 'Array';
      $value: ConcreteJSONArrayValue;
    }
  | {
      $type: 'color';
      $value: ConcreteColorValue;
    }
  | {
      $type: 'dimension';
      $value: ConcreteDimensionValue;
    }
  | {
      $type: 'fontFamily';
      $value: ConcreteFontFamilyValue;
    }
  | {
      $type: 'fontWeight';
      $value: ConcreteFontWeightValue;
    }
  | {
      $type: 'duration';
      $value: ConcreteDurationValue;
    }
  | {
      $type: 'cubicBezier';
      $value: ConcreteCubicBezierValue;
    }
  | {
      $type: 'shadow';
      $value:
        | {
            color: ConcreteColorValue;
            offsetX: ConcreteDimensionValue;
            offsetY: ConcreteDimensionValue;
            blur: ConcreteDimensionValue;
            spread: ConcreteDimensionValue;
          }
        | ConcreteAliasUnit;
    }
  | {
      $type: 'strokeStyle';
      $value: ConcreteStrokeValue;
    }
  | {
      $type: 'border';
      $value:
        | {
            color: ConcreteColorValue;
            width: ConcreteDimensionValue;
            style: ConcreteStrokeValue;
          }
        | ConcreteAliasUnit;
    }
  | {
      $type: 'transition';
      $value:
        | {
            duration: ConcreteDurationValue;
            delay: ConcreteDurationValue;
            timingFunction: ConcreteCubicBezierValue;
          }
        | ConcreteAliasUnit;
    }
  | {
      $type: 'gradient';
      $value:
        | Array<{
            color: ConcreteColorValue;
            position: ConcreteJSONNumberValue;
          }>
        | ConcreteAliasUnit;
    }
  | {
      $type: 'typography';
      $value:
        | {
            fontFamily: ConcreteFontFamilyValue;
            fontSize: ConcreteDimensionValue;
            fontWeight: ConcreteFontWeightValue;
            letterSpacing: ConcreteDimensionValue;
            lineHeight: ConcreteJSONStringValue;
          }
        | ConcreteAliasUnit;
    };

export type ConcreteTokenUnit = {
  // Token
  $description?: string;
  _kind: 'token';
  _path: Array<string>;
} & ConcreteTokenTypeValueGuard;
type ConcreteTokenGroup = {
  // Group
  $type?: TokenType;
  $description?: string;
  $extensions?: JSONObjectValue;
  // $value: never
  _kind: 'group';
  _path: Array<string>;
};
export type ConcreteTokenTree = {
  [name: string]: ConcreteTokenUnit | ConcreteTokenGroup | ConcreteTokenTree;
};