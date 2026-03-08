import { NextRequest, NextResponse } from "next/server";
import { generateIdeas } from "@/lib/anthropic";
import type { OnboardingProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const profile: OnboardingProfile = await req.json();

    // Basic validation
    if (
      !profile.goal ||
      !profile.ageRange ||
      !profile.interests.length ||
      !profile.skills.length ||
      !profile.tools.length ||
      !profile.hasTransportation ||
      !profile.timePerWeek ||
      !profile.startingBudget
    ) {
      return NextResponse.json(
        { error: "Incomplete profile" },
        { status: 400 }
      );
    }

    const ideas = await generateIdeas(profile);

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Error generating ideas:", error);
    return NextResponse.json(
      { error: "Failed to generate ideas. Please try again." },
      { status: 500 }
    );
  }
}
