"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { EditableField } from "@/lib/types";
import { PreviewPanel } from "@/components/PreviewPanel";
import { FileBrowser } from "@/components/FileBrowser";
import { TextFields } from "@/components/TextFields";
import { ExportNameDialog } from "@/components/ExportNameDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileDown, Save } from "lucide-react";

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
  const lastModifiedRef = useRef(0);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      // Next poll will pick up the change
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

  const handleSaveDraft = useCallback(async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Draft" }),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatusWithAutoDismiss("Saved!");
    } catch (err) {
      setStatusWithAutoDismiss(`Error: ${err instanceof Error ? err.message : "Save failed"}`);
    } finally {
      setSaving(false);
    }
  }, [setStatusWithAutoDismiss]);

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">OnePager</h1>
          <span className="text-xs text-muted-foreground">Prompt Claude Code to create</span>
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <span className={`text-xs px-2 py-1 rounded ${status.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {status}
            </span>
          )}
          <Button type="button" variant="outline" size="sm" onClick={handleSaveDraft} disabled={saving || !html}>
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
            {/* Files section */}
            <div className="p-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Saved Files</h3>
              <FileBrowser onStatusChange={setStatusWithAutoDismiss} />
            </div>

            <Separator />

            {/* Text fields section */}
            <div className="p-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quick Edit</h3>
              <TextFields fields={fields} onFieldChange={handleFieldChange} />
            </div>
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
