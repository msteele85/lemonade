// ── Onboarding Profile ──

export type GoalType = "fast-cash" | "recurring-income";

export type AgeRange = "under-8" | "8-11" | "12-14" | "15-17" | "18+";

export type Interest =
  | "Art & Design"
  | "Tech & Gaming"
  | "Animals"
  | "Food"
  | "Sports & Fitness"
  | "Music"
  | "People & Community"
  | "Nature & Outdoors"
  | "Fashion"
  | "Other";

export type Skill =
  | "Good with people"
  | "Creative"
  | "Organized"
  | "Good with hands"
  | "Tech-savvy"
  | "Good writer"
  | "Teacher/explainer"
  | "Athlete"
  | "Other";

export type Tool =
  | "Smartphone"
  | "Computer/laptop"
  | "Basic craft supplies"
  | "Lawn/garden tools"
  | "Camera"
  | "Musical instrument"
  | "None of the above";

export type HasTransportation = "yes-self" | "yes-parent" | "no";

export type NeighborhoodType = "suburban" | "urban-apartment" | "rural" | "other";

export type TimePerWeek =
  | "Less than 5 hrs"
  | "5-10 hrs"
  | "10-20 hrs"
  | "20+ hrs";

export type StartingBudget =
  | "$0 (no investment)"
  | "Under $25"
  | "$25-$100"
  | "$100+";

export interface OnboardingProfile {
  goal: GoalType | null;
  ageRange: AgeRange | null;
  interests: Interest[];
  customInterests: string;
  skills: Skill[];
  customSkills: string;
  tools: Tool[];
  hasTransportation: HasTransportation | null;
  neighborhoodType: NeighborhoodType | null;
  timePerWeek: TimePerWeek | null;
  startingBudget: StartingBudget | null;
}

// ── AI-Generated Ideas ──

export type Difficulty = "Easy" | "Medium";

export interface BusinessIdea {
  id: string;
  name: string;
  tagline: string;
  difficulty: Difficulty;
  weeklyEarningPotential: string;
  whyItFitsYou: string;
}

// ── AI-Generated Business Plan ──

export interface PlanStep {
  title: string;
  description: string;
}

export interface BusinessPlan {
  overview: string;
  stepByStepChecklist: PlanStep[];
  toolsNeeded: string[];
  howToGetFirstCustomer: string;
  pricingGuide: string;
  weeklyScheduleSuggestion: string;
  encouragingClosing: string;
}

// ── Supabase Session ──

export interface SessionRow {
  id: string;
  profile: OnboardingProfile;
  ideas: BusinessIdea[] | null;
  chosen_idea_id: string | null;
  plan: BusinessPlan | null;
  created_at: string;
}
