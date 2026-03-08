"use client";

import { OptionButton } from "../option-button";
import type { GoalType } from "@/lib/types";

const options: { label: string; value: GoalType; emoji: string }[] = [
  { label: "I want to make some fast cash today", value: "fast-cash", emoji: "💸" },
  { label: "I want to start something I can make money from every month", value: "recurring-income", emoji: "📈" },
];

interface GoalStepProps {
  value: GoalType | null;
  onChange: (value: GoalType) => void;
}

export function GoalStep({ value, onChange }: GoalStepProps) {
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
