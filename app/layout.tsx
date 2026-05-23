import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

export const metadata: Metadata = {
  title: "Image to PDF Converter — 100% Private, Free",
  description:
    "Convert JPG, PNG, WEBP, GIF, and BMP images to a single PDF — entirely in your browser. No uploads, no accounts, no cost.",
  keywords: [
    "image to pdf",
    "jpg to pdf",
    "png to pdf",
    "convert images to pdf",
    "client-side",
    "free",
    "private",
  ],
  authors: [{ name: "Image to PDF Converter" }],
  openGraph: {
    title: "Image to PDF Converter",
    description: "Convert images to PDF entirely in your browser.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={200}>
            <div className="flex min-h-screen flex-col">{children}</div>
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
