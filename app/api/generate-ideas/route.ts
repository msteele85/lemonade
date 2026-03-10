import { NextRequest, NextResponse } from "next/server";
import { generateIdeas } from "@/lib/anthropic";
import type { OnboardingProfile } from "@/lib/types";

interface RequestBody {
  profile: OnboardingProfile;
  excludeNames?: string[];
  feedback?: string;
  count?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();

    // Support both old format (profile at top level) and new format (profile nested)
    const profile: OnboardingProfile = body.profile ?? (body as unknown as OnboardingProfile);

    // Basic validation
    if (
      !profile.goal ||
      !profile.ageRange ||
      !profile.interests.length ||
      !profile.skills.length ||
      !profile.tools.length ||
      !profile.hasTransportation ||
      !profile.neighborhoodType ||
      !profile.timePerWeek ||
      !profile.startingBudget
    ) {
      return NextResponse.json(
        { error: "Incomplete profile" },
        { status: 400 }
      );
    }

    const ideas = await generateIdeas({
      profile,
      count: body.count,
      excludeNames: body.excludeNames,
      feedback: body.feedback,
    });

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Error generating ideas:", error);
    return NextResponse.json(
      { error: "Failed to generate ideas. Please try again." },
      { status: 500 }
    );
  }
}
