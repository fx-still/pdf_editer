export type Locale = "zh" | "en";

export const LOCALES: Locale[] = ["en", "zh"];

const zh = {
  "app.title": "PDF 极简工具站",
  "app.brand": "PDF 工具",
  "app.tagline": "全程在浏览器本地处理，不上传服务器。支持合并与拆分。",
  "lang.switch": "切换语言",

  "footer.privacyLabel": "隐私提示：",
  "footer.privacyText": "文件不会上传，但会在内存中处理；大文件可能占用较多内存。",
  "footer.getStarted": "现在开始",

  "home.mergeTitle": "合并 PDF",
  "home.mergeDesc": "多文件拖拽上传、排序后导出 merged.pdf",
  "home.splitTitle": "拆分 PDF",
  "home.splitDesc": "按范围 / 每 N 页 / 单页拆分，输出 zip",
  "home.enter": "进入",

  "common.clear": "清空",
  "common.processing": "处理中：{task}",
  "common.fileLimit": "单文件上限 {mb}MB",
  "common.pages": "{count} 页",
  "common.pages_one": "{count} 页",

  "dropzone.title": "拖拽 PDF 到这里",
  "dropzone.hint": "或点击按钮选择文件",
  "dropzone.pick": "选择 PDF",

  "error.onlyPdf": "仅支持 PDF 文件。",
  "error.fileTooLarge": "文件过大：上限 {mb}MB",
  "error.fileTooLargeNamed": "文件过大：{name}（上限 {mb}MB）",
  "error.readFailed": "读取 PDF 失败：请确认文件未损坏或受密码保护。",
  "error.noPageCount": "无法获取 PDF 页数。",
  "error.nInvalid": "N 必须是正整数。",
  "error.rangeEmpty": "请输入页范围。",
  "error.rangeInvalid": "请输入有效的页范围。",
  "error.rangeFormat": "范围格式错误：{token}",
  "error.rangeNotPositive": "范围不是正整数：{token}",
  "error.rangeOutOfBounds": "范围越界：{token}（有效：1-{max}）",
  "error.rangeOverlap": "范围重叠：p{a1}-{a2} 与 p{b1}-{b2}",

  "busy.readingPages": "读取 PDF 页数…",
  "busy.merging": "合并中…",
  "busy.splitting": "拆分中…",
  "busy.zipping": "打包 zip…",

  "merge.title": "合并 PDF",
  "merge.subtitle": "拖拽上传多个 PDF，支持排序。全程本地处理。",
  "merge.summary": "已添加 {count} 个文件 · 总页数 {pages}",
  "merge.export": "一键导出 merged.pdf",
  "merge.needTwo": "请至少上传 2 个 PDF。",
  "merge.done": "已生成 merged.pdf",
  "merge.failed": "合并失败：可能是文件损坏或内存不足。",
  "merge.empty": "还没有文件。先在上面上传多个 PDF 吧。",
  "merge.dragHandle": "拖拽排序",
  "merge.remove": "删除",

  "split.title": "拆分 PDF",
  "split.subtitle": "上传 1 个 PDF，选择拆分方式后导出 zip。全程本地处理。",
  "split.loaded": "已加载：{name}（{count} 页）",
  "split.loaded_one": "已加载：{name}（{count} 页）",
  "split.needFile": "请先上传一个 PDF。",
  "split.invalidN": "请输入有效的 N（正整数）。",
  "split.doneRanges": "已生成 ranges.zip",
  "split.doneZip": "已生成 zip",
  "split.doneSingle": "已生成 single_pages.zip",
  "split.failed": "拆分失败：可能是文件损坏或内存不足。",
  "split.currentFile": "当前文件：",
  "split.noFile": "未选择",
  "split.modeRange": "Range（按页范围）",
  "split.modeEveryN": "Every N（每 N 页）",
  "split.modeSingle": "Single pages（单页）",
  "split.rangeLabel": "页范围（例：1-3,5,8-10）",
  "split.rangeHint": "规则：逗号分隔；支持单页与区间（含空格、反向区间）；校验越界与重叠。",
  "split.everyNLabel": "每 N 页拆一个",
  "split.everyNPlaceholder": "例如 5",
  "split.singleHint": "将每一页单独输出为一个 PDF，并打包为 zip。",
  "split.export": "导出 zip",
} as const;

export type MessageKey = keyof typeof zh;

const en: Record<MessageKey, string> = {
  "app.title": "PDF Toolkit",
  "app.brand": "PDF Tools",
  "app.tagline":
    "Everything is processed locally in your browser — nothing is uploaded. Merge and split supported.",
  "lang.switch": "Switch language",

  "footer.privacyLabel": "Privacy:",
  "footer.privacyText":
    "Files are never uploaded, but they are processed in memory; large files may use a lot of memory.",
  "footer.getStarted": "Get started",

  "home.mergeTitle": "Merge PDF",
  "home.mergeDesc": "Drag in multiple files, reorder them, and export merged.pdf",
  "home.splitTitle": "Split PDF",
  "home.splitDesc": "Split by ranges / every N pages / single pages, exported as a zip",
  "home.enter": "Open",

  "common.clear": "Clear",
  "common.processing": "Processing: {task}",
  "common.fileLimit": "Max {mb}MB per file",
  "common.pages": "{count} pages",
  "common.pages_one": "{count} page",

  "dropzone.title": "Drop PDF files here",
  "dropzone.hint": "or click the button to choose files",
  "dropzone.pick": "Choose PDF",

  "error.onlyPdf": "Only PDF files are supported.",
  "error.fileTooLarge": "File too large: the limit is {mb}MB",
  "error.fileTooLargeNamed": "File too large: {name} (limit {mb}MB)",
  "error.readFailed":
    "Failed to read the PDF: make sure it isn't corrupted or password-protected.",
  "error.noPageCount": "Unable to determine the PDF page count.",
  "error.nInvalid": "N must be a positive integer.",
  "error.rangeEmpty": "Please enter page ranges.",
  "error.rangeInvalid": "Please enter valid page ranges.",
  "error.rangeFormat": "Invalid range format: {token}",
  "error.rangeNotPositive": "Range must use positive integers: {token}",
  "error.rangeOutOfBounds": "Range out of bounds: {token} (valid: 1-{max})",
  "error.rangeOverlap": "Overlapping ranges: p{a1}-{a2} and p{b1}-{b2}",

  "busy.readingPages": "Reading page count…",
  "busy.merging": "Merging…",
  "busy.splitting": "Splitting…",
  "busy.zipping": "Creating zip…",

  "merge.title": "Merge PDF",
  "merge.subtitle": "Drag in multiple PDFs and reorder them. Everything is processed locally.",
  "merge.summary": "Files: {count} · Total pages: {pages}",
  "merge.export": "Export merged.pdf",
  "merge.needTwo": "Please add at least 2 PDFs.",
  "merge.done": "merged.pdf is ready",
  "merge.failed": "Merge failed: the file may be corrupted or there isn't enough memory.",
  "merge.empty": "No files yet. Upload some PDFs above to get started.",
  "merge.dragHandle": "Drag to reorder",
  "merge.remove": "Remove",

  "split.title": "Split PDF",
  "split.subtitle":
    "Upload one PDF, choose how to split it, and export a zip. Everything is processed locally.",
  "split.loaded": "Loaded: {name} ({count} pages)",
  "split.loaded_one": "Loaded: {name} ({count} page)",
  "split.needFile": "Please upload a PDF first.",
  "split.invalidN": "Please enter a valid N (positive integer).",
  "split.doneRanges": "ranges.zip is ready",
  "split.doneZip": "Zip is ready",
  "split.doneSingle": "single_pages.zip is ready",
  "split.failed": "Split failed: the file may be corrupted or there isn't enough memory.",
  "split.currentFile": "Current file:",
  "split.noFile": "None selected",
  "split.modeRange": "Range (by page ranges)",
  "split.modeEveryN": "Every N (every N pages)",
  "split.modeSingle": "Single pages (one PDF per page)",
  "split.rangeLabel": "Page ranges (e.g. 1-3,5,8-10)",
  "split.rangeHint":
    "Rules: comma-separated; single pages and ranges are supported (spaces and reversed ranges allowed); out-of-bounds and overlapping ranges are rejected.",
  "split.everyNLabel": "Split every N pages",
  "split.everyNPlaceholder": "e.g. 5",
  "split.singleHint": "Each page is exported as its own PDF and bundled into a zip.",
  "split.export": "Export zip",
};

export const MESSAGES: Record<Locale, Record<MessageKey, string>> = { zh, en };

export type MessageParams = Record<string, string | number>;

/** Uses the `${key}_one` variant when `params.count === 1` and that variant exists. */
export function resolveMessage(locale: Locale, key: MessageKey, params?: MessageParams) {
  const dict = MESSAGES[locale];
  const oneKey = `${key}_one` as MessageKey;
  const template = params?.count === 1 && oneKey in dict ? dict[oneKey] : dict[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
}

/** Thrown by non-UI code so the UI can render the message in the current locale. */
export class I18nError extends Error {
  constructor(
    public readonly key: MessageKey,
    public readonly params?: MessageParams
  ) {
    super(resolveMessage("zh", key, params));
    this.name = "I18nError";
  }
}
