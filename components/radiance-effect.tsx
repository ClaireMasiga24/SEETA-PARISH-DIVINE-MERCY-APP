"use client";

import { useEffect, useRef } from "react";

/**
 * A multi-layered animated golden radiance that creates a
 * stained-glass light effect behind the Divine Mercy image.
 * Uses CSS GPU-composited transforms for smooth 60fps animation.
 */
/** Deterministic seeded random so SSR and client hydration produce identical sparkle positions */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function RadianceEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      container.style.setProperty("--mouse-x", String(x));
      container.style.setProperty("--mouse-y", String(y));
    };

    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => container.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -top-24 -bottom-24 overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1: Broad golden halo - slow pulse */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(90vw, 600px)",
          height: "min(90vw, 600px)",
        }}
      >
        <div
          className="animate-radiance-pulse absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.35) 0%, rgba(201, 168, 76, 0.12) 30%, transparent 70%)",
            filter: "blur(20px)",
            willChange: "transform, opacity",
          }}
        />
      </div>

      {/* Layer 2: Concentric rotating golden ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-radiance-rotate"
        style={{
          width: "min(80vw, 500px)",
          height: "min(80vw, 500px)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(201, 168, 76, 0.08) 45deg, transparent 90deg, rgba(201, 168, 76, 0.05) 135deg, transparent 180deg, rgba(201, 168, 76, 0.08) 225deg, transparent 270deg, rgba(201, 168, 76, 0.05) 315deg, transparent 360deg)",
            filter: "blur(30px)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Layer 3: Secondary counter-rotating ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(70vw, 420px)",
          height: "min(70vw, 420px)",
          animation: "radiance-rotate 25s linear infinite reverse",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 90deg, transparent, rgba(232, 196, 98, 0.06) 60deg, transparent 120deg, rgba(232, 196, 98, 0.04) 180deg, transparent 240deg, rgba(232, 196, 98, 0.06) 300deg, transparent 360deg)",
            filter: "blur(40px)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Layer 4: Stained-glass colored light beams */}
      {/* Warm red beam */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-radiance-beam-1"
        style={{
          width: "min(100vw, 700px)",
          height: "min(100vw, 700px)",
          transformOrigin: "center center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(180, 50, 50, 0.06) 0%, transparent 30%, transparent 70%, rgba(180, 50, 50, 0.04) 100%)",
            filter: "blur(40px)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Blue beam */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-radiance-beam-2"
        style={{
          width: "min(100vw, 700px)",
          height: "min(100vw, 700px)",
          transformOrigin: "center center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(225deg, rgba(50, 80, 180, 0.05) 0%, transparent 30%, transparent 70%, rgba(50, 80, 180, 0.03) 100%)",
            filter: "blur(50px)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Gold beam */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-radiance-beam-3"
        style={{
          width: "min(100vw, 700px)",
          height: "min(100vw, 700px)",
          transformOrigin: "center center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(201, 168, 76, 0.08) 0%, transparent 25%, transparent 75%, rgba(201, 168, 76, 0.05) 100%)",
            filter: "blur(45px)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Layer 5: Subtle particle sparkles */}
      {Array.from({ length: 6 }).map((_, i) => {
        const r = (offset: number) => {
          const v = seededRandom(i * 7 + offset * 13);
          return Math.round(v * 1e4) / 1e4; // round to 4dp so SSR === hydration
        };
        return (
          <div
            key={i}
            className="absolute animate-gold-shimmer"
            style={{
              width: `${(2 + r(1) * 3).toFixed(2)}px`,
              height: `${(2 + r(2) * 3).toFixed(2)}px`,
              left: `${(35 + r(3) * 30).toFixed(2)}%`,
              top: `${(35 + r(4) * 30).toFixed(2)}%`,
              borderRadius: "50%",
              background: "rgba(232, 196, 98, 0.6)",
              filter: "blur(1px)",
              animationDelay: `${(i * 0.5).toFixed(1)}s`,
              animationDuration: `${(2 + r(5) * 2).toFixed(1)}s`,
              willChange: "opacity",
            }}
          />
        );
      })}
    </div>
  );
}
