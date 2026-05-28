"use client";

import Link from "next/link";
import { STEPS } from "@/lib/steps/content";

const PACING_LABEL = { slow: "Rustig tempo", medium: "Eigen tempo", normal: "Flexibel" };

export default function StepsPage() {
  return (
    <main className="pb-28 max-w-screen-md mx-auto min-h-screen">

      {/* ── TopAppBar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-outline-variant/20">
        <div className="flex items-center px-6 h-16 max-w-screen-md mx-auto gap-3">
          <span className="material-symbols-outlined text-primary">spa</span>
          <div>
            <h1 className="text-headline-md text-primary tracking-tight leading-none">12 Stappen</h1>
            <p className="text-label-sm text-outline font-normal tracking-normal mt-0.5">ACA · CoDA herstelreis</p>
          </div>
        </div>
      </header>

      <div className="pt-20 px-6 space-y-6">

        {/* ── Hero Card ── */}
        <section className="animate-fade-up-1">
          <div className="bg-primary-fixed rounded-3xl p-7 relative overflow-hidden">
            {/* Ambient */}
            <div className="absolute -right-10 -bottom-10 opacity-8">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: "180px", fontVariationSettings: "'wght' 100" }}
              >
                route
              </span>
            </div>
            <div className="relative z-10 space-y-3">
              <span className="text-label-sm text-on-primary-fixed-variant uppercase tracking-widest block">
                Geen streaks · Niet-lineair · Jouw tempo
              </span>
              <h2 className="text-headline-md text-on-primary-fixed leading-snug">
                Elke stap is een thuis,<br />geen eindstation.
              </h2>
              <p className="text-body-md text-on-primary-fixed-variant leading-relaxed" style={{ maxWidth: "300px" }}>
                Je kunt terugkeren. Overslaan. Opnieuw beginnen. Er is geen fout pad.
              </p>
            </div>
          </div>
        </section>

        {/* ── Steps List ── */}
        <section className="space-y-2.5 animate-fade-up-2">
          {STEPS.map((step, index) => (
            <Link
              key={step.id}
              href={`/steps/${step.id}`}
              className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container active:scale-[0.99] transition-all duration-200 group"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Step icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                style={{ backgroundColor: step.color + "1a" }}
              >
                <span
                  className="material-symbols-outlined text-[26px]"
                  style={{ color: step.color, fontVariationSettings: "'wght' 200" }}
                >
                  {step.icon}
                </span>
                {/* Step number */}
                <span
                  className="absolute top-1 right-1.5 text-[10px] font-bold leading-none"
                  style={{ color: step.color + "88" }}
                >
                  {step.id}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-label-md text-on-surface">{step.title}</span>
                </div>
                <p className="text-label-sm text-outline font-normal tracking-normal truncate mt-0.5">{step.subtitle}</p>
                <p className="text-label-sm text-outline-variant font-normal tracking-normal italic mt-0.5">{step.coreTheme}</p>
              </div>

              {/* Pacing + arrow */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-label-sm text-outline-variant font-normal tracking-normal">
                  {PACING_LABEL[step.pacing]}
                </span>
                <span className="material-symbols-outlined text-[18px] text-outline-variant group-hover:text-primary transition-colors duration-200">
                  chevron_right
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* ── Footnote ── */}
        <div className="text-center animate-fade-up-3 pb-4">
          <p className="text-label-sm text-outline font-normal tracking-normal leading-relaxed max-w-xs mx-auto">
            Gebaseerd op het ACA Big Red Book en CoDA herstelprogramma's.
            Vervangt geen professionele hulp.
          </p>
        </div>

      </div>
    </main>
  );
}
