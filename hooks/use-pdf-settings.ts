"use client";

import * as React from "react";

import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "@/lib/constants";
import type { PdfSettings } from "@/types";

function loadInitial(): PdfSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<PdfSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function usePdfSettings() {
  const [settings, setSettings] = React.useState<PdfSettings>(() => ({ ...DEFAULT_SETTINGS }));
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from localStorage after mount to avoid SSR mismatch.
  React.useEffect(() => {
    setSettings(loadInitial());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage may be unavailable (private mode, quota); silently ignore.
    }
  }, [settings, hydrated]);

  const update = React.useCallback(<K extends keyof PdfSettings>(key: K, value: PdfSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  }, []);

  const reset = React.useCallback(() => setSettings({ ...DEFAULT_SETTINGS }), []);

  return { settings, update, reset };
}
