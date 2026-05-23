export type PageSize = "a4" | "letter" | "legal" | "a3" | "auto";
export type Orientation = "portrait" | "landscape" | "auto";
export type Margin = "none" | "small" | "medium" | "large";
export type ImageFit = "fit" | "stretch" | "original";
export type Quality = "low" | "medium" | "high";

export interface PdfSettings {
  pageSize: PageSize;
  orientation: Orientation;
  margin: Margin;
  imageFit: ImageFit;
  quality: Quality;
  filename: string;
}

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
}

export interface GenerationProgress {
  current: number;
  total: number;
  ratio: number;
}
