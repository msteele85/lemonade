import Anthropic from "@anthropic-ai/sdk";
import type { OnboardingProfile, BusinessIdea, BusinessPlan } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// ── Helpers ──

function stripMarkdownFences(text: string): string {
  return text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
}

function formatGoal(goal: OnboardingProfile["goal"]): string {
  if (goal === "fast-cash") return "Make money RIGHT NOW — ideas must be doable within a few hours today. Think lemonade stand, car wash, yard sale, bake sale, dog walking — things that can start and earn money the same day. No multi-day setup, no waiting for customers to find you online.";
  if (goal === "recurring-income") return "Build something that earns money every month";
  return "Not specified";
}

function formatTransportation(t: OnboardingProfile["hasTransportation"]): string {
  if (t === "yes-self") return "Yes — can drive themselves";
  if (t === "yes-parent") return "Yes — parent/guardian can drive them";
  if (t === "no") return "No reliable transportation";
  return "Not specified";
}

function formatNeighborhood(n: OnboardingProfile["neighborhoodType"]): string {
  if (n === "suburban") return "Suburban neighborhood with houses and yards nearby — can go door-to-door, has neighbors to sell to";
  if (n === "urban-apartment") return "City / apartment building — limited door-to-door access, but foot traffic and density are high";
  if (n === "rural") return "Rural / spread out — neighbors are far apart, limited foot traffic, but may have land or outdoor space";
  if (n === "other") return "Other living situation — don't assume door-to-door or neighborhood-based ideas will work";
  return "Not specified";
}

function isYoungAge(ageRange: OnboardingProfile["ageRange"]): boolean {
  return ageRange === "under-8" || ageRange === "8-11";
}

function formatProfile(profile: OnboardingProfile): string {
  const lines = [
    `Goal: ${formatGoal(profile.goal)}`,
    `Age range: ${profile.ageRange}`,
    `Interests: ${profile.interests.join(", ")}`,
  ];

  if (profile.customInterests?.trim()) {
    lines.push(`Additional interests (in their own words): ${profile.customInterests.trim()}`);
  }

  lines.push(`Skills: ${profile.skills.join(", ")}`);

  if (profile.customSkills?.trim()) {
    lines.push(`Additional skills (in their own words): ${profile.customSkills.trim()}`);
  }

  lines.push(
    `Tools available: ${profile.tools.join(", ")}`,
    `Reliable transportation: ${formatTransportation(profile.hasTransportation)}`,
    `Neighborhood: ${formatNeighborhood(profile.neighborhoodType)}`,
    `Time per week: ${profile.timePerWeek}`,
    `Starting budget: ${profile.startingBudget}`,
  );

  if (isYoungAge(profile.ageRange)) {
    lines.push("IMPORTANT: This user is under 12. All ideas MUST heavily involve a parent or guardian. Suggest activities they do together with an adult.");
  }

  return lines.join("\n");
}

// ── Shared system context (from CLAUDE.md + core_principles.md) ──
// Last synced: 2026-03-08

const AGENT_IDENTITY = `You are an expert business coach and mentor — sharp, warm, and experienced. You've helped hundreds of young people start real businesses. You are not a cheerleader. You are not a professor. You are the experienced adult in the room who takes kids completely seriously, tells them the truth, and believes in their ability to handle it.

VOICE:
- Talk like a person, not a product. Direct, specific, allergic to hype.
- Warm but honest. Never oversell or sugarcoat what's hard.
- No corporate speak, no buzzwords, no condescension.
- Speak to them like a smart, curious young person who has never done this before but is absolutely capable of figuring it out. Address their potential, not their limitations.
- Belief alone doesn't build anything. Action does. Show them the work.`;

const CORE_RULES = `NON-NEGOTIABLE RULES:

1. FIRST DOLLAR IN 3 DAYS: Every idea or plan must have a realistic path to earning money within 3 days. Minimize friction. Take the shortest path from start to execution.
2. SAFETY FIRST: Never reference or request personal information (address, full name, school, etc.). Only city/state level location is acceptable. Everything you produce must be something a parent would look at and feel proud of.
3. UNDER-12 RULE: If the user is under 12, every idea and every step MUST heavily involve a parent or guardian doing it together with them.
4. ENTREPRENEURSHIP ONLY: This is about starting a business or side gig, NOT finding a job. The hidden value is learning to be entrepreneurial — that matters as much as the money.
5. OFF LIMITS — never suggest:
   - MLMs or multi-level marketing of any kind
   - Anything requiring accounts on Discord, Twitch, Roblox, TikTok, Reddit, or any site with mature content
   - YouTuber, streamer, or content creator as a business idea
   - Anything illegal for their age range, or requiring business licenses or age-restricted permits
6. RESOURCE-SENSITIVE: Only suggest what's achievable with the exact resources they listed. Zero assumptions about cars, money, or tools they didn't mention. If no reliable transportation, no ideas requiring travel or hauling equipment. If $0 budget, no ideas requiring upfront purchases.
7. REAL CHOICE: Spread ideas across different effort levels, investment levels, and types of work. Include manual labor, trades, and hands-on work — not just tech-focused ideas.
8. GOAL-AWARE: If their goal is "fast cash," ONLY suggest ideas they can execute within a few hours and earn money the same day. Think classic hustle: lemonade stand, car wash, yard sale, bake sale, lawn mowing, dog walking, driveway shoveling. No setup that takes days. No waiting for online customers. Immediate action, immediate money. Provide as much variety as possible based on their interests and skills. If recurring income, suggest ideas that become ongoing monthly earners.
9. HIDDEN AI: You are invisible. The user is the builder. All wording puts the power in their hands. Say "here's how you build this" not "I'll build this for you."
10. NEIGHBORHOOD-AWARE: Factor in their living situation. If they live in an apartment building, don't suggest door-to-door lawn care. If they're rural, don't suggest ideas that need foot traffic. If suburban, leverage the neighborhood. Always match ideas to where they actually live.`;

// ── Idea Generation (Haiku — fast & cheap) ──

interface GenerateIdeasOptions {
  profile: OnboardingProfile;
  count?: number;
  excludeNames?: string[];
  feedback?: string;
}

export async function generateIdeas(
  options: GenerateIdeasOptions
): Promise<BusinessIdea[]> {
  const { profile, count = 5, excludeNames = [], feedback } = options;

  const fastCashExtra = profile.goal === "fast-cash"
    ? "\n\nCRITICAL: This user wants FAST CASH. Every single idea must be something they can start and earn money from within a few hours TODAY. No multi-day setup. No waiting for customers to find them online. Think: lemonade stand, car wash, bake sale, yard sale, dog walking, lawn mowing, snow shoveling, errand running — classic same-day hustles. Give as much variety as possible based on their specific interests and skills."
    : "";

  let excludeSection = "";
  if (excludeNames.length > 0) {
    excludeSection = `\n\nYou already suggested these ideas and the user wants DIFFERENT ones: ${excludeNames.join(", ")}. Do NOT repeat any of these. Come up with completely new, distinct ideas.`;
  }

  let feedbackSection = "";
  if (feedback?.trim()) {
    feedbackSection = `\n\nThe user gave this feedback on why the previous ideas weren't a good fit: "${feedback.trim()}". Use this to guide your new suggestions — address their concerns and steer in a different direction.`;
  }

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: `${AGENT_IDENTITY}\n\n${CORE_RULES}`,
    messages: [
      {
        role: "user",
        content: `Given this young person's profile:\n${formatProfile(profile)}${fastCashExtra}${excludeSection}${feedbackSection}\n\nSuggest exactly ${count} business ideas. For each, return JSON with: id (short kebab-case string), name, tagline (1 sentence), difficulty (Easy or Medium), weeklyEarningPotential (range string like "$20-$50"), whyItFitsYou (1-2 sentences referencing their profile — speak directly to them in second person, be warm and honest like a mentor).\n\nReturn ONLY a JSON array, no markdown, no explanation.`,
      },
    ],
  });

  // Models with adaptive thinking emit a thinking block first, so find the
  // text block rather than assuming it's at index 0.
  const textBlock = message.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  const raw = textBlock ? textBlock.text : "";
  return JSON.parse(stripMarkdownFences(raw)) as BusinessIdea[];
}

// ── Business Plan Generation (Sonnet — more capable) ──

export async function generatePlan(
  ideaName: string,
  profile: OnboardingProfile
): Promise<BusinessPlan> {
  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 8000,
    system: `${AGENT_IDENTITY}\n\n${CORE_RULES}\n\nYou are creating a step-by-step business plan. Be specific and practical — every step should be something they can actually do this week. The plan must lead to their first dollar within 3 days. The path should be clear and achievable.`,
    messages: [
      {
        role: "user",
        content: `Create a complete business plan for a young person starting a "${ideaName}" business.\n\nTheir profile:\n${formatProfile(profile)}\n\nReturn JSON with: overview (2-3 sentences — speak directly to them, be warm and honest), stepByStepChecklist (array of objects with title and description, 8-12 steps — each step should be concrete and actionable), toolsNeeded (array of strings — only things they already have or can get for free/cheap), howToGetFirstCustomer (2-3 sentences), pricingGuide (2-3 sentences), weeklyScheduleSuggestion (2-3 sentences fitting their stated availability of ${profile.timePerWeek}), encouragingClosing (2-3 sentences — be real, not cheesy).\n\nReturn ONLY JSON, no markdown, no explanation.`,
      },
    ],
  });

  // Models with adaptive thinking emit a thinking block first, so find the
  // text block rather than assuming it's at index 0.
  const textBlock = message.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  const raw = textBlock ? textBlock.text : "";
  return JSON.parse(stripMarkdownFences(raw)) as BusinessPlan;
}
