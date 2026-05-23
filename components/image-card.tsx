"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/format";
import { Button } from "@/components/ui/button";
import type { UploadedImage } from "@/types";

interface ImageCardProps {
  image: UploadedImage;
  index: number;
  onRemove: (id: string) => void;
}

export function ImageCard({ image, index, onRemove }: ImageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow",
        isDragging && "z-10 shadow-lg ring-2 ring-primary",
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {/* Using a plain <img> for blob: URLs — next/image disallows blob sources */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.previewUrl}
          alt={image.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute left-2 top-2 rounded-md bg-background/85 px-1.5 py-0.5 text-xs font-medium tabular-nums backdrop-blur">
          {index + 1}
        </div>
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${image.name}`}
          className="absolute right-2 top-2 inline-flex h-7 w-7 cursor-grab items-center justify-center rounded-md bg-background/85 text-foreground/80 opacity-0 backdrop-blur transition-opacity hover:text-foreground focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing group-hover:opacity-100"
        >
          <GripVertical className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="flex items-start justify-between gap-2 p-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium" title={image.name}>
            {image.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{formatBytes(image.size)}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
          aria-label={`Remove ${image.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(image.id);
          }}
        >
          <X className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
