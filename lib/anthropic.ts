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

// ── Idea Generation (Haiku — fast & cheap) ──

export async function generateIdeas(
  profile: OnboardingProfile
): Promise<BusinessIdea[]> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system:
      "You are a teen business advisor. Generate practical, age-appropriate business ideas that a young person could realistically start and run. Focus on ideas that match their specific profile. If their goal is fast cash, suggest ideas that can earn money today or this week. If their goal is recurring income, suggest ideas that can become ongoing monthly earners. If they have no reliable transportation, do NOT suggest ideas that require traveling to customers or transporting equipment (e.g. lawn care, mobile car wash). For users under 12, every idea MUST be something they do alongside a parent or guardian. Never suggest MLMs, creating accounts on social media or content platforms, or becoming a YouTuber/streamer.",
    messages: [
      {
        role: "user",
        content: `Given this young person's profile:\n${formatProfile(profile)}\n\nSuggest exactly 5 business ideas. For each, return JSON with: id (short kebab-case string), name, tagline (1 sentence), difficulty (Easy or Medium), weeklyEarningPotential (range string like "$20-$50"), whyItFitsYou (1-2 sentences referencing their profile).\n\nReturn ONLY a JSON array, no markdown, no explanation.`,
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
    system:
      "You are a teen business coach. Create an encouraging, actionable business plan that a young person can follow step by step. Be specific, practical, and positive. If the user is under 12, frame every step as something they do with a parent or guardian. If they have no reliable transportation, ensure the plan does not require traveling or transporting equipment. Never suggest MLMs, creating social media accounts, or becoming a YouTuber/streamer.",
    messages: [
      {
        role: "user",
        content: `Create a complete business plan for a teen starting a "${ideaName}" business.\n\nTheir profile:\n${formatProfile(profile)}\n\nReturn JSON with: overview (2-3 sentences), stepByStepChecklist (array of objects with title and description, 8-12 steps), toolsNeeded (array of strings), howToGetFirstCustomer (2-3 sentences), pricingGuide (2-3 sentences), weeklyScheduleSuggestion (2-3 sentences), encouragingClosing (2-3 sentences).\n\nReturn ONLY JSON, no markdown, no explanation.`,
      },
    ],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(stripMarkdownFences(raw)) as BusinessPlan;
}
