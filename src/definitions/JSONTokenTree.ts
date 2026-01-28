import type { DesignToken, PickTokenByType, TokenTypeName } from './tokenTypes.js';
import type { GroupProperties } from './GroupProperties.js';
import type { TokenSignature } from './TokenSignature.js';
import type { JSONValue } from './JSONSignatures.js';

type AnyToken = TokenSignature<TokenTypeName, JSONValue>;

type TokenWithExplicitType = AnyToken & {
  $type: TokenTypeName;
};

type TokenWithoutTypeInGroup<T extends TokenTypeName> = PickTokenByType<T> extends infer U
  ? U extends AnyToken
    ? Omit<U, '$type'> & { $type?: undefined }
    : never
  : never;

type TokenInContext<T extends TokenTypeName | undefined> = T extends TokenTypeName
  ? TokenWithoutTypeInGroup<T> | TokenWithExplicitType
  : AnyToken;

type GroupValue<InheritedType extends TokenTypeName | undefined> =
  | JSONTokenTree<InheritedType>
  // Needed so `$type`, `$description`, ... don't conflict with the index signature.
  // TODO @Nico if TS ever supports excluding known keys from index signatures, tighten this.
  | GroupProperties[keyof GroupProperties]
  | undefined;

type UntypedGroup<InheritedType extends TokenTypeName | undefined> = GroupProperties & {
  $type?: undefined;
  $value?: never;
  $root?: TokenInContext<InheritedType>;
  [key: string]: GroupValue<InheritedType>;
};

type TypedGroup<T extends TokenTypeName> = GroupProperties & {
  $type: T;
  $value?: never;
  $root?: TokenInContext<T>;
  [key: string]: GroupValue<T>;
};

export type JSONTokenTree<InheritedType extends TokenTypeName | undefined = undefined> =
  | TokenInContext<InheritedType>
  | UntypedGroup<InheritedType>
  | { [T in TokenTypeName]: TypedGroup<T> }[TokenTypeName];
