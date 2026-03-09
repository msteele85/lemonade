"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PlanSection } from "@/components/plan/plan-section";
import { Checklist } from "@/components/plan/checklist";
import { PageLayout } from "@/components/shared/page-layout";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Users,
  Wrench,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import type { BusinessIdea, BusinessPlan, OnboardingProfile } from "@/lib/types";

export default function PlanPage() {
  const router = useRouter();
  const [idea, setIdea] = useState<BusinessIdea | null>(null);
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedIdea = sessionStorage.getItem("lemonade-chosen-idea");
    const storedProfile = sessionStorage.getItem("lemonade-profile");

    if (!storedIdea || !storedProfile) {
      router.push("/ideas");
      return;
    }

    const chosenIdea: BusinessIdea = JSON.parse(storedIdea);
    const profile: OnboardingProfile = JSON.parse(storedProfile);
    setIdea(chosenIdea);

    fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideaName: chosenIdea.name, profile }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setPlan(data.plan);
      })
      .catch(() => {
        setError("Something went wrong generating your plan. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Image src="/logo.png" alt="Lemonade logo" width={44} height={44} className="mx-auto mb-4" priority />
            <Image
              src="/logo.png"
              alt="Loading"
              width={40}
              height={40}
              className="animate-spin mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-navy mb-2">
              Building your business plan...
            </h2>
            <p className="text-navy-500 text-sm max-w-xs mx-auto">
              Putting together a step-by-step plan based on your answers.
              This takes about 10 seconds.
            </p>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  if (error || !plan) {
    return (
      <PageLayout>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <p className="text-red-600 font-medium mb-4">
              {error || "Failed to load plan."}
            </p>
            <button
              onClick={() => router.push("/ideas")}
              className="text-navy-500 hover:text-navy underline font-medium"
            >
              Back to Ideas
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex-1 pb-12">
        <div className="max-w-md mx-auto px-6 py-8">
          {/* Mobile logo */}
          <div className="flex items-center justify-center mb-4 md:hidden">
            <Image src="/logo.png" alt="Lemonade logo" width={44} height={44} priority />
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.push("/ideas")}
              className="p-2 -ml-2 rounded-lg hover:bg-white/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-navy-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-navy">{idea?.name}</h1>
              <p className="text-navy-500 text-sm">{idea?.tagline}</p>
            </div>
          </div>

          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-lemon-50 border border-lemon-200 rounded-2xl p-5 mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-lemon-700" />
              <h3 className="font-bold text-navy">Overview</h3>
            </div>
            <p className="text-navy-700 text-sm leading-relaxed">
              {plan.overview}
            </p>
          </motion.div>

          {/* Sections */}
          <div className="flex flex-col gap-4">
            <PlanSection title="Action Checklist" icon="✅" index={0}>
              <Checklist steps={plan.stepByStepChecklist} />
            </PlanSection>

            <PlanSection title="Tools You'll Need" icon="🛠️" index={1}>
              <div className="flex flex-wrap gap-2">
                {plan.toolsNeeded.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1 bg-navy-50 text-navy-700 text-sm font-medium px-3 py-1.5 rounded-lg"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    {tool}
                  </span>
                ))}
              </div>
            </PlanSection>

            <PlanSection title="Get Your First Customer" icon="🎯" index={2}>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 mt-1 text-navy-400 flex-shrink-0" />
                <p className="text-sm text-navy-700 leading-relaxed">
                  {plan.howToGetFirstCustomer}
                </p>
              </div>
            </PlanSection>

            <PlanSection title="Pricing Guide" icon="💰" index={3}>
              <div className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 mt-1 text-navy-400 flex-shrink-0" />
                <p className="text-sm text-navy-700 leading-relaxed">
                  {plan.pricingGuide}
                </p>
              </div>
            </PlanSection>

            <PlanSection title="Weekly Schedule" icon="📅" index={4}>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 mt-1 text-navy-400 flex-shrink-0" />
                <p className="text-sm text-navy-700 leading-relaxed">
                  {plan.weeklyScheduleSuggestion}
                </p>
              </div>
            </PlanSection>

            {/* Encouraging closing */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-lemon text-navy rounded-2xl p-5 text-center"
            >
              <Image
                src="/logo.png"
                alt="Lemonade"
                width={48}
                height={48}
                className="mx-auto mb-2"
              />
              <p className="font-bold text-lg mb-1">You got this!</p>
              <p className="text-sm text-navy/80">{plan.encouragingClosing}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
