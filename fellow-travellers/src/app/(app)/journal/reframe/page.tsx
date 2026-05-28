"use client";

import { useState } from "react";
import Link from "next/link";
import SafeScreen from "@/components/crisis/SafeScreen";
import { useCrisisDetector } from "@/hooks/useCrisisDetector";

export default function ReframePage() {
  const [observation, setObservation]   = useState("");
  const [perspective, setPerspective]   = useState("");
  const [showSuccess, setShowSuccess]   = useState(false);
  const { showCrisisScreen, check, dismiss } = useCrisisDetector();

  const canSeal = perspective.trim().length > 0;

  const handleObservationChange = (val: string) => {
    setObservation(val);
    if (val.length > 20) check(val);
  };

  const handleSeal = () => {
    if (!canSeal) return;
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setObservation("");
      setPerspective("");
    }, 3200);
  };

  if (showCrisisScreen) return <SafeScreen onDismiss={dismiss} />;

  return (
    <>
      {/* ── TopAppBar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-outline-variant/20">
        <div className="flex items-center justify-between px-6 h-16 max-w-screen-md mx-auto">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary">spa</span>
            <h1 className="text-headline-md text-primary tracking-tight">Reflectie</h1>
          </div>
          <Link
            href="/dashboard"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/30 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-40 px-6 max-w-screen-md mx-auto min-h-screen">

        {/* ── Intro ── */}
        <section className="stagger-1 space-y-2 mb-8">
          <h2 className="text-headline-lg-mobile text-on-surface">Digitaal Toevluchtsoord</h2>
          <p className="text-body-md text-on-surface-variant" style={{ maxWidth: "88%" }}>
            Transformeer zware gedachten in lichtere. Observeer eerst — verschuif dan je perspectief.
          </p>
        </section>

        {/* ── Tool ── */}
        <div className="space-y-6">

          {/* Observation field */}
          <div className="stagger-2 group">
            <div className="flex items-center justify-between mb-2 px-0.5">
              <label
                htmlFor="observation"
                className="text-label-sm text-on-surface-variant uppercase tracking-wider"
              >
                Observatie
              </label>
              <span className="text-label-sm text-outline font-normal tracking-normal">
                {observation.length > 0 ? `${observation.length} tekens` : ""}
              </span>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-surface-container-low border-l-[3px] border-[#D38B71] focus-within:bg-surface-container transition-colors duration-200">
              <textarea
                id="observation"
                className="w-full min-h-[148px] p-5 bg-transparent border-none text-body-lg text-on-surface placeholder:text-outline-variant resize-none focus:outline-none focus:ring-0"
                value={observation}
                onChange={(e) => handleObservationChange(e.target.value)}
                placeholder="Wat is de automatische negatieve gedachte vandaag?"
              />
              <div className="absolute bottom-4 right-4 opacity-15 group-focus-within:opacity-35 transition-opacity duration-300">
                <span className="material-symbols-outlined text-tertiary">visibility</span>
              </div>
            </div>
            <p className="mt-2 text-label-sm text-outline px-1 italic font-normal tracking-normal">
              Beschrijf de gedachte precies zoals die verscheen, zonder oordeel.
            </p>
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center gap-2 py-2 stagger-2" style={{ opacity: observation.length > 0 ? 0.7 : 0.3, transition: "opacity 0.4s" }}>
            <div className="w-px h-6 bg-gradient-to-b from-[#D38B71] to-[#8EA4B8]" />
            <span className="material-symbols-outlined text-[18px] text-outline-variant">swap_vert</span>
            <div className="w-px h-6 bg-gradient-to-b from-[#8EA4B8] to-[#8EA4B8]/0" />
          </div>

          {/* Perspective field */}
          <div className="stagger-3 group">
            <div className="flex items-center justify-between mb-2 px-0.5">
              <label
                htmlFor="perspective"
                className="text-label-sm text-on-surface-variant uppercase tracking-wider"
              >
                Perspectief
              </label>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-surface-container-low border-l-[3px] border-[#8EA4B8] focus-within:bg-surface-container transition-colors duration-200">
              <textarea
                id="perspective"
                className="w-full min-h-[148px] p-5 bg-transparent border-none text-body-lg text-on-surface placeholder:text-outline-variant resize-none focus:outline-none focus:ring-0"
                value={perspective}
                onChange={(e) => setPerspective(e.target.value)}
                placeholder="Hoe zou een meelevende vriend reageren?"
              />
              <div className="absolute bottom-4 right-4 opacity-15 group-focus-within:opacity-35 transition-opacity duration-300">
                <span className="material-symbols-outlined text-secondary">favorite</span>
              </div>
            </div>
            <p className="mt-2 text-label-sm text-outline px-1 italic font-normal tracking-normal">
              Wat is een vriendelijkere, meer gebalanceerde waarheid?
            </p>
          </div>
        </div>

        {/* ── Decorative orb ── */}
        <div className="flex justify-center py-10 stagger-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-primary/8 rounded-full" style={{ animation: "breathe 6s ease-in-out infinite" }} />
            <div className="absolute inset-3 border border-primary/15 rounded-full animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-6 border border-secondary/15 rounded-full animate-[spin_18s_linear_infinite_reverse]" />
          </div>
        </div>

      </main>

      {/* ── Floating Seal Button ── */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-6 pb-safe z-50">
        <div className="max-w-screen-md mx-auto">
          <button
            onClick={handleSeal}
            disabled={!canSeal}
            className={`w-full py-5 rounded-full text-label-md flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.97] ${
              canSeal
                ? "bg-primary text-on-primary hover:opacity-90 atmospheric-shadow-lg cursor-pointer"
                : "bg-surface-container-highest text-outline cursor-not-allowed"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
            Perspectief Verzegelen
          </button>
        </div>
      </div>

      {/* ── Success Overlay ── */}
      <div
        className={`fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center px-6 text-center transition-all duration-700 ${
          showSuccess ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Ambient */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-80 h-80 bg-primary-fixed/30 rounded-full blur-3xl" style={{ animation: "breathe 3s ease-in-out infinite" }} />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="w-32 h-32 bg-primary-fixed rounded-full flex items-center justify-center mx-auto">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: "56px", fontVariationSettings: "'FILL' 1, 'wght' 200" }}
            >
              check_circle
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-headline-lg text-primary">Perspectief Verzegeld</h3>
            <p className="text-body-md text-on-surface-variant">Je geest is lichter nu. Adem diep in.</p>
          </div>
        </div>
      </div>
    </>
  );
}
