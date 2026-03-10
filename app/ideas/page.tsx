"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IdeaCard } from "@/components/ideas/idea-card";
import { PageLayout } from "@/components/shared/page-layout";
import { mockIdeas } from "@/lib/mock-ideas";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Image from "next/image";
import type { BusinessIdea, OnboardingProfile } from "@/lib/types";

export default function IdeasPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [moreError, setMoreError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("lemonade-profile");

    if (!stored) {
      // No profile — use mock data for preview
      setIdeas(mockIdeas);
      setLoading(false);
      return;
    }

    const profile: OnboardingProfile = JSON.parse(stored);

    fetch("/api/generate-ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setIdeas(data.ideas);
      })
      .catch(() => {
        setError("Couldn't generate ideas — showing examples instead.");
        setIdeas(mockIdeas);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChoose = () => {
    if (!selectedId) return;
    const chosen = ideas.find((i) => i.id === selectedId);
    if (chosen) {
      sessionStorage.setItem("lemonade-chosen-idea", JSON.stringify(chosen));
      router.push("/plan");
    }
  };

  const handleGenerateMore = async () => {
    const stored = sessionStorage.getItem("lemonade-profile");
    if (!stored) return;

    setLoadingMore(true);
    setMoreError(null);

    try {
      const profile: OnboardingProfile = JSON.parse(stored);
      const res = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          count: 3,
          excludeNames: ideas.map((i) => i.name),
          feedback: feedback.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setIdeas((prev) => [...prev, ...data.ideas]);
      setFeedback("");

      // Scroll to new ideas after they render
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch {
      setMoreError("Couldn't generate more ideas. Try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="flex items-center justify-center mb-4 md:hidden">
            <Image src="/logo.png" alt="Lemonade logo" width={44} height={44} priority />
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.push("/onboarding")}
              className="p-2 -ml-2 rounded-lg hover:bg-navy-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-navy-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-navy">Your Ideas</h1>
              <p className="text-navy-500 text-sm">Pick the one that excites you most.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Image
                src="/logo.png"
                alt="Loading"
                width={40}
                height={40}
                className="animate-spin"
              />
              <p className="text-navy-500 font-medium">
                Cooking up ideas just for you...
              </p>
            </div>
          ) : (
            <>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-orange-50 text-orange-700 text-sm p-3 rounded-lg mb-4"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex flex-col gap-4 mb-6">
                {ideas.map((idea, i) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    index={i}
                    selected={selectedId === idea.id}
                    onSelect={() => setSelectedId(idea.id)}
                  />
                ))}
              </div>

              {/* Generate more ideas section */}
              <div ref={bottomRef} className="mb-6">
                <div className="border border-dashed border-navy-200 rounded-2xl p-5 bg-white/40">
                  <p className="text-sm font-medium text-navy mb-3 text-center">
                    Not seeing the right fit?
                  </p>

                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you're looking for (optional) — e.g. &quot;I want something I can do indoors&quot; or &quot;These are too hard&quot;"
                    className="w-full text-sm bg-white border border-navy-100 rounded-xl px-4 py-3 text-navy placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-lemon focus:border-lemon resize-none mb-3"
                    rows={2}
                    maxLength={300}
                    disabled={loadingMore}
                  />

                  <button
                    onClick={handleGenerateMore}
                    disabled={loadingMore}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-navy-50 disabled:bg-navy-50 disabled:text-navy-300 text-navy font-bold py-3 rounded-xl transition-colors border border-navy-200"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingMore ? "animate-spin" : ""}`} />
                    {loadingMore ? "Generating..." : "Show Me More Ideas"}
                  </button>

                  <AnimatePresence>
                    {moreError && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-red-600 text-sm text-center mt-2"
                      >
                        {moreError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <motion.button
                onClick={handleChoose}
                disabled={!selectedId}
                className="w-full sticky bottom-6 bg-lemon hover:bg-lemon-600 disabled:bg-navy-50 disabled:text-navy-300 text-navy font-bold text-lg py-4 rounded-xl transition-colors shadow-lg shadow-lemon/30 active:scale-95"
                whileTap={selectedId ? { scale: 0.97 } : {}}
              >
                Build My Plan
              </motion.button>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
