"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { PdfItem } from "@/src/types/pdf";
import { PdfSortableRow } from "./PdfSortableRow";

export function PdfSortableList({
  items,
  onChange,
  disabled,
}: {
  items: PdfItem[];
  onChange: (items: PdfItem[]) => void;
  disabled?: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="grid gap-2">
      {items.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-zinc-950/40 p-3 text-sm text-zinc-400">
          还没有文件。先在上面上传多个 PDF 吧。
        </div>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (!over) return;
          if (active.id === over.id) return;
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over.id);
          if (oldIndex < 0 || newIndex < 0) return;
          onChange(arrayMove(items, oldIndex, newIndex));
        }}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((it, idx) => (
            <PdfSortableRow
              key={it.id}
              item={it}
              index={idx}
              disabled={disabled}
              onRemove={() => onChange(items.filter((x) => x.id !== it.id))}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

