export type MinimalDesignToken = {
  $value: unknown;
  $type?: unknown;
  $description?: unknown;
  $extensions?: unknown;
};

export function matchIsMinimalDesignToken(
  candidate: unknown
): candidate is MinimalDesignToken {
  return (
    typeof candidate === 'object' && candidate !== null && '$value' in candidate
  );
}
