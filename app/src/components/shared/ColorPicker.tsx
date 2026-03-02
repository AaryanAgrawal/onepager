"use client";

import { HexColorPicker } from "react-colorful";
import { useState, useRef, useEffect } from "react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          className="w-8 h-8 rounded border border-input cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => setOpen(!open)}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-8 w-24 rounded-md border border-input bg-background px-2 text-xs"
        />
      </div>
      {open && (
        <div className="absolute z-50 mt-2">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
