import type { PageRange } from "@/src/types/pdf";
import { I18nError } from "@/src/lib/i18n/messages";

function parsePositiveInt(raw: string) {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function parsePageRanges(input: string, pageCount: number): PageRange[] {
  const trimmed = input.trim();
  if (!trimmed) throw new I18nError("error.rangeEmpty");
  if (!Number.isFinite(pageCount) || pageCount <= 0) {
    throw new I18nError("error.noPageCount");
  }

  const tokens = trimmed
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tokens.length === 0) throw new I18nError("error.rangeInvalid");

  const ranges: PageRange[] = [];

  for (const tok of tokens) {
    const m = tok.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new I18nError("error.rangeFormat", { token: tok });

    const a = parsePositiveInt(m[1]!);
    const b = m[2] ? parsePositiveInt(m[2]) : a;
    if (!a || !b) throw new I18nError("error.rangeNotPositive", { token: tok });

    const start1 = Math.min(a, b);
    const end1 = Math.max(a, b);

    if (start1 < 1 || end1 > pageCount) {
      throw new I18nError("error.rangeOutOfBounds", { token: tok, max: pageCount });
    }

    ranges.push({ start: start1 - 1, end: end1 - 1 });
  }

  // Validate overlaps (avoid duplicated pages across outputs)
  const sorted = [...ranges].sort((x, y) =>
    x.start !== y.start ? x.start - y.start : x.end - y.end
  );
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]!;
    const cur = sorted[i]!;
    if (cur.start <= prev.end) {
      throw new I18nError("error.rangeOverlap", {
        a1: prev.start + 1,
        a2: prev.end + 1,
        b1: cur.start + 1,
        b2: cur.end + 1,
      });
    }
  }

  // Keep user order: each token => one PDF
  return ranges;
}
