"use client";

import { OptionButton } from "../option-button";
import type { NeighborhoodType } from "@/lib/types";

const options: { label: string; value: NeighborhoodType; emoji: string }[] = [
  { label: "Houses with yards nearby", value: "suburban", emoji: "🏡" },
  { label: "City / apartment building", value: "urban-apartment", emoji: "🏙️" },
  { label: "Rural / spread out", value: "rural", emoji: "🌾" },
  { label: "Something else", value: "other", emoji: "📍" },
];

interface NeighborhoodStepProps {
  value: NeighborhoodType | null;
  onChange: (value: NeighborhoodType) => void;
}

export function NeighborhoodStep({ value, onChange }: NeighborhoodStepProps) {
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
