const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const asList = <T>(data: unknown, keys: readonly string[] = []): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (!isRecord(data)) return [];
  if (Array.isArray(data.results)) return data.results as T[];
  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) return value as T[];
    if (isRecord(value) && Array.isArray(value.results)) return value.results as T[];
  }
  return [];
};

export const asCount = (data: unknown, keys: readonly string[] = []): number => {
  if (isRecord(data) && typeof data.count === 'number') return data.count;
  for (const key of keys) {
    const value = isRecord(data) ? data[key] : undefined;
    if (isRecord(value) && typeof value.count === 'number') return value.count;
  }
  return asList(data, keys).length;
};

export const asObject = <T>(data: unknown, key: string): T | null => {
  if (!isRecord(data)) return null;
  const value = data[key];
  return isRecord(value) ? (value as T) : (data as T);
};

export const numericEntries = (data: unknown): [string, number][] =>
  isRecord(data)
    ? Object.entries(data).filter((entry): entry is [string, number] => typeof entry[1] === 'number')
    : [];

export { isRecord };
