"use client";

import * as React from "react";
import { Settings2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  IMAGE_FIT_OPTIONS,
  MARGIN_OPTIONS,
  ORIENTATION_OPTIONS,
  PAGE_SIZE_OPTIONS,
  QUALITY_OPTIONS,
} from "@/lib/constants";
import type { ImageFit, Margin, Orientation, PageSize, PdfSettings, Quality } from "@/types";

interface SettingsPanelProps {
  settings: PdfSettings;
  onChange: <K extends keyof PdfSettings>(key: K, value: PdfSettings[K]) => void;
  disabled?: boolean;
}

export function SettingsPanel({ settings, onChange, disabled }: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings2 className="h-4 w-4" aria-hidden />
          PDF settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="page-size">Page size</Label>
          <Select
            value={settings.pageSize}
            onValueChange={(v) => onChange("pageSize", v as PageSize)}
            disabled={disabled}
          >
            <SelectTrigger id="page-size" aria-label="Page size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orientation">Orientation</Label>
          <Select
            value={settings.orientation}
            onValueChange={(v) => onChange("orientation", v as Orientation)}
            disabled={disabled || settings.pageSize === "auto"}
          >
            <SelectTrigger id="orientation" aria-label="Orientation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORIENTATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {settings.pageSize === "auto" && (
            <p className="text-xs text-muted-foreground">
              Orientation is set per image when page size is Auto.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="margin">Margin</Label>
          <Select
            value={settings.margin}
            onValueChange={(v) => onChange("margin", v as Margin)}
            disabled={disabled}
          >
            <SelectTrigger id="margin" aria-label="Margin">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MARGIN_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2.5">
          <Label>Image fit</Label>
          <RadioGroup
            value={settings.imageFit}
            onValueChange={(v) => onChange("imageFit", v as ImageFit)}
            disabled={disabled}
            className="gap-2"
          >
            {IMAGE_FIT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                htmlFor={`fit-${opt.value}`}
                className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem id={`fit-${opt.value}`} value={opt.value} className="mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quality">Quality</Label>
          <Select
            value={settings.quality}
            onValueChange={(v) => onChange("quality", v as Quality)}
            disabled={disabled}
          >
            <SelectTrigger id="quality" aria-label="Quality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUALITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
