"use client";

import { useState, useRef } from "react";

export default function ScreenshotUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult("AI Analysis Complete: Found 'Modern Dashboard' layout. Dominant colors: #FFFFFF, #B8F724. Suggested components: Navigation Sidebar, Analytics Cards, Main Content Grid.");
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="rounded-[2.5rem] border-[4px] border-black bg-white p-8 shadow-[12px_12px_0_rgba(0,0,0,1)] text-center">
      <h3 className="text-xl font-[1000] uppercase tracking-tighter mb-4 text-black">Snap & Synthesize</h3>
      <p className="text-zinc-500 font-bold mb-8 text-sm max-w-sm mx-auto">Upload a screenshot of any UI you like. Vibro will reverse-engineer its design tokens and structure.</p>
      
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-[3px] border-dashed border-black/10 rounded-3xl py-12 bg-[#F3F2EE] hover:border-[#B8F724] hover:bg-[#B8F724]/5 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-2xl bg-white border-[3px] border-black mx-auto mb-4 flex items-center justify-center text-3xl transition-transform group-hover:scale-110">
            📸
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Click to upload screenshot</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden border-[3px] border-black shadow-[6px_6px_0_rgba(0,0,0,1)]">
             <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
             <button 
               onClick={() => {setPreview(null); setFile(null); setAnalysisResult(null);}}
               className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black text-white border-[2px] border-white flex items-center justify-center text-xs"
             >
                ✕
             </button>
          </div>
          
          {!analysisResult ? (
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-4 rounded-xl border-[3px] border-black bg-black text-[#B8F724] font-black uppercase tracking-widest text-xs transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(184,247,36,1)] disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing Pixels..." : "Reverse Engineer UI"}
            </button>
          ) : (
            <div className="text-left p-6 bg-black text-[#B8F724] rounded-2xl font-mono text-[10px] border-[3px] border-black animate-in fade-in slide-in-from-bottom-4">
               <div className="flex items-center gap-2 mb-3 border-b border-[#B8F724]/20 pb-2">
                  <div className="w-2 h-2 rounded-full bg-[#B8F724]" />
                  <span>SYNTHESIS_REPORT.TXT</span>
               </div>
               {analysisResult}
               <div className="mt-6 flex gap-4">
                  <button className="flex-1 py-2 border border-[#B8F724] hover:bg-[#B8F724] hover:text-black transition-all">GENERATE_PROMPT</button>
                  <button className="flex-1 py-2 border border-[#B8F724] hover:bg-[#B8F724] hover:text-black transition-all">COLLECT_TOKENS</button>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
