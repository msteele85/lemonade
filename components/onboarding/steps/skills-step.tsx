"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";
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
  customText: string;
  onCustomTextChange: (value: string) => void;
}

export function SkillsStep({ value, onChange, customText, onCustomTextChange }: SkillsStepProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const otherSelected = value.includes("Other");

  const toggle = (skill: Skill) => {
    if (value.includes(skill)) {
      onChange(value.filter((s) => s !== skill));
    } else if (value.length < 3) {
      onChange([...value, skill]);
    }
  };

  useEffect(() => {
    if (otherSelected && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [otherSelected]);

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

      {/* Write-in option */}
      <div className="mt-1">
        <motion.button
          onClick={() => toggle("Other")}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed text-left transition-colors",
            otherSelected
              ? "border-lemon bg-lemon-50 text-navy"
              : "border-navy-200 bg-white text-navy-700 hover:border-navy-300"
          )}
        >
          <span className="text-xl">
            <Pencil className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <span className="font-medium">Something else?</span>
            <span className="block text-xs text-navy-400 mt-0.5">
              Type your own — the more specific, the better your ideas
            </span>
          </div>
          {otherSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 bg-lemon rounded-full flex items-center justify-center flex-shrink-0"
            >
              <Check className="w-4 h-4 text-navy" />
            </motion.div>
          )}
        </motion.button>

        <AnimatePresence>
          {otherSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3">
                <textarea
                  ref={textareaRef}
                  value={customText}
                  onChange={(e) => onCustomTextChange(e.target.value)}
                  placeholder="e.g., I can fix almost anything, I'm great at negotiating, I speak Spanish..."
                  maxLength={200}
                  className="w-full p-3 rounded-xl border-2 border-navy-100 bg-white text-navy text-sm placeholder:text-navy-300 focus:outline-none focus:border-lemon transition-colors resize-none"
                  rows={3}
                />
                <p className="text-xs text-navy-400 mt-1">
                  Don&apos;t share personal info — just tell us what you&apos;re good at.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
