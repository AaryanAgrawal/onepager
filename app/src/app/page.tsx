"use client";

import { useState, useCallback } from "react";
import { OnePagerData } from "@/lib/types";
import { defaultData } from "@/lib/defaultData";
import { renderTemplate } from "@/lib/renderTemplate";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { InputPanel } from "@/components/editor/InputPanel";
import { PreviewPanel } from "@/components/editor/PreviewPanel";
import { Button } from "@/components/ui/button";
import { FileDown, Save, FilePlus } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState<OnePagerData>(defaultData);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const debouncedData = useDebouncedValue(formData, 150);

  const handleExportPDF = useCallback(async () => {
    setExporting(true);
    setStatus(null);
    try {
      const html = renderTemplate(formData);
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          filename: `${formData.brand.companyName} - One Pager`,
          customerName: formData.brand.customerName || formData.brand.companyName,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.brand.companyName} - One Pager.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("PDF exported!");
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Export failed"}`);
    } finally {
      setExporting(false);
    }
  }, [formData]);

  const handleSaveDraft = useCallback(async () => {
    setSaving(true);
    setStatus(null);
    try {
      const html = renderTemplate(formData);
      const res = await fetch("/api/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          formData,
          customerName: formData.brand.customerName || formData.brand.companyName,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      setStatus("Draft saved!");
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Save failed"}`);
    } finally {
      setSaving(false);
    }
  }, [formData]);

  const handleNew = useCallback(() => {
    setFormData(defaultData);
    setStatus(null);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">OnePager</h1>
          <span className="text-xs text-muted-foreground">Branded PDF Generator</span>
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <span
              className={`text-xs px-2 py-1 rounded ${status.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
            >
              {status}
            </span>
          )}
          <Button type="button" variant="outline" size="sm" onClick={handleNew}>
            <FilePlus className="h-4 w-4 mr-1" /> New
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleSaveDraft} disabled={saving}>
            <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button type="button" size="sm" onClick={handleExportPDF} disabled={exporting}>
            <FileDown className="h-4 w-4 mr-1" /> {exporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </header>

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Input panel — fixed width */}
        <div className="w-[380px] border-r bg-background flex-shrink-0">
          <InputPanel data={formData} onChange={setFormData} />
        </div>

        {/* Preview panel — fills remaining space */}
        <div className="flex-1">
          <PreviewPanel data={debouncedData} />
        </div>
      </div>
    </div>
  );
}
