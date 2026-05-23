"use client";

import * as React from "react";
import { toast } from "sonner";

import { downloadBlob, generatePdf } from "@/lib/pdf-generator";
import { sanitizeFilename } from "@/lib/format";
import type { PdfSettings, UploadedImage } from "@/types";

interface GenerateState {
  isGenerating: boolean;
  progress: number;
  currentPage: number;
  totalPages: number;
}

const INITIAL_STATE: GenerateState = {
  isGenerating: false,
  progress: 0,
  currentPage: 0,
  totalPages: 0,
};

export function usePdfGenerator() {
  const [state, setState] = React.useState<GenerateState>(INITIAL_STATE);
  const abortRef = React.useRef<AbortController | null>(null);

  const generate = React.useCallback(
    async (images: UploadedImage[], settings: PdfSettings) => {
      if (images.length === 0) {
        toast.error("Add at least one image first.");
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({
        isGenerating: true,
        progress: 0,
        currentPage: 0,
        totalPages: images.length,
      });

      try {
        const blob = await generatePdf(images, settings, {
          signal: controller.signal,
          onProgress: (ratio, current, total) => {
            setState((s) => ({
              ...s,
              progress: ratio,
              currentPage: current,
              totalPages: total,
            }));
          },
        });
        const filename = sanitizeFilename(settings.filename);
        downloadBlob(blob, filename);
        toast.success("PDF ready", {
          description: `${filename}.pdf · ${images.length} page${images.length === 1 ? "" : "s"}`,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : "Unknown error";
        toast.error("PDF generation failed", { description: message });
        // Surface to the console for diagnostics; not user-facing.
        console.error(error);
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setState(INITIAL_STATE);
      }
    },
    [],
  );

  const cancel = React.useCallback(() => {
    abortRef.current?.abort();
    setState(INITIAL_STATE);
  }, []);

  React.useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return { ...state, generate, cancel };
}
