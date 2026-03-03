"use client";

import { useState, useCallback } from "react";
import { EditableField } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TextFieldsProps {
  fields: EditableField[];
  onFieldChange: (name: string, value: string) => void;
}

const FIELD_LABELS: Record<string, string> = {
  headline: "Headline",
  subheadline: "Subheadline",
  subtitle: "Subtitle",
  tagline: "Tagline",
  "hero-text": "Intro Paragraph",
  "segment-1": "Segment 1",
  "segment-2": "Segment 2",
  "segment-3": "Segment 3",
  "vp1-title": "Value Prop 1",
  "vp1-desc": "VP 1 Description",
  "vp1-badge": "VP 1 Badge",
  "vp2-title": "Value Prop 2",
  "vp2-desc": "VP 2 Description",
  "vp2-badge": "VP 2 Badge",
  "vp3-title": "Value Prop 3",
  "vp3-desc": "VP 3 Description",
  "vp3-badge": "VP 3 Badge",
  "workforce-1": "Workforce 1",
  "workforce-2": "Workforce 2",
  "workforce-3": "Workforce 3",
  "workforce-4": "Workforce 4",
  "platform-1": "AI Platform 1",
  "platform-2": "AI Platform 2",
  "platform-3": "AI Platform 3",
  "platform-4": "AI Platform 4",
  "platform-5": "AI Platform 5",
  "pricing-title": "Pricing Title",
  "team-title": "Team Title",
  "security-title": "Security Title",
  "cta-text": "CTA Text",
  phone: "Phone",
  email: "Email",
  website: "Website",
};

const LONG_FIELDS = new Set(["subheadline", "hero-text", "vp1-desc", "vp2-desc", "vp3-desc", "cta-text"]);

function formatFieldName(name: string): string {
  if (FIELD_LABELS[name]) return FIELD_LABELS[name];
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\b(Vp|Sc|Ms|Comp)\b/gi, (m) => m.toUpperCase())
    .replace(/(\d+)/g, " $1")
    .replace(/\s+/g, " ")
    .trim();
}

export function TextFields({ fields, onFieldChange }: TextFieldsProps) {
  const [pending, setPending] = useState<Record<string, string>>({});

  const handleChange = useCallback((name: string, value: string) => {
    setPending((p) => ({ ...p, [name]: value }));
  }, []);

  const handleBlur = useCallback((name: string) => {
    const value = pending[name];
    if (value !== undefined) {
      onFieldChange(name, value);
      setPending((p) => {
        const next = { ...p };
        delete next[name];
        return next;
      });
    }
  }, [pending, onFieldChange]);

  if (fields.length === 0) {
    return (
      <div className="text-xs text-muted-foreground p-2">
        No editable fields found. Fields with <code className="bg-muted px-1 rounded">data-field</code> attributes in the HTML will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {fields.map((f) => {
        const label = formatFieldName(f.name);
        const displayValue = pending[f.name] ?? f.value;
        const isLong = LONG_FIELDS.has(f.name);

        return (
          <div key={f.name} className="space-y-0.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
            {isLong ? (
              <Textarea
                value={displayValue}
                onChange={(e) => handleChange(f.name, e.target.value)}
                onBlur={() => handleBlur(f.name)}
                rows={2}
                className="text-xs"
              />
            ) : (
              <Input
                value={displayValue}
                onChange={(e) => handleChange(f.name, e.target.value)}
                onBlur={() => handleBlur(f.name)}
                className="h-8 text-xs"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
