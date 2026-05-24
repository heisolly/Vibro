import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  component: Index,
});

type SidebarMode = "expanded" | "icon" | "closed";

const navItems = [
  { icon: "add", label: "New" },
  { icon: "search", label: "Search" },
  { icon: "grid_view", label: "Workspaces" },
  { icon: "menu_book", label: "Library" },
  { icon: "forum", label: "Chats" },
  { icon: "history", label: "History" },
];

function Index() {
  const [mode, setMode] = useState<SidebarMode>("icon");
  const [dark, setDark] = useState(false);
  const [peek, setPeek] = useState(false); // hover-reveal when mode === "closed"
  const peekTimer = useRef<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    const storedMode = localStorage.getItem("sidebar-mode") as SidebarMode | null;
    if (storedMode) setMode(storedMode);
  }, []);

  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const cycleMode = () => {
    const order: SidebarMode[] = ["expanded", "icon", "closed"];
    const next = order[(order.indexOf(mode) + 1) % order.length];
    setMode(next);
    localStorage.setItem("sidebar-mode", next);
  };

  // Hover edge → peek open when closed
  const handleEdgeEnter = () => {
    if (peekTimer.current) window.clearTimeout(peekTimer.current);
    setPeek(true);
  };
  const handlePeekLeave = () => {
    if (peekTimer.current) window.clearTimeout(peekTimer.current);
    peekTimer.current = window.setTimeout(() => setPeek(false), 180);
  };

  const visible = mode !== "closed" || peek;
  const showLabels = mode === "expanded";
  const width = mode === "expanded" ? "w-60" : "w-[68px]";
  const mainPad =
    mode === "expanded" ? "md:pl-60" : mode === "icon" ? "md:pl-[68px]" : "md:pl-0";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 aurora-bg animate-pulse-slow" />

      {/* Edge hover trigger (only active in closed mode) */}
      {mode === "closed" && (
        <div
          onMouseEnter={handleEdgeEnter}
          className="fixed left-0 top-0 z-30 hidden h-screen w-3 md:block"
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseLeave={mode === "closed" ? handlePeekLeave : undefined}
        onMouseEnter={mode === "closed" ? handleEdgeEnter : undefined}
        className={`fixed left-0 top-0 z-30 hidden h-screen flex-col justify-between border-r border-border/60 bg-background/70 py-5 backdrop-blur-xl md:flex ${width} transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "-translate-x-full"
        } ${mode === "closed" ? "shadow-glow" : ""}`}
      >
        <div className="flex flex-col gap-2 px-3">
          <div
            className={`flex items-center mb-2 ${
              showLabels ? "justify-between" : "justify-center"
            }`}
          >
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Contexa"
                className="h-9 w-9 rounded-xl bg-foreground p-1.5"
              />
              {showLabels && (
                <span className="font-display text-lg">Contexa</span>
              )}
            </div>
            {showLabels && (
              <button
                onClick={cycleMode}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
                aria-label="Change sidebar mode"
                title="Switch to icon-only"
              >
                <span className="msr text-[18px]">left_panel_close</span>
              </button>
            )}
          </div>

          {!showLabels && (
            <button
              onClick={cycleMode}
              className="mx-auto grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition hover:bg-card hover:text-foreground"
              aria-label="Change sidebar mode"
              title={mode === "icon" ? "Hide sidebar" : "Expand sidebar"}
            >
              <span className="msr text-[20px]">
                {mode === "icon" ? "left_panel_open" : "dock_to_right"}
              </span>
            </button>
          )}

          <nav className="mt-1 flex flex-col gap-1">
            {navItems.map((item, i) => (
              <RailButton
                key={item.label}
                icon={item.icon}
                label={item.label}
                showLabel={showLabels}
                active={i === 0}
              />
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-1 px-3">
          <RailButton
            icon="settings"
            label="Settings"
            showLabel={showLabels}
            dot
          />
          <button
            className={`group relative flex h-9 items-center gap-3 rounded-xl px-2.5 text-muted-foreground transition hover:bg-card/70 hover:text-foreground ${
              showLabels ? "w-full justify-start" : "w-9 justify-center"
            }`}
            title={!showLabels ? "Michael" : undefined}
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500 text-[10px] font-semibold text-white">
              M
            </span>
            {showLabels && <span className="truncate text-sm">Michael</span>}
            {!showLabels && (
              <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-foreground shadow-soft group-hover:block animate-sidebar-in">
                Michael
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Top right actions */}
      <div className="absolute right-6 top-5 z-20 flex items-center gap-2">
        <button
          onClick={toggleDark}
          aria-label="Toggle theme"
          className="group grid h-9 w-9 place-items-center rounded-full border border-border bg-card/80 text-foreground/80 backdrop-blur transition hover:bg-card hover:text-foreground"
        >
          <span className="msr text-[18px]">
            {dark ? "light_mode" : "dark_mode"}
          </span>
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-primary to-[oklch(0.48_0.18_258)] px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:brightness-110">
          Sign up
        </button>
      </div>

      {/* Centered hero */}
      <main
        className={`relative z-10 flex min-h-screen items-center justify-center px-6 transition-[padding] duration-300 ${mainPad}`}
      >
        <div className="w-full max-w-3xl text-center animate-float-in">
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-[68px]">
            Your Context OS for{" "}
            <span className="italic text-primary">AI‑Assisted Development</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
            Everything but code lives here.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <div className="group relative">
              <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-r from-primary/30 via-primary-glow/40 to-primary/20 opacity-70 blur-2xl" />
              <div className="relative flex items-center gap-2 rounded-full border border-border bg-card/95 py-2.5 pl-3 pr-2 shadow-glow backdrop-blur">
                <button className="group grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                  <span className="msr text-[20px]">add</span>
                </button>
                <input
                  placeholder="Ask Contexa"
                  className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/80 focus:outline-none"
                />
                <button className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-xs text-foreground/80 transition hover:bg-secondary sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Flash
                  <span className="msr text-[14px] opacity-60">
                    expand_more
                  </span>
                </button>
                <button className="group grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                  <span className="msr text-[18px]">mic</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function RailButton({
  icon,
  label,
  showLabel,
  active,
  dot,
}: {
  icon: string;
  label: string;
  showLabel: boolean;
  active?: boolean;
  dot?: boolean;
}) {
  return (
    <button
      className={`group relative flex h-9 items-center gap-3 rounded-xl px-2.5 transition ${
        showLabel ? "w-full justify-start" : "w-9 justify-center"
      } ${
        active
          ? "bg-card text-foreground soft-card"
          : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
      }`}
      title={!showLabel ? label : undefined}
    >
      <span className={`msr text-[20px] ${active ? "msr-fill" : ""}`}>
        {icon}
      </span>
      {showLabel && <span className="truncate text-sm">{label}</span>}
      {dot && (
        <span
          className={`absolute h-1.5 w-1.5 rounded-full bg-primary ${
            showLabel ? "right-3 top-1/2 -translate-y-1/2" : "right-1.5 top-1.5"
          }`}
        />
      )}
      {!showLabel && (
        <span className="pointer-events-none absolute left-full ml-3 z-40 hidden whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-foreground shadow-soft group-hover:block animate-sidebar-in">
          {label}
        </span>
      )}
    </button>
  );
}
