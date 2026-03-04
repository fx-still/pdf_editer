import Link from "next/link";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-12 w-full max-w-3xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            PDF 工具
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/merge"
              className="rounded-md px-2 py-1 text-zinc-200 hover:bg-white/10"
            >
              Merge
            </Link>
            <Link
              href="/split"
              className="rounded-md px-2 py-1 text-zinc-200 hover:bg-white/10"
            >
              Split
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mx-auto w-full max-w-3xl px-4 pb-10 pt-6 text-xs text-zinc-500">
        本工具仅在浏览器本地处理 PDF；生产环境启用 PWA（离线缓存）。
      </footer>
    </div>
  );
}

