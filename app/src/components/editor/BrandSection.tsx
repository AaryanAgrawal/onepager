"use client";

import { OnePagerData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LogoUpload } from "@/components/shared/LogoUpload";
import { ColorPicker } from "@/components/shared/ColorPicker";

interface BrandSectionProps {
  data: OnePagerData;
  onChange: (data: OnePagerData) => void;
}

export function BrandSection({ data, onChange }: BrandSectionProps) {
  const b = data.brand;
  function update(patch: Partial<OnePagerData["brand"]>) {
    onChange({ ...data, brand: { ...b, ...patch } });
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Brand & Customer</h3>

      <LogoUpload label="Company Logo" value={b.companyLogoUrl} onChange={(v) => update({ companyLogoUrl: v })} />

      <div className="space-y-2">
        <Label className="text-xs">Company Name</Label>
        <Input value={b.companyName} onChange={(e) => update({ companyName: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Tagline</Label>
        <Input value={b.tagline} onChange={(e) => update({ tagline: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label className="text-xs">Email</Label>
          <Input value={b.email} onChange={(e) => update({ email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Phone</Label>
          <Input value={b.phone} onChange={(e) => update({ phone: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Website</Label>
        <Input value={b.website} onChange={(e) => update({ website: e.target.value })} />
      </div>

      <Separator />

      <h4 className="text-xs font-semibold text-muted-foreground">Customer (optional)</h4>
      <LogoUpload label="Customer Logo" value={b.customerLogoUrl} onChange={(v) => update({ customerLogoUrl: v })} />
      <div className="space-y-2">
        <Label className="text-xs">Customer Name</Label>
        <Input value={b.customerName} onChange={(e) => update({ customerName: e.target.value })} />
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={b.showPreparedFor}
          onChange={(e) => update({ showPreparedFor: e.target.checked })}
          className="rounded"
        />
        Show &ldquo;Prepared for&rdquo; header
      </label>

      <Separator />

      <h4 className="text-xs font-semibold text-muted-foreground">Colors</h4>
      <div className="flex gap-4">
        <ColorPicker label="Primary" color={b.primaryColor} onChange={(v) => update({ primaryColor: v })} />
        <ColorPicker label="Accent" color={b.accentColor} onChange={(v) => update({ accentColor: v })} />
        <ColorPicker label="Background" color={b.backgroundColor} onChange={(v) => update({ backgroundColor: v })} />
      </div>
    </div>
  );
}
