import type { Metadata, Viewport } from "next";
import { Italiana, Stack_Sans_Headline } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const stack = Stack_Sans_Headline({
  variable: "--font-stack",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

// Closest free match to the Figma display face "Voyage" (see globals.css)
const display = Italiana({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "RANGS Properties | Architecture Beyond Expectations",
  description:
    "RANGS Properties brings together decades of experience, thoughtful architecture and a commitment to quality to create spaces that stand the test of time.",
};

export const viewport: Viewport = {
  themeColor: "#0f0b07",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${stack.variable} ${display.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
