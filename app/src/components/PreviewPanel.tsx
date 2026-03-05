"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PAGE_W = 816;
const PAGE_H = 1056;
const PAGE_GAP = 32;
const BODY_PAD = 32;

interface PreviewPanelProps {
  html: string | null;
}

export function PreviewPanel({ html }: PreviewPanelProps) {
  const [zoom, setZoom] = useState(0.65);
  const [pageCount, setPageCount] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const zoomLevels = [
    { label: "50%", value: 0.5 },
    { label: "65%", value: 0.65 },
    { label: "75%", value: 0.75 },
    { label: "100%", value: 1 },
  ];

  // Count .page divs in HTML string for sizing (no JS injection needed)
  useEffect(() => {
    if (!html) { setPageCount(1); return; }
    const matches = html.match(/class="page"/g);
    setPageCount(matches && matches.length > 0 ? matches.length : 1);
  }, [html]);

  const iframeHeight = pageCount > 1
    ? pageCount * PAGE_H + (pageCount - 1) * PAGE_GAP + BODY_PAD * 2
    : PAGE_H;

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Preview</span>
          {pageCount > 1 && (
            <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {pageCount} pages
            </span>
          )}
        </div>
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
              width: `${PAGE_W}px`,
              height: `${iframeHeight}px`,
              flexShrink: 0,
            }}
          >
            <iframe
              ref={iframeRef}
              srcDoc={html}
              style={{
                width: `${PAGE_W}px`,
                height: `${iframeHeight}px`,
                border: "none",
                borderRadius: pageCount > 1 ? "0" : "4px",
                boxShadow: pageCount > 1 ? "none" : "0 4px 24px rgba(0,0,0,0.12)",
                background: pageCount > 1 ? "#e8e8e8" : "white",
              }}
              title="Document Preview"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            <div className="text-center space-y-2">
              <p className="font-medium">No document yet</p>
              <p className="text-xs">Ask Claude Code to create a document, or select one from the sidebar.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
