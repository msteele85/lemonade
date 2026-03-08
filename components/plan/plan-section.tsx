"use client";

import { motion } from "framer-motion";

interface PlanSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  index: number;
}

export function PlanSection({ title, icon, children, index }: PlanSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl border border-navy-100 p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="text-lg font-bold text-navy">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
