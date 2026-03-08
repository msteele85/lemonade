"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#fff5c4]">
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
          Turn your skills into a real business. Answer a few questions
          to build your custom plan in minutes.
        </p>
        <button
          onClick={() => router.push("/onboarding")}
          className="w-full bg-lemon hover:bg-lemon-600 text-navy font-bold text-lg py-4 px-8 rounded-xl transition-colors shadow-lg shadow-lemon/30 active:scale-95"
        >
          Get Started
        </button>
        <p className="text-sm text-navy-400 mt-4">
          No sign-up required. Totally free to start.
        </p>
      </motion.div>
    </main>
  );
}
