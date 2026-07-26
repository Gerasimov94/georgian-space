import type { Metadata } from "next";
import { Inter, Lora, Noto_Sans_Georgian } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Georgian Space",
  description:
    "Learn Georgian by hand: handwriting practice with automatic letter matching, matching cards and a full beginner course.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${notoGeorgian.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider>
          <AppShell>{children}</AppShell>
          <Toaster position="top-center" />
        </TooltipProvider>
      </body>
    </html>
  );
}
