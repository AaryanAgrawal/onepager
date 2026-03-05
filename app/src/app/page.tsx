"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { EditableField } from "@/lib/types";
import { PreviewPanel } from "@/components/PreviewPanel";
import { DocumentTree } from "@/components/DocumentTree";
import { FileBrowser } from "@/components/FileBrowser";
import { TextFields } from "@/components/TextFields";
import { ExportNameDialog } from "@/components/ExportNameDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileDown, Save, ChevronDown, ChevronRight } from "lucide-react";

function parseFields(html: string): EditableField[] {
  const fields: EditableField[] = [];
  const regex = /<(\w+)[^>]*data-field="([^"]+)"[^>]*>([^<]*)</g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    fields.push({ tag: match[1], name: match[2], value: decodeHtmlEntities(match[3]) });
  }
  return fields;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

export default function Home() {
  const [html, setHtml] = useState<string | null>(null);
  const [fields, setFields] = useState<EditableField[]>([]);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [activeDocPath, setActiveDocPath] = useState<string | null>(null);
  const [showExports, setShowExports] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [recentAssets, setRecentAssets] = useState<Array<{ filename: string; template: string }>>([]);
  const lastModifiedRef = useRef(0);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragCounterRef = useRef(0);

  const setStatusWithAutoDismiss = useCallback((msg: string) => {
    setStatus(msg);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => setStatus(null), 3000);
  }, []);

  // Poll current.html every 500ms
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/current-html");
        const data = await res.json();
        if (!active) return;
        if (data.html && data.lastModified > lastModifiedRef.current) {
          lastModifiedRef.current = data.lastModified;
          setHtml(data.html);
          setFields(parseFields(data.html));
        } else if (!data.html) {
          setHtml(null);
          setFields([]);
        }
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 500);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const handleFieldChange = useCallback(async (name: string, value: string) => {
    try {
      await fetch("/api/update-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: name, value }),
      });
    } catch {}
  }, []);

  const handleExportPDF = useCallback(async (filename: string) => {
    setExporting(true);
    setShowExportDialog(false);
    setStatus(null);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Export failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusWithAutoDismiss("PDF exported!");
    } catch (err) {
      setStatusWithAutoDismiss(`Error: ${err instanceof Error ? err.message : "Export failed"}`);
    } finally {
      setExporting(false);
    }
  }, [setStatusWithAutoDismiss]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setStatus(null);
    try {
      if (activeDocPath) {
        // Save to active document
        const res = await fetch("/api/documents/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: activeDocPath }),
        });
        if (!res.ok) throw new Error("Save failed");
        setStatusWithAutoDismiss("Saved!");
      } else {
        // Fallback: save as draft
        const res = await fetch("/api/save-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Draft" }),
        });
        if (!res.ok) throw new Error("Save failed");
        setStatusWithAutoDismiss("Saved as draft!");
      }
    } catch (err) {
      setStatusWithAutoDismiss(`Error: ${err instanceof Error ? err.message : "Save failed"}`);
    } finally {
      setSaving(false);
    }
  }, [activeDocPath, setStatusWithAutoDismiss]);

  const handleLoadDocument = useCallback(async (docPath: string) => {
    try {
      const res = await fetch("/api/documents/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: docPath }),
      });
      if (!res.ok) throw new Error("Load failed");
      setActiveDocPath(docPath);
      lastModifiedRef.current = 0; // Force next poll to pick up
      setStatusWithAutoDismiss(`Loaded: ${docPath.split("/").pop()?.replace(".html", "")}`);
    } catch (err) {
      setStatusWithAutoDismiss(`Error: ${err instanceof Error ? err.message : "Load failed"}`);
    }
  }, [setStatusWithAutoDismiss]);

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    dragCounterRef.current = 0;

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      /\.(png|jpe?g|gif|svg|webp)$/i.test(f.name)
    );

    if (files.length === 0) {
      setStatusWithAutoDismiss("Drop an image file (PNG, JPG, SVG, WebP, GIF)");
      return;
    }

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/assets/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setRecentAssets((prev) => [{ filename: data.filename, template: data.template }, ...prev].slice(0, 5));
        setStatusWithAutoDismiss(`Uploaded: ${data.filename}`);
      } catch (err) {
        setStatusWithAutoDismiss(`Error: ${err instanceof Error ? err.message : "Upload failed"}`);
      }
    }
  }, [setStatusWithAutoDismiss]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current++;
    if (dragCounterRef.current === 1) setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setStatusWithAutoDismiss("Copied!");
  }, [setStatusWithAutoDismiss]);

  return (
    <div
      className="h-screen flex flex-col relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleFileDrop}
    >
      {/* Drop overlay */}
      {dragging && (
        <div className="absolute inset-0 z-50 bg-background/90 flex items-center justify-center pointer-events-none">
          <div className="border-2 border-dashed border-[#33ee69] rounded-xl p-12 text-center">
            <div className="text-2xl font-bold mb-2">Drop image here</div>
            <div className="text-sm text-muted-foreground">PNG, JPG, SVG, WebP, GIF — saved to assets/</div>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">OnePager</h1>
          {activeDocPath ? (
            <span className="text-xs text-muted-foreground">
              {activeDocPath.split("/").pop()?.replace(".html", "")}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Prompt Claude Code to create</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <span className={`text-xs px-2 py-1 rounded ${status.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {status}
            </span>
          )}
          <Button type="button" variant="outline" size="sm" onClick={handleSave} disabled={saving || !html}>
            <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save"}
          </Button>
          <Button type="button" size="sm" onClick={() => setShowExportDialog(true)} disabled={exporting || !html}>
            <FileDown className="h-4 w-4 mr-1" /> {exporting ? "Exporting..." : "Export PDF"}
          </Button>
          <ExportNameDialog open={showExportDialog} onOpenChange={setShowExportDialog} onExport={handleExportPDF} exporting={exporting} />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[280px] border-r bg-background flex-shrink-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {/* Document tree */}
            <div className="p-3">
              <DocumentTree onLoadDocument={handleLoadDocument} activeDocPath={activeDocPath} />
            </div>

            <Separator />

            {/* Collapsible saved exports */}
            <div className="p-3">
              <button
                onClick={() => setShowExports(!showExports)}
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 hover:text-foreground transition-colors"
              >
                {showExports ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                Saved Exports
              </button>
              {showExports && <FileBrowser onStatusChange={setStatusWithAutoDismiss} />}
            </div>

            <Separator />

            {/* Text fields section */}
            <div className="p-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quick Edit</h3>
              <TextFields fields={fields} onFieldChange={handleFieldChange} />
            </div>

            {recentAssets.length > 0 && (
              <>
                <Separator />
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Recent Assets</h3>
                  <div className="space-y-1.5">
                    {recentAssets.map((asset, i) => (
                      <button
                        key={i}
                        onClick={() => copyToClipboard(asset.template)}
                        className="w-full text-left text-xs p-2 rounded-md border hover:bg-accent/10 transition-colors group"
                        title="Click to copy template"
                      >
                        <div className="font-medium truncate">{asset.filename}</div>
                        <div className="text-muted-foreground truncate font-mono mt-0.5 group-hover:text-[#33ee69] transition-colors">
                          {asset.template}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Preview */}
        <div className="flex-1">
          <PreviewPanel html={html} />
        </div>
      </div>
    </div>
  );
}
