"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/constants";

interface ImageUploaderProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

export function ImageUploader({ onFilesAdded, disabled }: ImageUploaderProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) onFilesAdded(acceptedFiles);
    },
    [onFilesAdded],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_MIME_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    disabled,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      role="button"
      tabIndex={0}
      aria-label="Upload images by dragging files here or clicking the button"
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          open();
        }
      }}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card/40 px-6 py-10 text-center transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDragActive && !isDragReject && "border-primary bg-primary/5",
        isDragReject && "border-destructive bg-destructive/5",
        !isDragActive && "hover:border-foreground/40",
        disabled && "cursor-not-allowed opacity-60",
      )}
      onClick={() => !disabled && open()}
    >
      <input {...getInputProps()} aria-label="Image file input" />
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-colors",
          isDragActive && !isDragReject && "bg-primary/10 text-primary",
          isDragReject && "bg-destructive/10 text-destructive",
        )}
      >
        <Upload className="h-5 w-5" aria-hidden />
      </div>
      <p className="mt-4 text-sm font-medium">
        {isDragReject
          ? "Some files aren't supported"
          : isDragActive
            ? "Drop to add"
            : "Drop images here or click to browse"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        JPG · PNG · WEBP · GIF · BMP — up to 25 MB each
      </p>
    </div>
  );
}
