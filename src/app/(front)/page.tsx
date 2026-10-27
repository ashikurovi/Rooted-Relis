"use client";

import { useEffect, useState } from "react";
import { Banner } from "@/components/landing/banner";
import { Category } from "@/components/landing/category";

import { AllProducts } from "@/components/landing/allproducts";
import { Customer } from "@/components/landing/customer";
import { CampaignModal } from "@/components/landing/campaign-modal";
import { RecentBlog } from "@/components/landing/recentblog";

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const loadingMessages = [
    "Curating authentic tastes and flavors...",
    "Preparing fresh heritage treats...",
    "Rooted in tradition, crafted with passion...",
    "Almost ready for your Rooted Relish moment...",
  ];

  useEffect(() => {
    const completedSections = new Set<string>();
    const handleSectionReady = (event: Event) => {
      const section = (event as CustomEvent<string>).detail;
      if (!section) return;
      completedSections.add(section);
      if (completedSections.size >= 4) setIsReady(true);
    };

    window.addEventListener("landing-data-ready", handleSectionReady);
    const fallbackTimer = window.setTimeout(() => setIsReady(true), 2400);

    return () => {
      window.removeEventListener("landing-data-ready", handleSectionReady);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (isReady) return;
    const timer = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % loadingMessages.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isReady, loadingMessages.length]);

  return (
    <main className="relative flex min-h-[70vh] flex-1 w-full flex-col items-center justify-start">
      {!isReady && (
        <div className="fixed inset-0 z-[80] flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f5fbf7_45%,_#edf7f1_100%)] px-6 text-center backdrop-blur-[2px] transition-opacity duration-700">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#106840]/10 blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-[#D9941E]/15 blur-3xl" />
          <div className="relative flex w-full max-w-md flex-col items-center">
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#D9941E]/30 bg-white shadow-[0_20px_50px_rgba(16,104,64,0.12)] p-2 backdrop-blur-sm">
              <div className="absolute inset-1 animate-[spin_4s_linear_infinite] rounded-full border-[2px] border-transparent border-t-[#106840] border-r-[#D9941E]" />
              <img src="/logo.png" alt="Rooted Relish" className="w-16 h-16 object-contain relative z-10" />
            </div>
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.32em] text-[#106840]">Rooted Relish • Est. 2026</p>
            <h1 className="min-h-14 max-w-sm text-xl font-semibold tracking-[-0.03em] text-[#172033] transition-all duration-500 sm:text-2xl">{loadingMessages[messageIndex]}</h1>
            <div className="mt-6 h-1.5 w-56 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-1/2 animate-[loading_2.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#106840] via-[#D9941E] to-[#106840] opacity-95" />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-slate-400 font-bold">Pure Heritage & Craft</p>
          </div>
        </div>
      )}
      <CampaignModal />
      <Banner />
      <Category />
      <AllProducts />
      <RecentBlog />
      <Customer />
    </main>
  );
}
