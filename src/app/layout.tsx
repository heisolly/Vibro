import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VibroBackground from "@/components/VibroBackground";
import LayoutContent from "@/components/LayoutContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibro — The Website-First Component Workflow",
  description:
    "Browse, customize, and install production-ready UI components directly via CLI. The modern workflow for vibe coders.",
  metadataBase: new URL("https://vibro.com"),
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Vibro — The Website-First Component Workflow",
    description: "Browse, customize, and install production-ready UI components directly via CLI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-vibro-primary/30 selection:text-vibro-primary-light`}
      >
          <VibroBackground />
          <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}

