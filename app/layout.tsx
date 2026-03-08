import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Lemonade \u2014 Turn Your Skills Into a Business",
  description:
    "The easy button for teen entrepreneurship. Build your business ideas and step-by-step plan in minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bitcount+Prop+Double&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${jetbrains.variable} font-sans`}>{children}</body>
    </html>
  );
}
