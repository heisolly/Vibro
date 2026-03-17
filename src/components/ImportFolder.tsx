"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen, X, FileText, FileCode, Image as ImageIcon,
  Loader2, CheckCircle2, AlertCircle, ArrowRight, Zap,
  ChevronRight, File, FileType, Globe, Copy, Check
} from "lucide-react";

/* ── Types ───────────────────────────────── */
interface ParsedFolder {
  folderName: string;
  totalFiles: number;
  htmlFiles: { name: string; content: string; size: number }[];
  cssFiles:  { name: string; content: string; size: number }[];
  jsFiles:   { name: string; content: string; size: number }[];
  imageFiles:{ name: string; file: File; url: string; size: number }[];
  otherFiles:{ name: string; size: number }[];
}

export interface FolderAnalysisResult {
  masterPrompt?: string;
  generatedPrompt?: string;
  projectName?: string;
  detectedFramework?: string;
  uiStyle?: string;
  theme?: string;
  colorPalette?: Record<string, string>;
  fonts?: Record<string, string>;
  borderRadius?: { style: string; sm?: string; md?: string; lg?: string; full?: string; none?: string };
  cssVariables?: { detected: string[]; extracted: Record<string, string> };
  detectedComponents?: string[];
  componentStyle?: string;
  animationStyle?: string;
  tokens?: Record<string, any>;
  metadata?: Record<string, any>;
  [key: string]: any;
}

interface ImportFolderProps {
  onAnalysisComplete: (result: FolderAnalysisResult) => void;
  onClose: () => void;
}

const ANALYSIS_STEPS = [
  "> MOUNTING FOLDER_FILESYSTEM...",
  "> PARSING HTML_STRUCTURE_TREE...",
  "> EXTRACTING CSS_VARIABLES_AND_TOKENS...",
  "> SCANNING IMAGE_ASSETS...",
  "> INDEXING JAVASCRIPT_COMPONENTS...",
  "> SENDING TO OPTICAL_AUDITOR...",
  "> COMPILING MASTER_PROMPT_SPEC...",
  "> EXTRACTION COMPLETE — SYSTEM READY.",
];

const ACCEPTED_EXTENSIONS = new Set([
  "html", "htm", "css", "scss", "sass", "less",
  "js", "jsx", "ts", "tsx", "vue", "svelte",
  "png", "jpg", "jpeg", "webp", "gif", "svg", "ico",
  "woff", "woff2", "ttf", "eot",
  "json", "xml"
]);

const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "webp", "gif", "svg", "ico"]);
const CSS_EXTS   = new Set(["css", "scss", "sass", "less"]);
const JS_EXTS    = new Set(["js", "jsx", "ts", "tsx", "vue", "svelte"]);

function getExt(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

/* ── Utility: Read file as text ── */
function readAsText(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => res(e.target?.result as string);
    reader.onerror = () => rej(new Error(`Failed to read ${file.name}`));
    reader.readAsText(file);
  });
}

/* ── File Tree Node ── */
interface TreeNode {
  name: string;
  type: "file" | "folder";
  children?: TreeNode[];
  ext?: string;
  size?: number;
}

function FileTreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const icon = node.type === "folder"
    ? <FolderOpen className="w-3.5 h-3.5 text-[#C6FF3D]" />
    : node.ext && IMAGE_EXTS.has(node.ext)
    ? <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
    : node.ext && CSS_EXTS.has(node.ext)
    ? <FileCode className="w-3.5 h-3.5 text-purple-400" />
    : node.ext && JS_EXTS.has(node.ext)
    ? <FileType className="w-3.5 h-3.5 text-yellow-400" />
    : node.ext === "html" || node.ext === "htm"
    ? <FileText className="w-3.5 h-3.5 text-orange-400" />
    : <File className="w-3.5 h-3.5 text-zinc-500" />;

  return (
    <div>
      <button
        onClick={() => node.type === "folder" && setOpen(o => !o)}
        className="flex items-center gap-2 w-full text-left py-0.5 hover:bg-white/5 rounded px-1 transition-colors"
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
      >
        {node.type === "folder" && (
          <ChevronRight className={`w-3 h-3 text-zinc-600 transition-transform shrink-0 ${open ? "rotate-90" : ""}`} />
        )}
        {node.type !== "folder" && <span className="w-3 shrink-0" />}
        {icon}
        <span className="text-[11px] font-bold text-zinc-300 truncate">{node.name}</span>
        {node.size !== undefined && (
          <span className="text-[9px] text-zinc-700 ml-auto shrink-0">{formatBytes(node.size)}</span>
        )}
      </button>
      {node.type === "folder" && open && node.children && (
        <div>
          {node.children.map((child, i) => (
            <FileTreeItem key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ImportFolder({ onAnalysisComplete, onClose }: ImportFolderProps) {
  const [parsed, setParsed] = useState<ParsedFolder | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeSteps, setAnalyzeSteps] = useState<string[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [result, setResult] = useState<FolderAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [activeTab, setActiveTab] = useState<"tree" | "html" | "css" | "images">("tree");
  const folderInputRef = useRef<HTMLInputElement>(null);

  /* ── Parse dropped / selected folder ── */
  const parseFolder = useCallback(async (files: File[]) => {
    setAnalysisError(null);
    if (files.length === 0) return;

    const res: ParsedFolder = {
      folderName: "website",
      totalFiles: files.length,
      htmlFiles: [], cssFiles: [], jsFiles: [],
      imageFiles: [], otherFiles: [],
    };

    // Derive folder name from first file path
    const firstPath = (files[0] as any).webkitRelativePath || files[0].name;
    res.folderName = firstPath.split("/")[0] || firstPath.split("\\")[0] || "website";

    // Build a tree structure
    const treeMap: Record<string, TreeNode> = {};

    for (const file of files) {
      const relPath = (file as any).webkitRelativePath || file.name;
      const parts = relPath.split("/");
      const ext = getExt(file.name);

      // Build tree
      let current = treeMap;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLeaf = i === parts.length - 1;
        const key = parts.slice(0, i + 1).join("/");
        if (!treeMap[key]) {
          treeMap[key] = {
            name: part,
            type: isLeaf ? "file" : "folder",
            children: isLeaf ? undefined : [],
            ext: isLeaf ? ext : undefined,
            size: isLeaf ? file.size : undefined,
          };
          if (i > 0) {
            const parentKey = parts.slice(0, i).join("/");
            treeMap[parentKey]?.children?.push(treeMap[key]);
          }
        }
      }

      if (!ACCEPTED_EXTENSIONS.has(ext)) {
        res.otherFiles.push({ name: file.name, size: file.size });
        continue;
      }

      if (ext === "html" || ext === "htm") {
        try {
          const content = await readAsText(file);
          res.htmlFiles.push({ name: relPath, content, size: file.size });
        } catch (_) {}
      } else if (CSS_EXTS.has(ext)) {
        try {
          const content = await readAsText(file);
          res.cssFiles.push({ name: relPath, content, size: file.size });
        } catch (_) {}
      } else if (JS_EXTS.has(ext)) {
        // Only read JS if reasonable size
        if (file.size < 500 * 1024) {
          try {
            const content = await readAsText(file);
            res.jsFiles.push({ name: relPath, content, size: file.size });
          } catch (_) {}
        }
      } else if (IMAGE_EXTS.has(ext)) {
        const url = URL.createObjectURL(file);
        res.imageFiles.push({ name: relPath, file, url, size: file.size });
      }
    }

    const firstSegments = new Set(
      Object.keys(treeMap)
        .filter(k => k.split("/").length === 1)
        .map(k => k)
    );
    const rootTree = [...firstSegments].map(k => treeMap[k]).filter(Boolean);

    setTreeNodes(rootTree);
    setParsed(res);
  }, []);

  /* Drop handler */
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const items = e.dataTransfer.items;
    if (!items) return;

    const files: File[] = [];
    const readEntry = (entry: any): Promise<void> => {
      return new Promise(resolve => {
        if (entry.isFile) {
          entry.file((f: File) => {
            Object.defineProperty(f, "webkitRelativePath", { value: entry.fullPath.slice(1) });
            files.push(f);
            resolve();
          });
        } else if (entry.isDirectory) {
          const reader = entry.createReader();
          reader.readEntries(async (entries: any[]) => {
            await Promise.all(entries.map(readEntry));
            resolve();
          });
        } else resolve();
      });
    };

    const traversals: Promise<void>[] = [];
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry?.();
      if (entry) traversals.push(readEntry(entry));
    }
    await Promise.all(traversals);
    await parseFolder(files);
  }, [parseFolder]);

  /* Input handler */
  const handleInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    await parseFolder(files);
    e.target.value = "";
  }, [parseFolder]);

  /* Analyze */
  const handleAnalyze = async () => {
    if (!parsed) return;
    setIsAnalyzing(true);
    setAnalyzeSteps([]);
    setAnalysisError(null);
    setAnalysisDone(false);
    setResult(null);

    // Animate steps
    const runSteps = async () => {
      for (let i = 0; i < ANALYSIS_STEPS.length - 2; i++) {
        await new Promise(r => setTimeout(r, 680));
        setAnalyzeSteps(prev => [...prev, ANALYSIS_STEPS[i]]);
      }
    };
    runSteps();

    try {
      // Combine all HTML
      const sortedHTML = [...parsed.htmlFiles].sort((a, b) =>
        a.name.includes("index") ? -1 : b.name.includes("index") ? 1 : 0
      );
      const htmlContent = sortedHTML.map(f => `/* === ${f.name} === */\n${f.content}`).join("\n\n");

      // Combine all CSS
      const cssContent = parsed.cssFiles.map(f => `/* === ${f.name} === */\n${f.content}`).join("\n\n");

      // Combine relevant JS
      const relevantJS = parsed.jsFiles
        .filter(f =>
          f.name.includes("theme") || f.name.includes("config") ||
          f.name.includes("main") || f.name.includes("app") ||
          f.name.includes("tailwind") || f.name.includes("index")
        )
        .slice(0, 5);
      const jsContent = relevantJS.map(f => `/* === ${f.name} === */\n${f.content}`).join("\n\n");

      // Key images for vision (max 3)
      const keyImages = parsed.imageFiles
        .filter(f => {
          const lower = f.name.toLowerCase();
          return (!lower.includes("icon") && !lower.includes("favicon") && !lower.includes("logo")) || f.size > 5000;
        })
        .slice(0, 3);

      const formData = new FormData();
      formData.append("htmlContent", htmlContent);
      formData.append("cssContent", cssContent);
      formData.append("jsContent", jsContent);
      formData.append("metadata", JSON.stringify({
        folderName: parsed.folderName,
        totalFiles: parsed.totalFiles,
        htmlCount: parsed.htmlFiles.length,
        cssCount: parsed.cssFiles.length,
        jsCount: parsed.jsFiles.length,
        imageCount: parsed.imageFiles.length,
      }));
      keyImages.forEach(img => formData.append("images", img.file));

      const apiRes = await fetch("/api/ai/analyze-folder", {
        method: "POST",
        body: formData,
      });

      const data = await apiRes.json();
      if (!apiRes.ok) throw new Error(data.error || "Analysis failed.");

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

  const copyPrompt = async () => {
    const text = result?.masterPrompt || result?.generatedPrompt || "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (result) onAnalysisComplete(result);
  };

  const totalSize = parsed
    ? [...parsed.htmlFiles, ...parsed.cssFiles, ...parsed.jsFiles, ...parsed.imageFiles]
        .reduce((acc, f) => acc + f.size, 0)
    : 0;

  const masterPromptText = result?.masterPrompt || result?.generatedPrompt || "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className="w-full max-w-[900px] max-h-[92vh] bg-[#FFFCF2] border-[4px] border-black shadow-[24px_24px_0_#C6FF3D] flex flex-col overflow-hidden"
      >
        {/* ── Header ── */}
        <div className="bg-black px-8 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#C6FF3D] flex items-center justify-center shadow-[3px_3px_0_#000]">
              <FolderOpen className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-white font-black uppercase text-[15px] tracking-widest">Import Website Folder</h2>
              <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">
                Folder_Scan_Engine v2.5 · Visual & Code Auditor Mode
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 border border-white/20 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* == RESULT VIEW == */}
            {analysisDone && result && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                {/* Meta summary row */}
                <div className="grid grid-cols-4 border-b-[3px] border-black bg-zinc-900">
                  {[
                    { label: "Project", value: result.projectName || parsed?.folderName || "Detected Component" },
                    { label: "Framework", value: result.detectedFramework || "Vanilla" },
                    { label: "Style", value: result.uiStyle || "—" },
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
                      <div key={key} className="flex flex-col items-center gap-1 px-3 py-3 shrink-0 border-r border-black/10" title={`${key}: ${val}`}>
                        <div className="w-6 h-6 border-2 border-black/20" style={{ backgroundColor: String(val) }} />
                        <span className="text-[7px] font-black uppercase text-zinc-500 tracking-wide">{key}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Master Prompt View */}
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

            {/* == ANALYSIS MODE == */}
            {isAnalyzing && !analysisDone && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="m-8 bg-black border-2 border-black p-8 min-h-[320px] relative overflow-hidden font-mono text-sm space-y-2"
              >
                {!analysisDone && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-[#C6FF3D] shadow-[0_0_12px_#C6FF3D] animate-[scan_3s_linear_infinite]" />
                )}
                <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em] mb-6">
                  VIBRO FOLDER ANALYZER · {parsed?.folderName} · {parsed?.totalFiles} files
                </p>
                {analyzeSteps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 ${i === analyzeSteps.length - 1 ? "text-[#C6FF3D]" : "text-zinc-600"}`}
                  >
                    <span className="text-zinc-800 shrink-0">[{String(i + 1).padStart(2, "0")}]</span>
                    <span className="font-bold">{step}</span>
                    {i === analyzeSteps.length - 1 && <Loader2 className="w-3 h-3 animate-spin shrink-0" />}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* == NO FOLDER YET == */}
            {!isAnalyzing && !parsed && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
                <div
                  onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => folderInputRef.current?.click()}
                  className={`border-[3px] border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-6 py-20 px-10 ${
                    isDragging ? "border-[#C6FF3D] bg-[#C6FF3D]/10" : "border-black/30 hover:border-black hover:bg-zinc-50"
                  }`}
                >
                  <input
                    ref={folderInputRef}
                    type="file"
                    // @ts-ignore — webkitdirectory is non-standard but widely supported
                    webkitdirectory=""
                    multiple
                    className="hidden"
                    onChange={handleInput}
                  />
                  <div className={`w-24 h-24 border-[4px] flex items-center justify-center transition-all ${
                    isDragging ? "border-[#C6FF3D] bg-[#C6FF3D] shadow-[10px_10px_0_#000]" : "border-black hover:shadow-[10px_10px_0_#C6FF3D]"
                  }`}>
                    <FolderOpen className={`w-12 h-12 transition-colors ${isDragging ? "text-black" : "text-black"}`} />
                  </div>

                  <div className="text-center space-y-3">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">
                      {isDragging ? "Drop Folder Here" : "Drop Website Folder"}
                    </h3>
                    <p className="text-zinc-500 font-bold uppercase text-sm">or click to browse your filesystem</p>
                  </div>

                  <div className="flex flex-col items-center gap-3 text-[11px] font-black uppercase tracking-widest text-zinc-400">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-orange-400" /> HTML / HTM</span>
                      <span className="flex items-center gap-2"><FileCode className="w-4 h-4 text-purple-400" /> CSS / SCSS / SASS</span>
                      <span className="flex items-center gap-2"><FileType className="w-4 h-4 text-yellow-400" /> JS / TS / JSX</span>
                      <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4 text-blue-400" /> Images</span>
                    </div>
                    <p className="text-zinc-300">Save any webpage as "Webpage, Complete" and import the folder</p>
                  </div>
                </div>

                <div className="mt-6 border-2 border-black p-6 bg-zinc-900 text-white shadow-[8px_8px_0_#C6FF3D]">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C6FF3D] mb-4">HOW TO SAVE A WEBSITE AS FOLDER</p>
                  <div className="grid grid-cols-3 gap-6 text-xs font-bold">
                    <div className="flex gap-3"><div className="w-6 h-6 bg-[#C6FF3D] text-black flex items-center justify-center font-black text-xs shrink-0">1</div><p className="text-zinc-300">Open website in Chrome / Firefox / Edge</p></div>
                    <div className="flex gap-3"><div className="w-6 h-6 bg-[#C6FF3D] text-black flex items-center justify-center font-black text-xs shrink-0">2</div><p className="text-zinc-300">Press <span className="text-white">Ctrl+S</span> → Save as "Webpage, Complete"</p></div>
                    <div className="flex gap-3"><div className="w-6 h-6 bg-[#C6FF3D] text-black flex items-center justify-center font-black text-xs shrink-0">3</div><p className="text-zinc-300">Drop the entire <span className="text-white">folder</span> here</p></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* == FOLDER LOADED == */}
            {!isAnalyzing && parsed && !analysisDone && (
              <motion.div key="loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                <div className="flex items-center gap-0 border-b-[3px] border-black bg-zinc-900 overflow-x-auto shrink-0">
                  {[
                    { label: "Folder", value: parsed.folderName, color: "text-[#C6FF3D]" },
                    { label: "HTML", value: `${parsed.htmlFiles.length} files`, color: "text-orange-400" },
                    { label: "CSS", value: `${parsed.cssFiles.length} files`, color: "text-purple-400" },
                    { label: "JS", value: `${parsed.jsFiles.length} files`, color: "text-yellow-400" },
                    { label: "Images", value: `${parsed.imageFiles.length} files`, color: "text-blue-400" },
                    { label: "Total", value: `${parsed.totalFiles} files`, color: "text-white" },
                    { label: "Size", value: formatBytes(totalSize), color: "text-white" },
                  ].map((s, i) => (
                    <div key={i} className="px-5 py-3 border-r border-white/5 shrink-0">
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">{s.label}</p>
                      <p className={`text-[12px] font-black ${s.color} truncate max-w-[120px]`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex border-b-2 border-black shrink-0 bg-white">
                  {[
                    { id: "tree", label: "File Tree" },
                    { id: "html", label: `HTML (${parsed.htmlFiles.length})` },
                    { id: "css",  label: `CSS (${parsed.cssFiles.length})` },
                    { id: "images", label: `Images (${parsed.imageFiles.length})` },
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                        activeTab === tab.id ? "border-[#C6FF3D] bg-[#C6FF3D]/10 text-black" : "border-transparent text-zinc-400 hover:text-black hover:bg-zinc-50"
                      }`}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 min-h-[260px] max-h-[340px] overflow-y-auto">
                  {/* Tree */}
                  {activeTab === "tree" && (
                    <div className="p-4 bg-zinc-950 min-h-full">
                      {treeNodes.length > 0 ? treeNodes.map((n, i) => <FileTreeItem key={i} node={n} depth={0} />) : <div className="py-8 text-center text-[10px] font-black text-zinc-700 uppercase tracking-widest">No tree data available</div>}
                    </div>
                  )}

                  {/* HTML */}
                  {activeTab === "html" && (
                    <div className="bg-zinc-950 min-h-full">
                      {parsed.htmlFiles.length === 0 ? <p className="p-8 text-zinc-700 text-xs font-bold uppercase">No HTML files found</p> : (
                        parsed.htmlFiles.slice(0, 3).map((f, i) => (
                          <div key={i} className="border-b border-white/5">
                            <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border-b border-white/5">
                              <FileText className="w-3.5 h-3.5 text-orange-400" />
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{f.name}</span>
                              <span className="ml-auto text-[9px] text-zinc-700">{formatBytes(f.size)}</span>
                            </div>
                            <pre className="p-4 text-[10px] text-zinc-400 font-mono overflow-x-auto whitespace-pre-wrap leading-5">
                              {f.content.slice(0, 2000)}{f.content.length > 2000 ? "\n... (truncated)" : ""}
                            </pre>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* CSS */}
                  {activeTab === "css" && (
                    <div className="bg-zinc-950 min-h-full">
                      {parsed.cssFiles.length === 0 ? <p className="p-8 text-zinc-700 text-xs font-bold uppercase">No CSS files found</p> : (
                        parsed.cssFiles.slice(0, 3).map((f, i) => (
                          <div key={i} className="border-b border-white/5">
                            <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border-b border-white/5">
                              <FileCode className="w-3.5 h-3.5 text-purple-400" />
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{f.name}</span>
                              <span className="ml-auto text-[9px] text-zinc-700">{formatBytes(f.size)}</span>
                            </div>
                            <pre className="p-4 text-[10px] text-[#C6FF3D]/70 font-mono overflow-x-auto whitespace-pre-wrap leading-5">
                              {f.content.slice(0, 2000)}{f.content.length > 2000 ? "\n/* ... truncated */" : ""}
                            </pre>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Images */}
                  {activeTab === "images" && (
                    <div className="p-4 bg-zinc-950 min-h-full">
                      {parsed.imageFiles.length === 0 ? <p className="text-zinc-700 text-xs font-bold uppercase">No images found</p> : (
                        <div className="grid grid-cols-6 gap-3">
                          {parsed.imageFiles.slice(0, 30).map((img, i) => (
                            <div key={i} className="group relative">
                              <div className="aspect-square bg-zinc-900 border border-white/5 overflow-hidden">
                                <img src={img.url} alt="" className={`w-full h-full ${img.name.endsWith(".svg") ? "object-contain p-1" : "object-cover"}`} />
                              </div>
                              <p className="text-[8px] text-zinc-600 truncate mt-1 font-mono">{img.name.split("/").pop()}</p>
                              <p className="text-[8px] text-zinc-700">{formatBytes(img.size)}</p>
                            </div>
                          ))}
                          {parsed.imageFiles.length > 30 && (
                            <div className="aspect-square bg-zinc-900 border border-white/5 flex items-center justify-center">
                              <p className="text-[10px] text-zinc-600 font-black">+{parsed.imageFiles.length - 30}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {analysisError && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mx-8 mb-4 p-4 border-2 border-red-500 bg-red-50 flex items-center gap-3 shadow-[4px_4px_0_#ef4444]">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <p className="text-red-600 text-[11px] font-black uppercase tracking-tight">{analysisError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Footer CTA ── */}
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
          ) : !isAnalyzing && (
            <>
              <div className="flex items-center gap-4">
                {parsed ? (
                  <button onClick={() => { setParsed(null); setTreeNodes([]); setAnalysisError(null); }}
                    className="px-6 py-3 border-2 border-black text-[11px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all">
                    Change Folder
                  </button>
                ) : (
                  <button onClick={onClose}
                    className="px-6 py-3 border-2 border-black text-[11px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all">
                    Cancel
                  </button>
                )}
              </div>

              <button onClick={parsed ? handleAnalyze : () => folderInputRef.current?.click()} className="group relative flex-1 max-w-[360px]">
                <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-active:translate-x-0 group-active:translate-y-0" />
                <div className={`relative h-14 border-[3px] border-black flex items-center justify-center gap-3 transition-all ${
                  parsed ? "bg-[#C6FF3D] text-black" : "bg-zinc-200 text-zinc-600 cursor-not-allowed"
                }`}>
                  {parsed ? <Zap className="w-5 h-5" /> : <FolderOpen className="w-5 h-5" />}
                  <span className="text-[13px] font-black uppercase tracking-widest italic">
                    {parsed ? `Analyze ${parsed.totalFiles} Files` : "Select Folder"}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </>
          )}
        </div>

        <style jsx global>{`
          @keyframes scan {
            0%   { transform: translateY(0);     opacity: 1; }
            100% { transform: translateY(320px); opacity: 0.3; }
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}
