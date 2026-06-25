"use client";

import { useState, useEffect } from "react";
import { Cross, Menu, X } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#EBE3DB]/90 backdrop-blur-lg shadow-[0_4px_30px_rgba(11,19,43,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-center px-6 py-4">
        {/* Logo / Brand */}
        <a
          href="#home"
          className="flex items-center gap-2 transition-colors duration-300"
          style={{ color: "#0B132B" }}
        >
          <Cross className="h-5 w-5 text-[#C9A84C]" />
          <span className="font-serif text-base font-semibold tracking-wide">
            DIVINE MERCY
          </span>
        </a>
      </nav>
    </header>
  );
}
