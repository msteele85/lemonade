"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  emoji?: string;
}

export function OptionButton({
  label,
  selected,
  onClick,
  emoji,
}: OptionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors",
        selected
          ? "border-lemon bg-lemon-50 text-navy"
          : "border-navy-100 bg-white text-navy-700 hover:border-navy-200"
      )}
    >
      {emoji && <span className="text-xl">{emoji}</span>}
      <span className="flex-1 font-medium">{label}</span>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 bg-lemon rounded-full flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-navy" />
        </motion.div>
      )}
    </motion.button>
  );
}
