"use client";

import { useState, type ReactNode } from "react";

interface PreviewFrameProps {
  slug: string;
  title: string;
}

type Viewport = "desktop" | "tablet" | "mobile";

const viewportConfig: Record<Viewport, { width: string; label: string; icon: ReactNode }> = {
  desktop: {
    width: "100%",
    label: "Desktop",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  tablet: {
    width: "768px",
    label: "Tablet",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  mobile: {
    width: "375px",
    label: "Mobile",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
};

export default function PreviewFrame({ slug, title }: PreviewFrameProps) {
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const previewUrl = `/api/preview/${slug}`;
  const vp = viewportConfig[viewport];

  function handleLoad() {
    setLoading(false);
  }

  function handleError() {
    setLoading(false);
    setError(true);
  }

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
  }

  const containerClass = isFullscreen
    ? "fixed inset-0 z-[100] flex flex-col bg-vibro-bg-card"
    : "overflow-hidden rounded-xl border border-white/[0.06] bg-vibro-bg-card/50";

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-vibro-bg-card/80 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          </div>
          <span className="ml-3 hidden text-xs text-zinc-400 sm:inline">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          {/* Viewport toggles */}
          <div className="flex items-center rounded-md border border-white/[0.06] bg-vibro-bg-card/50 p-0.5">
            {(Object.keys(viewportConfig) as Viewport[]).map((vk) => (
              <button
                key={vk}
                onClick={() => setViewport(vk)}
                title={viewportConfig[vk].label}
                aria-label={`Switch to ${viewportConfig[vk].label} view`}
                className={`rounded-md p-1.5 transition ${
                  viewport === vk
                    ? "bg-white/10 text-white"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {viewportConfig[vk].icon}
              </button>
            ))}
          </div>

          <div className="mx-1.5 h-4 w-px bg-white/[0.06]" />

          {/* Open in new tab */}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
            className="rounded-md p-1.5 text-zinc-600 transition hover:bg-white/5 hover:text-zinc-400"
            aria-label="Open preview in new tab"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="rounded-md p-1.5 text-zinc-600 transition hover:bg-white/5 hover:text-zinc-400"
          >
            {isFullscreen ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9L4 4m0 0v5m0-5h5m6 6l5 5m0 0v-5m0 5h-5M9 15l-5 5m0 0h5m-5 0v-5m11-6l5-5m0 0h-5m5 0v5" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div
        className={`relative flex justify-center overflow-auto ${
          isFullscreen ? "flex-1" : "h-[600px]"
        }`}
        style={{ backgroundColor: "#f8fafc" }}
      >
        {loading && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-vibro-bg-card/90">
            <div className="flex flex-col items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              <span className="text-xs text-zinc-400">Loading preview...</span>
            </div>
          </div>
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-3xl">
              🚧
            </div>
            <h3 className="mb-2 text-base font-semibold text-zinc-800">Preview Coming Soon</h3>
            <p className="max-w-md text-sm text-zinc-400">
              Copy the prompt and paste it into ChatGPT, Claude, or Cursor to see the result!
            </p>
          </div>
        ) : (
          <iframe
            src={previewUrl}
            title={`Preview: ${title}`}
            onLoad={handleLoad}
            onError={handleError}
            className="h-full border-0 transition-all duration-300"
            style={{
              width: vp.width,
              maxWidth: "100%",
              minHeight: isFullscreen ? "100%" : "600px",
            }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        )}
      </div>

      {/* Viewport indicator */}
      <div className="flex items-center justify-center border-t border-white/[0.06] bg-vibro-bg-card/80 py-1.5">
        <span className="text-[11px] text-zinc-600">
          {vp.label} &middot; {vp.width === "100%" ? "Full width" : vp.width}
        </span>
      </div>
    </div>
  );
}
