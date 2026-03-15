import type { Metadata } from "next";
import "./globals.css";
import VibroBackground from "@/components/VibroBackground";
import LayoutContent from "@/components/LayoutContent";

const inter = { variable: "--font-geist-sans" };
const interMono = { variable: "--font-geist-mono" };

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
        className={`${inter.variable} ${interMono.variable} antialiased selection:bg-vibro-primary/30 selection:text-vibro-primary-light`}
      >
          <VibroBackground />
          <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}

