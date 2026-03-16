"use client";

import { useEffect, useRef, useState } from "react";

interface LazyPreviewProps {
  slug: string;
  width?: number;
  height?: number;
  scale?: number;
  className?: string;
}

export default function LazyPreview({
  slug,
  width = 1400,
  height = 900,
  scale = 0.165,
  className = "",
}: LazyPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible ? (
        <iframe
          src={`/api/preview/${slug}`}
          title={slug}
          className="pointer-events-none origin-top-left border-none"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          tabIndex={-1}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-zinc-50">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-400" />
        </div>
      )}
    </div>
  );
}
