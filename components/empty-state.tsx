import { Images, MousePointerClick, ShieldCheck } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <Images className="h-7 w-7 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="text-xl font-semibold tracking-tight">Drop images to get started</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Drag &amp; drop JPG, PNG, WEBP, GIF, or BMP files anywhere in the dropzone above — or click
        to browse. Reorder them, then generate your PDF in one click.
      </p>
      <div className="mx-auto mt-8 grid max-w-xl gap-4 text-left text-sm sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-lg border bg-background p-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden />
          <div>
            <p className="font-medium">100% private</p>
            <p className="text-xs text-muted-foreground">
              Images never leave your device. All conversion happens in your browser.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border bg-background p-3">
          <MousePointerClick className="mt-0.5 h-4 w-4 text-blue-500" aria-hidden />
          <div>
            <p className="font-medium">Drag to reorder</p>
            <p className="text-xs text-muted-foreground">
              The order of images becomes the order of pages in your PDF.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
