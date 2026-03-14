"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const navLinks = [
  { href: "/", label: "Core" },
  { href: "/categories", label: "Archive" },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [user, setUser] = useState<any>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      searchRef.current?.focus();
    }
    if (e.key === "Escape") {
      searchRef.current?.blur();
      setSearchFocused(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      searchRef.current?.blur();
    }
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 pt-5 pb-4 flex justify-center pointer-events-none">
      <div className="mx-auto flex w-[95%] max-w-7xl items-center justify-between pointer-events-auto rounded-[2rem] border-[3.5px] border-black bg-white/80 px-8 py-2.5 backdrop-blur-xl shadow-[6px_6px_0_rgba(0,0,0,1)]">
        
        {/* ── Left Section: Logo & Search ── */}
        <div className="flex items-center gap-10">
          <Link href="/" className="group flex items-center gap-3 transition-all">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b8f724] border-[3px] border-black shadow-[3px_3px_0_rgba(0,0,0,1)] transition-transform group-hover:scale-105 group-hover:rotate-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[26px] font-[1000] tracking-tighter text-black uppercase">
              VIBRO<span className="text-zinc-300">_</span>
            </span>
          </Link>

          {/* Search Bar matching screenshot */}
          <form onSubmit={handleSearch} className="hidden lg:block">
            <div className={`relative flex items-center rounded-2xl border-[3px] border-black/5 bg-[#F3F2EE] transition-all duration-300 w-72 ${
              searchFocused ? "border-black bg-white shadow-[5px_5px_0_rgba(0,0,0,1)] -translate-y-1" : ""
            }`}>
              <svg className="ml-5 h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="EXECUTE FINDER..."
                className="w-full bg-transparent px-4 py-3 text-[12px] font-black text-black outline-none placeholder-zinc-400 uppercase tracking-widest"
              />
              <div className="mr-4 flex items-center gap-1 opacity-20">
                 <span className="text-[10px] font-black">⌘K</span>
              </div>
            </div>
          </form>
        </div>

        {/* ── center: Navigation ── */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-6 py-2.5 text-[12px] font-black uppercase tracking-widest transition-all duration-200 ${
                  active
                    ? "rounded-xl border-[3px] border-black bg-black text-[#b8f724] shadow-[4px_4px_0_rgba(184,247,36,1)] -translate-y-1"
                    : "text-zinc-400 hover:text-black hover:bg-zinc-50 rounded-xl"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ── Right Actions: Auth & CTA ── */}
        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <Link
                href="/sign-in"
                className="hidden text-[12px] font-black uppercase tracking-widest lg:block text-zinc-400 hover:text-black transition-colors"
              >
                Sign_In
              </Link>
              <Link
                href="/sign-up"
                className="flex items-center justify-center rounded-2xl border-[3px] border-black bg-[#b8f724] px-8 py-3 text-[12px] font-[1000] text-black shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none uppercase tracking-widest"
              >
                Get_Vibro
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-2xl border-[3px] border-black bg-black px-8 py-3 text-[12px] font-black text-[#b8f724] shadow-[4px_4px_0_rgba(184,247,36,1)] transition-all hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest"
            >
              <span className="w-2 h-2 rounded-full bg-[#b8f724] animate-pulse" />
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

