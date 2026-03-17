"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, X, FileImage, FileVideo, Loader2,
  CheckCircle2, AlertCircle, ArrowRight, Zap, Copy, Check
} from "lucide-react";

/* ── Types ── */
interface FilePreview {
  file: File;
  url: string;
  type: "image" | "video";
}

export interface AnalysisResult {
  masterPrompt?: string;
  generatedPrompt?: string;
  projectName?: string;
  uiStyle?: string;
  theme?: string;
  colorPalette?: Record<string, string>;
  fonts?: Record<string, string>;
  componentStyle?: string;
  tokens?: Record<string, any>;
  filesAnalyzed?: number;
  [key: string]: any;
}

interface UploadReferenceProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onClose: () => void;
}

const ACCEPTED_TYPES = [
  "image/png", "image/jpeg", "image/jpg", "image/webp",
  "video/mp4", "video/webm", "video/quicktime",
];

const MAX_FILES = 5;
const MAX_SIZE_MB = 20;

/* 4-step chain-of-thought steps shown in UI */
const ANALYSIS_STEPS = [
  "> [STEP 1] LOADING FILES INTO OPTICAL_AUDITOR...",
  "> [STEP 1] EXTRACTING COLOR FREQUENCY SPECTRUM...",
  "> [STEP 2] MAPPING LAYOUT ARCHITECTURE & DOM TREE...",
  "> [STEP 3] DEFINING CONSTRAINT BOUNDARIES...",
  "> [STEP 4] GENERATING PIXEL-PERFECT MASTER PROMPT...",
  "> COMPILING DESIGN_SYSTEM_TOKENS...",
  "> ANALYSIS COMPLETE — MASTER_SPEC READY.",
];

export default function UploadReference({ onAnalysisComplete, onClose }: UploadReferenceProps) {
  const [files, setFiles]               = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging]     = useState(false);
  const [isAnalyzing, setIsAnalyzing]   = useState(false);
  const [analyzeSteps, setAnalyzeSteps] = useState<string[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [result, setResult]             = useState<AnalysisResult | null>(null);
  const [copied, setCopied]             = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── File handling ── */
  const addFiles = useCallback((incoming: File[]) => {
    setAnalysisError(null);
    const valid = incoming.filter(f => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setAnalysisError(`Unsupported file type: ${f.type}`);
        return false;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        setAnalysisError(`"${f.name}" exceeds ${MAX_SIZE_MB}MB limit.`);
        return false;
      }
      return true;
    });
    setFiles(prev =>
      [...prev, ...valid.map(f => ({
        file: f,
        url: URL.createObjectURL(f),
        type: (f.type.startsWith("video/") ? "video" : "image") as "image" | "video",
      }))].slice(0, MAX_FILES)
    );
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const removeFile = (i: number) => {
    setFiles(prev => {
      const c = [...prev];
      URL.revokeObjectURL(c[i].url);
      c.splice(i, 1);
      return c;
    });
  };

  /* ── Copy master prompt ── */
  const copyPrompt = async () => {
    const text = result?.masterPrompt || result?.generatedPrompt || "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Analyze ── */
  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setIsAnalyzing(true);
    setAnalyzeSteps([]);
    setAnalysisError(null);
    setAnalysisDone(false);
    setResult(null);

    // Run animation steps in parallel with API call
    const runSteps = async () => {
      for (let i = 0; i < ANALYSIS_STEPS.length - 2; i++) {
        await new Promise(r => setTimeout(r, 680));
        setAnalyzeSteps(prev => [...prev, ANALYSIS_STEPS[i]]);
      }
    };
    runSteps();

    try {
      const formData = new FormData();
      files.forEach(f => formData.append("files", f.file));

      const res = await fetch("/api/ai/analyze-reference", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");

      setAnalyzeSteps(prev => [...prev, ANALYSIS_STEPS[ANALYSIS_STEPS.length - 2], ANALYSIS_STEPS[ANALYSIS_STEPS.length - 1]]);
      await new Promise(r => setTimeout(r, 600));
      setResult(data);
      setAnalysisDone(true);

    } catch (err: any) {
      setAnalysisError(err.message || "Analysis failed. Please try again.");
      setIsAnalyzing(false);
      setAnalyzeSteps([]);
    }
  };

  /* ── Apply to canvas — called after user sees the prompt ── */
  const handleApply = () => {
    if (result) onAnalysisComplete(result);
  };

  const masterPromptText = result?.masterPrompt || result?.generatedPrompt || "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="w-full max-w-[780px] max-h-[92vh] bg-[#FFFCF2] border-[4px] border-black shadow-[20px_20px_0_#C6FF3D] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-black px-8 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#C6FF3D] flex items-center justify-center">
              <Upload className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-white font-black uppercase text-[15px] tracking-widest">Upload References</h2>
              <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">
                Optical_Auditor v2.5 · Pixel-Perfect Spec Generator
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 border border-white/20 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ── RESULT VIEW ── */}
            {analysisDone && result && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                {/* Token summary row */}
                <div className="grid grid-cols-4 border-b-2 border-black bg-zinc-900">
                  {[
                    { label: "Project", value: result.projectName || "Detected" },
                    { label: "Style", value: result.uiStyle || "—" },
                    { label: "Theme", value: result.theme || "—" },
                    { label: "Components", value: `${result.detectedComponents?.length ?? "?"} found` },
                  ].map((s, i) => (
                    <div key={i} className="px-5 py-3 border-r border-white/5">
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">{s.label}</p>
                      <p className="text-[12px] font-black text-white truncate">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Color swatches */}
                {result.colorPalette && (
                  <div className="flex gap-0 border-b-2 border-black overflow-x-auto shrink-0">
                    {Object.entries(result.colorPalette).slice(0, 11).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex flex-col items-center gap-1 px-3 py-3 shrink-0 border-r border-black/10"
                        title={`${key}: ${val}`}
                      >
                        <div
                          className="w-6 h-6 border-2 border-black/20"
                          style={{ backgroundColor: String(val) }}
                        />
                        <span className="text-[7px] font-black uppercase text-zinc-500 tracking-wide">{key}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Master Prompt */}
                <div className="flex-1 bg-black overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#C6FF3D] rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-[#C6FF3D] uppercase tracking-[0.3em]">Master_Prompt · Pixel-Perfect Spec</span>
                    </div>
                    <button
                      onClick={copyPrompt}
                      className={`flex items-center gap-2 px-4 py-1.5 border text-[10px] font-black uppercase tracking-widest transition-all ${
                        copied ? "border-[#C6FF3D] text-[#C6FF3D] bg-[#C6FF3D]/10" : "border-white/20 text-zinc-400 hover:border-white hover:text-white"
                      }`}
                    >
                      {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Prompt</>}
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 max-h-[360px]">
                    <pre className="text-[11px] text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
                      {masterPromptText || "No master prompt generated."}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── ANALYSIS LOG ── */}
            {isAnalyzing && !analysisDone && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="m-8 bg-black border-2 border-black p-8 min-h-[280px] relative overflow-hidden font-mono text-sm space-y-2"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-[#C6FF3D] shadow-[0_0_12px_#C6FF3D] animate-[scan_3s_linear_infinite]" />
                <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.4em] mb-5">
                  OPTICAL AUDITOR ENGINE · {files.length} FILE{files.length > 1 ? "S" : ""} · 4-STEP ANALYSIS
                </p>
                {analyzeSteps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 text-xs ${i === analyzeSteps.length - 1 ? "text-[#C6FF3D]" : "text-zinc-600"}`}
                  >
                    <span className="text-zinc-800 shrink-0">[{String(i + 1).padStart(2, "0")}]</span>
                    <span className="font-bold">{step}</span>
                    {i === analyzeSteps.length - 1 && <Loader2 className="w-3 h-3 animate-spin shrink-0" />}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ── UPLOAD VIEW ── */}
            {!isAnalyzing && !analysisDone && (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-5">
                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-[3px] border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4 min-h-[170px] p-8 ${
                    isDragging ? "border-[#C6FF3D] bg-[#C6FF3D]/10" : "border-black/30 hover:border-black hover:bg-zinc-50"
                  }`}
                >
                  <input ref={fileInputRef} type="file" multiple
                    accept="image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/webm,video/quicktime"
                    className="hidden" onChange={e => addFiles(Array.from(e.target.files ?? []))}
                  />
                  <div className={`w-16 h-16 border-[3px] flex items-center justify-center transition-all ${
                    isDragging ? "border-[#C6FF3D] bg-[#C6FF3D] shadow-[8px_8px_0_#000]" : "border-black hover:shadow-[8px_8px_0_#C6FF3D]"
                  }`}>
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-[16px] uppercase tracking-widest mb-1">
                      {isDragging ? "Drop to Analyze" : "Drop your design here"}
                    </p>
                    <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">or click to browse</p>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span className="flex items-center gap-1.5"><FileImage className="w-3.5 h-3.5" /> PNG · JPG · WebP</span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span className="flex items-center gap-1.5"><FileVideo className="w-3.5 h-3.5" /> MP4 · WebM · MOV</span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span>Up to {MAX_FILES} files</span>
                  </div>
                </div>

                {/* Capability callout */}
                <div className="border-2 border-black bg-zinc-900 p-5">
                  <p className="text-[9px] font-black text-[#C6FF3D] uppercase tracking-[0.4em] mb-3">What the Optical Auditor does</p>
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-zinc-400">
                    {[
                      "Layer-by-layer color extraction (hex/hsl)",
                      "Typography audit: family, weight, size, line-height",
                      "Layout mapping: flex/grid, spacing grid",
                      "Generates Senior-Engineer pixel-perfect spec",
                    ].map((t, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[#C6FF3D] shrink-0">→</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Previews */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                        {files.length} File{files.length > 1 ? "s" : ""} Queued
                      </p>
                      <div className="grid grid-cols-5 gap-3">
                        {files.map((f, i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative group">
                            <div className="aspect-square border-2 border-black overflow-hidden bg-zinc-100 shadow-[3px_3px_0_#000]">
                              {f.type === "image"
                                // eslint-disable-next-line @next/next/no-img-element
                                ? <img src={f.url} alt="ref" className="w-full h-full object-cover" />
                                : <video src={f.url} className="w-full h-full object-cover" muted />}
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#C6FF3D] border-2 border-black flex items-center justify-center">
                              {f.type === "video" ? <FileVideo className="w-3 h-3" /> : <FileImage className="w-3 h-3" />}
                            </div>
                            <button onClick={e => { e.stopPropagation(); removeFile(i); }}
                              className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 border-2 border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3 text-white" />
                            </button>
                            <p className="text-[8px] font-black uppercase text-zinc-500 mt-1 truncate">{f.file.name.split(".")[0]}</p>
                          </motion.div>
                        ))}
                        {files.length < MAX_FILES && (
                          <button onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-black/30 hover:border-black flex flex-col items-center justify-center gap-1 hover:bg-zinc-50 transition-all">
                            <span className="text-2xl font-black text-zinc-300">+</span>
                            <span className="text-[8px] font-black uppercase text-zinc-400">Add</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {analysisError && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="p-4 border-2 border-red-500 bg-red-50 flex items-center gap-3 shadow-[4px_4px_0_#ef4444]">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <p className="text-red-600 text-[11px] font-black uppercase tracking-tight">{analysisError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer CTA */}
        <div className="shrink-0 border-t-[3px] border-black p-5 bg-white flex items-center justify-between gap-4">
          {analysisDone && result ? (
            <>
              <button onClick={() => { setAnalysisDone(false); setResult(null); setAnalyzeSteps([]); setIsAnalyzing(false); }}
                className="px-6 py-3 border-2 border-black text-[11px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all">
                ← Re-analyze
              </button>
              <div className="flex gap-3 flex-1 justify-end">
                <button onClick={copyPrompt}
                  className={`px-6 py-3 border-2 border-black text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${copied ? "bg-[#C6FF3D] border-black" : "hover:bg-zinc-100"}`}>
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Prompt</>}
                </button>
                <button onClick={handleApply} className="group relative">
                  <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-active:translate-x-0 group-active:translate-y-0" />
                  <div className="relative h-12 px-8 border-[3px] border-black bg-[#C6FF3D] text-black flex items-center gap-3 font-black text-[12px] uppercase tracking-widest">
                    Apply to Canvas <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <button onClick={onClose}
                className="px-6 py-3 border-2 border-black text-[11px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all">
                Cancel
              </button>
              <button onClick={handleAnalyze} disabled={files.length === 0 || isAnalyzing} className="group relative flex-1 max-w-[360px]">
                <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-active:translate-x-0 group-active:translate-y-0" />
                <div className={`relative h-14 border-[3px] border-black flex items-center justify-center gap-3 transition-all ${
                  files.length > 0 && !isAnalyzing ? "bg-[#C6FF3D] text-black" : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                }`}>
                  {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  <span className="text-[13px] font-black uppercase tracking-widest italic">
                    {isAnalyzing ? "Analyzing..." : `Analyze ${files.length > 0 ? files.length + " File" + (files.length > 1 ? "s" : "") : "Reference"}`}
                  </span>
                  {!isAnalyzing && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </div>
              </button>
            </>
          )}
        </div>

        <style jsx global>{`
          @keyframes scan {
            0%   { transform: translateY(0);     opacity: 1; }
            100% { transform: translateY(280px); opacity: 0.2; }
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}
