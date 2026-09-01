"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/onboarding/step-layout";
import { GoalStep } from "@/components/onboarding/steps/goal-step";
import { AgeStep } from "@/components/onboarding/steps/age-step";
import { InterestsStep } from "@/components/onboarding/steps/interests-step";
import { SkillsStep } from "@/components/onboarding/steps/skills-step";
import { ToolsStep } from "@/components/onboarding/steps/tools-step";
import { TransportationStep } from "@/components/onboarding/steps/transportation-step";
import { NeighborhoodStep } from "@/components/onboarding/steps/neighborhood-step";
import { TimeStep } from "@/components/onboarding/steps/time-step";
import { BudgetStep } from "@/components/onboarding/steps/budget-step";
import type { OnboardingProfile } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

const TOTAL_STEPS = 9;

const STEP_CONFIG = [
  { title: "What's your goal?", subtitle: "So your ideas match what you're looking for." },
  { title: "How old are you?", subtitle: "So your ideas fit your age group." },
  { title: "What are you into?", subtitle: "Pick up to 3 — or write your own." },
  { title: "What are you good at?", subtitle: "Pick up to 3 — or write your own." },
  { title: "What tools do you have?", subtitle: "So your ideas are realistic to start." },
  { title: "Do you have reliable transportation?", subtitle: "Either yourself or a parent/guardian who can drive you." },
  { title: "What's your area like?", subtitle: "No address needed — just the general vibe of where you live." },
  { title: "How much time do you have?", subtitle: "Per week, roughly." },
  { title: "How much can you invest to start?", subtitle: "It's totally fine if the answer is $0." },
];

const STEP_NAMES = [
  "goal", "age", "interests", "skills", "tools",
  "transportation", "neighborhood", "time", "budget",
];

// The `custom` free-text values below are redacted by trackEvent before they
// reach the database — it stores only whether text was written and how long
// it was, never the text itself. See lib/analytics.ts.
function getStepValue(step: number, profile: OnboardingProfile): unknown {
  switch (step) {
    case 0: return profile.goal;
    case 1: return profile.ageRange;
    case 2: return { selected: profile.interests, custom: profile.customInterests };
    case 3: return { selected: profile.skills, custom: profile.customSkills };
    case 4: return profile.tools;
    case 5: return profile.hasTransportation;
    case 6: return profile.neighborhoodType;
    case 7: return profile.timePerWeek;
    case 8: return profile.startingBudget;
    default: return null;
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<OnboardingProfile>({
    goal: null,
    ageRange: null,
    interests: [],
    customInterests: "",
    skills: [],
    customSkills: "",
    tools: [],
    hasTransportation: null,
    neighborhoodType: null,
    timePerWeek: null,
    startingBudget: null,
  });

  useEffect(() => {
    trackEvent("onboarding_started");
  }, []);

  const canContinue = (() => {
    switch (step) {
      case 0: return profile.goal !== null;
      case 1: return profile.ageRange !== null;
      case 2: return profile.interests.length > 0 && (!profile.interests.includes("Other") || profile.customInterests.trim() !== "");
      case 3: return profile.skills.length > 0 && (!profile.skills.includes("Other") || profile.customSkills.trim() !== "");
      case 4: return profile.tools.length > 0;
      case 5: return profile.hasTransportation !== null;
      case 6: return profile.neighborhoodType !== null;
      case 7: return profile.timePerWeek !== null;
      case 8: return profile.startingBudget !== null;
      default: return false;
    }
  })();

  const handleContinue = async () => {
    // Track the step that was just completed
    trackEvent("onboarding_step_completed", {
      step,
      stepName: STEP_NAMES[step],
      value: getStepValue(step, profile),
    });

    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      // Track onboarding completion with the full profile
      trackEvent("onboarding_completed", { profile });
      // Save profile to sessionStorage and navigate to ideas
      sessionStorage.setItem("lemonade-profile", JSON.stringify(profile));
      router.push("/ideas");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else router.push("/");
  };

  const { title, subtitle } = STEP_CONFIG[step];

  return (
    <StepLayout
      step={step}
      totalSteps={TOTAL_STEPS}
      title={title}
      subtitle={subtitle}
      canContinue={canContinue}
      onBack={handleBack}
      onContinue={handleContinue}
    >
      {step === 0 && (
        <GoalStep
          value={profile.goal}
          onChange={(v) => setProfile({ ...profile, goal: v })}
        />
      )}
      {step === 1 && (
        <AgeStep
          value={profile.ageRange}
          onChange={(v) => setProfile({ ...profile, ageRange: v })}
        />
      )}
      {step === 2 && (
        <InterestsStep
          value={profile.interests}
          onChange={(v) => setProfile({ ...profile, interests: v })}
          customText={profile.customInterests}
          onCustomTextChange={(v) => setProfile({ ...profile, customInterests: v })}
        />
      )}
      {step === 3 && (
        <SkillsStep
          value={profile.skills}
          onChange={(v) => setProfile({ ...profile, skills: v })}
          customText={profile.customSkills}
          onCustomTextChange={(v) => setProfile({ ...profile, customSkills: v })}
        />
      )}
      {step === 4 && (
        <ToolsStep
          value={profile.tools}
          onChange={(v) => setProfile({ ...profile, tools: v })}
        />
      )}
      {step === 5 && (
        <TransportationStep
          value={profile.hasTransportation}
          onChange={(v) => setProfile({ ...profile, hasTransportation: v })}
          ageRange={profile.ageRange}
        />
      )}
      {step === 6 && (
        <NeighborhoodStep
          value={profile.neighborhoodType}
          onChange={(v) => setProfile({ ...profile, neighborhoodType: v })}
        />
      )}
      {step === 7 && (
        <TimeStep
          value={profile.timePerWeek}
          onChange={(v) => setProfile({ ...profile, timePerWeek: v })}
        />
      )}
      {step === 8 && (
        <BudgetStep
          value={profile.startingBudget}
          onChange={(v) => setProfile({ ...profile, startingBudget: v })}
        />
      )}
    </StepLayout>
  );
}
