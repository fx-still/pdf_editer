export function fileBaseName(fileName: string) {
  const trimmed = fileName.trim();
  if (!trimmed) return "file";
  const lower = trimmed.toLowerCase();
  if (lower.endsWith(".pdf")) return trimmed.slice(0, -4) || "file";
  return trimmed;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  const fixed = i === 0 ? String(Math.round(v)) : v.toFixed(v >= 10 ? 1 : 2);
  return `${fixed} ${units[i]}`;
}

