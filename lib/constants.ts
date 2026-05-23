import type { ImageFit, Margin, Orientation, PageSize, Quality } from "@/types";

export const ACCEPTED_MIME_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/bmp": [".bmp"],
};

export const ACCEPTED_EXTENSIONS = Object.values(ACCEPTED_MIME_TYPES).flat();

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB per image
export const MAX_FILE_SIZE_LABEL = "25 MB";

export const PAGE_SIZE_OPTIONS: { value: PageSize; label: string }[] = [
  { value: "a4", label: "A4 (210 × 297 mm)" },
  { value: "letter", label: "Letter (8.5 × 11 in)" },
  { value: "legal", label: "Legal (8.5 × 14 in)" },
  { value: "a3", label: "A3 (297 × 420 mm)" },
  { value: "auto", label: "Auto (fit image)" },
];

export const ORIENTATION_OPTIONS: { value: Orientation; label: string }[] = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "auto", label: "Auto" },
];

export const MARGIN_OPTIONS: { value: Margin; label: string }[] = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export const IMAGE_FIT_OPTIONS: { value: ImageFit; label: string; description: string }[] = [
  { value: "fit", label: "Fit to page", description: "Maintain aspect ratio, letterboxed" },
  { value: "stretch", label: "Stretch", description: "Fill page, may distort" },
  { value: "original", label: "Original size", description: "Place at natural size, centered" },
];

export const QUALITY_OPTIONS: { value: Quality; label: string }[] = [
  { value: "low", label: "Low (smaller file)" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High (best quality)" },
];

// Page dimensions in mm — jsPDF's mm unit.
export const PAGE_DIMENSIONS_MM: Record<Exclude<PageSize, "auto">, [number, number]> = {
  a4: [210, 297],
  letter: [215.9, 279.4],
  legal: [215.9, 355.6],
  a3: [297, 420],
};

export const MARGIN_MM: Record<Margin, number> = {
  none: 0,
  small: 10,
  medium: 20,
  large: 30,
};

// JPEG quality factor for canvas.toDataURL.
export const QUALITY_VALUES: Record<Quality, number> = {
  low: 0.55,
  medium: 0.78,
  high: 0.92,
};

// Cap the longest edge during compression to keep PDFs reasonable.
// A typical phone photo is 4000-6000px; capping to ~2400 keeps quality high
// while shrinking final PDF significantly.
export const MAX_IMAGE_DIMENSION: Record<Quality, number> = {
  low: 1400,
  medium: 2000,
  high: 3000,
};

export const DEFAULT_SETTINGS = {
  pageSize: "a4" as PageSize,
  orientation: "auto" as Orientation,
  margin: "small" as Margin,
  imageFit: "fit" as ImageFit,
  quality: "medium" as Quality,
  filename: "images",
};

export const SETTINGS_STORAGE_KEY = "img2pdf:settings:v1";
