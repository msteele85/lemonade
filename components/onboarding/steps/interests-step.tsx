"use client";

import { OptionButton } from "../option-button";
import type { Interest } from "@/lib/types";

const options: { label: Interest; emoji: string }[] = [
  { label: "Art & Design", emoji: "🎨" },
  { label: "Tech & Gaming", emoji: "🎮" },
  { label: "Animals", emoji: "🐾" },
  { label: "Food", emoji: "🍳" },
  { label: "Sports & Fitness", emoji: "⚽" },
  { label: "Music", emoji: "🎵" },
  { label: "People & Community", emoji: "🤝" },
  { label: "Nature & Outdoors", emoji: "🌲" },
  { label: "Fashion", emoji: "👗" },
  { label: "Other", emoji: "✨" },
];

interface InterestsStepProps {
  value: Interest[];
  onChange: (value: Interest[]) => void;
  customText: string;
  onCustomTextChange: (value: string) => void;
}

export function InterestsStep({ value, onChange, customText, onCustomTextChange }: InterestsStepProps) {
  const toggle = (interest: Interest) => {
    if (value.includes(interest)) {
      onChange(value.filter((i) => i !== interest));
    } else if (value.length < 3) {
      onChange([...value, interest]);
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
            placeholder="Tell us what you're interested in..."
            maxLength={200}
            className="w-full p-3 rounded-xl border-2 border-navy-100 bg-white text-navy text-sm placeholder:text-navy-300 focus:outline-none focus:border-lemon transition-colors resize-none"
            rows={3}
          />
          <p className="text-xs text-navy-400 mt-1">
            Don&apos;t share personal info — just tell us what you&apos;re into.
          </p>
        </div>
      )}
    </div>
  );
}
