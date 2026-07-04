/** Shared dot/bracket path parsing for CMS get/set (e.g. hero.title, items[0].quote). */
export function parseCmsPath(path: string): (string | number)[] {
  const tokens: (string | number)[] = [];
  const regex = /([^[\].]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(path)) !== null) {
    if (match[1]) tokens.push(match[1]);
    if (match[2] != null) tokens.push(Number(match[2]));
  }
  return tokens;
}

export function readCmsPath<T>(
  obj: Record<string, unknown>,
  path: string,
  fallback: T
): T {
  const tokens = parseCmsPath(path);
  let current: unknown = obj;

  for (const token of tokens) {
    if (current == null || typeof current !== "object") {
      return fallback;
    }
    if (typeof token === "number") {
      if (!Array.isArray(current)) return fallback;
      current = current[token];
    } else {
      current = (current as Record<string, unknown>)[token];
    }
  }

  if (current === "" || (typeof current === "string" && current.trim() === "")) {
    return fallback;
  }

  return (current as T | undefined) ?? fallback;
}

export function writeCmsPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const result = structuredClone(obj);
  const tokens = parseCmsPath(path);
  if (tokens.length === 0) return result;

  let current: unknown = result;
  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];

    if (current == null || typeof current !== "object") return result;

    if (typeof token === "number") {
      if (!Array.isArray(current)) return result;
      if (current[token] == null || typeof current[token] !== "object") {
        current[token] = typeof nextToken === "number" ? [] : {};
      }
      current = current[token];
    } else {
      const record = current as Record<string, unknown>;
      const next = record[token];
      if (next == null || typeof next !== "object") {
        record[token] = typeof nextToken === "number" ? [] : {};
      }
      current = record[token];
    }
  }

  const last = tokens[tokens.length - 1];
  if (typeof last === "number" && Array.isArray(current)) {
    current[last] = value;
  } else if (typeof last === "string" && current && typeof current === "object" && !Array.isArray(current)) {
    (current as Record<string, unknown>)[last] = value;
  }

  return result;
}
