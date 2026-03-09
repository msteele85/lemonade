"use client";

import Image from "next/image";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop left panel: logo + branding */}
      <div className="hidden md:flex md:w-1/2 bg-[#fee87f] flex-col items-center justify-center border-r-[5px] border-[#faf2e7]">
        <Image
          src="/logo.png"
          alt="Lemonade logo"
          width={120}
          height={120}
          className="mb-4"
          priority
        />
        <h1 className="text-5xl font-extrabold text-navy font-title">Lemonade</h1>
      </div>

      {/* Right panel (full width on mobile, half on desktop) */}
      <div className="flex-1 flex flex-col bg-[#fff5c4] md:overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
