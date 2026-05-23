"use client";

import * as React from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageCard } from "@/components/image-card";
import { formatBytes } from "@/lib/format";
import type { UploadedImage } from "@/types";

interface ImageGridProps {
  images: UploadedImage[];
  totalSize: number;
  onRemove: (id: string) => void;
  onClear: () => void;
  onReorder: (sourceId: string, destinationId: string) => void;
}

export function ImageGrid({ images, totalSize, onRemove, onClear, onReorder }: ImageGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = React.useMemo(() => images.map((i) => i.id), [images]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
  };

  return (
    <section aria-label="Uploaded images" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm">
          <span className="font-medium">{images.length}</span>{" "}
          <span className="text-muted-foreground">
            image{images.length === 1 ? "" : "s"} · {formatBytes(totalSize)} total
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="mr-1.5 h-4 w-4" aria-hidden />
          Clear all
        </Button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((image, index) => (
              <ImageCard key={image.id} image={image} index={index} onRemove={onRemove} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
