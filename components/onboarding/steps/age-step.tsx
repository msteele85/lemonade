"use client";

import { OptionButton } from "../option-button";
import type { AgeRange } from "@/lib/types";

const options: { label: string; value: AgeRange; emoji: string }[] = [
  { label: "Under 8", value: "under-8", emoji: "💒" },
  { label: "8 – 11", value: "8-11", emoji: "🌱" },
  { label: "12 – 14", value: "12-14", emoji: "🌿" },
  { label: "15 – 17", value: "15-17", emoji: "🌳" },
  { label: "18+", value: "18+", emoji: "🎓" },
];

interface AgeStepProps {
  value: AgeRange | null;
  onChange: (value: AgeRange) => void;
}

export function AgeStep({ value, onChange }: AgeStepProps) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => (
        <OptionButton
          key={opt.value}
          label={opt.label}
          emoji={opt.emoji}
          selected={value === opt.value}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </div>
  );
}
