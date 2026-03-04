import { Shell } from "@/src/components/layout/Shell";
import { Card } from "@/src/components/ui/Card";
import { ButtonLink } from "@/src/components/ui/Button";

export default function LandingPage() {
  return (
    <Shell>
      <div className="mx-auto w-full max-w-xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            PDF 极简工具站
          </h1>
          <p className="mt-2 text-sm text-zinc-300">
            全程在浏览器本地处理，不上传服务器。支持合并与拆分。
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-medium">合并 PDF</div>
                <div className="mt-1 text-sm text-zinc-300">
                  多文件拖拽上传、排序后导出 merged.pdf
                </div>
              </div>
              <ButtonLink href="/merge">进入</ButtonLink>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-medium">拆分 PDF</div>
                <div className="mt-1 text-sm text-zinc-300">
                  按范围 / 每 N 页 / 单页拆分，输出 zip
                </div>
              </div>
              <ButtonLink href="/split">进入</ButtonLink>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

