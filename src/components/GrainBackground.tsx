"use client";

import { useEffect, useRef } from "react";

export default function GrainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      const idata = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.1) {
          buffer32[i] = 0xffffffff; // White
        } else {
          buffer32[i] = 0xff000000; // Black
        }
      }

      ctx.putImageData(idata, 0, 0);
      animationFrameId = requestAnimationFrame(loop);
    };

    // To make it less resource intensive, we throttle it using setTimeout if we prefer, but for high end looks let's run it standard or slow it down
    let lastTime = 0;
    const fpsInterval = 1000 / 12; // 12fps for that retro/film grain feel
    
    const throttledLoop = (time: number) => {
      animationFrameId = requestAnimationFrame(throttledLoop);
      const elapsed = time - lastTime;
      if (elapsed > fpsInterval) {
        lastTime = time - (elapsed % fpsInterval);
        
        // Draw noise
        const w = canvas.width;
        const h = canvas.height;
        // Optimization: draw smaller noise and scale it up with CSS
        const noiseW = w / 2;
        const noiseH = h / 2;
        const idata = ctx.createImageData(noiseW, noiseH);
        const buffer32 = new Uint32Array(idata.data.buffer);
        const len = buffer32.length;

        for (let i = 0; i < len; i++) {
          const v = Math.random() * 255;
          // Monochrome noise
          buffer32[i] = (255 << 24) | (v << 16) | (v << 8) | v;
        }

        ctx.putImageData(idata, 0, 0);
        // We draw to a hidden small canvas, then copy to main, but here we can just scale via CSS
      }
    };

    // simplified resize for scaled noise
    const resizeScaled = () => {
      canvas.width = window.innerWidth / 2;
      canvas.height = window.innerHeight / 2;
    };
    window.removeEventListener("resize", resize);
    window.addEventListener("resize", resizeScaled);
    resizeScaled();
    
    animationFrameId = requestAnimationFrame(throttledLoop);

    return () => {
      window.removeEventListener("resize", resizeScaled);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        imageRendering: "pixelated"
      }}
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay"
    />
  );
}
