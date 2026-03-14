"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Prompt, Category } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"prompts" | "categories" | "dashboard">("dashboard");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Prompt | Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const supabase = createClient();

  // Form states
  const [promptForm, setPromptForm] = useState({
    title: "",
    slug: "",
    categorySlug: "",
    description: "",
    promptText: "",
    tags: "",
    featured: false,
    previewImage: "",
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    icon: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const pRes = await fetch("/api/prompts");
      const { data: cData } = await supabase.from("categories").select("*").order("name");
      
      const pData = await pRes.json();
      setPrompts(pData);
      setCategories(cData as Category[] || []);
    } finally {
      setLoading(false);
    }
  }

  function resetForms() {
    setPromptForm({
      title: "",
      slug: "",
      categorySlug: "",
      description: "",
      promptText: "",
      tags: "",
      featured: false,
      previewImage: "",
    });
    setCategoryForm({
      name: "",
      slug: "",
      icon: "",
      description: "",
    });
    setEditing(null);
    setCreating(false);
    setDeleteId(null);
  }

  function startEditPrompt(prompt: Prompt) {
    setPromptForm({
      title: prompt.title,
      slug: prompt.slug,
      categorySlug: prompt.categorySlug,
      description: prompt.description,
      promptText: prompt.promptText,
      tags: prompt.tags.join(", "),
      featured: prompt.featured,
      previewImage: prompt.previewImage,
    });
    setEditing(prompt);
    setCreating(false);
    setActiveTab("prompts");
  }

  function startEditCategory(category: Category) {
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      description: category.description,
    });
    setEditing(category);
    setCreating(false);
    setActiveTab("categories");
  }

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handlePromptSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...promptForm,
      slug: promptForm.slug || generateSlug(promptForm.title),
      tags: promptForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const url = editing ? `/api/prompts/${(editing as Prompt).id}` : "/api/prompts";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetForms();
    loadData();
  }

  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...categoryForm,
      slug: categoryForm.slug || generateSlug(categoryForm.name),
    };

    if (editing) {
      await supabase.from("categories").update(payload).eq("id", (editing as Category).id);
    } else {
      await supabase.from("categories").insert([{ ...payload, id: `cat-${Date.now()}` }]);
    }

    resetForms();
    loadData();
  }

  async function handleDeletePrompt(id: string) {
    await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    setDeleteId(null);
    loadData();
  }

  async function handleDeleteCategory(id: string) {
    await supabase.from("categories").delete().eq("id", id);
    setDeleteId(null);
    loadData();
  }

  async function handleLogout() {
    document.cookie = "vibro_admin_access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-[#F3F2EE] px-4 py-12 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-black animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Secure_Control_Terminal_v4.2</span>
            </div>
            <h1 className="text-5xl font-[1000] tracking-tighter text-black uppercase leading-none">Vibro_Architect<span className="text-white [-webkit-text-stroke:2px_black]">.</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="rounded-xl border-[3px] border-black bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(239,68,68,1)] hover:bg-red-50"
            >
              Terminate_Session
            </button>
          </div>
        </div>

        {/* Dash Tabs */}
        <div className="mb-12 flex flex-wrap gap-4 border-b-[4px] border-black pb-8">
          {[
            { id: "dashboard", label: "Overview", icon: "📊" },
            { id: "prompts", label: "Components", icon: "🏗️" },
            { id: "categories", label: "Archives", icon: "📂" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); resetForms(); }}
              className={`group flex items-center gap-3 rounded-2xl border-[3px] border-black px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? "bg-black text-[#b8f724] shadow-[8px_8px_0_rgba(184,247,36,1)]"
                  : "bg-white text-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,1)]"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 border-[4px] border-black border-t-[#b8f724] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <div className="grid gap-8 md:grid-cols-4 animate-fade-in">
                <div className="rounded-[2.5rem] border-[4px] border-black bg-white p-8 shadow-[12px_12px_0_rgba(0,0,0,1)]">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">Total_Archives</p>
                  <p className="text-6xl font-[1000] text-black tracking-tighter">{categories.length}</p>
                </div>
                <div className="rounded-[2.5rem] border-[4px] border-black bg-white p-8 shadow-[12px_12px_0_rgba(184,247,36,1)]">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">Active_Components</p>
                  <p className="text-6xl font-[1000] text-black tracking-tighter">{prompts.length}</p>
                </div>
                <div className="rounded-[2.5rem] border-[4px] border-black bg-white p-8 shadow-[12px_12px_0_rgba(0,0,0,1)]">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">Featured_Assets</p>
                  <p className="text-6xl font-[1000] text-black tracking-tighter">{prompts.filter(p => p.featured).length}</p>
                </div>
                <div className="rounded-[2.5rem] border-[4px] border-black bg-black p-8 shadow-[12px_12px_0_rgba(0,0,0,0.2)]">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">System_Health</p>
                  <p className="text-4xl font-[1000] text-[#b8f724] tracking-tighter uppercase">Optimal</p>
                </div>
              </div>
            )}

            {activeTab === "prompts" && (
              <div className="space-y-12 animate-fade-in">
                {/* Form Toggle */}
                <div className="flex justify-end">
                  {!creating && !editing && (
                    <button
                      onClick={() => setCreating(true)}
                      className="rounded-2xl border-[3px] border-black bg-black px-10 py-5 text-sm font-black uppercase tracking-widest text-[#b8f724] shadow-[8px_8px_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_rgba(184,247,36,1)]"
                    >
                      + Construct New Component
                    </button>
                  )}
                </div>

                {/* Form */}
                {(creating || editing) && (
                  <div className="rounded-[3rem] border-[4px] border-black bg-white p-12 shadow-[20px_20px_0_rgba(184,247,36,1)]">
                    <h2 className="mb-12 text-3xl font-[1000] uppercase tracking-tighter text-black">
                      {editing ? "Refactor_Existing_Component" : "Synthesis_New_Architecture"}
                    </h2>
                    <form onSubmit={handlePromptSubmit} className="space-y-8">
                       <div className="grid gap-8 md:grid-cols-2">
                        <div>
                          <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Structural Title</label>
                          <input
                            type="text"
                            required
                            value={promptForm.title}
                            onChange={(e) => setPromptForm({
                              ...promptForm,
                              title: e.target.value,
                              slug: generateSlug(e.target.value)
                            })}
                            className="w-full rounded-2xl border-[3px] border-black bg-white px-6 py-4 font-bold text-black outline-none focus:shadow-[5px_5px_0_rgba(0,0,0,1)]"
                            placeholder="e.g. Neo-Brutalist Sidebar"
                          />
                        </div>
                        <div>
                          <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Path Signature (Slug)</label>
                          <input
                            type="text"
                            value={promptForm.slug}
                            onChange={(e) => setPromptForm({ ...promptForm, slug: e.target.value })}
                            className="w-full rounded-2xl border-[3px] border-black bg-[#FAFAF8] px-6 py-4 font-mono text-xs font-bold text-zinc-500"
                            placeholder="auto-generated"
                          />
                        </div>
                      </div>

                      <div className="grid gap-8 md:grid-cols-3">
                         <div>
                          <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Parent Archive</label>
                          <select
                            required
                            value={promptForm.categorySlug}
                            onChange={(e) => setPromptForm({ ...promptForm, categorySlug: e.target.value })}
                            className="w-full rounded-2xl border-[3px] border-black bg-white px-6 py-4 font-bold text-black outline-none"
                          >
                            <option value="">Select Target...</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.slug}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Descriptor Attributes (Comma separated)</label>
                          <input
                            type="text"
                            value={promptForm.tags}
                            onChange={(e) => setPromptForm({ ...promptForm, tags: e.target.value })}
                            className="w-full rounded-2xl border-[3px] border-black bg-white px-6 py-4 font-bold text-black outline-none"
                            placeholder="glassmorphic, animated, grid, responsive"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Summary Manifest (Description)</label>
                        <textarea
                          required
                          rows={2}
                          value={promptForm.description}
                          onChange={(e) => setPromptForm({ ...promptForm, description: e.target.value })}
                          className="w-full rounded-2xl border-[3px] border-black bg-white p-6 font-bold text-black outline-none resize-none"
                          placeholder="Brief architectural summary..."
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Prompt Logical Core</label>
                        <textarea
                          required
                          rows={10}
                          value={promptForm.promptText}
                          onChange={(e) => setPromptForm({ ...promptForm, promptText: e.target.value })}
                          className="w-full rounded-[2rem] border-[3px] border-black bg-black p-8 font-mono text-[13px] leading-relaxed text-[#b8f724] outline-none"
                          placeholder="Insert expert system instructions..."
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <label className="flex cursor-pointer items-center gap-4 group">
                          <input
                            type="checkbox"
                            checked={promptForm.featured}
                            onChange={(e) => setPromptForm({ ...promptForm, featured: e.target.checked })}
                            className="h-8 w-8 rounded-lg border-[3px] border-black bg-white text-black transition-all checked:bg-black"
                          />
                          <span className="text-xs font-black uppercase tracking-widest text-black group-hover:underline">Prioritize as Featured Archive</span>
                        </label>
                         
                        <div className="flex gap-4">
                          <button type="submit" className="rounded-2xl border-[3px] border-black bg-black px-10 py-5 text-sm font-black uppercase tracking-widest text-[#b8f724] shadow-[8px_8px_0_rgba(184,247,36,1)]">Deploy_Archive</button>
                          <button type="button" onClick={resetForms} className="rounded-2xl border-[3px] border-black bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-50">Cancel</button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* List */}
                <div className="rounded-[3rem] border-[4px] border-black bg-white overflow-hidden shadow-[20px_20px_0_rgba(0,0,0,1)]">
                   <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                        <tr className="border-b-[4px] border-black bg-[#FAFAF8]">
                          <th className="px-10 py-6 text-xs font-[1000] uppercase tracking-widest text-black">Asset_Node</th>
                          <th className="px-10 py-6 text-xs font-[1000] uppercase tracking-widest text-black">Sector</th>
                          <th className="px-10 py-6 text-xs font-[1000] uppercase tracking-widest text-black">Status</th>
                          <th className="px-10 py-6 text-right text-xs font-[1000] uppercase tracking-widest text-black">Operations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-[3px] divide-black/5">
                        {prompts.map((p) => (
                           <tr key={p.id} className="group transition hover:bg-zinc-50/50">
                            <td className="px-10 py-8">
                               <div className="flex flex-col">
                                <span className="text-lg font-black text-black leading-tight group-hover:underline decoration-[#b8f724] decoration-[3px] underline-offset-4">{p.title}</span>
                                <span className="mt-1 font-mono text-[10px] font-bold text-zinc-400 uppercase">{p.slug}</span>
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <span className="rounded-lg border-[2px] border-black/10 bg-black/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                {p.categorySlug}
                              </span>
                            </td>
                            <td className="px-10 py-8">
                               {p.featured ? (
                                <div className="flex items-center gap-2 text-black">
                                  <div className="h-2 w-2 rounded-full bg-[#b8f724] border-[1.5px] border-black animate-pulse" />
                                  <span className="text-[10px] font-black uppercase tracking-widest italic">Featured</span>
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Standard</span>
                              )}
                            </td>
                            <td className="px-10 py-8 text-right">
                               <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                  onClick={() => startEditPrompt(p)}
                                  className="rounded-lg border-[2px] border-black bg-white p-2 text-black hover:bg-[#b8f724]"
                                  title="Edit"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                </button>
                                {deleteId === p.id ? (
                                  <div className="flex gap-1 animate-scale-in">
                                    <button onClick={() => handleDeletePrompt(p.id)} className="rounded-lg border-[2px] border-black bg-red-500 px-3 py-2 text-[10px] font-black text-white hover:bg-red-600">YES</button>
                                    <button onClick={() => setDeleteId(null)} className="rounded-lg border-[2px] border-black bg-white px-3 py-2 text-[10px] font-black text-black">NO</button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteId(p.id)}
                                    className="rounded-lg border-[2px] border-black bg-white p-2 text-black hover:bg-red-500 hover:text-white"
                                    title="Delete"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "categories" && (
              <div className="space-y-12 animate-fade-in">
                 <div className="flex justify-end">
                  {!creating && !editing && (
                    <button
                      onClick={() => setCreating(true)}
                      className="rounded-2xl border-[3px] border-black bg-black px-10 py-5 text-sm font-black uppercase tracking-widest text-[#b8f724] shadow-[8px_8px_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_rgba(184,247,36,1)]"
                    >
                      + Register New Sector
                    </button>
                  )}
                </div>

                {(creating || editing) && (
                  <div className="rounded-[3rem] border-[4px] border-black bg-white p-12 shadow-[20px_20px_0_rgba(184,247,36,1)]">
                    <h2 className="mb-12 text-3xl font-[1000] uppercase tracking-tighter text-black">
                      {editing ? "Refactor_Sector_Manifest" : "Register_New_Archive_Sector"}
                    </h2>
                    <form onSubmit={handleCategorySubmit} className="space-y-8">
                       <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-2">
                          <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Sector Name</label>
                          <input
                            type="text"
                            required
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({
                              ...categoryForm,
                              name: e.target.value,
                              slug: generateSlug(e.target.value)
                            })}
                            className="w-full rounded-2xl border-[3px] border-black bg-white px-6 py-4 font-bold text-black outline-none focus:shadow-[5px_5px_0_rgba(0,0,0,1)]"
                            placeholder="e.g. Navigation Systems"
                          />
                        </div>
                        <div>
                          <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Sector Icon (Emoji)</label>
                          <input
                            type="text"
                            required
                            maxLength={2}
                            value={categoryForm.icon}
                            onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                            className="w-full rounded-2xl border-[3px] border-black bg-white px-6 py-4 text-center text-3xl outline-none"
                            placeholder="🚀"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Sector URI Slug</label>
                        <input
                          type="text"
                          value={categoryForm.slug}
                          onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                          className="w-full rounded-2xl border-[3px] border-black bg-[#FAFAF8] px-6 py-4 font-mono text-xs font-bold text-zinc-500"
                          placeholder="auto-generated"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Mission Parameters (Description)</label>
                        <textarea
                          required
                          rows={2}
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          className="w-full rounded-2xl border-[3px] border-black bg-white p-6 font-bold text-black outline-none resize-none"
                          placeholder="What kind of architectures are stored here?"
                        />
                      </div>

                      <div className="flex justify-end gap-4">
                        <button type="submit" className="rounded-2xl border-[3px] border-black bg-black px-10 py-5 text-sm font-black uppercase tracking-widest text-[#b8f724] shadow-[8px_8px_0_rgba(0,0,0,1)]">Sync_Sector</button>
                        <button type="button" onClick={resetForms} className="rounded-2xl border-[3px] border-black bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-50">Discard</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((c) => (
                    <div key={c.id} className="group relative rounded-[2.5rem] border-[4px] border-black bg-white p-10 shadow-[8px_8px_0_rgba(0,0,0,1)] transition-all hover:-translate-y-2 hover:shadow-[12px_12px_0_rgba(184,247,36,1)]">
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-black bg-[#FAFAF8] text-3xl shadow-[4px_4px_0_rgba(0,0,0,1)] group-hover:-rotate-6 transition-transform">
                          {c.icon}
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => startEditCategory(c)} className="rounded-lg border-[2px] border-black bg-white p-2 text-black hover:bg-[#b8f724]">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                           </button>
                           <button onClick={() => handleDeleteCategory(c.id)} className="rounded-lg border-[2px] border-black bg-white p-2 text-black hover:bg-red-500 hover:text-white">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                      </div>
                      <h3 className="mb-2 text-2xl font-[1000] text-black uppercase tracking-tighter">{c.name}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#b8f724] bg-black px-2 py-0.5 w-fit rounded mb-4 italic">{c.slug}</p>
                      <p className="text-sm font-bold leading-relaxed text-zinc-500 italic">"{c.description}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
