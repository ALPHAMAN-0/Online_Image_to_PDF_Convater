"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_LABEL,
} from "@/lib/constants";
import type { UploadedImage } from "@/types";

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isAcceptedMime(type: string): boolean {
  return Object.prototype.hasOwnProperty.call(ACCEPTED_MIME_TYPES, type);
}

export interface UseImageUploadReturn {
  images: UploadedImage[];
  addFiles: (files: File[]) => void;
  removeImage: (id: string) => void;
  clearAll: () => void;
  reorder: (sourceId: string, destinationId: string) => void;
  totalSize: number;
}

export function useImageUpload(): UseImageUploadReturn {
  const [images, setImages] = React.useState<UploadedImage[]>([]);

  // Revoke ALL blob URLs on unmount as a final safety net.
  React.useEffect(() => {
    return () => {
      setImages((current) => {
        current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        return [];
      });
    };
    // We deliberately only want this to fire on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = React.useCallback((files: File[]) => {
    const accepted: UploadedImage[] = [];
    const rejected: { name: string; reason: string }[] = [];

    for (const file of files) {
      if (!isAcceptedMime(file.type)) {
        rejected.push({ name: file.name, reason: "unsupported type" });
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        rejected.push({ name: file.name, reason: `exceeds ${MAX_FILE_SIZE_LABEL}` });
        continue;
      }
      accepted.push({
        id: generateId(),
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    if (accepted.length > 0) {
      setImages((current) => [...current, ...accepted]);
      toast.success(
        accepted.length === 1
          ? `Added ${accepted[0].name}`
          : `Added ${accepted.length} images`,
      );
    }

    if (rejected.length > 0) {
      const detail = rejected
        .slice(0, 3)
        .map((r) => `${r.name} (${r.reason})`)
        .join(", ");
      const extra = rejected.length > 3 ? ` and ${rejected.length - 3} more` : "";
      toast.error(`Couldn't add ${rejected.length} file${rejected.length === 1 ? "" : "s"}`, {
        description: `${detail}${extra}`,
      });
    }
  }, []);

  const removeImage = React.useCallback((id: string) => {
    setImages((current) => {
      const target = current.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = React.useCallback(() => {
    setImages((current) => {
      current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      return [];
    });
  }, []);

  const reorder = React.useCallback((sourceId: string, destinationId: string) => {
    if (sourceId === destinationId) return;
    setImages((current) => {
      const sourceIdx = current.findIndex((i) => i.id === sourceId);
      const destIdx = current.findIndex((i) => i.id === destinationId);
      if (sourceIdx === -1 || destIdx === -1) return current;
      const next = current.slice();
      const [moved] = next.splice(sourceIdx, 1);
      next.splice(destIdx, 0, moved);
      return next;
    });
  }, []);

  const totalSize = React.useMemo(
    () => images.reduce((sum, img) => sum + img.size, 0),
    [images],
  );

  return { images, addFiles, removeImage, clearAll, reorder, totalSize };
}
