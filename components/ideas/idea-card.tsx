"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp } from "lucide-react";
import type { BusinessIdea } from "@/lib/types";

interface IdeaCardProps {
  idea: BusinessIdea;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

export function IdeaCard({ idea, index, selected, onSelect }: IdeaCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      className={cn(
        "w-full text-left p-5 rounded-2xl border-2 transition-all",
        selected
          ? "border-lemon bg-lemon-50 shadow-lg shadow-lemon/20"
          : "border-navy-100 bg-white hover:border-navy-200 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-navy pr-2">{idea.name}</h3>
        <span
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap",
            idea.difficulty === "Easy"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          )}
        >
          {idea.difficulty}
        </span>
      </div>

      <p className="text-navy-600 text-sm mb-3">{idea.tagline}</p>

      <div className="flex items-center gap-1 text-sm text-navy-500 mb-2">
        <TrendingUp className="w-4 h-4" />
        <span className="font-medium">{idea.weeklyEarningPotential}/week</span>
      </div>

      <div className="flex items-start gap-2 text-sm text-navy-500 bg-navy-50/50 rounded-lg p-3">
        <Sparkles className="w-4 h-4 mt-0.5 text-lemon-600 flex-shrink-0" />
        <span>{idea.whyItFitsYou}</span>
      </div>
    </motion.button>
  );
}
