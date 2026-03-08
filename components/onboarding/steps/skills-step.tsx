"use client";

import { OptionButton } from "../option-button";
import type { Skill } from "@/lib/types";

const options: { label: Skill; emoji: string }[] = [
  { label: "Good with people", emoji: "💬" },
  { label: "Creative", emoji: "💡" },
  { label: "Organized", emoji: "📋" },
  { label: "Good with hands", emoji: "🛠️" },
  { label: "Tech-savvy", emoji: "💻" },
  { label: "Good writer", emoji: "✍️" },
  { label: "Teacher/explainer", emoji: "📚" },
  { label: "Athlete", emoji: "🏃" },
];

interface SkillsStepProps {
  value: Skill[];
  onChange: (value: Skill[]) => void;
}

export function SkillsStep({ value, onChange }: SkillsStepProps) {
  const toggle = (skill: Skill) => {
    if (value.includes(skill)) {
      onChange(value.filter((s) => s !== skill));
    } else if (value.length < 3) {
      onChange([...value, skill]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-navy-400 mb-1">
        {value.length}/3 selected
      </p>
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
