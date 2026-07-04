const SKIP_KEY_PATTERN =
  /^(slug|href|url|src|image(url)?|featuredimage|email|id|path|pageSlug|updatedby)$/i;
const SKIP_VALUE_PATTERN =
  /^(https?:\/\/|\/|data:|mailto:|#|[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,})/i;

function shouldTranslateString(key: string, value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.length > 5000) return false;
  if (SKIP_KEY_PATTERN.test(key)) return false;
  if (SKIP_VALUE_PATTERN.test(trimmed)) return false;
  if (/\.(webp|png|jpe?g|gif|svg|avif|pdf)(\?|$)/i.test(trimmed)) return false;
  if (/^[a-z0-9-]+$/i.test(trimmed) && !/\s/.test(trimmed) && trimmed.length < 40) return false;
  return /[a-zA-Z\u00C0-\u024F\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(trimmed);
}

type StringLeaf = { path: string; value: string };

function collectStringLeaves(value: unknown, path = ""): StringLeaf[] {
  if (typeof value === "string") {
    const key = path.split(".").pop() || "";
    return shouldTranslateString(key, value) ? [{ path, value }] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStringLeaves(item, `${path}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
      const nextPath = path ? `${path}.${key}` : key;
      return collectStringLeaves(child, nextPath);
    });
  }
  return [];
}

function parsePath(path: string): (string | number)[] {
  const tokens: (string | number)[] = [];
  const regex = /([^[\].]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(path)) !== null) {
    if (match[1]) tokens.push(match[1]);
    if (match[2] != null) tokens.push(Number(match[2]));
  }
  return tokens;
}

function setByPath(obj: Record<string, unknown>, path: string, newValue: string): void {
  const tokens = parsePath(path);
  if (tokens.length === 0) return;

  let current: unknown = obj;
  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];
    if (typeof token === "number") continue;

    if (current == null || typeof current !== "object") return;

    if (Array.isArray(current)) {
      const index = token as unknown as number;
      if (typeof nextToken === "number") {
        if (!current[index] || typeof current[index] !== "object") {
          current[index] = [];
        }
        current = current[index];
      }
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
  const parentToken = tokens[tokens.length - 2];

  if (typeof last === "number" && Array.isArray(current)) {
    current[last] = newValue;
    return;
  }

  if (typeof last === "string" && current && typeof current === "object" && !Array.isArray(current)) {
    (current as Record<string, unknown>)[last] = newValue;
  }
}

export async function translateJsonStrings<T extends Record<string, unknown>>(
  input: T,
  translateBatch: (texts: string[]) => Promise<string[]>
): Promise<T> {
  const leaves = collectStringLeaves(input);
  if (leaves.length === 0) return input;

  const translatedValues = await translateBatch(leaves.map((leaf) => leaf.value));
  const output = structuredClone(input) as T;

  leaves.forEach((leaf, index) => {
    setByPath(output as Record<string, unknown>, leaf.path, translatedValues[index] ?? leaf.value);
  });

  return output;
}

export { collectStringLeaves, shouldTranslateString };
