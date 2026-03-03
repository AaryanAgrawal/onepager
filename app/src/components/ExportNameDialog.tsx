"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExportNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (filename: string) => void;
  exporting: boolean;
}

export function ExportNameDialog({ open, onOpenChange, onExport, exporting }: ExportNameDialogProps) {
  const [filename, setFilename] = useState("Farhand - One Pager");

  const handleExport = useCallback(() => {
    const trimmed = filename.trim();
    if (trimmed) onExport(trimmed);
  }, [filename, onExport]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Export PDF</DialogTitle>
          <DialogDescription>Choose a filename for the exported PDF.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="export-filename" className="text-sm">Filename</Label>
          <Input
            id="export-filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleExport(); }}
            placeholder="My One-Pager"
            autoFocus
          />
          <p className="text-xs text-muted-foreground">.pdf will be appended automatically</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm">Cancel</Button>
          </DialogClose>
          <Button type="button" size="sm" onClick={handleExport} disabled={exporting || !filename.trim()}>
            {exporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
