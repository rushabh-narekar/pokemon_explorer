export function isRtkNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const record = error as Record<string, unknown>;

  if (record.status === 404 || record.status === "404") {
    return true;
  }

  if (record.originalStatus === 404 || record.originalStatus === "404") {
    return true;
  }

  return false;
}
