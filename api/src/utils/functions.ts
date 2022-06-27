export function removeNullability<T>(
  type: T | null | undefined
): T | undefined {
  if (type === null) {
    return undefined;
  }
  return type;
}
