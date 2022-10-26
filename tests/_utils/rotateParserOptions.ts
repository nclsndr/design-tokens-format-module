import { ParseDesignTokensOptions } from '../../src/parseDesignTokens.js';

const defaultParserOptionsKeys: Array<keyof ParseDesignTokensOptions> = [
  'resolveAliases',
  'publishMetadata',
];

export function generateParserOptions<A extends boolean, M extends boolean>(
  parserOptionsKeys: Array<
    keyof ParseDesignTokensOptions<A, M>
  > = defaultParserOptionsKeys,
  forceOptions?: ParseDesignTokensOptions<A, M>
) {
  const finalForce = forceOptions || {};
  const forcedKeys = Object.keys(finalForce);
  const rotatingKeys = parserOptionsKeys.filter((k) => !forcedKeys.includes(k));

  return Array.from(new Array(2 ** rotatingKeys.length))
    .fill(rotatingKeys)
    .map((keys: Array<keyof ParseDesignTokensOptions<A, M>>, i) => {
      return keys.reduce(
        (acc, key, j) => ({
          ...acc,
          [key]: Boolean(i & (1 << j)),
        }),
        finalForce as ParseDesignTokensOptions<A, M>
      );
    });
}

export function rotateParserOptions<A extends boolean, M extends boolean>(
  callback: (parserOptions: ParseDesignTokensOptions<A, M>) => void,
  forceOptions?: ParseDesignTokensOptions<A, M>
) {
  const parserOptions = generateParserOptions(
    defaultParserOptionsKeys,
    forceOptions
  );
  parserOptions.forEach((parserOptions) => {
    callback(parserOptions);
  });
  return parserOptions.length;
}
