"use client";

import React from "react";

export function LandingFooter() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 py-10 px-6 z-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 opacity-20 hover:opacity-100 transition-opacity duration-1000">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">NAMIX UNIVERSAL NETWORK</p>
        <div className="flex items-center gap-8 text-[10px] font-bold text-white/60">
           <span>Privacy Policy</span>
           <span>Terms of Service</span>
           <span>© 2024</span>
        </div>
      </div>
    </footer>
  );
}