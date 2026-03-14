
"use client";

import { useState, useRef, useEffect } from "react";
import { streamAIChat } from "@/lib/ai";

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
        content: "You are the Vibro Design Bot. Help the user with design suggestions, color harmonies, or UI patterns. Keep it concise and formatted with simple HTML/Markdown. Bold important terms. Use a premium, professional yet creative tone." 
      },
      { role: "user", content: input }
    ];

    try {
      await streamAIChat(messages, (text) => {
        setResponse((prev) => prev + text);
      }, { model: "openrouter/free", max_tokens: 400 });
    } catch (error) {
      setResponse(`Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please verify your API configuration.`);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="relative z-10 rounded-[2.5rem] border-[4px] border-black bg-white p-2 shadow-[12px_12px_0_rgba(184,247,36,1)] sm:shadow-[20px_20px_0_rgba(184,247,36,1)] overflow-hidden transition-all duration-500">
      <div className="bg-zinc-50 rounded-[2.2rem] sm:rounded-[2.5rem] p-6 sm:p-8 flex flex-col min-h-[450px]">
        
        {/* Header - No Manual Model Selection */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-[#b8f724] border-2 border-black animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Design_Engine_Active</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black bg-white shadow-[3px_3px_0_rgba(0,0,0,1)] text-[10px] font-black uppercase">
            <span className="text-[#b8f724]">★</span>
            <span>Vibro Intelligence</span>
          </div>
        </div>

        {/* Chat History */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto mb-6 space-y-4 max-h-[350px] custom-scrollbar pr-2"
        >
          {response ? (
            <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-sm font-bold text-zinc-700 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-300">
              {response}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 italic text-center p-8">
              <div className="w-16 h-16 rounded-3xl bg-black/5 flex items-center justify-center mb-6 border-2 border-dashed border-black/10">
                 <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 012 2h-5l-5 5v-5z" /></svg>
              </div>
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-2">System Initialized</p>
              <p className="max-w-[200px]">"Suggest a color palette for a 'Cyberpunk' dashboard."</p>
            </div>
          )}
          {isStreaming && (
            <div className="flex gap-2 items-center px-4">
               <div className="w-2 h-2 bg-[#b8f724] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-2 h-2 bg-[#b8f724] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="relative group">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your design intent..."
            className="w-full bg-white border-[3px] border-black rounded-2xl px-6 py-5 text-sm font-black focus:outline-none focus:ring-4 focus:ring-[#b8f724]/30 shadow-[6px_6px_0_rgba(0,0,0,1)] pr-16 transition-all group-hover:shadow-[8px_8px_0_rgba(184,247,36,1)]"
          />
          <button 
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#b8f724] border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0_rgba(0,0,0,1)] hover:-translate-y-[calc(50%+2px)] active:translate-y-[calc(50%-0px)] active:shadow-none transition-all disabled:opacity-30"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
