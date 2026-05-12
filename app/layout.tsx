import type { Metadata } from "next";
import { Playfair_Display, IBM_Plex_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-ibm-plex",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KlarHilfe — AI legal document assistant for migrants in Germany",
  description:
    "Understand German official documents in your language. Explanations, next steps, and German reply templates.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${ibmPlex.variable} ${notoArabic.variable} min-h-screen bg-background`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
