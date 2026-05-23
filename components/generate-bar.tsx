"use client";

import * as React from "react";
import { FileDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface GenerateBarProps {
  filename: string;
  onFilenameChange: (value: string) => void;
  imageCount: number;
  isGenerating: boolean;
  progress: number;
  currentPage: number;
  totalPages: number;
  onGenerate: () => void;
  disabled?: boolean;
}

export function GenerateBar({
  filename,
  onFilenameChange,
  imageCount,
  isGenerating,
  progress,
  currentPage,
  totalPages,
  onGenerate,
  disabled,
}: GenerateBarProps) {
  const progressPct = Math.round(progress * 100);

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="filename">PDF filename</Label>
            <div className="flex items-stretch">
              <Input
                id="filename"
                value={filename}
                onChange={(e) => onFilenameChange(e.target.value)}
                placeholder="images"
                disabled={isGenerating}
                className="rounded-r-none"
                aria-label="PDF filename"
              />
              <div className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                .pdf
              </div>
            </div>
          </div>
          <Button
            size="lg"
            onClick={onGenerate}
            disabled={disabled || isGenerating || imageCount === 0}
            className="min-w-[180px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                Generating…
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" aria-hidden />
                Generate PDF
              </>
            )}
          </Button>
        </div>

        {isGenerating && (
          <div className="space-y-2 animate-fade-in" role="status" aria-live="polite">
            <Progress value={progressPct} aria-label="PDF generation progress" />
            <p className="text-xs text-muted-foreground tabular-nums">
              Processing page {currentPage} of {totalPages} ({progressPct}%)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
