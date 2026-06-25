import { UserPlus } from "lucide-react";
import Navigation from "@/components/navigation";
import RadianceEffect from "@/components/radiance-effect";

export default function HomePage() {
  return (
    <main>
      <Navigation />

      {/* ════════════════════════════════════════
           HERO — Sacred Welcome
           ════════════════════════════════════════ */}
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #EBE3DB 0%, #F0EAE2 30%, #F5F0E8 60%, #EBE3DB 100%)",
        }}
      >
        {/* Animated radiance behind the Divine Mercy image */}
        <RadianceEffect />

        {/* Ornamental top gold border */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(201, 168, 76, 0.3) 15%, rgba(212, 175, 55, 0.6) 30%, rgba(232, 196, 98, 0.8) 50%, rgba(212, 175, 55, 0.6) 70%, rgba(201, 168, 76, 0.3) 85%, transparent 100%)",
          }}
        />

        {/* Subtle dot texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(139, 111, 50, 0.15) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top-right ambient light */}
        <div
          className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle, rgba(201, 168, 76, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Bottom-left ambient light */}
        <div
          className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-[0.04]"
          style={{
            background:
              "radial-gradient(circle, rgba(201, 168, 76, 0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-16 text-center">

          {/* ─── Divine Mercy Image (circular) ─── */}
          <div
            className="relative mx-auto mb-8 w-56 sm:w-64 md:w-72"
            style={{ animation: "gentle-float 6s ease-in-out infinite" }}
          >
            {/* Golden ring border */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow:
                  "0 0 0 3px rgba(201, 168, 76, 0.3), 0 0 0 6px rgba(201, 168, 76, 0.1), 0 0 30px rgba(201, 168, 76, 0.15)",
              }}
            />
            <div className="overflow-hidden rounded-full golden-glow">
              <img
                src="/Images/SEETA%20PARISH%20DIVINE%20MERCY.png"
                alt="The Divine Mercy image of Jesus"
                className="w-full select-none"
                draggable={false}
                style={{
                  display: "block",
                  filter:
                    "drop-shadow(0 0 30px rgba(201, 168, 76, 0.15)) drop-shadow(0 8px 40px rgba(0, 0, 0, 0.1))",
                }}
              />
            </div>
          </div>

          {/* ─── Motto ─── */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-px w-8 sm:w-10" style={{ background: "linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.4))" }} />
            <p
              className="font-heading text-base italic tracking-wide sm:text-lg"
              style={{ color: "rgba(180, 140, 60, 0.85)" }}
            >
              Jesus, I Trust In You
            </p>
            <div className="h-px w-8 sm:w-10" style={{ background: "linear-gradient(90deg, rgba(201, 168, 76, 0.4), transparent)" }} />
          </div>

          {/* ─── Description ─── */}
          <p
            className="mt-5 max-w-xs text-xs leading-relaxed tracking-wide sm:max-w-sm sm:text-sm"
            style={{ color: "rgba(11, 19, 43, 0.45)" }}
          >
            Welcome to the Divine Mercy community of Seeta Parish,
            <br className="hidden sm:block" />
            a place of prayer, fellowship, and devotion.
          </p>

          {/* ─── CTA ─── */}
          <div className="mt-12 sm:mt-14">
            {/* Enter Sanctuary — sacred gold pathway */}
            <a
              href="#"
              className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full px-6 py-4 text-base font-semibold tracking-wide text-navy-900 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(201,168,76,0.35)] sm:w-auto sm:px-10 sm:py-3.5 sm:text-sm"
              style={{
                background: "linear-gradient(135deg, #E8C462, #C9A84C)",
                boxShadow: "0 6px 32px rgba(201, 168, 76, 0.3)",
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <UserPlus className="h-5 w-5 sm:h-4 sm:w-4" />
                Enter Sanctuary
              </span>
              <span
                className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg, #D4AF37, #E8C462)",
                }}
              />
            </a>
          </div>
        </div>

        {/* Bottom fade to page */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
          style={{
            background:
              "linear-gradient(to top, rgba(235, 227, 219, 0.6) 0%, transparent 100%)",
          }}
        />
      </section>
    </main>
  );
}
