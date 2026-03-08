"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanStep } from "@/lib/types";

interface ChecklistProps {
  steps: PlanStep[];
}

export function Checklist({ steps }: ChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    const next = new Set(checked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setChecked(next);
  };

  const progress = steps.length > 0 ? (checked.size / steps.length) * 100 : 0;

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 bg-navy-50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-lemon rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm font-medium text-navy-400 whitespace-nowrap">
          {checked.size}/{steps.length}
        </span>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl text-left transition-colors",
              checked.has(i) ? "bg-lemon-50" : "bg-navy-50/50 hover:bg-navy-50"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                checked.has(i)
                  ? "bg-lemon border-lemon"
                  : "border-navy-200 bg-white"
              )}
            >
              {checked.has(i) && <Check className="w-3.5 h-3.5 text-navy" />}
            </div>
            <div>
              <p
                className={cn(
                  "font-semibold text-sm",
                  checked.has(i) ? "text-navy-400 line-through" : "text-navy"
                )}
              >
                {step.title}
              </p>
              <p className="text-sm text-navy-500 mt-0.5">{step.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
