
"use client";

import { useState, useRef, useEffect } from "react";
import { streamAIChat } from "@/lib/ai";
import { Zap, Send, Command } from "lucide-react";

export default function DesignBot() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    setResponse("");
    setIsStreaming(true);
    
    const messages = [
      { 
        role: "system", 
        content: "You are the Vibro Design Engine. You synthesize technical design architectures. Keep replies focused on architectural decisions, tokens, and structural logic. Use sharp, technical tone. Format with bold keywords." 
      },
      { role: "user", content: input }
    ];

    try {
      await streamAIChat(messages, (text) => {
        setResponse((prev) => prev + text);
      }, { model: "openrouter/free", max_tokens: 400 });
    } catch (error) {
      console.error("Synthesis Error:", error);
      setResponse(`[SYNTHESIS_ERROR]: Connection failed. Check network or protocol keys.`);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="relative z-10 rounded-[3rem] border border-white/5 bg-[#0a0a0b] p-2 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
      <div className="bg-[#0e0e0f] rounded-[2.8rem] p-10 flex flex-col min-h-[500px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10 pb-10 border-b border-white/5">
          <div className="flex items-center gap-4">
             <div className="w-4 h-4 rounded-lg bg-[#BAFF29] shadow-[0_0_20px_rgba(186,255,41,0.4)] animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Protocol::Synthesis</span>
          </div>
          
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-[#BAFF29]">
            <Zap className="w-3 h-3 fill-current" />
            <span>AI CORE V.4</span>
          </div>
        </div>

        {/* Chat History */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto mb-10 space-y-6 max-h-[400px] custom-scrollbar pr-4"
        >
          {response ? (
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-lg font-bold text-white leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-zinc-600 font-mono text-xs block mb-4 uppercase tracking-[0.3em]">Result_Synthesis:</span>
              {response}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-700 italic text-center py-10">
              <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                 <Command className="w-8 h-8 opacity-20 text-white" />
              </div>
              <p className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.5em] mb-4">Neural Buffer Ready</p>
              <p className="max-w-[240px] text-zinc-500 font-bold overflow-hidden">"Define a high-contrast structural system for a data lab."</p>
            </div>
          )}
          {isStreaming && (
            <div className="flex gap-3 items-center px-6">
               <div className="w-2.5 h-2.5 bg-[#BAFF29] rounded-full animate-bounce shadow-[0_0_10px_rgba(186,255,41,0.5)]" style={{ animationDelay: '0ms' }} />
               <div className="w-2.5 h-2.5 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-2.5 h-2.5 bg-[#BAFF29] rounded-full animate-bounce shadow-[0_0_10px_rgba(186,255,41,0.5)]" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Initialize intent..."
            className="w-full bg-[#0a0a0b] border-2 border-white/5 rounded-[1.8rem] px-10 py-7 text-lg font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#BAFF29]/40 focus:ring-0 transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-[#BAFF29] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(186,255,41,0.2)] hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
          >
            <Send className="w-6 h-6 text-black" />
          </button>
        </form>
      </div>
    </div>
  );
}
