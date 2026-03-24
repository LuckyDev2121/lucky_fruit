export class ApiValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiValidationError";
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function toStringValue(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

export function toArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function ensureString(
  value: unknown,
  fieldName: string,
  fallback?: string
): string {
  const stringValue = toStringValue(value);
  if (stringValue !== null) return stringValue;
  if (fallback !== undefined) return fallback;
  throw new ApiValidationError(`Invalid "${fieldName}" in API response`);
}

export function ensureRecord(value: unknown, fieldName: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new ApiValidationError(`Invalid "${fieldName}" object in API response`);
  }
  return value;
}
