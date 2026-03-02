"use client";

import { OnePagerData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/shared/TagInput";

interface TeamSectionProps {
  data: OnePagerData;
  onChange: (data: OnePagerData) => void;
}

export function TeamSection({ data, onChange }: TeamSectionProps) {
  const t = data.team;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Team</h3>
      <div className="space-y-2">
        <Label className="text-xs">Section Title</Label>
        <Input value={t.sectionTitle} onChange={(e) => onChange({ ...data, team: { ...t, sectionTitle: e.target.value } })} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Roles</Label>
        <TagInput tags={t.roles} onChange={(roles) => onChange({ ...data, team: { ...t, roles } })} placeholder="Add role" />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Highlights</Label>
        <TagInput tags={t.highlights} onChange={(highlights) => onChange({ ...data, team: { ...t, highlights } })} placeholder="Add highlight" />
      </div>
    </div>
  );
}
