"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    trackEvent("page_viewed", { page: "home" });
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-[#fff5c4]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <Image
          src="/logo.png"
          alt="Lemonade logo"
          width={100}
          height={100}
          className="mx-auto mb-4"
          priority
        />
        <h1 className="text-5xl font-extrabold text-navy mb-3 font-title">Lemonade</h1>
        <p className="text-lg text-navy-600 mb-8">
          Helping young entrepreneurs start real businesses — no
          experience needed. Answer a few questions to build a
          step-by-step plan based on your skills and resources.
        </p>
        <button
          onClick={() => router.push("/onboarding")}
          className="w-full bg-lemon hover:bg-lemon-600 text-navy font-bold text-lg py-4 px-8 rounded-xl transition-colors shadow-lg shadow-lemon/30 active:scale-95"
        >
          Get Started
        </button>
        <p className="text-sm text-navy-400 mt-4">
          No sign-up required. Totally free.
        </p>
      </motion.div>
      <p className="absolute bottom-4 text-xs text-navy-300/60">v1.1</p>
    </main>
  );
}
