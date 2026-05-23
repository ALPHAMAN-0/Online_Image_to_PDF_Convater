import exifr from "exifr";

import { MAX_IMAGE_DIMENSION, QUALITY_VALUES } from "@/lib/constants";
import type { Quality } from "@/types";

/**
 * Read the EXIF orientation tag (1-8) from a JPEG file.
 * Returns 1 (normal) on failure or for non-JPEG inputs.
 *
 * Why: phone photos store orientation as metadata; without applying it,
 * portrait shots end up sideways in the rendered PDF.
 */
export async function readOrientation(file: File): Promise<number> {
  if (file.type !== "image/jpeg") return 1;
  try {
    const orientation = await exifr.orientation(file);
    return typeof orientation === "number" && orientation >= 1 && orientation <= 8
      ? orientation
      : 1;
  } catch {
    return 1;
  }
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to decode image: ${file.name}`));
    };
    img.src = url;
  });
}

/**
 * Draw an image onto a fresh canvas, applying both EXIF rotation and a max-edge cap.
 * Returns the canvas and the final (post-rotation, post-resize) dimensions.
 *
 * Orientation map (EXIF spec):
 *   1: 0°            5: 0° + flip
 *   2: flip H        6: 90° CW
 *   3: 180°          7: 180° + flip
 *   4: flip V        8: 90° CCW
 */
export function drawCorrectedImage(
  img: HTMLImageElement,
  orientation: number,
  maxEdge: number,
): { canvas: HTMLCanvasElement; width: number; height: number } {
  // After rotation, source dims may swap.
  const rotated = orientation >= 5 && orientation <= 8;
  const srcW = rotated ? img.naturalHeight : img.naturalWidth;
  const srcH = rotated ? img.naturalWidth : img.naturalHeight;

  const scale = Math.min(1, maxEdge / Math.max(srcW, srcH));
  const outW = Math.max(1, Math.round(srcW * scale));
  const outH = Math.max(1, Math.round(srcH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context");

  // Apply EXIF transforms relative to the output canvas.
  switch (orientation) {
    case 2:
      ctx.translate(outW, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      ctx.translate(outW, outH);
      ctx.rotate(Math.PI);
      break;
    case 4:
      ctx.translate(0, outH);
      ctx.scale(1, -1);
      break;
    case 5:
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -outW);
      break;
    case 7:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(outH, -outW);
      ctx.scale(-1, 1);
      break;
    case 8:
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-outH, 0);
      break;
    default:
      break;
  }

  // After the EXIF transform the canvas's "drawing-space" matches the unrotated source,
  // so draw at the *unrotated* (rotated ? swapped back) dimensions.
  const drawW = rotated ? outH : outW;
  const drawH = rotated ? outW : outH;
  ctx.drawImage(img, 0, 0, drawW, drawH);

  return { canvas, width: outW, height: outH };
}

/**
 * Decode a file, apply EXIF correction + downsizing, and re-encode as JPEG.
 * Returns the data URL plus pixel dimensions so the PDF layer can compute mm sizing.
 *
 * Always re-encodes as JPEG — jsPDF handles JPEG most efficiently, and PNGs from
 * cameras rarely benefit from PNG's lossless overhead inside a PDF.
 */
export async function prepareImageForPdf(
  file: File,
  quality: Quality,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const [orientation, img] = await Promise.all([readOrientation(file), loadImageFromFile(file)]);
  const { canvas, width, height } = drawCorrectedImage(img, orientation, MAX_IMAGE_DIMENSION[quality]);
  const dataUrl = canvas.toDataURL("image/jpeg", QUALITY_VALUES[quality]);
  return { dataUrl, width, height };
}
