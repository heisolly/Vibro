"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { createClient } from "@/utils/supabase/client";

/* ── Google Material Icon Component ────────────────── */
function MaterialIcon({
  name,
  className = "",
  size = 20,
  weight = 250, // Premium elegant weight
  fill = false,
  style = {},
}: {
  name: string;
  className?: string;
  size?: number;
  weight?: number;
  fill?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`material-symbols-rounded select-none ${className}`}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        display: "inline-block",
        ...style,
      }}
    >
      {name}
    </span>
  );
}

export default function Home() {
  /* ── Core Navigation / Screen Flow State ── */
  // 'landing' | 'signup' | 'projects' | 'create_project' | 'onboarding' | 'ai_setup' | 'luterchat' | 'dashboard'
  const [screen, setScreen] = useState<"landing" | "signup" | "projects" | "create_project" | "onboarding" | "ai_setup" | "luterchat" | "dashboard">("landing");
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4 | 5>(1); // Step 1-4 for Linear flow, Step 5 for completion check
  const [activeBoard, setActiveBoard] = useState<"home" | "architecture" | "design" | "context" | "build" | "inspiration" | "bundle" | "settings">("home");

  /* ── Interface Layout States ── */
  const [expanded, setExpanded] = useState(true);
  const [dark, setDark] = useState(false); // Default to light mode (approachable soft-blue gradient primary)
  const [logoHovered, setLogoHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  /* ── Dynamic Workspaces / Projects State ── */
  const [projects, setProjects] = useState<Array<{
    id: string;
    name: string;
    description: string;
    repo: string;
    team: string;
    status: "active" | "offline" | "syncing";
    lastSync: string;
    syncsCount: number;
  }>>([
    {
      id: "vibro-core",
      name: "Vibro Core",
      description: "The Context OS for Next.js and Cursor workflows.",
      repo: "github.com/heisolly/Vibro",
      team: "Michael, Sarah, Alex",
      status: "active",
      lastSync: "12 mins ago",
      syncsCount: 142
    }
  ]);

  /* ── Active User / Profile State ── */
  const [user, setUser] = useState<{ email?: string; name?: string; avatar?: string } | null>(null);

  /* ── Linear-Style Onboarding Wizard States ── */
  const [workspaceSlug, setWorkspaceSlug] = useState("vibro-core");
  const [workspaceRegion, setWorkspaceRegion] = useState("European Union");
  const [profileName, setProfileName] = useState("Michael Oluwayanmi");
  const [profileTitle, setProfileTitle] = useState("Software engineer");
  const [inviteEmails, setInviteEmails] = useState("");
  const [subscribeChangelog, setSubscribeChangelog] = useState(true);
  const [subscribeEmails, setSubscribeEmails] = useState(false);

  /* ── Interactive Form / Project States ── */
  const [projectName, setProjectName] = useState("Vibro Core");
  const [projectDesc, setProjectDesc] = useState("The Context OS for Next.js and Cursor workflows.");
  const [projectRepo, setProjectRepo] = useState("");
  const [projectTeam, setProjectTeam] = useState("Michael, Sarah, Alex");
  const [formError, setFormError] = useState("");
  
  /* ── Project Filter/Search States ── */
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  /* ── Onboarding / Design Generator States ── */
  const [designVibe, setDesignVibe] = useState("Playful AI developer space with neon accents");
  const [isGeneratingPalette, setIsGeneratingPalette] = useState(false);
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([]);
  const [isScanningRepo, setIsScanningRepo] = useState(false);
  const [scannedFiles, setScannedFiles] = useState<string[]>([]);
  const [isSyncingTrigger, setIsSyncingTrigger] = useState(false);
  const [triggerConnected, setTriggerConnected] = useState(false);

  /* ── LuterChat Conversational States ── */
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "vibro"; text: string; logs?: string[] }[]>([
    {
      sender: "vibro",
      text: "Welcome Michael! I'm ready to build your project's context layer. Tell Vibro what you're building — architecture, databases, APIs, or design flow.",
    },
  ]);
  const [isChatGenerating, setIsChatGenerating] = useState(false);

  /* ── Filtered & Sorted Projects ── */
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "syncs") return b.syncsCount - a.syncsCount;
        if (sortBy === "active") return b.syncsCount - a.syncsCount;
        return 0;
      });
  }, [projects, searchQuery, statusFilter, sortBy]);

  /* ── Initialize Supabase Browser Client ── */
  const supabase = createClient();

  /* ── Theme Loading & Syncing & Auth Sessions ── */
  useEffect(() => {
    // 1. Load persisted theme
    const saved = localStorage.getItem("vibro-theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }

    // 2. Fetch active session and user profile info
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userName = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Developer";
          setUser({
            email: session.user.email,
            name: userName,
            avatar: session.user.user_metadata?.avatar_url,
          });
          setProfileName(userName);
        }
      } catch (e) {
        console.warn("Could not retrieve Supabase session.", e);
      }
    };
    checkSession();

    // 3. Listen for auth status changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userName = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Developer";
        setUser({
          email: session.user.email,
          name: userName,
          avatar: session.user.user_metadata?.avatar_url,
        });
        setProfileName(userName);
      } else {
        setUser(null);
      }
    });

    // 4. Check if redirected back from Supabase auth callback
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get("screen");
    if (screenParam === "projects" || screenParam === "dashboard") {
      setScreen(screenParam as any);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("vibro-theme", next ? "dark" : "light");
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const t = dark ? tokens.dark : tokens.light;

  /* ── Handlers for Simulated / Active Flows ── */
  const handleStartWorkspace = () => setScreen("signup");
  const handleSignup = () => setScreen("projects");

  const handleGithubSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "read:user user:email repo",
        },
      });
      if (error) {
        console.warn("Supabase GitHub Auth Error:", error.message);
        setScreen("projects");
      }
    } catch (e) {
      console.warn("Supabase GitHub Auth skipped, running simulated flow.");
      setScreen("projects");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.warn("Supabase Google Auth Error:", error.message);
        setScreen("projects");
      }
    } catch (e) {
      console.warn("Supabase Google Auth skipped, running simulated flow.");
      setScreen("projects");
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signout skipped.", e);
    }
    setUser(null);
    setScreen("landing");
  };

  const openWorkspace = (project: typeof projects[number]) => {
    setProjectName(project.name);
    setProjectDesc(project.description);
    setProjectRepo(project.repo);
    setProjectTeam(project.team);
    setScreen("dashboard");
  };

  const enterDashboard = () => {
    // Save/append the project to the workspace manager if it doesn't exist
    if (!projects.some(p => p.name.toLowerCase() === projectName.toLowerCase() || p.repo === projectRepo)) {
      const newProject = {
        id: projectName.toLowerCase().replace(/\s+/g, "-"),
        name: projectName,
        description: projectDesc,
        repo: projectRepo,
        team: projectTeam,
        status: "active" as const,
        lastSync: "Just now",
        syncsCount: 1
      };
      setProjects(prev => [...prev, newProject]);
    }
    setScreen("dashboard");
  };

  const handleWorkspaceCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    const slug = workspaceSlug.trim();
    if (!slug) {
      setFormError("A workspace URL slug is required.");
      return;
    }
    
    if (!projectName.trim()) {
      setFormError("A workspace name is required.");
      return;
    }

    // Automatically derive description if empty
    if (!projectDesc.trim()) {
      setProjectDesc(`The Workspace Context Bundle for ${projectName}.`);
    }

    setScreen("onboarding");
    setOnboardingStep(1);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingStep(2);
  };

  const handleTeammatesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update project team list state
    if (inviteEmails.trim()) {
      const names = inviteEmails.split(",").map(email => email.trim().split("@")[0]);
      setProjectTeam(["Michael", ...names].join(", "));
    }
    setOnboardingStep(3);
  };

  const handleGithubConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const repoValue = projectRepo.trim();
    if (!repoValue) {
      setFormError("A GitHub repository is required to map your architecture and sync context.");
      return;
    }

    const isValidRepo =
      repoValue.includes("github.com/") &&
      repoValue.split("github.com/")[1]?.includes("/");
    if (!isValidRepo) {
      setFormError("Please enter a valid GitHub repository link (e.g. github.com/username/repo-name).");
      return;
    }

    setOnboardingStep(4);
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Finish onboarding wizard, transition to AI setup
    setScreen("ai_setup");
  };

  // Step 1: Design System Generator
  const generatePalette = () => {
    setIsGeneratingPalette(true);
    setGeneratedTokens([]);
    setTimeout(() => {
      setGeneratedTokens([
        "--color-accent: #3B82F6",
        "--color-bg: #E0F2FE",
        "--color-card: #FFFFFF",
        "--color-glow: rgba(59,130,246,0.15)",
        "--font-family: 'Inter', sans-serif",
      ]);
      setIsGeneratingPalette(false);
    }, 1800);
  };

  // Step 2: Architecture Scanner
  const startRepoScan = () => {
    setIsScanningRepo(true);
    setScannedFiles([]);
    const files = [
      "src/app/page.tsx (Static landing screen detected)",
      "src/app/layout.tsx (Google Fonts initialized)",
      "package.json (Trigger.dev, Liveblocks, Tailwind loaded)",
      "next.config.js (Turbo bundling active)",
      "supabase/config.toml (PostgreSQL registry maps loaded)",
    ];
    let index = 0;
    const interval = setInterval(() => {
      if (index < files.length) {
        setScannedFiles((prev) => [...prev, files[index]]);
        index++;
      } else {
        clearInterval(interval);
        setIsScanningRepo(false);
      }
    }, 500);
  };

  // Step 3: Trigger.dev Sync Connect
  const startTriggerSync = () => {
    setIsSyncingTrigger(true);
    setTimeout(() => {
      setTriggerConnected(true);
      setIsSyncingTrigger(false);
    }, 2000);
  };

  const handleFinishOnboarding = () => setScreen("luterchat");

  // LuterChat prompt send handler
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsChatGenerating(true);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "vibro",
          text: `Vibro has successfully captured that architecture profile. I've compiled this directly into your Context Bundle (v1.0.0). All database relations, API schemas, and trigger hooks are now version-saved and synced to your MCP Server.`,
          logs: [
            "Initializing Context compiler...",
            "Writing Schema definitions (vibro_v1.0.0.json)",
            "Syncing context package map with Cursor IDE client",
            "Context Bundle compiled: v1.0.0 [Success]",
          ],
        },
      ]);
      setIsChatGenerating(false);
    }, 2500);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: t.bg,
        color: t.text,
        transition: "background 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), color 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      {/* ── Aurora Background Gradient ── */}
      <div
        className="pointer-events-none absolute inset-0 animate-pulse-slow z-0"
        style={{
          background: t.aurora,
          transition: "background 0.5s ease-in-out",
        }}
      />

      {/* ── Background Dot Grid Pattern ── */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-55 dark:opacity-25 dot-grid" />

      {/* ── Header Top Right Controls (Shared) ── */}
      <div className="absolute right-6 top-5 z-40 flex items-center gap-3">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleDark}
          aria-label="Toggle theme"
          className="grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition"
          style={{
            borderColor: t.border,
            backgroundColor: t.cardBg,
            color: t.text,
          }}
        >
          <MaterialIcon name={dark ? "dark_mode" : "light_mode"} size={18} />
        </motion.button>

        {/* Upgrade Pill Button (Gemini Style) */}
        {screen === "dashboard" && (
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition shadow-sm"
            style={{
              background: t.upgradeBtnBg,
              color: t.upgradeBtnText,
              border: `1px solid ${t.upgradeBtnBorder}`,
            }}
          >
            <MaterialIcon name="auto_awesome" size={14} fill />
            Upgrade
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* ── SCREEN 1: LANDING PAGE ── */}
        {screen === "landing" && (
          <motion.main
            key="landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45 }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
          >
            {/* Branding Logo */}
            <div className="mb-6 flex items-center gap-3">
              <Image
                src={dark ? "/logo.png" : "/light_logo.png"}
                alt="Vibro"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
              <span className="font-display font-semibold text-2xl tracking-tight">Vibro</span>
            </div>

            {/* Headline taglines */}
            <h1 className="font-display text-5xl leading-[1.08] tracking-tight sm:text-6xl md:text-[76px] max-w-4xl">
              Your Context OS for{" "}
              <span className="italic animate-pulse-slow" style={{ color: t.accent }}>
                AI‑Assisted Development
              </span>
            </h1>
            <p
              className="mt-6 text-lg sm:text-xl font-medium max-w-xl"
              style={{ color: t.subText }}
            >
              Everything but code lives here. Architecture maps, Design systems, and Context logs.
            </p>

            {/* CTA Start Workspace (Linear Layout Inspired) */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartWorkspace}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-bold text-white shadow-lg transition"
                style={{
                  background: t.ctaGradient,
                  boxShadow: dark ? "0 4px 20px rgba(59,130,246,0.3)" : "0 4px 20px rgba(37,99,235,0.25)",
                }}
              >
                Start Workspace
                <MaterialIcon name="arrow_forward" size={18} />
              </motion.button>

            </div>
          </motion.main>
        )}

        {/* ── SCREEN 2: SIGNUP / AUTH SCREEN ── */}
        {screen === "signup" && (
          <motion.main
            key="signup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6"
          >
            <div
              className="w-full max-w-md rounded-3xl border p-8 backdrop-blur-md shadow-xl"
              style={{
                backgroundColor: t.cardBg,
                borderColor: t.border,
              }}
            >
              <div className="text-center mb-6">
                <Image
                  src={dark ? "/logo.png" : "/light_logo.png"}
                  alt="Vibro"
                  width={40}
                  height={40}
                  className="mx-auto object-contain mb-3"
                />
                <h2 className="text-2xl font-bold tracking-tight">Create your Vibro Account</h2>
                <p className="text-sm mt-1" style={{ color: t.subText }}>
                  Sync your developer memory context in seconds.
                </p>
              </div>

              {/* GitHub OAuth — Primary */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGithubSignup}
                className="w-full flex items-center justify-center gap-3 rounded-xl border py-3 text-sm font-semibold transition mb-3"
                style={{
                  borderColor: t.border,
                  backgroundColor: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  color: t.text,
                }}
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </motion.button>

              {/* Google OAuth */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 rounded-xl border py-3 text-sm font-semibold transition"
                style={{
                  borderColor: t.border,
                  backgroundColor: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  color: t.text,
                }}
              >
                {/* Google SVG logo */}
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </motion.button>

              <div className="relative my-5 flex items-center justify-center">
                <span className="absolute w-full border-t" style={{ borderColor: t.border }} />
                <span className="relative px-3 text-xs uppercase bg-inherit" style={{ color: t.subText }}>
                  Or Email Code
                </span>
              </div>

              {/* Email Form Option */}
              <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: t.subText }}>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="michael@vibro.com"
                    className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2"
                    style={{
                      borderColor: t.border,
                      backgroundColor: t.inputBg,
                      color: t.text,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: t.subText }}>Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2"
                    style={{
                      borderColor: t.border,
                      backgroundColor: t.inputBg,
                      color: t.text,
                    }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-white tracking-wide"
                  style={{ background: t.ctaGradient }}
                >
                  Create Account
                </motion.button>
              </form>
            </div>
          </motion.main>
        )}

        {/* ── SCREEN 2.5: WORKSPACES / PROJECTS MANAGEMENT PANEL ── */}
        {screen === "projects" && (
          <motion.main
            key="projects"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex min-h-screen flex-col px-6 md:px-12 py-8 max-w-6xl mx-auto w-full"
          >
            {/* Console Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6 mb-10" style={{ borderColor: t.border }}>
              <div className="flex items-center gap-3">
                <Image
                  src={dark ? "/logo.png" : "/light_logo.png"}
                  alt="Vibro"
                  width={34}
                  height={34}
                  className="object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Vibro Console</h1>
                  <p className="text-xs" style={{ color: t.subText }}>Context OS for AI Development</p>
                </div>
              </div>

              {/* User Profile widget */}
              <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs text-white"
                    style={{
                      background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                      boxShadow: "0 2px 8px rgba(59,130,246,0.3)"
                    }}
                  >
                    {user?.name ? user.name[0].toUpperCase() : "M"}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold leading-none">{user?.name || "Micheal Oluwayanmi"}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: t.subText }}>{user?.email || "michael@gmail.com"}</div>
                  </div>
                </div>

                <div className="h-4 w-px mx-1 hidden sm:block" style={{ backgroundColor: t.border }} />

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold hover:bg-red-500/10 hover:text-red-500 transition-all"
                  style={{ borderColor: t.border, color: t.text }}
                >
                  <MaterialIcon name="logout" size={14} />
                  Sign Out
                </motion.button>
              </div>
            </div>

            {/* Dashboard Welcome & Stats overview */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="text-center sm:text-left">
                <h2 className="text-4xl font-display font-medium tracking-tight mb-2" style={{ color: t.text }}>
                  Welcome back, <span className="italic font-normal" style={{ color: t.accent }}>{user?.name?.split(" ")[0] || "Michael"}</span>
                </h2>
                <p className="text-sm max-w-2xl leading-relaxed" style={{ color: t.subText }}>
                  Your synchronized workspaces are active and synced. Choose an instance to view active schemas and design systems, or connect a new GitHub repository.
                </p>
              </div>

              {/* Real-time system ribbon */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: t.border, backgroundColor: t.badgeBg }}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Vibro Engine: Active
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: t.border, backgroundColor: t.badgeBg }}>
                  <MaterialIcon name="sync" size={12} className="text-blue-500 animate-spin" style={{ animationDuration: "3s" }} />
                  {projects.length} Workspaces Synced
                </div>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center w-full">
              {/* Search Input */}
              <div className="relative w-full sm:w-80">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                  <MaterialIcon name="search" size={16} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search workspaces..."
                  className="w-full pl-10 pr-12 py-2.5 text-xs font-semibold rounded-2xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm transition-all"
                  style={{
                    backgroundColor: t.inputBg,
                    borderColor: t.border,
                    color: t.text
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border text-[9px] font-bold select-none opacity-40 pointer-events-none" style={{ borderColor: t.border }}>
                  ⌘K
                </span>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {/* Status Selector */}
                <div className="flex items-center gap-1.5 border rounded-2xl px-3 py-2 text-xs font-semibold backdrop-blur-sm" style={{ borderColor: t.border, backgroundColor: t.badgeBg }}>
                  <MaterialIcon name="filter_list" size={14} className="opacity-60" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs font-bold cursor-pointer"
                    style={{ color: t.text }}
                  >
                    <option value="all" className="bg-slate-100 dark:bg-slate-900">All Statuses</option>
                    <option value="active" className="bg-slate-100 dark:bg-slate-900">Online only</option>
                  </select>
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-1.5 border rounded-2xl px-3 py-2 text-xs font-semibold backdrop-blur-sm" style={{ borderColor: t.border, backgroundColor: t.badgeBg }}>
                  <MaterialIcon name="sort" size={14} className="opacity-60" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs font-bold cursor-pointer"
                    style={{ color: t.text }}
                  >
                    <option value="name" className="bg-slate-100 dark:bg-slate-900">Sort by Name</option>
                    <option value="syncs" className="bg-slate-100 dark:bg-slate-900">Sort by Syncs</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Workspaces Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {filteredProjects.map((project) => (
                <div key={project.id} className="relative group">
                  {/* Glowing back-border blur overlay on card hover */}
                  <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition duration-500 blur-md pointer-events-none -z-10" />

                  <motion.div
                    whileHover={{ y: -4 }}
                    className="h-full rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-md transition-all duration-300 relative overflow-hidden"
                    style={{ backgroundColor: t.cardBg, borderColor: t.border, boxShadow: t.shadowMd }}
                  >
                    {/* Spotlight gradient effect inside card */}
                    <div
                      className="absolute -inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    />

                    <div>
                      {/* Header: Project Icon & Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="h-10 w-10 rounded-2xl flex items-center justify-center font-black text-sm text-white relative overflow-hidden shadow-inner shrink-0"
                          style={{
                            background: t.ctaGradient,
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(59,130,246,0.15)"
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/10" />
                          {project.name.substring(0, 2).toUpperCase()}
                        </div>

                        {/* Breathing status pill */}
                        <div
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all"
                          style={{
                            backgroundColor: project.status === "active" ? "rgba(16,185,129,0.08)" : "rgba(107,114,128,0.08)",
                            borderColor: project.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.15)",
                            color: project.status === "active" ? t.success : t.subText,
                          }}
                        >
                          {project.status === "active" ? (
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-600" />
                          )}
                          {project.status === "active" ? "Online" : "Offline"}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold tracking-tight mb-1 transition-colors group-hover:text-blue-500" style={{ color: t.text }}>
                        {project.name}
                      </h3>
                      <p className="text-xs mb-5 line-clamp-2 leading-relaxed" style={{ color: t.subText }}>
                        {project.description}
                      </p>

                      {/* Repository sync details */}
                      <div
                        className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold mb-6 max-w-full truncate transition-colors group-hover:border-blue-500/20 group-hover:bg-blue-500/[0.02]"
                        style={{ backgroundColor: t.badgeBg, borderColor: t.border, color: t.text }}
                      >
                        <svg className="h-3.5 w-3.5 fill-current shrink-0 opacity-70" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span className="truncate opacity-90">{project.repo || "github.com/heisolly/Vibro"}</span>
                      </div>
                    </div>

                    {/* Stats Row & Actions */}
                    <div className="border-t pt-4 flex items-center justify-between mt-auto" style={{ borderColor: t.border }}>
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Syncs (May)</span>
                        <span className="text-xs font-black">{project.syncsCount} Executions</span>
                      </div>

                      <div className="flex flex-col gap-0.5 text-left hidden sm:flex">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Last Active</span>
                        <span className="text-xs font-bold" style={{ color: t.success }}>{project.lastSync}</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openWorkspace(project)}
                        className="px-4 py-2 rounded-2xl text-xs font-bold text-white flex items-center gap-1 shadow-sm transition-all"
                        style={{ background: t.ctaGradient }}
                      >
                        Open Workspace
                        <MaterialIcon name="chevron_right" size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              ))}

              {/* Zero State / Create New Workspace Card */}
              <div className="relative group">
                {/* Glowing back-border blur overlay on zero-state hover */}
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-md pointer-events-none -z-10" />

                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => setScreen("create_project")}
                  className="h-full rounded-3xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[260px] transition-all duration-300 relative overflow-hidden"
                  style={{
                    backgroundColor: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
                    borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)",
                    boxShadow: t.shadowSm
                  }}
                >
                  {/* Rotating plus icon block */}
                  <motion.div
                    className="h-12 w-12 rounded-2xl border border-dashed flex items-center justify-center mb-4 transition-all duration-300"
                    style={{
                      borderColor: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
                      backgroundColor: t.badgeBg,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                    }}
                    whileHover={{ rotate: 90, scale: 1.1 }}
                  >
                    <MaterialIcon name="add" size={24} style={{ color: t.text }} />
                  </motion.div>

                  <h3 className="text-base font-bold tracking-tight mb-1 transition-colors group-hover:text-blue-500" style={{ color: t.text }}>
                    Create New Workspace
                  </h3>
                  <p className="text-xs max-w-xs leading-relaxed" style={{ color: t.subText }}>
                    Sync a new GitHub repository, map its architecture automatically, and build a scoped developer context bundle.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Zero State Query Alert */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-center py-12 rounded-3xl border border-dashed flex flex-col items-center justify-center gap-3"
                style={{ borderColor: t.border, backgroundColor: t.badgeBg }}
              >
                <MaterialIcon name="search_off" size={32} style={{ color: t.subText }} />
                <h4 className="text-sm font-bold">No workspaces match your filters</h4>
                <p className="text-xs max-w-sm" style={{ color: t.subText }}>
                  We couldn't find any projects matching "{searchQuery}" with status "{statusFilter === "all" ? "Any Status" : statusFilter}".
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                  className="mt-2 text-xs font-bold text-blue-500 hover:text-blue-600 transition"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </motion.main>
        )}

        {/* ── SCREEN 3: CREATE NEW PROJECT ── */}
        {screen === "create_project" && (
          <motion.main
            key="create_project"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12"
          >
            <div
              className="w-full max-w-lg rounded-3xl border p-8 backdrop-blur-md shadow-xl"
              style={{ backgroundColor: t.cardBg, borderColor: t.border }}
            >
              {/* Header */}
              <div className="text-center mb-7">
                <div
                  className="inline-flex items-center justify-center h-11 w-11 rounded-2xl mb-3"
                  style={{ background: t.ctaGradient }}
                >
                  <MaterialIcon name="folder_open" size={22} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Create a New Workspace</h2>
                <p className="text-sm mt-1" style={{ color: t.subText }}>
                  Each project gets its own scoped Context Bundle, Architecture Map, and Design System.
                </p>
              </div>

              <form onSubmit={handleWorkspaceCreateSubmit} className="space-y-5">
                {/* Project Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: t.subText }}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => { setProjectName(e.target.value); setFormError(""); }}
                    placeholder="e.g. Vibro Frontend"
                    className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none transition"
                    style={{ borderColor: t.border, backgroundColor: t.inputBg, color: t.text }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: t.subText }}>
                    Project Description
                  </label>
                  <textarea
                    rows={2}
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="Describe what your app does — APIs, schemas, visual design"
                    className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none resize-none transition"
                    style={{ borderColor: t.border, backgroundColor: t.inputBg, color: t.text }}
                  />
                </div>

                {/* Repository — Required, featured */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: t.subText }}>
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub Repository
                    <span className="ml-auto text-red-500 font-bold normal-case tracking-normal">Required</span>
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold select-none"
                      style={{ color: t.subText }}
                    >
                      github.com/
                    </span>
                    <input
                      type="text"
                      value={projectRepo.replace("github.com/", "").replace("https://github.com/", "")}
                      onChange={(e) => {
                        setProjectRepo(`github.com/${e.target.value}`);
                        setFormError("");
                      }}
                      placeholder="username/repo-name"
                      className="w-full rounded-xl border pl-24 pr-3.5 py-2.5 text-sm focus:outline-none transition"
                      style={{
                        borderColor: formError ? t.error : t.border,
                        backgroundColor: t.inputBg,
                        color: t.text,
                        boxShadow: formError ? `0 0 0 2px ${t.error}22` : "none",
                      }}
                    />
                  </div>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color: t.subText }}>
                    Vibro will use this to auto-map your architecture, detect your stack, and sync context bundles.
                  </p>

                  {/* Inline validation error */}
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold"
                      style={{
                        borderColor: `${t.error}40`,
                        backgroundColor: `${t.error}10`,
                        color: t.error,
                      }}
                    >
                      <MaterialIcon name="error" size={14} className="mt-0.5 shrink-0" />
                      <span>{formError}</span>
                    </motion.div>
                  )}
                </div>

                {/* Team Members */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: t.subText }}>
                    Team Members
                    <span className="ml-2 normal-case font-medium tracking-normal" style={{ color: t.subText }}>— optional, comma separated</span>
                  </label>
                  <input
                    type="text"
                    value={projectTeam}
                    onChange={(e) => setProjectTeam(e.target.value)}
                    placeholder="Sarah, Alex, Michael"
                    className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none transition"
                    style={{ borderColor: t.border, backgroundColor: t.inputBg, color: t.text }}
                  />
                </div>

                {/* Submit */}
                <div className="pt-1">
                  <motion.button
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-white tracking-wide flex items-center justify-center gap-2 shadow-md"
                    style={{
                      background: t.ctaGradient,
                      boxShadow: dark
                        ? "0 4px 20px rgba(59,130,246,0.3)"
                        : "0 4px 20px rgba(37,99,235,0.2)",
                    }}
                  >
                    <MaterialIcon name="bolt" size={18} />
                    Configure Workspace Onboarding
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.main>
        )}

        {/* ── SCREEN 4: ONBOARDING FLOW ── */}
        {screen === "onboarding" && (
          <motion.main
            key="onboarding"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6"
          >
            <div
              className="w-full max-w-xl rounded-3xl border p-8 backdrop-blur-md shadow-xl"
              style={{
                backgroundColor: t.cardBg,
                borderColor: t.border,
              }}
            >
              {/* Wizard Nav Steps */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold uppercase" style={{ color: t.accent }}>
                  Workspace Onboarding
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: t.badgeBg, color: t.subText }}>
                  Step {onboardingStep} of 3
                </span>
              </div>

              {/* Step Title Header */}
              <div className="mb-6">
                {onboardingStep === 1 && (
                  <>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <MaterialIcon name="palette" size={22} className="text-blue-500" />
                      1. Generate AI Design System
                    </h3>
                    <p className="text-sm mt-1" style={{ color: t.subText }}>
                      Describe the visual vibe of the application, and we'll generate HSL palette variables.
                    </p>
                  </>
                )}
                {onboardingStep === 2 && (
                  <>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <MaterialIcon name="schema" size={22} className="text-emerald-500" />
                      2. Map Application Architecture
                    </h3>
                    <p className="text-sm mt-1" style={{ color: t.subText }}>
                      Vibro will inspect your repository and map active dependencies, router nodes, and code context.
                    </p>
                  </>
                )}
                {onboardingStep === 3 && (
                  <>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <MaterialIcon name="sync_alt" size={22} className="text-amber-500" />
                      3. Sync GitHub & Trigger.dev Integrations
                    </h3>
                    <p className="text-sm mt-1" style={{ color: t.subText }}>
                      Sync Trigger.dev triggers to check on background compilation and drift warnings in real-time.
                    </p>
                  </>
                )}
              </div>

              {/* Wizard Content Inner */}
              <div className="min-h-[160px] flex flex-col justify-center rounded-2xl p-5 border mb-6" style={{ borderColor: t.border, backgroundColor: dark ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.4)" }}>
                {onboardingStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={designVibe}
                        onChange={(e) => setDesignVibe(e.target.value)}
                        className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                        style={{ borderColor: t.border, backgroundColor: t.inputBg, color: t.text }}
                      />
                      <button
                        onClick={generatePalette}
                        disabled={isGeneratingPalette}
                        className="px-4 py-2 rounded-xl text-white font-semibold text-sm flex items-center gap-1.5"
                        style={{ background: t.ctaGradient }}
                      >
                        {isGeneratingPalette ? "Drafting..." : "Generate"}
                        <MaterialIcon name="sparkles" size={16} fill />
                      </button>
                    </div>

                    {isGeneratingPalette && (
                      <div className="flex items-center gap-2 text-xs font-bold" style={{ color: t.accent }}>
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                        AI is compiling tokens, gradients, and font families...
                      </div>
                    )}

                    {generatedTokens.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase" style={{ color: t.subText }}>Generated Palette Tokens:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {generatedTokens.map((tok) => (
                            <div key={tok} className="font-mono text-xs px-2.5 py-1 rounded border flex items-center justify-between" style={{ backgroundColor: t.badgeBg, borderColor: t.border }}>
                              <span>{tok}</span>
                              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tok.split("#")[1] ? `#${tok.split("#")[1]}` : "#E0F2FE" }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {onboardingStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: t.subText }}>Target Repository: {projectRepo}</span>
                      <button
                        onClick={startRepoScan}
                        disabled={isScanningRepo}
                        className="px-4 py-2 rounded-xl text-white font-semibold text-sm flex items-center gap-1.5"
                        style={{ background: t.ctaGradient }}
                      >
                        {isScanningRepo ? "Scanning..." : "Scan Repo"}
                        <MaterialIcon name="folder_open" size={16} />
                      </button>
                    </div>

                    {isScanningRepo && (
                      <div className="flex items-center gap-2 text-xs font-bold" style={{ color: t.accent }}>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        Analyzing workspace package layout...
                      </div>
                    )}

                    {scannedFiles.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold uppercase" style={{ color: t.subText }}>Active Maps Discovered:</div>
                        <div className="max-h-[100px] overflow-y-auto font-mono text-[11px] space-y-1 pr-2">
                          {scannedFiles.map((file) => (
                            <div key={file} className="flex items-center gap-2" style={{ color: t.text }}>
                              <MaterialIcon name="check_circle" size={12} className="text-emerald-500" />
                              <span>{file}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {onboardingStep === 3 && (
                  <div className="space-y-4 text-center">
                    <div className="flex justify-center gap-4">
                      <div className="flex flex-col items-center p-3 border rounded-xl" style={{ borderColor: t.border, backgroundColor: t.badgeBg, width: "110px" }}>
                        <MaterialIcon name="webhook" size={24} className="text-amber-500 mb-1" />
                        <span className="text-[10px] font-bold">Trigger.dev</span>
                      </div>
                      <div className="flex flex-col items-center p-3 border rounded-xl" style={{ borderColor: t.border, backgroundColor: t.badgeBg, width: "110px" }}>
                        <MaterialIcon name="groups" size={24} className="text-blue-500 mb-1" />
                        <span className="text-[10px] font-bold">Liveblocks</span>
                      </div>
                    </div>

                    {!triggerConnected && !isSyncingTrigger && (
                      <button
                        onClick={startTriggerSync}
                        className="mx-auto px-5 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2"
                        style={{ background: t.ctaGradient }}
                      >
                        Authorize & Sync Integrations
                        <MaterialIcon name="cloud_sync" size={18} />
                      </button>
                    )}

                    {isSyncingTrigger && (
                      <div className="flex items-center justify-center gap-2 text-xs font-bold" style={{ color: t.accent }}>
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                        Syncing webhook triggers and multiplayer rooms...
                      </div>
                    )}

                    {triggerConnected && (
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                          <MaterialIcon name="verified" size={18} />
                          Trigger.dev webhooks synced & Active
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: t.subText }}>Cursor & Claude MCP hooks successfully loaded!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wizard Steps Controller */}
              <div className="flex justify-between items-center">
                <button
                  disabled={onboardingStep === 1}
                  onClick={() => setOnboardingStep((s) => (s - 1) as 1 | 2 | 3)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border flex items-center gap-1 transition-all disabled:opacity-40"
                  style={{ borderColor: t.border, color: t.text }}
                >
                  <MaterialIcon name="arrow_back" size={16} />
                  Back
                </button>

                {onboardingStep < 3 ? (
                  <button
                    onClick={() => setOnboardingStep((s) => (s + 1) as 1 | 2 | 3)}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-1 transition-all"
                    style={{ background: t.ctaGradient }}
                  >
                    Next
                    <MaterialIcon name="arrow_forward" size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishOnboarding}
                    disabled={!triggerConnected}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-all disabled:opacity-55"
                    style={{ background: t.ctaGradient }}
                  >
                    Enter LuterChat
                    <MaterialIcon name="forum" size={18} />
                  </button>
                )}
              </div>
            </div>
          </motion.main>
        )}

        {/* ── SCREEN 5: LUTERCHAT CONVERSATIONAL LAYER ── */}
        {screen === "luterchat" && (
          <motion.main
            key="luterchat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex min-h-screen flex-col justify-between py-6 px-6 max-w-4xl mx-auto"
          >
            {/* Header info */}
            <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: t.border }}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-sm font-bold tracking-tight">Active Context Compiler: LuterChat</span>
              </div>
              <span className="text-xs font-semibold" style={{ color: t.subText }}>Project: {projectName}</span>
            </div>

            {/* Chat Messages Feed (Gemini / Claude style bubble display) */}
            <div className="flex-1 overflow-y-auto my-6 space-y-4 pr-2 max-h-[60vh] scrollbar-thin">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xl rounded-2xl p-4 border shadow-sm ${
                      msg.sender === "user" ? "text-white" : ""
                    }`}
                    style={{
                      backgroundColor: msg.sender === "user" ? t.accent : t.cardBg,
                      borderColor: t.border,
                      color: msg.sender === "user" ? "#FFFFFF" : t.text,
                    }}
                  >
                    <p className="text-[14px] leading-relaxed font-semibold">{msg.text}</p>
                    
                    {msg.logs && (
                      <div className="mt-3 space-y-1 font-mono text-[10px] bg-slate-950/80 p-2.5 rounded-lg text-emerald-400">
                        {msg.logs.map((log) => (
                          <div key={log} className="flex items-center gap-1">
                            <span className="text-slate-500">&gt;</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isChatGenerating && (
                <div className="flex justify-start">
                  <div className="rounded-2xl p-4 border flex items-center gap-2" style={{ backgroundColor: t.cardBg, borderColor: t.border }}>
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-xs font-semibold" style={{ color: t.subText }}>Vibro Context Compiler is analyzing schemas...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom prompt panel (Gemini core UI styling input) */}
            <div className="space-y-3">
              <div className="flex gap-2 justify-center flex-wrap">
                <button
                  onClick={() => setChatInput("A task manager app with a dynamic Kanban and drift monitoring hooks.")}
                  className="text-xs px-3 py-1.5 rounded-full border hover:bg-opacity-50 transition"
                  style={{ borderColor: t.border, backgroundColor: t.badgeBg, color: t.subText }}
                >
                  💡 Build task manager app
                </button>
                <button
                  onClick={() => setChatInput("A visual drag-and-drop landing page editor that compiles layout variables into Supabase.")}
                  className="text-xs px-3 py-1.5 rounded-full border hover:bg-opacity-50 transition"
                  style={{ borderColor: t.border, backgroundColor: t.badgeBg, color: t.subText }}
                >
                  💡 Supabase UI landing builder
                </button>
              </div>

              <div className="group relative">
                {/* Decorative glow aura */}
                <div
                  className="absolute -inset-1 rounded-full blur-xl pointer-events-none opacity-40 transition"
                  style={{ background: t.searchGlow }}
                />
                
                <div
                  className="relative flex items-center gap-2 rounded-full border py-2 pl-3 pr-2 backdrop-blur-md"
                  style={{ backgroundColor: t.inputBg, borderColor: t.border }}
                >
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Tell Vibro what you're building — architecture, database schemas, active flows..."
                    className="flex-1 bg-transparent text-[14px] font-semibold focus:outline-none"
                    style={{ color: t.text }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                  />

                  {/* Send CTA */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    className="grid h-8 w-8 place-items-center rounded-full text-white"
                    style={{ background: t.ctaGradient }}
                  >
                    <MaterialIcon name="arrow_upward" size={16} />
                  </motion.button>
                </div>
              </div>

              {chatMessages.length > 1 && (
                <div className="flex justify-center pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={enterDashboard}
                    className="px-6 py-2 rounded-full font-bold text-xs text-white flex items-center gap-1.5 transition-all shadow-md"
                    style={{ background: t.ctaGradient }}
                  >
                    Enter Workspace Dashboard
                    <MaterialIcon name="dashboard" size={14} />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.main>
        )}

        {/* ── SCREEN 6: CORE PROJECT WORKSPACE DASHBOARD ── */}
        {screen === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen z-10 relative"
          >
            {/* Sidebar (Linear Blend Structure) */}
            <motion.aside
              animate={{ width: expanded ? 240 : 68 }}
              transition={{ type: "spring", stiffness: 220, damping: 23 }}
              className="fixed left-0 top-0 z-20 hidden h-screen flex-col justify-between py-5 md:flex border-r"
              style={{
                backgroundColor: dark ? "rgba(22,27,34,0.3)" : "rgba(255,255,255,0.15)",
                borderColor: t.border,
              }}
            >
              <div className="flex flex-col gap-3 px-3">
                {/* Branding / Collapse Hover Handler */}
                <div
                  className={`relative flex h-10 items-center ${expanded ? "justify-between" : "justify-center"} mb-4 px-1.5`}
                  onMouseEnter={() => setLogoHovered(true)}
                  onMouseLeave={() => setLogoHovered(false)}
                >
                  {expanded ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-lg">
                          <Image
                            src={dark ? "/logo.png" : "/light_logo.png"}
                            alt="Vibro"
                            width={28}
                            height={28}
                            className="object-contain"
                          />
                        </div>
                        <span className="font-bold tracking-tight text-[16px]">{projectName}</span>
                      </div>

                      {logoHovered && (
                        <motion.button
                          onClick={() => setExpanded(false)}
                          className="grid h-7 w-7 place-items-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                          style={{ color: t.text }}
                        >
                          <MaterialIcon name="dock_to_left" size={16} />
                        </motion.button>
                      )}
                    </>
                  ) : (
                    <div className="relative h-8 w-8 flex items-center justify-center">
                      {logoHovered ? (
                        <button
                          onClick={() => setExpanded(true)}
                          className="grid h-8 w-8 place-items-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                          style={{ color: t.text }}
                        >
                          <MaterialIcon name="dock_to_left" size={16} />
                        </button>
                      ) : (
                        <Image
                          src={dark ? "/logo.png" : "/light_logo.png"}
                          alt="Vibro"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Sidebar Navigation Options */}
                <nav className="flex flex-col gap-1.5">
                  <SidebarNavItem
                    icon="home"
                    label="Home Dashboard"
                    active={activeBoard === "home"}
                    expanded={expanded}
                    onClick={() => setActiveBoard("home")}
                    t={t}
                  />
                  <SidebarNavItem
                    icon="schema"
                    label="Architecture Board"
                    active={activeBoard === "architecture"}
                    expanded={expanded}
                    onClick={() => setActiveBoard("architecture")}
                    t={t}
                  />
                  <SidebarNavItem
                    icon="palette"
                    label="Design System Board"
                    active={activeBoard === "design"}
                    expanded={expanded}
                    onClick={() => setActiveBoard("design")}
                    t={t}
                  />
                  <SidebarNavItem
                    icon="table_rows"
                    label="Context Management"
                    active={activeBoard === "context"}
                    expanded={expanded}
                    onClick={() => setActiveBoard("context")}
                    t={t}
                  />
                  <SidebarNavItem
                    icon="view_kanban"
                    label="Build Progress Board"
                    active={activeBoard === "build"}
                    expanded={expanded}
                    onClick={() => setActiveBoard("build")}
                    t={t}
                  />
                  <SidebarNavItem
                    icon="auto_stories"
                    label="Inspiration Board"
                    active={activeBoard === "inspiration"}
                    expanded={expanded}
                    onClick={() => setActiveBoard("inspiration")}
                    t={t}
                  />
                  <SidebarNavItem
                    icon="inventory_2"
                    label="Context Bundle"
                    active={activeBoard === "bundle"}
                    expanded={expanded}
                    onClick={() => setActiveBoard("bundle")}
                    t={t}
                  />
                  <SidebarNavItem
                    icon="settings"
                    label="Settings Page"
                    active={activeBoard === "settings"}
                    expanded={expanded}
                    onClick={() => setActiveBoard("settings")}
                    t={t}
                  />
                  <div className="my-1 border-t opacity-10" style={{ borderColor: t.border }} />
                  <SidebarNavItem
                    icon="workspaces"
                    label="Switch Workspace"
                    active={false}
                    expanded={expanded}
                    onClick={() => setScreen("projects")}
                    t={t}
                  />
                </nav>
              </div>

              {/* Sidebar Footer Widget (Vibro Context Bundle Status) */}
              <div className="flex flex-col gap-2.5 px-3">
                <div
                  className="rounded-xl border p-3 flex flex-col gap-1 backdrop-blur-sm"
                  style={{
                    backgroundColor: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    borderColor: t.border,
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider" style={{ color: t.subText }}>
                    <span>Context Bundle</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-xs font-bold font-mono">vibro_v1.0.2</span>
                  {expanded && (
                    <span className="text-[10px] font-medium leading-none opacity-80" style={{ color: t.subText }}>
                      MCP Connected &amp; Synced to Cursor
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-1 px-1">
                  <span className="text-xs font-bold" style={{ color: t.subText }}>{projectTeam.split(",")[0]}</span>
                  <span
                    className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}
                  >
                    M
                  </span>
                </div>
              </div>
            </motion.aside>

            {/* Main Area Content Container */}
            <main
              className="flex-1 py-8 px-8 transition-[padding] duration-300 min-h-screen"
              style={{ paddingLeft: expanded ? "272px" : "100px" }}
            >
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Board Header Title bar */}
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: t.border }}>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Project Space</span>
                    <h2 className="text-2xl font-bold font-display leading-tight">{projectName}</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: t.badgeBg, color: t.text }}>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Sync Status: OK
                    </span>
                  </div>
                </div>

                {/* ── BOARD 1: HOME DASHBOARD ── */}
                {activeBoard === "home" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-2xl p-5" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                        <div className="flex items-center gap-2 mb-2">
                          <MaterialIcon name="verified_user" className="text-blue-500" size={24} />
                          <h4 className="font-bold text-sm">Active OS Context</h4>
                        </div>
                        <p className="text-2xl font-bold font-mono">v1.0.2</p>
                        <span className="text-xs" style={{ color: t.subText }}>Synced 3 mins ago in Cursor</span>
                      </div>
                      
                      <div className="border rounded-2xl p-5" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                        <div className="flex items-center gap-2 mb-2">
                          <MaterialIcon name="folder_sync" className="text-emerald-500" size={24} />
                          <h4 className="font-bold text-sm">GitHub Sync</h4>
                        </div>
                        <p className="text-[13px] font-semibold truncate">{projectRepo}</p>
                        <span className="text-xs text-emerald-500 font-bold flex items-center gap-1 mt-1">
                          <MaterialIcon name="check" size={14} /> Webhooks Active
                        </span>
                      </div>

                      <div className="border rounded-2xl p-5" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                        <div className="flex items-center gap-2 mb-2">
                          <MaterialIcon name="webhook" className="text-amber-500" size={24} />
                          <h4 className="font-bold text-sm">Trigger.dev Workers</h4>
                        </div>
                        <p className="text-2xl font-bold font-mono">Active</p>
                        <span className="text-xs" style={{ color: t.subText }}>3 active background workers</span>
                      </div>
                    </div>

                    {/* Quick action grid (Linear Layout Inspired) */}
                    <div className="border rounded-2xl p-6" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                      <h4 className="font-bold text-[15px] mb-4">Quick Operations</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button onClick={() => setActiveBoard("architecture")} className="border p-4 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition" style={{ borderColor: t.border }}>
                          <MaterialIcon name="schema" size={22} className="text-blue-500" />
                          <span className="text-xs font-semibold">Arch Board</span>
                        </button>
                        <button onClick={() => setActiveBoard("design")} className="border p-4 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition" style={{ borderColor: t.border }}>
                          <MaterialIcon name="palette" size={22} className="text-emerald-500" />
                          <span className="text-xs font-semibold">Design System</span>
                        </button>
                        <button onClick={() => setActiveBoard("build")} className="border p-4 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition" style={{ borderColor: t.border }}>
                          <MaterialIcon name="view_kanban" size={22} className="text-amber-500" />
                          <span className="text-xs font-semibold">Kanban Board</span>
                        </button>
                        <button onClick={() => setActiveBoard("bundle")} className="border p-4 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition" style={{ borderColor: t.border }}>
                          <MaterialIcon name="inventory_2" size={22} className="text-purple-500" />
                          <span className="text-xs font-semibold">Context Bundle</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── BOARD 2: ARCHITECTURE BOARD ── */}
                {activeBoard === "architecture" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border rounded-2xl p-6" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                      <h3 className="font-bold text-[16px] mb-2 flex items-center gap-2">
                        <MaterialIcon name="schema" className="text-blue-500" />
                        Application Architecture Schema
                      </h3>
                      <p className="text-xs" style={{ color: t.subText }}>Visual relationships and schema structures mapped directly to your database registries.</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {/* Users Table */}
                        <div className="border rounded-xl p-4 font-mono text-[11px] space-y-2 bg-slate-950 text-slate-200">
                          <div className="border-b border-slate-800 pb-1.5 mb-1.5 text-xs font-bold text-blue-400">TABLE users</div>
                          <div>id: uuid (PRIMARY KEY)</div>
                          <div>email: text (UNIQUE)</div>
                          <div>avatar_url: text</div>
                          <div>created_at: timestamp</div>
                        </div>

                        {/* Projects Table */}
                        <div className="border rounded-xl p-4 font-mono text-[11px] space-y-2 bg-slate-950 text-slate-200">
                          <div className="border-b border-slate-800 pb-1.5 mb-1.5 text-xs font-bold text-emerald-400">TABLE projects</div>
                          <div>id: uuid (PRIMARY KEY)</div>
                          <div>name: text</div>
                          <div>repo_link: text</div>
                          <div>owner_id: uuid (FK users.id)</div>
                        </div>

                        {/* Context Bundles Table */}
                        <div className="border rounded-xl p-4 font-mono text-[11px] space-y-2 bg-slate-950 text-slate-200">
                          <div className="border-b border-slate-800 pb-1.5 mb-1.5 text-xs font-bold text-amber-400">TABLE context_bundles</div>
                          <div>id: uuid (PRIMARY KEY)</div>
                          <div>version: text</div>
                          <div>schema_dump: jsonb</div>
                          <div>project_id: uuid (FK projects.id)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── BOARD 3: DESIGN SYSTEM BOARD ── */}
                {activeBoard === "design" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border rounded-2xl p-6" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                      <h3 className="font-bold text-[16px] mb-2 flex items-center gap-2">
                        <MaterialIcon name="palette" className="text-emerald-500" />
                        Design System Palette Tokens
                      </h3>
                      <p className="text-xs" style={{ color: t.subText }}>Visual tokens compiled directly from the onboarding prompt variables.</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="border rounded-xl p-4 space-y-3" style={{ borderColor: t.border, backgroundColor: t.badgeBg }}>
                          <span className="text-xs font-bold uppercase" style={{ color: t.subText }}>Primary Accent</span>
                          <div className="h-12 w-full rounded-lg" style={{ backgroundColor: t.accent }} />
                          <div className="text-xs font-mono font-bold flex justify-between">
                            <span>{t.accent}</span>
                          </div>
                        </div>

                        <div className="border rounded-xl p-4 space-y-3" style={{ borderColor: t.border, backgroundColor: t.badgeBg }}>
                          <span className="text-xs font-bold uppercase" style={{ color: t.subText }}>Secondary Text</span>
                          <div className="h-12 w-full rounded-lg" style={{ backgroundColor: t.subText }} />
                          <div className="text-xs font-mono font-bold flex justify-between">
                            <span>{t.subText}</span>
                          </div>
                        </div>

                        <div className="border rounded-xl p-4 space-y-3" style={{ borderColor: t.border, backgroundColor: t.badgeBg }}>
                          <span className="text-xs font-bold uppercase" style={{ color: t.subText }}>Success color</span>
                          <div className="h-12 w-full rounded-lg" style={{ backgroundColor: t.success }} />
                          <div className="text-xs font-mono font-bold flex justify-between">
                            <span>{t.success}</span>
                          </div>
                        </div>

                        <div className="border rounded-xl p-4 space-y-3" style={{ borderColor: t.border, backgroundColor: t.badgeBg }}>
                          <span className="text-xs font-bold uppercase" style={{ color: t.subText }}>Warning color</span>
                          <div className="h-12 w-full rounded-lg" style={{ backgroundColor: t.warning }} />
                          <div className="text-xs font-mono font-bold flex justify-between">
                            <span>{t.warning}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── BOARD 4: CONTEXT MANAGEMENT BOARD ── */}
                {activeBoard === "context" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border rounded-2xl p-6" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                      <h3 className="font-bold text-[16px] mb-2 flex items-center gap-2">
                        <MaterialIcon name="table_rows" className="text-amber-500" />
                        Vibro Developer Context Registries
                      </h3>
                      <p className="text-xs" style={{ color: t.subText }}>Active stack integrations, active endpoints, and versioned decision logs.</p>

                      <div className="overflow-x-auto mt-6">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b" style={{ borderColor: t.border }}>
                              <th className="py-2.5 font-bold uppercase" style={{ color: t.subText }}>Dependency Stack</th>
                              <th className="py-2.5 font-bold uppercase" style={{ color: t.subText }}>Purpose</th>
                              <th className="py-2.5 font-bold uppercase" style={{ color: t.subText }}>Integration Hook</th>
                              <th className="py-2.5 font-bold uppercase" style={{ color: t.subText }}>Status</th>
                            </tr>
                          </thead>
                          <tbody className="font-semibold">
                            <tr className="border-b" style={{ borderColor: t.border }}>
                              <td className="py-3">Liveblocks</td>
                              <td>Realtime multi-player presence</td>
                              <td>useOthers() hooks in sidebars</td>
                              <td className="text-emerald-500">Connected</td>
                            </tr>
                            <tr className="border-b" style={{ borderColor: t.border }}>
                              <td className="py-3">Trigger.dev</td>
                              <td>Background queue workflows</td>
                              <td>trigger/tasks routes</td>
                              <td className="text-emerald-500">Active</td>
                            </tr>
                            <tr className="border-b" style={{ borderColor: t.border }}>
                              <td className="py-3">Supabase</td>
                              <td>PostgreSQL data &amp; Authentication</td>
                              <td>Row Level Security active</td>
                              <td className="text-emerald-500">Enabled</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── BOARD 5: KANBAN BUILD PROGRESS BOARD ── */}
                {activeBoard === "build" && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Live Drift Warning Banner */}
                    <div className="border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <MaterialIcon name="warning" className="text-red-500 animate-bounce" />
                        <span><strong>Warning</strong>: 1 architectural drift alert detected inside local Cursor bundle mapping config!</span>
                      </div>
                      <button className="underline font-bold">Fix Drift</button>
                    </div>

                    {/* Columns grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Planned */}
                      <div className="border rounded-2xl p-4 space-y-3" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                        <div className="flex items-center justify-between border-b pb-2 mb-1" style={{ borderColor: t.border }}>
                          <span className="text-xs font-bold uppercase tracking-wide">Planned</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: t.badgeBg }}>2</span>
                        </div>
                        <KanbanCard title="Database Index mapping" priority="Medium" />
                        <KanbanCard title="Add Liveblocks cursor presence" priority="High" />
                      </div>

                      {/* In Progress */}
                      <div className="border rounded-2xl p-4 space-y-3" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                        <div className="flex items-center justify-between border-b pb-2 mb-1" style={{ borderColor: t.border }}>
                          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: t.accent }}>In Progress</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: t.badgeBg }}>1</span>
                        </div>
                        <KanbanCard title="Integrate Trigger.dev webhook loader" priority="High" active />
                      </div>

                      {/* Built */}
                      <div className="border rounded-2xl p-4 space-y-3" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                        <div className="flex items-center justify-between border-b pb-2 mb-1" style={{ borderColor: t.border }}>
                          <span className="text-xs font-bold uppercase tracking-wide text-emerald-500">Built</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: t.badgeBg }}>3</span>
                        </div>
                        <KanbanCard title="Configure Google Fonts layout integration" priority="Low" />
                        <KanbanCard title="Dynamic Light/Dark logo triggers" priority="Low" />
                      </div>

                      {/* Drifted */}
                      <div className="border rounded-2xl p-4 space-y-3" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                        <div className="flex items-center justify-between border-b pb-2 mb-1" style={{ borderColor: t.border }}>
                          <span className="text-xs font-bold uppercase tracking-wide text-red-500">Drifted</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">1</span>
                        </div>
                        <KanbanCard title="Vercel Edge server route mismatch" priority="High" drifted />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── BOARD 6: INSPIRATION BOARD ── */}
                {activeBoard === "inspiration" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border rounded-2xl p-6" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                      <h3 className="font-bold text-[16px] mb-2 flex items-center gap-2">
                        <MaterialIcon name="auto_stories" className="text-purple-500" />
                        Visual Inspiration Repository
                      </h3>
                      <p className="text-xs" style={{ color: t.subText }}>Store, sort, and tag screenshots or URLs for easy layout inspirations.</p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                        <div className="border rounded-xl overflow-hidden shadow-sm" style={{ borderColor: t.border }}>
                          <div className="h-28 bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold font-display text-lg">Linear App</div>
                          <div className="p-3 text-xs font-semibold">Tabular dark mode interface</div>
                        </div>

                        <div className="border rounded-xl overflow-hidden shadow-sm" style={{ borderColor: t.border }}>
                          <div className="h-28 bg-gradient-to-tr from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold font-display text-lg">Gemini Feed</div>
                          <div className="p-3 text-xs font-semibold">Glowing inputs &amp; aurora grids</div>
                        </div>

                        <div className="border rounded-xl overflow-hidden shadow-sm" style={{ borderColor: t.border }}>
                          <div className="h-28 bg-gradient-to-tr from-amber-400 to-red-500 flex items-center justify-center text-white font-bold font-display text-lg">Vercel Vibe</div>
                          <div className="p-3 text-xs font-semibold">Zero-border transparent panels</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── BOARD 7: CONTEXT BUNDLE PAGE ── */}
                {activeBoard === "bundle" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border rounded-2xl p-6" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                      <div className="flex items-center justify-between border-b pb-4 mb-4" style={{ borderColor: t.border }}>
                        <h3 className="font-bold text-[16px] flex items-center gap-2">
                          <MaterialIcon name="inventory_2" className="text-blue-500" />
                          Vibro Context Bundle Versions
                        </h3>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">Active: v1.0.2</span>
                      </div>

                      <div className="space-y-4">
                        <div className="border rounded-xl p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] space-y-1">
                          <div>&gt; active_bundle: vibro_v1.0.2.json</div>
                          <div>&gt; size: 24.8 KB</div>
                          <div>&gt; synced_at: 2026-05-23T09:12:00Z</div>
                          <div>&gt; code_integrity_hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e46</div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-bold uppercase" style={{ color: t.subText }}>Version Rollbacks:</span>
                          <div className="space-y-2">
                            <div className="border p-3 rounded-xl flex items-center justify-between text-xs" style={{ borderColor: t.border }}>
                              <div className="flex items-center gap-2">
                                <MaterialIcon name="history" />
                                <span className="font-bold">v1.0.2 (Active)</span>
                                <span style={{ color: t.subText }}>- Integrated Trigger.dev background hooks</span>
                              </div>
                              <button className="text-[10px] font-bold bg-blue-500 text-white px-2.5 py-1 rounded-full">Re-sync</button>
                            </div>

                            <div className="border p-3 rounded-xl flex items-center justify-between text-xs opacity-75" style={{ borderColor: t.border }}>
                              <div className="flex items-center gap-2">
                                <MaterialIcon name="history" />
                                <span className="font-bold">v1.0.1</span>
                                <span style={{ color: t.subText }}>- Generated visual Design tokens</span>
                              </div>
                              <button className="text-[10px] font-bold border px-2.5 py-1 rounded-full" style={{ borderColor: t.border }}>Rollback</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── BOARD 8: SETTINGS PAGE ── */}
                {activeBoard === "settings" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border rounded-2xl p-6" style={{ borderColor: t.border, backgroundColor: t.cardBg }}>
                      <h3 className="font-bold text-[16px] mb-2 flex items-center gap-2">
                        <MaterialIcon name="settings" className="text-slate-500" />
                        Project Settings &amp; Integrations
                      </h3>
                      <p className="text-xs" style={{ color: t.subText }}>Configure repo webhooks, Cursor/Claude MCP servers, and connected developer roles.</p>

                      <div className="space-y-4 mt-6">
                        <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: t.border }}>
                          <div>
                            <div className="text-xs font-bold">GitHub Sync Triggers</div>
                            <div className="text-[11px]" style={{ color: t.subText }}>Auto sync context profiles on git commits</div>
                          </div>
                          <span className="text-xs font-bold text-emerald-500">Webhook: Active</span>
                        </div>

                        <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: t.border }}>
                          <div>
                            <div className="text-xs font-bold">Local MCP Port</div>
                            <div className="text-[11px]" style={{ color: t.subText }}>Vibro server listening for Cursor connections</div>
                          </div>
                          <span className="font-mono text-xs font-bold bg-slate-900 text-slate-100 px-2 py-0.5 rounded">port: 8080</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Custom Kanban Card Component ──────────────────── */
function KanbanCard({ title, priority, active, drifted }: { title: string; priority: "High" | "Medium" | "Low"; active?: boolean; drifted?: boolean }) {
  const badgeColors = {
    High: "text-red-500 bg-red-500/10",
    Medium: "text-amber-500 bg-amber-500/10",
    Low: "text-blue-500 bg-blue-500/10",
  };

  return (
    <div
      className={`border rounded-xl p-3 text-xs space-y-2 backdrop-blur-sm ${
        active ? "ring-1 ring-blue-500/30" : ""
      } ${
        drifted ? "border-red-500/30 bg-red-500/5" : "bg-white/80 dark:bg-slate-900/60"
      }`}
      style={{
        borderColor: drifted ? "rgba(239,68,68,0.25)" : "rgba(15,23,42,0.06)",
      }}
    >
      <div className="font-bold leading-tight">{title}</div>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColors[priority]}`}>
          {priority}
        </span>
        {drifted && (
          <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5">
            <MaterialIcon name="warning" size={12} /> Drift
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Custom Sidebar Item Component ─────────────────── */
function SidebarNavItem({
  icon,
  label,
  active,
  expanded,
  onClick,
  t,
}: {
  icon: string;
  label: string;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
  t: typeof tokens.dark;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: expanded ? 3 : 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      title={!expanded ? label : undefined}
      className={`relative flex h-9 items-center gap-3 rounded-xl px-2.5 transition-all ${
        expanded ? "w-full justify-start" : "w-9 justify-center"
      }`}
      style={{
        backgroundColor: active ? t.railIconActiveBg : "transparent",
        color: active ? t.accent : t.text,
      }}
    >
      <span className="grid h-5 w-5 place-items-center">
        <MaterialIcon name={icon} size={18} fill={active} />
      </span>
      {expanded && (
        <span className="truncate text-xs font-bold tracking-tight">
          {label}
        </span>
      )}
    </motion.button>
  );
}

/* ── Custom Theme Design Tokens ────────────────────── */
const tokens = {
  dark: {
    bg:                "#030712",
    secondaryBg:       "#0E131F",
    text:              "#F9FAFB",
    subText:           "#9CA3AF",
    border:            "rgba(255,255,255,0.06)",
    railBg:            "transparent",
    railIconActiveBg:  "rgba(59,130,246,0.16)",
    railIconHoverBg:   "rgba(59,130,246,0.08)",
    cardBg:            "rgba(17,24,39,0.65)",
    inputBg:           "rgba(17,24,39,0.85)",
    badgeBg:           "rgba(31,41,55,0.70)",
    accent:            "#3B82F6",
    accentHover:       "#60A5FA",
    accentSubtle:      "rgba(59,130,246,0.12)",
    ctaGradient:       "linear-gradient(135deg,#3B82F6 0%,#60A5FA 100%)",
    upgradeBtnBg:      "rgba(59,130,246,0.14)",
    upgradeBtnText:    "#60A5FA",
    upgradeBtnBorder:  "rgba(59,130,246,0.25)",
    aurora:
      "radial-gradient(ellipse 80% 50% at 50% -10%,rgba(59,130,246,0.16) 0%,rgba(99,102,241,0.08) 50%,transparent 80%)," +
      "radial-gradient(ellipse 55% 45% at 10% 70%,rgba(139,92,246,0.06) 0%,transparent 60%)," +
      "radial-gradient(ellipse 50% 40% at 90% 60%,rgba(244,63,94,0.04) 0%,transparent 55%)",
    success:           "#10B981",
    warning:           "#F59E0B",
    error:             "#EF4444",
    searchGlow:        "linear-gradient(90deg,rgba(59,130,246,0.28),rgba(30,64,175,0.35),rgba(59,130,246,0.22))",
    searchFocusBorder: "#3B82F6",
    shadowSm:          "0 1px 2px rgba(0,0,0,0.3), 0 1px 1px rgba(0,0,0,0.2)",
    shadowMd:          "0 8px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
  },
  light: {
    bg:                "#F8FAFC",
    secondaryBg:       "#F1F5F9",
    text:              "#0F172A",
    subText:           "#475569",
    border:            "rgba(15,23,42,0.06)",
    railBg:            "transparent",
    railIconActiveBg:  "rgba(59,130,246,0.10)",
    railIconHoverBg:   "rgba(59,130,246,0.05)",
    cardBg:            "rgba(255,255,255,0.75)",
    inputBg:           "rgba(255,255,255,0.85)",
    badgeBg:           "rgba(241,245,249,0.80)",
    accent:            "#3B82F6",
    accentHover:       "#2563EB",
    accentSubtle:      "rgba(59,130,246,0.08)",
    ctaGradient:       "linear-gradient(135deg,#3B82F6 0%,#1D4ED8 100%)",
    upgradeBtnBg:      "linear-gradient(135deg,#DBEAFE 0%,#EFF6FF 100%)",
    upgradeBtnText:    "#1D4ED8",
    upgradeBtnBorder:  "rgba(59,130,246,0.15)",
    aurora:
      "radial-gradient(ellipse 80% 50% at 50% -10%,rgba(59,130,246,0.15) 0%,rgba(99,102,241,0.06) 50%,transparent 80%)," +
      "radial-gradient(ellipse 55% 45% at 15% 70%,rgba(139,92,246,0.06) 0%,transparent 60%)," +
      "radial-gradient(ellipse 50% 40% at 85% 60%,rgba(244,63,94,0.04) 0%,transparent 55%)",
    success:           "#10B981",
    warning:           "#F59E0B",
    error:             "#EF4444",
    searchGlow:        "linear-gradient(90deg,rgba(59,130,246,0.22),rgba(37,99,235,0.28),rgba(59,130,246,0.18))",
    searchFocusBorder: "#3B82F6",
    shadowSm:          "0 1px 2px rgba(15,23,42,0.03), 0 1px 1px rgba(15,23,42,0.02)",
    shadowMd:          "0 8px 24px rgba(15,23,42,0.04), 0 2px 8px rgba(15,23,42,0.02)",
  },
};