"use client";

import dynamic from "next/dynamic";

const ShaderPreview = dynamic(
  () => import("shaders/react").then((module) => module.Preview),
  {
    ssr: false,
    loading: () => null,
  }
);

export function ShaderBackdrop({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <ShaderPreview
        presetId="f0e04028-4126-4d60-b059-5c45e1bad6c4"
        disableTelemetry
        className="h-full w-full"
        style={{
          width: "100%",
          height: "100%",
          opacity: theme === "dark" ? 0.42 : 0.34,
          filter: theme === "dark" ? "saturate(0.95) contrast(0.92)" : "saturate(0.86) contrast(0.88)",
        }}
      />
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-[radial-gradient(ellipse_55%_45%_at_50%_52%,rgba(32,91,139,.30),transparent_70%),linear-gradient(180deg,rgba(5,9,20,.78),rgba(5,9,20,.42)_48%,rgba(5,9,20,.88))]"
            : "bg-[radial-gradient(ellipse_58%_44%_at_50%_48%,rgba(194,232,255,.58),transparent_72%),linear-gradient(180deg,rgba(255,255,255,.80),rgba(255,255,255,.38)_48%,rgba(255,255,255,.78))]"
        }`}
      />
    </div>
  );
}
