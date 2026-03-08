"use client";

import { OptionButton } from "../option-button";
import type { HasTransportation } from "@/lib/types";

const options: { label: string; value: HasTransportation; emoji: string }[] = [
  { label: "Yes, I can drive myself", value: "yes-self", emoji: "🚗" },
  { label: "Yes, a parent/guardian can drive me", value: "yes-parent", emoji: "👨‍👩‍👧" },
  { label: "Not really", value: "no", emoji: "🚶" },
];

interface TransportationStepProps {
  value: HasTransportation | null;
  onChange: (value: HasTransportation) => void;
}

export function TransportationStep({ value, onChange }: TransportationStepProps) {
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
