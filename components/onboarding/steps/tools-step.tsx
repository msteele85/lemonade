"use client";

import { OptionButton } from "../option-button";
import type { Tool } from "@/lib/types";

const options: { label: Tool; emoji: string }[] = [
  { label: "Smartphone", emoji: "📱" },
  { label: "Computer/laptop", emoji: "💻" },
  { label: "Basic craft supplies", emoji: "✂️" },
  { label: "Lawn/garden tools", emoji: "🌿" },
  { label: "Camera", emoji: "📷" },
  { label: "Musical instrument", emoji: "🎸" },
  { label: "None of the above", emoji: "🤷" },
];

interface ToolsStepProps {
  value: Tool[];
  onChange: (value: Tool[]) => void;
}

export function ToolsStep({ value, onChange }: ToolsStepProps) {
  const toggle = (tool: Tool) => {
    if (tool === "None of the above") {
      onChange(value.includes(tool) ? [] : [tool]);
      return;
    }
    // Remove "None of the above" if selecting a real tool
    const filtered = value.filter((t) => t !== "None of the above");
    if (filtered.includes(tool)) {
      onChange(filtered.filter((t) => t !== tool));
    } else {
      onChange([...filtered, tool]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-navy-400 mb-1">Select all that apply</p>
      {options.map((opt) => (
        <OptionButton
          key={opt.label}
          label={opt.label}
          emoji={opt.emoji}
          selected={value.includes(opt.label)}
          onClick={() => toggle(opt.label)}
        />
      ))}
    </div>
  );
}
