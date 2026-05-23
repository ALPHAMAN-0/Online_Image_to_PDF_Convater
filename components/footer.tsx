import { Github, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span>
            All processing happens in your browser. No uploads, no tracking, no cost.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Built with Next.js · jsPDF · shadcn/ui</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-foreground hover:underline"
            aria-label="View source on GitHub"
          >
            <Github className="h-4 w-4" />
            <span>Source</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
