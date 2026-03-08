"use client";

import { OptionButton } from "../option-button";
import type { TimePerWeek } from "@/lib/types";

const options: { label: string; value: TimePerWeek; emoji: string }[] = [
  { label: "Less than 5 hours", value: "Less than 5 hrs", emoji: "⏰" },
  { label: "5 – 10 hours", value: "5-10 hrs", emoji: "🕐" },
  { label: "10 – 20 hours", value: "10-20 hrs", emoji: "🕑" },
  { label: "20+ hours", value: "20+ hrs", emoji: "🔥" },
];

interface TimeStepProps {
  value: TimePerWeek | null;
  onChange: (value: TimePerWeek) => void;
}

export function TimeStep({ value, onChange }: TimeStepProps) {
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
