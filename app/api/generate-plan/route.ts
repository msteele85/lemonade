import { NextRequest, NextResponse } from "next/server";
import { generatePlan } from "@/lib/anthropic";
import type { OnboardingProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { ideaName, profile }: { ideaName: string; profile: OnboardingProfile } =
      await req.json();

    if (!ideaName || !profile) {
      return NextResponse.json(
        { error: "Missing ideaName or profile" },
        { status: 400 }
      );
    }

    const plan = await generatePlan(ideaName, profile);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error generating plan:", error);
    return NextResponse.json(
      { error: "Failed to generate plan. Please try again." },
      { status: 500 }
    );
  }
}
