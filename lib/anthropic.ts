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
  if (goal === "fast-cash") return "Make money quickly (one-time or immediate earnings)";
  if (goal === "recurring-income") return "Build something that earns money every month";
  return "Not specified";
}

function formatTransportation(t: OnboardingProfile["hasTransportation"]): string {
  if (t === "yes-self") return "Yes — can drive themselves";
  if (t === "yes-parent") return "Yes — parent/guardian can drive them";
  if (t === "no") return "No reliable transportation";
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
    `Skills: ${profile.skills.join(", ")}`,
    `Tools available: ${profile.tools.join(", ")}`,
    `Reliable transportation: ${formatTransportation(profile.hasTransportation)}`,
    `Time per week: ${profile.timePerWeek}`,
    `Starting budget: ${profile.startingBudget}`,
  ];

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
8. GOAL-AWARE: If their goal is fast cash, suggest ideas that earn money today or this week. If recurring income, suggest ideas that become ongoing monthly earners.
9. HIDDEN AI: You are invisible. The user is the builder. All wording puts the power in their hands. Say "here's how you build this" not "I'll build this for you."`;

// ── Idea Generation (Haiku — fast & cheap) ──

export async function generateIdeas(
  profile: OnboardingProfile
): Promise<BusinessIdea[]> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: `${AGENT_IDENTITY}\n\n${CORE_RULES}`,
    messages: [
      {
        role: "user",
        content: `Given this young person's profile:\n${formatProfile(profile)}\n\nSuggest exactly 5 business ideas. For each, return JSON with: id (short kebab-case string), name, tagline (1 sentence), difficulty (Easy or Medium), weeklyEarningPotential (range string like "$20-$50"), whyItFitsYou (1-2 sentences referencing their profile — speak directly to them in second person, be warm and honest like a mentor).\n\nReturn ONLY a JSON array, no markdown, no explanation.`,
      },
    ],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(stripMarkdownFences(raw)) as BusinessIdea[];
}

// ── Business Plan Generation (Sonnet — more capable) ──

export async function generatePlan(
  ideaName: string,
  profile: OnboardingProfile
): Promise<BusinessPlan> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: `${AGENT_IDENTITY}\n\n${CORE_RULES}\n\nYou are creating a step-by-step business plan. Be specific and practical — every step should be something they can actually do this week. The plan must lead to their first dollar within 3 days. The path should be clear and achievable.`,
    messages: [
      {
        role: "user",
        content: `Create a complete business plan for a young person starting a "${ideaName}" business.\n\nTheir profile:\n${formatProfile(profile)}\n\nReturn JSON with: overview (2-3 sentences — speak directly to them, be warm and honest), stepByStepChecklist (array of objects with title and description, 8-12 steps — each step should be concrete and actionable), toolsNeeded (array of strings — only things they already have or can get for free/cheap), howToGetFirstCustomer (2-3 sentences), pricingGuide (2-3 sentences), weeklyScheduleSuggestion (2-3 sentences fitting their stated availability of ${profile.timePerWeek}), encouragingClosing (2-3 sentences — be real, not cheesy).\n\nReturn ONLY JSON, no markdown, no explanation.`,
      },
    ],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(stripMarkdownFences(raw)) as BusinessPlan;
}
