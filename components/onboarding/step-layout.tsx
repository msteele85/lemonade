"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "./progress-bar";
import { ArrowLeft } from "lucide-react";

interface StepLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  canContinue: boolean;
  onBack: () => void;
  onContinue: () => void;
  children: React.ReactNode;
}

export function StepLayout({
  step,
  totalSteps,
  title,
  subtitle,
  canContinue,
  onBack,
  onContinue,
  children,
}: StepLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff5c4] px-6 py-8 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {step > 0 && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-navy-50 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-navy-500" />
          </button>
        )}
        <div className="flex-1">
          <ProgressBar currentStep={step} totalSteps={totalSteps} />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          <h2 className="text-2xl font-bold text-navy mb-1">{title}</h2>
          {subtitle && (
            <p className="text-navy-500 mb-6">{subtitle}</p>
          )}

          <div className="flex-1">{children}</div>
        </motion.div>
      </AnimatePresence>

      {/* Continue button */}
      <motion.button
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full mt-6 bg-lemon hover:bg-lemon-600 disabled:bg-navy-50 disabled:text-navy-300 text-navy font-bold text-lg py-4 rounded-xl transition-colors active:scale-95"
        whileTap={canContinue ? { scale: 0.97 } : {}}
      >
        {step === totalSteps - 1 ? "See My Ideas ✨" : "Continue"}
      </motion.button>
    </div>
  );
}
