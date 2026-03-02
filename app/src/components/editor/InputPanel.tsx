"use client";

import { OnePagerData } from "@/lib/types";
import { BrandSection } from "./BrandSection";
import { HeroSection } from "./HeroSection";
import { ValuePropsSection } from "./ValuePropsSection";
import { PricingSection } from "./PricingSection";
import { TeamSection } from "./TeamSection";
import { SecuritySection } from "./SecuritySection";
import { CTASection } from "./CTASection";
import { Separator } from "@/components/ui/separator";

interface InputPanelProps {
  data: OnePagerData;
  onChange: (data: OnePagerData) => void;
}

export function InputPanel({ data, onChange }: InputPanelProps) {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <BrandSection data={data} onChange={onChange} />
      <Separator />
      <HeroSection data={data} onChange={onChange} />
      <Separator />
      <ValuePropsSection data={data} onChange={onChange} />
      <Separator />
      <PricingSection data={data} onChange={onChange} />
      <Separator />
      <TeamSection data={data} onChange={onChange} />
      <Separator />
      <SecuritySection data={data} onChange={onChange} />
      <Separator />
      <CTASection data={data} onChange={onChange} />
    </div>
  );
}
