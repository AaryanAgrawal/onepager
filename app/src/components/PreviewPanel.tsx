"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  html: string | null;
}

export function PreviewPanel({ html }: PreviewPanelProps) {
  const [zoom, setZoom] = useState(0.65);

  const zoomLevels = [
    { label: "50%", value: 0.5 },
    { label: "65%", value: 0.65 },
    { label: "75%", value: 0.75 },
    { label: "100%", value: 1 },
  ];

  return (
    <div className="flex flex-col h-full bg-muted/30">
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

      <div className="flex-1 overflow-auto flex justify-center p-6">
        {html ? (
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
              srcDoc={html}
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
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            <div className="text-center space-y-2">
              <p className="font-medium">No document yet</p>
              <p className="text-xs">Ask Claude Code to create a one-pager, or click a saved file to load it.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
