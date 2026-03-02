"use client";

import { useMemo, useState } from "react";
import { OnePagerData } from "@/lib/types";
import { renderTemplate } from "@/lib/renderTemplate";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  data: OnePagerData;
}

export function PreviewPanel({ data }: PreviewPanelProps) {
  const [zoom, setZoom] = useState(0.55);
  const htmlContent = useMemo(() => renderTemplate(data), [data]);

  const zoomLevels = [
    { label: "50%", value: 0.5 },
    { label: "65%", value: 0.65 },
    { label: "75%", value: 0.75 },
    { label: "100%", value: 1 },
  ];

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <span className="text-xs font-medium text-muted-foreground">Preview</span>
        <div className="flex gap-1">
          {zoomLevels.map((z) => (
            <Button
              key={z.value}
              type="button"
              variant={zoom === z.value ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => setZoom(z.value)}
            >
              {z.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-auto flex justify-center p-6">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            width: "816px",
            height: "1056px",
            flexShrink: 0,
          }}
        >
          <iframe
            srcDoc={htmlContent}
            style={{
              width: "816px",
              height: "1056px",
              border: "none",
              borderRadius: "4px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              background: "white",
            }}
            title="One-Pager Preview"
          />
        </div>
      </div>
    </div>
  );
}
