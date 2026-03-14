import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-[#FAFAF8] bg-grid-pattern">
      <div className="mb-12 relative animate-item" style={{ opacity: 1, transform: 'none' }}>
        <div className="relative flex h-40 w-40 items-center justify-center rounded-[3rem] border-[4.5px] border-black bg-white text-7xl shadow-[15px_15px_0_rgba(0,0,0,1)]">
          🛰️
        </div>
        <div className="absolute -right-4 -top-4 rounded-xl border-[2.5px] border-black bg-[#FF5C5C] px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-widest shadow-[4px_4px_0_rgba(0,0,0,1)]">
          FAULT_OFF_GRID
        </div>
      </div>

      <h1 className="mb-6 text-7xl sm:text-9xl font-[1000] text-black tracking-[calc(-0.06em)] leading-[0.8] uppercase">
        SIGNAL <br /><span className="text-white [-webkit-text-stroke:3px_black]">TERMINATED.</span>
      </h1>
      
      <p className="mb-12 max-w-lg text-xl font-bold text-zinc-400 italic leading-relaxed">
        "The coordinate sequence you requested is outside the known Vibro collective synthesis. Redirecting to core."
      </p>

      <Link
        href="/"
        className="brutal-btn-primary h-16 px-12 group"
      >
        <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        RE-INITIATE_CORE
      </Link>

      <div className="mt-20 text-[10px] font-[1000] text-zinc-300 uppercase tracking-[0.5em]">
        Status: 404_NULL_REFERENCE
      </div>
    </div>
  );
}
