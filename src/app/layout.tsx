import type { Metadata } from "next";
import { Inter, Average_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const averageSans = Average_Sans({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-average" 
});
const instrumentSerif = Instrument_Serif({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-instrument",
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: "Vibro - Context OS for AI-Assisted Development",
  description:
    "Plan architecture, design systems, inspiration boards, and context bundles for AI-assisted development.",
  metadataBase: new URL("https://vibro.com"),
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Vibro - Context OS for AI-Assisted Development",
    description: "Everything but code lives here.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${averageSans.variable} ${instrumentSerif.variable}`}>
      <head>
        {/* Material Symbols still requires a link if not using a local font file */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
