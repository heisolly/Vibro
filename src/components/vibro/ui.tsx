"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { VibroBoard, VibroUser } from "@/lib/vibro";

export const spring = {
  type: "spring" as const,
  stiffness: 220,
  damping: 24,
};

export function MaterialIcon({
  name,
  size = 18,
  fill = false,
  className = "",
}: {
  name: string;
  size?: number;
  fill?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 300, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}

export function VibroMark({ dark = false, size = 34 }: { dark?: boolean; size?: number }) {
  return (
    <Image
      src={dark ? "/logo.png" : "/light_logo.png"}
      alt="Vibro"
      width={size}
      height={size}
      className="object-contain"
      priority
    />
  );
}

export function ScreenShell({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={dark ? "min-h-screen bg-black text-white" : "min-h-screen bg-[#fbfaf8] text-neutral-950"}>
      {children}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-neutral-500">{label}</span>
      <div className="flex overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
        {prefix && <span className="border-r border-neutral-200 bg-neutral-50 px-3 py-3 text-sm text-neutral-500">{prefix}</span>}
        {multiline ? (
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            rows={5}
            className="min-h-32 w-full resize-none bg-transparent px-3 py-3 text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
          />
        ) : (
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-11 w-full bg-transparent px-3 text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
          />
        )}
      </div>
    </label>
  );
}

export function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <motion.span
          key={index}
          layout
          className="h-2 rounded-full"
          animate={{
            width: index === current ? 24 : 8,
            backgroundColor: index === current ? "#ffffff" : "rgba(255,255,255,0.36)",
          }}
          transition={spring}
        />
      ))}
    </div>
  );
}

export function WorkspaceRail({
  activeBoard,
  user,
}: {
  activeBoard: VibroBoard;
  user: VibroUser | null;
}) {
  const items: { id: VibroBoard; icon: string; label: string }[] = [
    { id: "home", icon: "grid_view", label: "Overview" },
    { id: "design", icon: "palette", label: "Design" },
    { id: "architecture", icon: "schema", label: "Architecture" },
    { id: "inspiration", icon: "auto_stories", label: "Inspiration" },
    { id: "bundle", icon: "inventory_2", label: "Bundle" },
    { id: "handoff", icon: "hub", label: "Handoff" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[52px] flex-col items-center border-r border-neutral-200 bg-[#efeeea]">
      <Link href="/dashboard" className="mt-5">
        <VibroMark size={24} />
      </Link>
      <nav className="mt-8 flex flex-1 flex-col items-center gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            title={item.label}
            className={`grid h-8 w-8 place-items-center rounded-lg text-neutral-700 ${activeBoard === item.id ? "bg-white shadow-sm" : "hover:bg-white/70"}`}
          >
            <MaterialIcon name={item.icon} size={18} fill={activeBoard === item.id} />
          </a>
        ))}
      </nav>
      <div className="mb-4 flex flex-col items-center gap-3">
        <button className="grid h-8 w-8 place-items-center rounded-lg text-neutral-600 hover:bg-white">
          <MaterialIcon name="notifications" size={17} />
        </button>
        <div className="grid h-8 w-8 place-items-center rounded-full bg-rose-200 text-xs font-semibold text-rose-950">
          {(user?.name || "VI").slice(0, 2).toUpperCase()}
        </div>
      </div>
    </aside>
  );
}

export function Composer({ placeholder }: { placeholder: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.18 }}
      className="fixed bottom-4 left-1/2 z-30 w-[min(780px,calc(100vw-140px))] -translate-x-1/2"
    >
      <div className="rounded-lg border border-neutral-200 bg-[#fbfaf7] p-3 shadow-sm">
        <textarea placeholder={placeholder} rows={3} className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-neutral-500" />
        <div className="flex items-center justify-between pt-2">
          <button className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100">
            <MaterialIcon name="add" size={18} />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg bg-neutral-200 text-neutral-500 hover:bg-neutral-300">
            <MaterialIcon name="arrow_upward" size={17} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
