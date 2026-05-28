"use client";

import { useState, useEffect, useRef } from "react";
import { get } from "idb-keyval";
import SafeScreen from "@/components/crisis/SafeScreen";
import OnboardingChat, { ONBOARDING_KEY } from "@/components/onboarding/OnboardingChat";
import { useCrisisDetector } from "@/hooks/useCrisisDetector";
import { PEER_SUPPORT_CONFIG } from "@/lib/moderation/policy";
import { hashSessionId } from "@/lib/matching/vectorize";
import type { MatchCandidate } from "@/lib/matching/types";

const SESSION_KEY = "ft_session_id_v1";

// ── Cooldown ring ───────────────────────────────────────────────
function CooldownCircle({ pct }: { pct: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  return (
    <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 32 32">
      <circle className="text-outline-variant" cx="16" cy="16" fill="transparent" r={r} stroke="currentColor" strokeWidth="2" />
      <circle
        className="text-primary-container"
        cx="16" cy="16" fill="transparent" r={r}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
}

// ── Match-label chip ────────────────────────────────────────────
function MatchBadge({ label }: { label: MatchCandidate["label"] }) {
  const styles = {
    sterk: "bg-primary/15 text-primary",
    goed: "bg-secondary-container/40 text-on-secondary-container",
    mogelijk: "bg-surface-container-highest text-on-surface-variant",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-label-sm ${styles[label]}`}>
      {label === "sterk" ? "Sterke match" : label === "goed" ? "Goede match" : "Mogelijke match"}
    </span>
  );
}

// ── Lege staat ──────────────────────────────────────────────────
function EmptyState({ pending }: { pending: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center px-8">
      <div className="w-16 h-16 bg-primary-fixed/30 rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'wght' 200" }}>
          {pending ? "hourglass_empty" : "group_add"}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-headline-md text-on-surface">
          {pending ? "Aan het zoeken…" : "Nog geen verbindingen"}
        </p>
        <p className="text-body-md text-on-surface-variant max-w-xs">
          {pending
            ? "Haven zoekt voorzichtig naar iemand die goed bij je past. Dit kan even duren."
            : "Je profiel staat klaar. Zodra er een match is, zie je die hier."}
        </p>
      </div>
      {pending && (
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Hoofd component ─────────────────────────────────────────────
export default function ConnectionsPage() {
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [matches, setMatches] = useState<MatchCandidate[]>([]);
  const [matchPending, setMatchPending] = useState(false);
  const [openMatch, setOpenMatch] = useState<MatchCandidate | null>(null);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recSecs, setRecSecs] = useState(0);
  const [cooldownSecs, setCooldownSecs] = useState(PEER_SUPPORT_CONFIG.cooldownMinutes * 60);
  const [cooldownPct, setCooldownPct] = useState(0.5);
  const { showCrisisScreen, check, dismiss } = useCrisisDetector();
  const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Onboarding check
  useEffect(() => {
    get<{ completed?: boolean }>(ONBOARDING_KEY).then((v) => {
      setOnboardingDone(!!v?.completed);
    });
  }, []);

  // Matches ophalen als onboarding klaar is
  useEffect(() => {
    if (!onboardingDone) return;
    async function fetchMatches() {
      const sessionId = localStorage.getItem(SESSION_KEY) ?? "anonymous";
      const sh = await hashSessionId(sessionId);
      try {
        const res = await fetch(`/api/match?sh=${encodeURIComponent(sh)}`);
        const data = await res.json() as { matches: MatchCandidate[]; pending: boolean };
        setMatches(data.matches ?? []);
        setMatchPending(data.pending ?? false);
      } catch {
        // Offline — stille fout
      }
    }
    fetchMatches();
  }, [onboardingDone]);

  // Cooldown timer
  useEffect(() => {
    const t = setInterval(() => {
      setCooldownSecs((s) => {
        const next = Math.max(0, s - 1);
        setCooldownPct(next / (PEER_SUPPORT_CONFIG.cooldownMinutes * 60));
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecSecs(0);
      if (recTimerRef.current) clearInterval(recTimerRef.current);
    } else {
      setIsRecording(true);
      recTimerRef.current = setInterval(() => {
        setRecSecs((s) => {
          if (s >= PEER_SUPPORT_CONFIG.maxAudioSeconds - 1) {
            setIsRecording(false);
            clearInterval(recTimerRef.current!);
            return 0;
          }
          return s + 1;
        });
      }, 1000);
    }
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (showCrisisScreen) return <SafeScreen onDismiss={dismiss} />;

  // Laadstatus
  if (onboardingDone === null) return null;

  // Onboarding nog niet gedaan
  if (!onboardingDone) {
    return (
      <OnboardingChat
        onComplete={() => setOnboardingDone(true)}
      />
    );
  }

  return (
    <>
      {/* ── TopAppBar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-6 h-16 max-w-screen-md mx-auto">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary">spa</span>
            <h1 className="text-headline-md text-primary tracking-tight">Connecties</h1>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/30 transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">settings</span>
          </button>
        </div>
      </header>

      <main className="pt-20 pb-32 px-6 max-w-screen-md mx-auto min-h-screen">

        {/* ── Bento Header Cards ── */}
        <section className="mt-4 mb-8 stagger-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-primary-fixed rounded-3xl flex flex-col justify-between min-h-[168px] relative overflow-hidden group">
              <div className="relative z-10 space-y-1">
                <span className="text-label-sm text-on-primary-fixed-variant uppercase tracking-widest block">
                  Nieuwe Reflectie
                </span>
                <h2 className="text-headline-md text-on-primary-fixed leading-snug">
                  Gedeelde Stilte
                </h2>
              </div>
              <button className="relative z-10 bg-primary text-on-primary w-fit px-6 py-2.5 rounded-full text-label-md hover:opacity-90 transition-opacity flex items-center gap-2 active:scale-95">
                Begin
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-primary/15 rounded-full blur-2xl group-hover:bg-primary/25 transition-colors duration-500" />
            </div>

            <div className="p-6 bg-surface-container rounded-3xl flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-headline-md text-on-surface">Peer Veiligheid</h3>
                <p className="text-body-md text-on-surface-variant">
                  {matches.length > 0
                    ? `${matches.length} actieve verbinding${matches.length > 1 ? "en" : ""} beveiligd.`
                    : "Jouw profiel staat klaar."}
                </p>
              </div>
              <div className="w-14 h-14 bg-primary-fixed rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'wght' 200" }}>shield</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Match List ── */}
        <section className="space-y-3 stagger-2">
          <h3 className="text-label-sm text-outline uppercase tracking-widest px-1">
            Medereizigers
          </h3>

          {matches.length === 0 ? (
            <EmptyState pending={matchPending} />
          ) : (
            matches.map((m, i) => (
              <div
                key={m.alias}
                className="p-4 rounded-2xl bg-surface-container-low cursor-pointer hover:bg-surface-container active:scale-[0.99] transition-all duration-200"
                onClick={() => setOpenMatch(m)}
              >
                <div className="flex items-center gap-4">
                  {/* Geometrisch avatar */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 ${m.colorClass}`}
                    style={{ color: m.accentColor }}
                  >
                    <svg className="w-10 h-10" viewBox="0 0 40 40">
                      {i % 3 === 0 && (
                        <>
                          <circle cx="20" cy="20" fill="currentColor" fillOpacity="0.25" r="10" />
                          <rect fill="currentColor" height="10" width="10" x="15" y="15" />
                        </>
                      )}
                      {i % 3 === 1 && (
                        <>
                          <polygon fill="currentColor" fillOpacity="0.25" points="20,10 30,30 10,30" />
                          <circle cx="20" cy="28" fill="currentColor" r="4" />
                        </>
                      )}
                      {i % 3 === 2 && (
                        <>
                          <rect fill="currentColor" fillOpacity="0.25" height="20" rx="10" width="20" x="10" y="10" />
                          <rect fill="currentColor" height="4" width="4" x="18" y="18" />
                        </>
                      )}
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-label-md text-on-surface">{m.alias}</span>
                      <MatchBadge label={m.label} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.tags.map((tag) => (
                        <span key={tag} className="text-label-sm text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* ── Thread Detail Sheet ── */}
      <div
        className={`fixed inset-0 z-[60] bg-surface flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          openMatch ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {openMatch && (
          <>
            <header className="h-16 flex items-center px-6 justify-between border-b border-surface-container flex-shrink-0">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95"
                onClick={() => setOpenMatch(null)}
              >
                <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-label-md text-on-surface">{openMatch.alias}</span>
              </div>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
              {/* Welkomstbericht bij nieuwe verbinding */}
              <div className="flex flex-col items-center py-8 space-y-3">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${openMatch.colorClass}`}
                  style={{ color: openMatch.accentColor }}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 200" }}>handshake</span>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-label-sm text-outline uppercase tracking-widest">Nieuwe verbinding</p>
                  <p className="text-body-md text-on-surface-variant max-w-xs">
                    Jij en {openMatch.alias} zijn verbonden. Neem de tijd — er is geen haast.
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                    {openMatch.tags.map((tag) => (
                      <span key={tag} className="text-label-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cooldown indicator */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="3" />
                    <circle className="text-primary" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="283" strokeDashoffset={283 * (1 - cooldownPct)} style={{ transition: "stroke-dashoffset 1s linear" }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-headline-md text-primary tabular-nums">{fmtTime(cooldownSecs)}</span>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-label-sm text-outline uppercase tracking-widest">Intentionele Pauze</p>
                  <p className="text-body-md text-on-surface-variant max-w-xs">Afkoeling voor bewuste communicatie.</p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 glass-panel border-t border-surface-container px-6 py-4 pb-safe">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleRecording}
                  className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${
                    isRecording ? "bg-tertiary text-on-tertiary" : "bg-surface-container-highest text-primary hover:bg-surface-container"
                  }`}
                >
                  <span className="material-symbols-outlined">{isRecording ? "stop" : "mic"}</span>
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (e.target.value.length > 20) check(e.target.value);
                    }}
                    placeholder="Schrijf een reflectie…"
                    className="w-full bg-surface-container-lowest rounded-full px-6 py-3.5 text-body-md focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-outline-variant"
                  />
                  <button
                    disabled={cooldownSecs > 0}
                    className={`absolute right-2 top-1.5 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      cooldownSecs > 0
                        ? "bg-primary/25 text-white cursor-not-allowed"
                        : "bg-primary text-on-primary hover:opacity-90 active:scale-90"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </div>
              </div>
              {isRecording && (
                <div className="mt-3 flex items-center justify-between px-4 py-2.5 bg-primary/10 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
                    <span className="text-label-md text-primary">Opname… (Max {PEER_SUPPORT_CONFIG.maxAudioSeconds / 60}:00)</span>
                  </div>
                  <span className="text-label-md text-primary tabular-nums">{fmtTime(recSecs)}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
