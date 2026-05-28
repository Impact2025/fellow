"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { deriveKey, encryptEntry } from "@/lib/crypto/vault";
import ProgressCard from "@/components/dashboard/ProgressCard";

const HALT_ITEMS = [
  { id: "hungry", label: "Hungry", emoji: "🍃", states: ["Voldaan", "Een beetje", "Heel hongerig"] },
  { id: "angry",  label: "Angry",  emoji: "🌊", states: ["Rustig", "Gefrustreerd", "Overweldigd"] },
  { id: "lonely", label: "Lonely", emoji: "☁️", states: ["Verbonden", "Stil", "Eenzaam"] },
  { id: "tired",  label: "Tired",  emoji: "🌙", states: ["Uitgerust", "Moe", "Uitgeput"] },
] as const;

const QUOTES = [
  "Stilte is ook een antwoord.",
  "Herstel begint met eerlijkheid.",
  "Je bent meer dan je overlevingsstrategieën.",
  "Vandaag is genoeg.",
  "Kwetsbaarheid is geen zwakheid — het is moed.",
  "Je hoeft het niet alleen te dragen.",
];

function labelFor(value: number, states: readonly string[]): string {
  if (value < 33) return states[0];
  if (value < 66) return states[1];
  return states[2];
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Goedemorgen.";
  if (h < 18) return "Goedemiddag.";
  return "Goedenavond.";
}

function todayQuote(): string {
  return QUOTES[new Date().getDate() % QUOTES.length];
}

export default function DashboardPage() {
  const sessionId = useSession();
  const [values, setValues] = useState<Record<string, number>>({
    hungry: 20, angry: 10, lonely: 15, tired: 30,
  });
  const [logged, setLogged]   = useState(false);
  const [logging, setLogging] = useState(false);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/steps?sessionId=${sessionId}`)
      .then((r) => r.json())
      .then((data: { visited: number[] }) => setVisitedSteps(data.visited ?? []))
      .catch(() => {});
  }, [sessionId]);

  const handleLog = async () => {
    if (logging || logged) return;
    setLogging(true);
    try {
      const key       = await deriveKey("anonymous-halt-v1");
      const encrypted = await encryptEntry(JSON.stringify({ values, ts: Date.now() }), key);
      if (sessionId) {
        await fetch("/api/halt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, ciphertext: encrypted.ciphertext, iv: encrypted.iv }),
        });
      }
    } finally {
      setLogging(false);
      setLogged(true);
      setTimeout(() => setLogged(false), 3000);
    }
  };

  return (
    <>
      {/* ── TopAppBar ── */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-screen-md mx-auto">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary">spa</span>
            <span className="text-headline-md text-primary tracking-tight">Haven</span>
          </div>
          <Link
            href="/settings"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/30 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-6 max-w-screen-md mx-auto min-h-screen">

        {/* ── Hero ── */}
        <section className="mb-12 stagger-1">
          <div className="flex flex-col items-center text-center space-y-5">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary-fixed rounded-full" style={{ animation: "breathe 5s ease-in-out infinite", opacity: 0.35 }} />
              <div className="absolute inset-2 bg-primary-fixed/50 rounded-full blur-lg" />
              <span
                className="material-symbols-outlined text-primary relative z-10"
                style={{ fontSize: "68px", fontVariationSettings: "'wght' 100, 'FILL' 0" }}
              >
                wb_sunny
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-headline-lg-mobile text-on-surface">{greeting()}</h1>
              <p className="text-body-md text-on-surface-variant opacity-70">Welkom in je stille ruimte.</p>
            </div>
          </div>
        </section>

        {/* ── HALT Tracker ── */}
        <section className="mb-12 stagger-2">
          <div className="bg-surface-container-low rounded-3xl p-8 space-y-8">
            <header className="text-center space-y-1">
              <h2 className="text-headline-md text-on-surface">Hoe voel je je nu?</h2>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-widest opacity-60">
                Dagelijkse Check-in
              </p>
            </header>

            <div className="grid grid-cols-1 gap-8">
              {HALT_ITEMS.map(({ id, label, states }) => {
                const pct = values[id];
                return (
                  <div key={id} className="space-y-3">
                    <div className="flex justify-between items-center px-0.5">
                      <span className="text-label-md text-on-surface-variant">{label}</span>
                      <span
                        className="text-label-sm text-primary transition-all duration-300"
                        style={{ opacity: 0.85 }}
                      >
                        {labelFor(pct, states)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={pct}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [id]: Number(e.target.value) }))
                      }
                      className="slider-thumb w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #476553 0%, #476553 ${pct}%, #e4e2dd ${pct}%, #e4e2dd 100%)`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleLog}
              disabled={logging}
              className={`w-full bg-primary-container text-on-primary-container text-label-md py-4 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                logging ? "opacity-60" : "hover:opacity-90"
              }`}
            >
              {logged ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Versleuteld opgeslagen
                </>
              ) : logging ? (
                "Opslaan..."
              ) : (
                "Log mijn status"
              )}
            </button>
          </div>
        </section>

        {/* ── Gentle Suggestions ── */}
        <section className="space-y-4 stagger-3">
          <h3 className="text-label-sm text-on-surface-variant uppercase tracking-widest px-1">
            Zachte Suggesties
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/steps"
              className="aspect-square rounded-3xl bg-primary-fixed/40 p-6 flex flex-col justify-between overflow-hidden relative group active:scale-[0.97] transition-transform"
            >
              <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'wght' 200" }}>route</span>
              <p className="text-label-md text-on-primary-fixed-variant leading-tight relative z-10 font-medium">
                12 Stappen
              </p>
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-primary rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity duration-500" />
            </Link>
            <Link
              href="/journal/reframe"
              className="aspect-square rounded-3xl bg-secondary-fixed/40 p-6 flex flex-col justify-between overflow-hidden relative group active:scale-[0.97] transition-transform"
            >
              <span className="material-symbols-outlined text-secondary text-[32px]" style={{ fontVariationSettings: "'wght' 200" }}>edit_note</span>
              <p className="text-label-md text-on-secondary-fixed-variant leading-tight relative z-10 font-medium">
                Ochtend dagboek
              </p>
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-secondary rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity duration-500" />
            </Link>
          </div>
        </section>

        {/* ── Voortgang ── */}
        <section className="mt-4 stagger-4">
          <ProgressCard visitedSteps={visitedSteps} />
        </section>

        {/* ── Quick links ── */}
        <section className="mt-4 grid grid-cols-2 gap-3 stagger-4">
          <Link
            href="/companion"
            className="p-5 rounded-2xl bg-surface-container flex items-center gap-3 hover:bg-surface-container-high transition-colors group"
          >
            <span className="material-symbols-outlined text-primary text-[22px] group-hover:scale-110 transition-transform">psychology</span>
            <div>
              <p className="text-label-md text-on-surface">Companion</p>
              <p className="text-label-sm text-on-surface-variant font-normal tracking-normal">AI reflectietool</p>
            </div>
          </Link>
          <Link
            href="/connections"
            className="p-5 rounded-2xl bg-surface-container flex items-center gap-3 hover:bg-surface-container-high transition-colors group"
          >
            <span className="material-symbols-outlined text-secondary text-[22px] group-hover:scale-110 transition-transform">bubble_chart</span>
            <div>
              <p className="text-label-md text-on-surface">Connecties</p>
              <p className="text-label-sm text-on-surface-variant font-normal tracking-normal">Peer support</p>
            </div>
          </Link>
        </section>

        {/* ── Atmospheric Quote Card ── */}
        <section className="mt-8 rounded-3xl overflow-hidden h-52 relative shadow-sm stagger-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Serene landscape at dawn with soft rolling hills in morning mist"
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(0.15) brightness(1.05)" }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIZ1u7O_JFcexSnE58b7dpew9o74ggUw2jMQgQ8FaFQLe7zN7FkTIyikpfzjduZq3IajnhZk_-PR0sQAa9C2cJcGUgEIE9_r-dlHQQQgI34_v8TJZp4p3G8-L3a-OEv-af15FGMN3Asvgppe5_usPjV2_k_y7viin6W0uVBspdq7sdosSywpjYp7cFWUnHLvALS8ph_6MLscDVt83FPyDgCjt9rwduAXUYxrq4A3h3c77WLQiIOPmPe7C31oMyd4aFIXR7mAncAds"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = "none";
              (t.nextElementSibling as HTMLElement | null)?.classList.remove("hidden");
            }}
          />
          {/* Fallback */}
          <div className="hidden absolute inset-0 bg-gradient-to-br from-primary-container/50 via-secondary-fixed/30 to-tertiary-fixed/20" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Content */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-label-sm uppercase tracking-widest opacity-70 mb-1">Quote van vandaag</p>
            <p className="text-body-lg italic drop-shadow-sm">&ldquo;{todayQuote()}&rdquo;</p>
          </div>
        </section>

      </main>
    </>
  );
}
