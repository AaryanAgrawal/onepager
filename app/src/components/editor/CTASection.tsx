"use client";

import { OnePagerData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CTASectionProps {
  data: OnePagerData;
  onChange: (data: OnePagerData) => void;
}

export function CTASection({ data, onChange }: CTASectionProps) {
  const c = data.cta;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Call to Action</h3>
      <div className="space-y-2">
        <Label className="text-xs">CTA Text</Label>
        <Textarea value={c.text} onChange={(e) => onChange({ ...data, cta: { ...c, text: e.target.value } })} rows={2} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Email</Label>
        <Input value={c.email} onChange={(e) => onChange({ ...data, cta: { ...c, email: e.target.value } })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label className="text-xs">Phone</Label>
          <Input value={c.phone} onChange={(e) => onChange({ ...data, cta: { ...c, phone: e.target.value } })} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Website</Label>
          <Input value={c.website} onChange={(e) => onChange({ ...data, cta: { ...c, website: e.target.value } })} />
        </div>
      </div>
    </div>
  );
}
