"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PdfItem } from "@/src/types/pdf";
import { formatBytes } from "@/src/lib/utils/format";
import { Button } from "@/src/components/ui/Button";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function PdfSortableRow({
  item,
  index,
  disabled,
  onRemove,
}: {
  item: PdfItem;
  index: number;
  disabled?: boolean;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cx(
        "flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-950/40 px-3 py-2",
        isDragging && "border-white/25 bg-white/10"
      )}
    >
      <button
        type="button"
        className={cx(
          "flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-200",
          disabled ? "cursor-not-allowed opacity-60" : "active:scale-[0.98]"
        )}
        aria-label="拖拽排序"
        {...attributes}
        {...listeners}
      >
        <span className="text-base leading-none">≡</span>
      </button>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">
          {index + 1}. {item.fileName}
        </div>
        <div className="mt-0.5 text-xs text-zinc-400">
          {item.pageCount} 页 · {formatBytes(item.fileSize)}
        </div>
      </div>

      <Button type="button" variant="ghost" disabled={disabled} onClick={onRemove}>
        删除
      </Button>
    </div>
  );
}

