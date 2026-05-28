"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { STEPS, LAUNDRY_LIST_TRAITS } from "@/lib/steps/content";
import SafeScreen from "@/components/crisis/SafeScreen";
import { useCrisisDetector } from "@/hooks/useCrisisDetector";

const TYPE_LABELS: Record<string, string> = {
  journal: "Schrijfoefening",
  letter: "Brief",
  reflection: "Reflectie",
  list: "Lijst",
  meditation: "Meditatie",
};

const TYPE_ICONS: Record<string, string> = {
  journal: "edit_note",
  letter: "mail",
  reflection: "psychology",
  list: "format_list_bulleted",
  meditation: "self_improvement",
};

export default function StepDetailPage() {
  const params = useParams();
  const stepId = Number(params.step);
  const step = STEPS.find((s) => s.id === stepId);

  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [showLaundryList, setShowLaundryList] = useState(false);
  const { showCrisisScreen, check, dismiss } = useCrisisDetector();

  if (!step) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-on-surface-variant">Stap niet gevonden</p>
          <Link href="/steps" className="text-primary text-sm mt-2 block">
            Terug naar overzicht
          </Link>
        </div>
      </main>
    );
  }

  if (showCrisisScreen) return <SafeScreen onDismiss={dismiss} />;

  const prevStep = stepId > 1 ? stepId - 1 : null;
  const nextStep = stepId < 12 ? stepId + 1 : null;

  const handleSave = (idx: number) => {
    if (!answers[idx]?.trim()) return;
    setSaved((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setSaved((prev) => ({ ...prev, [idx]: false }));
    }, 3000);
  };

  return (
    <>
      <main className="pb-32 max-w-screen-md mx-auto min-h-screen">
        {/* Hero header */}
        <div
          className="relative overflow-hidden pt-16 pb-12 px-6"
          style={{ backgroundColor: step.color + "18" }}
        >
          {/* Back */}
          <Link
            href="/steps"
            className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-sm hover:bg-surface transition-colors z-10"
          >
            <span className="material-symbols-outlined text-on-surface text-[20px]">arrow_back</span>
          </Link>

          {/* Step number */}
          <div className="absolute top-4 right-4 z-10">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: step.color + "22", color: step.color }}
            >
              Stap {step.id} / 12
            </span>
          </div>

          {/* Icon + title */}
          <div className="mt-8 flex flex-col items-center text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
              style={{ backgroundColor: step.color + "22" }}
            >
              <span
                className="material-symbols-outlined text-4xl"
                style={{ color: step.color, fontVariationSettings: "'wght' 200" }}
              >
                {step.icon}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface mb-1">{step.title}</h1>
            <p className="text-on-surface-variant text-base">{step.subtitle}</p>
          </div>
        </div>

        <div className="px-6 space-y-6 pt-6">
          {/* Core theme chip */}
          <div className="flex justify-center">
            <span className="text-xs font-semibold text-outline uppercase tracking-widest px-4 py-2 bg-surface-container rounded-full">
              {step.coreTheme}
            </span>
          </div>

          {/* Inviting intro */}
          <div className="bg-surface-container-low rounded-3xl p-6">
            <p className="text-on-surface leading-relaxed text-base italic">
              "{step.invitingIntro}"
            </p>
          </div>

          {/* ACA framing */}
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-outline uppercase tracking-widest px-1">
              ACA Perspectief
            </h2>
            <div className="bg-surface-container-low rounded-2xl p-5">
              <p className="text-on-surface-variant leading-relaxed text-sm">
                {step.acaFraming}
              </p>
            </div>
          </div>

          {/* Psycho-education */}
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-outline uppercase tracking-widest px-1">
              Achtergrond
            </h2>
            <div
              className="rounded-2xl p-5 border-l-4"
              style={{ backgroundColor: step.color + "0d", borderColor: step.color + "44" }}
            >
              <p className="text-on-surface-variant leading-relaxed text-sm">
                {step.psychoEducation}
              </p>
            </div>
          </div>

          {/* Laundry list (step 1 only) */}
          {step.id === 1 && (
            <div className="space-y-1">
              <button
                onClick={() => setShowLaundryList((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors"
              >
                <span className="text-sm font-semibold text-on-surface">De Waslijst</span>
                <span className="material-symbols-outlined text-outline text-[20px]">
                  {showLaundryList ? "expand_less" : "expand_more"}
                </span>
              </button>
              {showLaundryList && (
                <div className="bg-surface-container-lowest rounded-2xl p-5 space-y-3">
                  {LAUNDRY_LIST_TRAITS.map((trait, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-xs font-bold text-outline mt-0.5 flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{trait}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Exercises */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-outline uppercase tracking-widest px-1">
              Oefeningen
            </h2>
            {step.exercises.map((exercise, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden bg-surface-container-low">
                {/* Exercise header */}
                <button
                  onClick={() => setActiveExercise(activeExercise === idx ? null : idx)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-surface-container transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: step.color + "18" }}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ color: step.color }}
                    >
                      {TYPE_ICONS[exercise.type]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-on-surface">{exercise.title}</span>
                      {exercise.isOptional && (
                        <span className="text-[10px] text-outline bg-surface-container-highest px-2 py-0.5 rounded-full">
                          Optioneel
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-outline">{TYPE_LABELS[exercise.type]}</span>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[20px] flex-shrink-0">
                    {activeExercise === idx ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {/* Exercise body */}
                {activeExercise === idx && (
                  <div className="px-5 pb-5 space-y-4">
                    {exercise.triggerWarning && (
                      <div className="flex gap-2 p-3 bg-error-container/30 rounded-xl">
                        <span className="material-symbols-outlined text-error text-[16px] mt-0.5 flex-shrink-0">
                          warning
                        </span>
                        <p className="text-xs text-on-error-container">{exercise.triggerWarning}</p>
                      </div>
                    )}

                    <p className="text-sm text-on-surface-variant leading-relaxed italic">
                      {exercise.prompt}
                    </p>

                    <textarea
                      rows={5}
                      value={answers[idx] ?? ""}
                      onChange={(e) => {
                        setAnswers((prev) => ({ ...prev, [idx]: e.target.value }));
                        if (e.target.value.length > 30) check(e.target.value);
                      }}
                      placeholder="Schrijf hier..."
                      className="w-full bg-surface-container rounded-xl p-4 text-sm text-on-surface placeholder:text-outline-variant resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />

                    <button
                      onClick={() => handleSave(idx)}
                      disabled={!answers[idx]?.trim()}
                      className={`w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                        saved[idx]
                          ? "bg-primary text-on-primary"
                          : answers[idx]?.trim()
                          ? "bg-primary-container/30 text-on-primary-container hover:bg-primary-container/40"
                          : "bg-surface-container-highest text-outline cursor-not-allowed opacity-50"
                      }`}
                    >
                      {saved[idx] ? (
                        <>
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Opgeslagen
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">lock</span>
                          Versleuteld opslaan
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Resistance note */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20">
            <p className="text-xs font-bold text-outline uppercase tracking-widest mb-2">
              Als je weerstand voelt
            </p>
            <p className="text-sm text-on-surface-variant leading-relaxed italic">
              "{step.resistanceNote}"
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {prevStep ? (
              <Link
                href={`/steps/${prevStep}`}
                className="flex-1 py-4 rounded-2xl bg-surface-container-low text-center text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Stap {prevStep}
              </Link>
            ) : (
              <Link
                href="/steps"
                className="flex-1 py-4 rounded-2xl bg-surface-container-low text-center text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">apps</span>
                Overzicht
              </Link>
            )}
            {nextStep && (
              <Link
                href={`/steps/${nextStep}`}
                className="flex-1 py-4 rounded-2xl text-center text-sm font-semibold text-on-primary flex items-center justify-center gap-2 transition-colors"
                style={{ backgroundColor: step.color }}
              >
                Stap {nextStep}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
