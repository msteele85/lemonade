"use client";

import { OptionButton } from "../option-button";
import type { HasTransportation, AgeRange } from "@/lib/types";

const allOptions: { label: string; value: HasTransportation; emoji: string }[] = [
  { label: "Yes, I can drive myself", value: "yes-self", emoji: "🚗" },
  { label: "Yes, a parent/guardian can drive me", value: "yes-parent", emoji: "👨‍👩‍👧" },
  { label: "Not really", value: "no", emoji: "🚶" },
];

const UNDER_16_AGES: AgeRange[] = ["under-8", "8-11", "12-14"];

interface TransportationStepProps {
  value: HasTransportation | null;
  onChange: (value: HasTransportation) => void;
  ageRange: AgeRange | null;
}

export function TransportationStep({ value, onChange, ageRange }: TransportationStepProps) {
  const options = ageRange && UNDER_16_AGES.includes(ageRange)
    ? allOptions.filter((opt) => opt.value !== "yes-self")
    : allOptions;

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
