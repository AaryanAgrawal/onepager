"use client";

import { OnePagerData, PricingTier } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Star } from "lucide-react";

interface PricingSectionProps {
  data: OnePagerData;
  onChange: (data: OnePagerData) => void;
}

export function PricingSection({ data, onChange }: PricingSectionProps) {
  const p = data.pricing;

  function updateTier(index: number, patch: Partial<PricingTier>) {
    const next = p.tiers.map((t, i) => (i === index ? { ...t, ...patch } : t));
    onChange({ ...data, pricing: { ...p, tiers: next } });
  }

  function addTier() {
    onChange({
      ...data,
      pricing: { ...p, tiers: [...p.tiers, { name: "New Tier", price: "$0", unit: "/month", details: "Details" }] },
    });
  }

  function removeTier(index: number) {
    onChange({ ...data, pricing: { ...p, tiers: p.tiers.filter((_, i) => i !== index) } });
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Pricing</h3>

      <div className="space-y-2">
        <Label className="text-xs">Section Title</Label>
        <Input
          value={p.sectionTitle}
          onChange={(e) => onChange({ ...data, pricing: { ...p, sectionTitle: e.target.value } })}
        />
      </div>

      {p.tiers.map((tier, i) => (
        <div key={i} className="p-3 border rounded-md space-y-2 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Tier {i + 1}</span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant={tier.highlighted ? "default" : "ghost"}
                size="icon"
                className="h-6 w-6"
                onClick={() => updateTier(i, { highlighted: !tier.highlighted })}
                title="Highlight"
              >
                <Star className="h-3 w-3" />
              </Button>
              {p.tiers.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeTier(i)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Name</Label>
              <Input value={tier.name} onChange={(e) => updateTier(i, { name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Price</Label>
              <Input value={tier.price} onChange={(e) => updateTier(i, { price: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Unit</Label>
              <Input value={tier.unit} onChange={(e) => updateTier(i, { unit: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Details</Label>
            <Input value={tier.details} onChange={(e) => updateTier(i, { details: e.target.value })} />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addTier} disabled={p.tiers.length >= 4}>
        <Plus className="h-4 w-4 mr-1" /> Add Tier
      </Button>

      <div className="space-y-2">
        <Label className="text-xs">Footer Note</Label>
        <Input
          value={p.footerNote}
          onChange={(e) => onChange({ ...data, pricing: { ...p, footerNote: e.target.value } })}
        />
      </div>
    </div>
  );
}
