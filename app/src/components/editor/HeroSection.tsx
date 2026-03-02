"use client";

import { OnePagerData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/shared/TagInput";

interface HeroSectionProps {
  data: OnePagerData;
  onChange: (data: OnePagerData) => void;
}

export function HeroSection({ data, onChange }: HeroSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Header</h3>
      <div className="space-y-2">
        <Label className="text-xs">Headline</Label>
        <Input
          value={data.hero.headline}
          onChange={(e) =>
            onChange({ ...data, hero: { ...data.hero, headline: e.target.value } })
          }
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Subheadline</Label>
        <Textarea
          value={data.hero.subheadline}
          onChange={(e) =>
            onChange({ ...data, hero: { ...data.hero, subheadline: e.target.value } })
          }
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Tags</Label>
        <TagInput
          tags={data.hero.tags}
          onChange={(tags) => onChange({ ...data, hero: { ...data.hero, tags } })}
          placeholder="Add tag and press Enter"
        />
      </div>
    </div>
  );
}
