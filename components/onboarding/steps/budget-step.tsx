"use client";

import { OptionButton } from "../option-button";
import type { StartingBudget } from "@/lib/types";

const options: { label: string; value: StartingBudget; emoji: string }[] = [
  { label: "$0 — no investment", value: "$0 (no investment)", emoji: "🆓" },
  { label: "Under $25", value: "Under $25", emoji: "💵" },
  { label: "$25 – $100", value: "$25-$100", emoji: "💰" },
  { label: "$100+", value: "$100+", emoji: "🏦" },
];

interface BudgetStepProps {
  value: StartingBudget | null;
  onChange: (value: StartingBudget) => void;
}

export function BudgetStep({ value, onChange }: BudgetStepProps) {
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
