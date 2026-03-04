import type { PageRange } from "@/src/types/pdf";

function parsePositiveInt(raw: string) {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function parsePageRanges(input: string, pageCount: number): PageRange[] {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("请输入页范围。");
  if (!Number.isFinite(pageCount) || pageCount <= 0) {
    throw new Error("无法获取 PDF 页数。");
  }

  const tokens = trimmed
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tokens.length === 0) throw new Error("请输入有效的页范围。");

  const ranges: PageRange[] = [];

  for (const tok of tokens) {
    const m = tok.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new Error(`范围格式错误：${tok}`);

    const a = parsePositiveInt(m[1]!);
    const b = m[2] ? parsePositiveInt(m[2]) : a;
    if (!a || !b) throw new Error(`范围不是正整数：${tok}`);

    const start1 = Math.min(a, b);
    const end1 = Math.max(a, b);

    if (start1 < 1 || end1 > pageCount) {
      throw new Error(`范围越界：${tok}（有效：1-${pageCount}）`);
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
      throw new Error(
        `范围重叠：p${prev.start + 1}-${prev.end + 1} 与 p${cur.start + 1}-${cur.end + 1}`
      );
    }
  }

  // Keep user order: each token => one PDF
  return ranges;
}

