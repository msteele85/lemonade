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
  { label: "Other", emoji: "✨" },
];

interface SkillsStepProps {
  value: Skill[];
  onChange: (value: Skill[]) => void;
  customText: string;
  onCustomTextChange: (value: string) => void;
}

export function SkillsStep({ value, onChange, customText, onCustomTextChange }: SkillsStepProps) {
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
      {value.includes("Other") && (
        <div className="mt-2">
          <textarea
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="Tell us what you're good at..."
            maxLength={200}
            className="w-full p-3 rounded-xl border-2 border-navy-100 bg-white text-navy text-sm placeholder:text-navy-300 focus:outline-none focus:border-lemon transition-colors resize-none"
            rows={3}
          />
          <p className="text-xs text-navy-400 mt-1">
            Don&apos;t share personal info — just share some of your interests.
          </p>
        </div>
      )}
    </div>
  );
}
