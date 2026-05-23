"use client";

import * as React from "react";

import { EmptyState } from "@/components/empty-state";
import { Footer } from "@/components/footer";
import { GenerateBar } from "@/components/generate-bar";
import { Header } from "@/components/header";
import { ImageGrid } from "@/components/image-grid";
import { ImageUploader } from "@/components/image-uploader";
import { SettingsPanel } from "@/components/settings-panel";
import { useImageUpload } from "@/hooks/use-image-upload";
import { usePdfGenerator } from "@/hooks/use-pdf-generator";
import { usePdfSettings } from "@/hooks/use-pdf-settings";

export default function HomePage() {
  const { images, addFiles, removeImage, clearAll, reorder, totalSize } = useImageUpload();
  const { settings, update } = usePdfSettings();
  const { isGenerating, progress, currentPage, totalPages, generate } = usePdfGenerator();

  const handleGenerate = React.useCallback(() => {
    generate(images, settings);
  }, [generate, images, settings]);

  return (
    <>
      <Header />
      <main className="container flex-1 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Image to PDF Converter
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Combine your images into a single PDF — drag, drop, reorder, and download. Everything
              runs in your browser, so your files stay on your device.
            </p>
          </div>

          <ImageUploader onFilesAdded={addFiles} disabled={isGenerating} />

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {images.length === 0 ? (
                <EmptyState />
              ) : (
                <ImageGrid
                  images={images}
                  totalSize={totalSize}
                  onRemove={removeImage}
                  onClear={clearAll}
                  onReorder={reorder}
                />
              )}
              <GenerateBar
                filename={settings.filename}
                onFilenameChange={(v) => update("filename", v)}
                imageCount={images.length}
                isGenerating={isGenerating}
                progress={progress}
                currentPage={currentPage}
                totalPages={totalPages}
                onGenerate={handleGenerate}
              />
            </div>
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <SettingsPanel settings={settings} onChange={update} disabled={isGenerating} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
