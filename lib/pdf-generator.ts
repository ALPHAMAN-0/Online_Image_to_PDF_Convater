import { jsPDF } from "jspdf";

import { MARGIN_MM, PAGE_DIMENSIONS_MM } from "@/lib/constants";
import { prepareImageForPdf } from "@/lib/image-utils";
import type { PdfSettings, UploadedImage } from "@/types";

// Pixels-per-mm at 96 DPI (browser standard): 96 px / 25.4 mm ≈ 3.78
const PX_PER_MM = 96 / 25.4;
// Upper bound on auto page dimensions, in mm, so a 12000px image doesn't make a
// physically impossible PDF page.
const AUTO_PAGE_MAX_MM = 1200;

interface PageGeometry {
  width: number;
  height: number;
  orientation: "p" | "l";
}

function resolvePageGeometry(
  imgWidth: number,
  imgHeight: number,
  settings: PdfSettings,
): PageGeometry {
  if (settings.pageSize === "auto") {
    const widthMm = Math.min((imgWidth / PX_PER_MM), AUTO_PAGE_MAX_MM);
    const heightMm = Math.min((imgHeight / PX_PER_MM), AUTO_PAGE_MAX_MM);
    // For "auto" the orientation flag is informational only.
    return {
      width: widthMm,
      height: heightMm,
      orientation: widthMm > heightMm ? "l" : "p",
    };
  }

  const [shortSide, longSide] = PAGE_DIMENSIONS_MM[settings.pageSize];

  let orientation: "p" | "l";
  if (settings.orientation === "portrait") orientation = "p";
  else if (settings.orientation === "landscape") orientation = "l";
  else orientation = imgWidth > imgHeight ? "l" : "p";

  const [width, height] = orientation === "p" ? [shortSide, longSide] : [longSide, shortSide];
  return { width, height, orientation };
}

function placeImage(
  imgWidthPx: number,
  imgHeightPx: number,
  page: PageGeometry,
  settings: PdfSettings,
): { x: number; y: number; w: number; h: number } {
  const marginMm = MARGIN_MM[settings.margin];
  const printableW = Math.max(1, page.width - 2 * marginMm);
  const printableH = Math.max(1, page.height - 2 * marginMm);

  if (settings.imageFit === "stretch") {
    return { x: marginMm, y: marginMm, w: printableW, h: printableH };
  }

  if (settings.imageFit === "original") {
    const wMm = imgWidthPx / PX_PER_MM;
    const hMm = imgHeightPx / PX_PER_MM;
    return {
      x: (page.width - wMm) / 2,
      y: (page.height - hMm) / 2,
      w: wMm,
      h: hMm,
    };
  }

  // Fit-to-page: scale to fit inside printable area, preserve aspect ratio, center.
  const aspect = imgWidthPx / imgHeightPx;
  let w = printableW;
  let h = printableW / aspect;
  if (h > printableH) {
    h = printableH;
    w = printableH * aspect;
  }
  return {
    x: (page.width - w) / 2,
    y: (page.height - h) / 2,
    w,
    h,
  };
}

export interface GenerateOptions {
  onProgress?: (ratio: number, current: number, total: number) => void;
  signal?: AbortSignal;
}

/**
 * Pure PDF builder. Iterates images in the given order, applies settings, and
 * returns a Blob. Caller is responsible for triggering the download.
 */
export async function generatePdf(
  images: UploadedImage[],
  settings: PdfSettings,
  options: GenerateOptions = {},
): Promise<Blob> {
  if (images.length === 0) {
    throw new Error("No images to convert.");
  }

  // Initialize the doc using the first image's geometry; subsequent pages are added with explicit formats.
  const firstPrepared = await prepareImageForPdf(images[0].file, settings.quality);
  if (options.signal?.aborted) throw new Error("Generation aborted");

  const firstGeom = resolvePageGeometry(firstPrepared.width, firstPrepared.height, settings);
  const doc = new jsPDF({
    unit: "mm",
    orientation: firstGeom.orientation,
    format: [firstGeom.width, firstGeom.height],
    compress: true,
  });

  const addImageToCurrentPage = (
    dataUrl: string,
    widthPx: number,
    heightPx: number,
    page: PageGeometry,
  ) => {
    const placement = placeImage(widthPx, heightPx, page, settings);
    doc.addImage(dataUrl, "JPEG", placement.x, placement.y, placement.w, placement.h, undefined, "FAST");
  };

  addImageToCurrentPage(firstPrepared.dataUrl, firstPrepared.width, firstPrepared.height, firstGeom);
  options.onProgress?.(1 / images.length, 1, images.length);

  for (let i = 1; i < images.length; i++) {
    if (options.signal?.aborted) throw new Error("Generation aborted");
    const prepared = await prepareImageForPdf(images[i].file, settings.quality);
    const geom = resolvePageGeometry(prepared.width, prepared.height, settings);
    doc.addPage([geom.width, geom.height], geom.orientation);
    addImageToCurrentPage(prepared.dataUrl, prepared.width, prepared.height, geom);
    options.onProgress?.((i + 1) / images.length, i + 1, images.length);
  }

  return doc.output("blob");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so the download has time to start in all browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
