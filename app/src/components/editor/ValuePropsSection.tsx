"use client";

import { OnePagerData, ValueProp } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ValuePropsSectionProps {
  data: OnePagerData;
  onChange: (data: OnePagerData) => void;
}

export function ValuePropsSection({ data, onChange }: ValuePropsSectionProps) {
  const cols = data.valueProps.columns;

  function updateCol(index: number, patch: Partial<ValueProp>) {
    const next = cols.map((c, i) => (i === index ? { ...c, ...patch } : c));
    onChange({ ...data, valueProps: { columns: next } });
  }

  function addCol() {
    onChange({
      ...data,
      valueProps: {
        columns: [...cols, { icon: "✨", title: "New Value", description: "Description", badge: "Badge" }],
      },
    });
  }

  function removeCol(index: number) {
    onChange({ ...data, valueProps: { columns: cols.filter((_, i) => i !== index) } });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Value Propositions</h3>
        <Button type="button" variant="ghost" size="sm" onClick={addCol} disabled={cols.length >= 4}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {cols.map((col, i) => (
        <div key={i} className="p-3 border rounded-md space-y-2 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Column {i + 1}</span>
            {cols.length > 1 && (
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeCol(i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-[50px_1fr] gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Icon</Label>
              <Input value={col.icon} onChange={(e) => updateCol(i, { icon: e.target.value })} className="text-center" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Title</Label>
              <Input value={col.title} onChange={(e) => updateCol(i, { title: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Textarea value={col.description} onChange={(e) => updateCol(i, { description: e.target.value })} rows={2} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Badge</Label>
            <Input value={col.badge} onChange={(e) => updateCol(i, { badge: e.target.value })} />
          </div>
        </div>
      ))}
    </div>
  );
}
