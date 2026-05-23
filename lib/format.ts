export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(value >= 100 || i === 0 ? 0 : decimals)} ${sizes[i]}`;
}

export function sanitizeFilename(name: string): string {
  const trimmed = name.trim().replace(/\.pdf$/i, "");
  const cleaned = trimmed.replace(/[\\/:*?"<>|]/g, "_");
  return cleaned.length > 0 ? cleaned : "images";
}
