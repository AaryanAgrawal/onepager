"use client";

import { useEffect, useState, useCallback } from "react";
import { SavedFile } from "@/lib/types";
import { FileText, File, Upload } from "lucide-react";

interface FileBrowserProps {
  onStatusChange?: (msg: string) => void;
}

export function FileBrowser({ onStatusChange }: FileBrowserProps) {
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/list-files");
        if (res.ok) setFiles(await res.json());
      } catch {}
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLoad = useCallback(async (file: SavedFile) => {
    if (!file.hasHTML || !file.htmlFile) return;
    setLoading(file.id);
    try {
      const res = await fetch("/api/load-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: file.id, htmlFile: file.htmlFile }),
      });
      if (!res.ok) throw new Error("Load failed");
      onStatusChange?.(`Loaded: ${file.name}`);
    } catch {
      onStatusChange?.("Error: Failed to load draft");
    } finally {
      setLoading(null);
    }
  }, [onStatusChange]);

  if (files.length === 0) {
    return (
      <div className="text-xs text-muted-foreground p-2">
        No saved files yet. Export or save a draft to see files here.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {files.map((f) => (
        <div key={f.id} className="flex items-center gap-1 text-xs">
          {f.hasHTML && f.htmlFile && (
            <>
              <a
                href={`/api/serve-file/${f.id}/${f.htmlFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-muted/50 transition-colors flex-1 min-w-0"
                title="Open HTML"
              >
                <FileText className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium truncate">{f.name}</div>
                  <div className="text-muted-foreground text-[10px]">{f.createdAt}</div>
                </div>
              </a>
              <button
                onClick={() => handleLoad(f)}
                disabled={loading === f.id}
                className="p-1 rounded hover:bg-muted/50 transition-colors flex-shrink-0 disabled:opacity-50"
                title="Load into editor"
              >
                <Upload className="h-3.5 w-3.5 text-blue-500" />
              </button>
            </>
          )}
          {f.hasPDF && (
            <a
              href={`/api/serve-file/${f.id}/${f.name.replace(/[^a-zA-Z0-9 ._-]/g, "")}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-muted/50 transition-colors flex-shrink-0"
              title="Open PDF"
            >
              <File className="h-3.5 w-3.5 text-red-500" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
