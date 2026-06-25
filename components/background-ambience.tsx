/**
 * Atmospheric background that enriches the cream canvas
 * with barely-perceptible depth — light beams, drifting
 * gold motes, and stained-glass colour washes.
 *
 * The intent is luxury-cathedral stillness, not vfx.
 * Each layer is so faint it reads as texture, not animation.
 */

function GoldDustMote({ i }: { i: number }) {
  /* Deterministic from index — stable SSR, no hydration drift */
  const seed = i * 7 + 3;
  const x = ((seed * 13) % 92) + 4;
  const y = ((seed * 17) % 88) + 4;
  const size = 1.5 + ((seed * 3) % 4);
  const delay = (seed % 12) * 1.5;
  const duration = 12 + ((seed * 5) % 10);
  const pattern = `dust-float-${(i % 3) + 1}`;
  const alpha = 0.08 + (seed % 7) * 0.04;

  return (
    <div
      className="absolute rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
        background: `radial-gradient(circle, rgba(232, 196, 98, ${alpha}) 0%, transparent 70%)`,
        filter: "blur(0.6px)",
        animation: `${pattern} ${duration}s ease-in-out ${delay}s infinite`,
        willChange: "transform, opacity",
      }}
    />
  );
}

export default function BackgroundAmbience() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Layer 1: Radial light beams ── */}
      {/* Warm shaft from upper-left — the "morning light" feel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 80% at 15% 5%, rgba(201, 168, 76, 0.045) 0%, transparent 60%)",
          filter: "blur(70px)",
          animation: "beam-drift-1 24s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Softer shaft from lower-right — balance */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 70% at 85% 95%, rgba(212, 175, 55, 0.03) 0%, transparent 55%)",
          filter: "blur(90px)",
          animation: "beam-drift-2 30s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Subtle top-centre glow — sanctuary light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 150% 50% at 50% -5%, rgba(232, 196, 98, 0.025) 0%, transparent 55%)",
          filter: "blur(100px)",
          animation: "beam-drift-3 28s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* ── Layer 2: Stained-glass colour washes ── */}
      {/* Warm amber pool — left */}
      <div
        className="absolute"
        style={{
          width: "min(65vw, 520px)",
          height: "min(65vw, 520px)",
          left: "-12%",
          top: "15%",
          background:
            "radial-gradient(circle, rgba(180, 130, 60, 0.025) 0%, transparent 70%)",
          filter: "blur(90px)",
          animation: "wash-drift-1 20s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Soft rose tone — right */}
      <div
        className="absolute"
        style={{
          width: "min(55vw, 420px)",
          height: "min(55vw, 420px)",
          right: "-8%",
          top: "35%",
          background:
            "radial-gradient(circle, rgba(200, 140, 120, 0.02) 0%, transparent 70%)",
          filter: "blur(100px)",
          animation: "wash-drift-2 26s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Pale gold — bottom-centre */}
      <div
        className="absolute"
        style={{
          width: "min(80vw, 640px)",
          height: "min(50vw, 380px)",
          left: "25%",
          bottom: "-12%",
          background:
            "radial-gradient(circle, rgba(201, 168, 76, 0.02) 0%, transparent 65%)",
          filter: "blur(110px)",
          animation: "wash-drift-3 32s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* ── Layer 3: Floating gold dust particles ── */}
      {Array.from({ length: 20 }).map((_, i) => (
        <GoldDustMote key={i} i={i} />
      ))}

      {/* ── Almost-imperceptible central radiance ── */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(90vw, 900px)",
          height: "min(90vw, 900px)",
          background:
            "radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.015) 0%, transparent 50%)",
          filter: "blur(80px)",
          animation: "central-breathe 14s ease-in-out infinite",
          willChange: "opacity",
        }}
      />
    </div>
  );
}
