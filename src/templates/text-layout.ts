const punctuation = new Set(Array.from('，。！？；：、,.!?;:'));
const asciiWord = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export interface TitleLayoutOptions {
  maxCharsPerLine: number;
  maxLines: number;
  targetLines?: number;
  minCharsPerLine?: number;
  keepWords?: boolean;
}

export interface TitleLayoutResult {
  lines: string[];
  tokens: string[];
  exceededMaxLines: boolean;
}

export function tokenizeMixedText(text: string) {
  const clean = (text ?? '').trim();
  if (!clean) return [] as string[];

  const regex = /([A-Za-z0-9][A-Za-z0-9._-]*|\p{Extended_Pictographic}|[^A-Za-z0-9\s])/gu;
  return Array.from(clean.matchAll(regex), (m) => m[0]).filter(Boolean);
}

function splitByManualLines(text: string) {
  return (text ?? '')
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function layoutTokens(tokens: string[], options: TitleLayoutOptions) {
  const maxChars = options.maxCharsPerLine;
  const lines: string[] = [];
  let current = '';

  for (const token of tokens) {
    const isPunc = punctuation.has(token);
    const isAscii = asciiWord.test(token);

    if (!current) {
      current = token;
      continue;
    }

    const next = current + token;
    if (next.length <= maxChars || isPunc) {
      current = next;
      continue;
    }

    if (options.keepWords !== false && isAscii && current.length <= Math.max(3, Math.floor(maxChars * 0.35))) {
      current = next;
      continue;
    }

    lines.push(current);
    current = token;
  }

  if (current) lines.push(current);
  return lines;
}

export function layoutTitle(text: string, options: TitleLayoutOptions): TitleLayoutResult {
  const clean = (text ?? '').trim();
  if (!clean) {
    return { lines: [''], tokens: [], exceededMaxLines: false };
  }

  const manualLines = splitByManualLines(clean);
  const sourceLines = manualLines.length ? manualLines : [clean];
  const allTokens: string[] = [];

  for (const line of sourceLines) {
    allTokens.push(...tokenizeMixedText(line));
  }

  const minChars = options.minCharsPerLine ?? Math.max(4, options.maxCharsPerLine - 3);
  let bestLines: string[] | null = null;

  for (let maxChars = options.maxCharsPerLine; maxChars >= minChars; maxChars--) {
    const lines: string[] = [];

    for (const line of sourceLines) {
      const tokens = tokenizeMixedText(line);
      lines.push(...layoutTokens(tokens, { ...options, maxCharsPerLine: maxChars }));
    }

    if (lines.length > options.maxLines) continue;

    const lastLen = lines[lines.length - 1]?.length ?? 0;
    if (lines.length >= 3 && lastLen <= 2) continue;

    if (!bestLines) bestLines = lines;

    if (options.targetLines && lines.length <= options.targetLines) {
      bestLines = lines;
      break;
    }
  }

  const fallbackLines = bestLines ?? sourceLines.flatMap((line) => layoutTokens(tokenizeMixedText(line), options));

  return {
    lines: fallbackLines.slice(0, options.maxLines),
    tokens: allTokens,
    exceededMaxLines: fallbackLines.length > options.maxLines,
  };
}

export function splitTitleSmart(text: string, maxChars = 10, maxLines = 5) {
  return layoutTitle(text, {
    maxCharsPerLine: maxChars,
    maxLines,
    keepWords: true,
  }).lines;
}
