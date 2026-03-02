"use client";

import { OnePagerData, SecurityItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SecuritySectionProps {
  data: OnePagerData;
  onChange: (data: OnePagerData) => void;
}

export function SecuritySection({ data, onChange }: SecuritySectionProps) {
  const s = data.security;

  function updateItem(index: number, patch: Partial<SecurityItem>) {
    const next = s.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange({ ...data, security: { ...s, items: next } });
  }

  function addItem() {
    onChange({ ...data, security: { ...s, items: [...s.items, { icon: "🔒", text: "New item" }] } });
  }

  function removeItem(index: number) {
    onChange({ ...data, security: { ...s, items: s.items.filter((_, i) => i !== index) } });
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Security & Trust</h3>
      <div className="space-y-2">
        <Label className="text-xs">Section Title</Label>
        <Input value={s.sectionTitle} onChange={(e) => onChange({ ...data, security: { ...s, sectionTitle: e.target.value } })} />
      </div>

      {s.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input value={item.icon} onChange={(e) => updateItem(i, { icon: e.target.value })} className="w-12 text-center" />
          <Input value={item.text} onChange={(e) => updateItem(i, { text: e.target.value })} className="flex-1" />
          {s.items.length > 1 && (
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4 mr-1" /> Add Item
      </Button>
    </div>
  );
}
