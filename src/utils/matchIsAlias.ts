export function matchIsAlias(value: unknown) {
  return (
    typeof value === 'string' && value.startsWith('{') && value.endsWith('}')
  );
}
