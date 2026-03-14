"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  components,
  frameworks,
  styles,
  themes,
  animations,
  generatePrompt,
  getTotalCombinations,
  type GeneratorOption,
  type GeneratorSelections,
} from "@/lib/generator";
import CopyButton from "@/components/CopyButton";
import { streamAIChat } from "@/lib/ai";

const steps = [
  { key: "component" as const, label: "Component", description: "Target Base", options: components },
  { key: "framework" as const, label: "Framework", description: "Core Stack", options: frameworks },
  { key: "style" as const, label: "Style", description: "Visual DNA", options: styles },
  { key: "theme" as const, label: "Theme", description: "Color Logic", options: themes },
  { key: "animation" as const, label: "Animation", description: "Dynamics", options: animations },
];

export default function GeneratorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Partial<GeneratorSelections>>({});
  const [generated, setGenerated] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const totalCombinations = useMemo(() => getTotalCombinations(), []);

  const handleSelect = useCallback((key: string, id: string) => {
    setSelections((prev) => ({ ...prev, [key]: id }));
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 250);
    }
  }, [currentStep]);

  const canGenerate = steps.every((step) => selections[step.key]);

  const result = useMemo(() => {
    if (!canGenerate) return null;
    return generatePrompt(selections as GeneratorSelections);
  }, [canGenerate, selections]);

  const handleGenerate = () => {
    if (canGenerate) setGenerated(true);
  };

  const handleSynthesize = async () => {
    if (!result || isSynthesizing) return;
    
    setAiResponse("");
    setIsSynthesizing(true);
    
    const messages = [
      { 
        role: "system", 
        content: "You are the Vibro AI Architect. Analyze the following system prompt and provide a 'Synthetic Breakdown'. Format nicely with simple HTML-like tags for bolding." 
      },
      { 
        role: "user", 
        content: `Analyze the following system prompt for "${result.title}" and provide:
        1. Key design tokens (colors, spacing, typography) derived from the requirements.
        2. A suggested component hierarchy.
        3. Potential micro-animations that would fit the style.
        
        SYSTEM PROMPT:
        ${result.prompt}` 
      }
    ];

    try {
      await streamAIChat(messages, (text) => {
        setAiResponse((prev) => prev + text);
      }, { model: "openrouter/free", temperature: 0.5, max_tokens: 500 });
    } catch (error) {
      setAiResponse(`Synthesis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or check your API key.`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleReset = () => {
    setSelections({});
    setCurrentStep(0);
    setGenerated(false);
  };

  if (generated && result) {
    return (
      <div className="relative mx-auto max-w-4xl px-4 pt-10 pb-32 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-2xl border-[3px] border-black bg-[#b8f724] px-6 py-2 shadow-[4px_4px_0_rgba(0,0,0,1)]">
            <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Architected_Complete</span>
          </div>
          <h1 className="text-5xl font-black text-black tracking-tighter mb-4 italic underline decoration-[#b8f724] decoration-8">{result.title}</h1>
          <p className="mt-6 text-zinc-500 font-bold max-w-2xl mx-auto text-lg leading-relaxed">{result.description}</p>
        </div>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
          {steps.map((step) => {
            const opt = step.options.find((o) => o.id === selections[step.key]);
            return opt ? (
              <span key={step.key} className="inline-flex items-center gap-3 rounded-2xl border-[3px] border-black bg-white px-5 py-3 text-[11px] font-black text-black uppercase tracking-widest shadow-[5px_5px_0_rgba(0,0,0,1)]">
                <span className="text-xl grayscale group-hover:grayscale-0">{opt.icon}</span> {opt.label}
              </span>
            ) : null;
          })}
        </div>

        {/* Result Terminal View */}
        <div className="relative rounded-[3rem] border-[4px] border-black bg-black p-1.5 shadow-[25px_25px_0_rgba(0,0,0,1)] overflow-hidden mb-12">
          <div className="bg-[#0f0f0f] rounded-[2.5rem] border border-white/10 overflow-hidden">
             <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                   </div>
                   <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">System_Prompt.pen</span>
                </div>
                <CopyButton text={result.prompt} />
             </div>
             <div className="p-10 font-mono text-sm leading-[1.8] text-zinc-300 overflow-auto max-h-[40vh] custom-scrollbar">
                <p className="text-[#b8f724] mb-4 font-black tracking-tighter text-[12px]">/* ARCHITECT_OUTPUT_START */</p>
                {result.prompt}
                <p className="text-[#b8f724] mt-8 font-black tracking-tighter text-[12px]">/* ARCHITECT_OUTPUT_END */</p>
             </div>
          </div>
        </div>

        {/* AI Synthesis Section */}
        <div className="mb-16">
           {!aiResponse && !isSynthesizing ? (
              <button 
                onClick={handleSynthesize}
                className="w-full py-10 rounded-[2.5rem] border-[4px] border-dashed border-black/10 hover:border-[#b8f724] hover:bg-[#b8f724]/5 transition-all flex flex-col items-center justify-center group"
              >
                 <div className="w-16 h-16 rounded-2xl bg-black border-[3.5px] border-white flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-[6px_6px_0_rgba(184,247,36,1)]">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <h3 className="text-xl font-black text-black uppercase tracking-tighter">Synthesize with OpenRouter AI</h3>
                 <p className="text-sm font-bold text-zinc-400 mt-2">Generate architectural breakdown and design tokens.</p>
              </button>
           ) : (
              <div className="rounded-[2.5rem] border-[4px] border-black bg-white p-8 sm:p-12 shadow-[15px_15px_0_rgba(184,247,36,1)]">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-[#b8f724]">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Architecture_Analysis</div>
                       <div className="text-lg font-black text-black uppercase tracking-tighter">Synthetic Metadata</div>
                    </div>
                    {isSynthesizing && (
                      <div className="ml-auto flex gap-1">
                         <div className="w-2 h-2 bg-[#b8f724] rounded-full animate-bounce" />
                         <div className="w-2 h-2 bg-[#b8f724] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      </div>
                    )}
                 </div>
                 <div className="text-zinc-700 font-bold leading-relaxed whitespace-pre-wrap italic">
                    {aiResponse || "Synthesizing..."}
                 </div>
              </div>
           )}
        </div>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <button
            onClick={handleReset}
            className="flex h-16 items-center gap-3 rounded-2xl border-[3px] border-black bg-white px-10 text-sm font-black text-black transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Re-Architect
          </button>
          <Link
            href="/categories"
            className="flex h-16 items-center gap-3 rounded-2xl border-[3px] border-black bg-[#b8f724] px-10 text-sm font-black text-black transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
          >
            Explore Library
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-32 sm:px-6 lg:px-8">
      <div className="mb-24 text-center">
        <div className="mb-10 inline-flex items-center gap-3 rounded-2xl border-2 border-black/5 bg-[#F3F2EE] px-6 py-2">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Available Combinations:</span>
           <span className="text-[10px] font-black text-black uppercase tracking-widest">{totalCombinations.toLocaleString()}</span>
        </div>
        <h1 className="text-6xl sm:text-8xl font-black tracking-[calc(-0.05em)] text-black mb-8 leading-[0.85]">
          Build the <br /><span className="italic underline decoration-[#b8f724] decoration-[16px] underline-offset-[8px]">Future.</span>
        </h1>
        <p className="mx-auto max-w-xl text-xl text-zinc-500 font-bold leading-relaxed">
          Configure your visual architecture below. Our engine will synthesize a high-fidelity system prompt instantly.
        </p>
      </div>

      {/* Progress Step Bar */}
      <div className="mb-24">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center group">
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => setCurrentStep(i)}
                  className={`flex h-16 w-16 items-center justify-center rounded-[1.25rem] border-[3px] transition-all duration-300 font-[1000] text-lg ${
                    selections[s.key]
                      ? "border-black bg-[#b8f724] text-black shadow-[6px_6px_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0_rgba(0,0,0,1)]"
                      : i === currentStep
                      ? "border-black bg-black text-white shadow-[6px_6px_0_rgba(184,247,36,1)]"
                      : "border-black/5 bg-[#F3F2EE] text-zinc-300"
                  }`}
                >
                  {selections[s.key] ? (
                     <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  ) : i + 1}
                </button>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                  i === currentStep ? "text-black" : selections[s.key] ? "text-zinc-500" : "text-zinc-200"
                }`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-4 h-[3px] w-12 sm:w-20 transition-all duration-700 rounded-full ${
                  selections[s.key] ? "bg-black" : "bg-black/5"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Options Grid */}
      <div className="animate-item">
        <div className="mb-16 text-center">
          <p className="text-[11px] font-black text-[#8fcc00] uppercase tracking-[0.3em] mb-3">Step {currentStep + 1} of {steps.length}</p>
          <h2 className="text-4xl font-black text-black italic underline decoration-black/5 decoration-4">Select {step.description}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {step.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(step.key, option.id)}
              className={`group relative flex flex-col items-center rounded-[2.5rem] border-[3.5px] p-10 text-center transition-all duration-300 ${
                selections[step.key] === option.id
                  ? "border-black bg-white shadow-[12px_12px_0_rgba(184,247,36,1)] scale-[1.02]"
                  : "border-black/5 bg-white hover:border-black/10 hover:-translate-y-2 hover:shadow-[12px_12px_0_rgba(0,0,0,1)]"
              }`}
            >
              <span className="text-5xl mb-6 transition-transform group-hover:scale-125 group-hover:rotate-6 duration-300 grayscale group-hover:grayscale-0">
                {option.icon}
              </span>
              <h3 className="text-lg font-[1000] text-black tracking-tight mb-2 uppercase">{option.label}</h3>
              <p className="text-sm text-zinc-500 font-bold leading-relaxed line-clamp-2">{option.description}</p>
              
              {selections[step.key] === option.id && (
                <div className="absolute -top-3 -right-3 h-10 w-10 rounded-2xl bg-black border-[3px] border-white text-white flex items-center justify-center shadow-lg">
                   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-24 flex items-center justify-between border-t-[3px] border-black pt-16">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="flex h-14 items-center gap-3 rounded-2xl border-[3px] border-black bg-white px-8 text-sm font-black text-black transition-all hover:bg-[#FAFAF8] disabled:opacity-5 disabled:cursor-not-allowed group"
        >
          <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Previous
        </button>

        <div className="flex items-center gap-6">
          {currentStep < steps.length - 1 ? (
             <div className="hidden sm:flex items-center gap-3 px-6 h-14 rounded-2xl border-[3px] border-black bg-[#F3F2EE] text-black font-black text-[11px] uppercase tracking-widest italic">
                Awaiting Next Selection
             </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex h-16 items-center gap-4 rounded-2xl border-[3px] border-black bg-black px-12 text-sm font-black text-[#b8f724] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(184,247,36,0.5)] active:translate-y-0 active:shadow-none shadow-[6px_6px_0_rgba(184,247,36,1)] disabled:opacity-30 group"
            >
              Generate Architecture
              <svg className="h-5 w-5 transition-transform group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
