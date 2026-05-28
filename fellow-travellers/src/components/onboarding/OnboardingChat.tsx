"use client";

import { useState, useEffect, useRef } from "react";
import { set } from "idb-keyval";
import PostcodeInput from "./PostcodeInput";
import { buildVector, hashSessionId } from "@/lib/matching/vectorize";
import type {
  OnboardingProfile,
  RecoveryPath,
  SupportNeed,
  AvailabilitySlot,
  Language,
} from "@/lib/matching/types";

export const ONBOARDING_KEY = "ft_onboarding_v1";
const SESSION_KEY = "ft_session_id_v1";

interface Message {
  id: string;
  from: "haven" | "user";
  text: string;
}

interface Props {
  onComplete: () => void;
}

// ── Haven typing indicator ──────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-5 py-3.5 bg-surface-container-high rounded-2xl rounded-tl-none w-fit">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-on-surface-variant/50 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: "900ms" }}
        />
      ))}
    </div>
  );
}

// ── Enkele chat-bubble ──────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  const isHaven = msg.from === "haven";
  return (
    <div
      className={`flex ${isHaven ? "justify-start" : "justify-end"} animate-[fadeSlideUp_0.3s_ease_both]`}
    >
      <div
        className={`max-w-[82%] px-5 py-3.5 text-body-md rounded-2xl ${
          isHaven
            ? "bg-surface-container-high text-on-surface rounded-tl-none"
            : "bg-primary-container text-on-primary-container rounded-tr-none"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

// ── Keuze-knoppen ───────────────────────────────────────────────
function ChoiceButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-label-md border transition-all active:scale-95 ${
        selected
          ? "bg-primary text-on-primary border-primary"
          : "bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-container"
      }`}
    >
      {label}
    </button>
  );
}

// ── Hoofd-component ─────────────────────────────────────────────
export default function OnboardingChat({ onComplete }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(-1); // -1 = welkomst pending
  const [isThinking, setIsThinking] = useState(false);
  const [profile, setProfile] = useState<Partial<OnboardingProfile>>({});
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const uid = () => crypto.randomUUID();

  function addHavenMsg(text: string) {
    setMessages((prev) => [...prev, { id: uid(), from: "haven", text }]);
  }

  function addUserMsg(text: string) {
    setMessages((prev) => [...prev, { id: uid(), from: "user", text }]);
  }

  async function think(ms = 700) {
    setIsThinking(true);
    await new Promise((r) => setTimeout(r, ms + Math.random() * 300));
    setIsThinking(false);
  }

  // Scroll naar beneden bij nieuwe berichten
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking, step]);

  // Start welkomst
  useEffect(() => {
    let cancelled = false;
    async function start() {
      await think(400);
      if (cancelled) return;
      addHavenMsg("Fijn dat je er bent.");
      await think(800);
      if (cancelled) return;
      addHavenMsg(
        "Voordat ik je verbind met een medereizigers, stel ik je een paar korte vragen. Alles blijft op jouw apparaat — we bewaren nooit namen of adressen."
      );
      setStep(0);
    }
    start();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function advance(
    userText: string,
    profilePatch: Partial<OnboardingProfile>,
    nextStep: number
  ) {
    addUserMsg(userText);
    setProfile((prev) => ({ ...prev, ...profilePatch }));
    setSelectedMulti([]);
    setTextInput("");
    await think();

    const merged = { ...profile, ...profilePatch };
    const alias = merged.alias ?? "jij";

    const nextMessages: Record<number, string> = {
      1: `Fijn, ${alias}. In welke regio woon je? We gebruiken alleen je provincie — nooit je exacte adres.`,
      2: "Welk herstelpad voelt het meest als het jouwe?",
      3: "En hoe lang ben je al bewust op dit pad?",
      4: "Wat zoek je het meest? Je mag meerdere dingen kiezen.",
      5: "Wanneer ben je meestal beschikbaar voor een kort gesprek?",
      6: "In welke taal praat jij het liefst?",
      7: `Bedankt, ${alias}. Ik zoek nu voorzichtig naar iemand voor je. Dit kan even duren — ik let goed op wie goed bij je past.`,
    };

    if (nextMessages[nextStep]) addHavenMsg(nextMessages[nextStep]);
    setStep(nextStep);

    if (nextStep === 7) {
      await saveAndComplete({ ...merged } as OnboardingProfile);
    }
  }

  async function saveAndComplete(final: OnboardingProfile) {
    try {
      const sessionId = localStorage.getItem(SESSION_KEY) ?? "anonymous";
      const sessionHash = await hashSessionId(sessionId);
      const vector = buildVector(final);

      await Promise.all([
        set(ONBOARDING_KEY, { completed: true, alias: final.alias, completedAt: Date.now() }),
        fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionHash,
            alias: final.alias,
            vector,
            regionCode: final.provinceCode ?? "XX",
          }),
        }),
      ]);
    } catch {
      // Non-fatal — profiel wordt lokaal bewaard, server sync mislukt stil
    }
  }

  const handleAliasSubmit = () => {
    const alias = textInput.trim();
    if (!alias) return;
    advance(alias, { alias }, 1);
  };

  const handlePostcodeConfirm = (
    postcode: string,
    city: string,
    province: string,
    provinceCode: string
  ) => {
    advance(`${city}, ${province}`, { postcode, city, province, provinceCode }, 2);
  };

  const handlePostcodeSkip = () => {
    advance("Liever niet", { postcode: "", city: "", province: "", provinceCode: "XX" }, 2);
  };

  const handleSingle = (
    label: string,
    field: keyof OnboardingProfile,
    value: unknown,
    nextStep: number
  ) => {
    advance(label, { [field]: value } as Partial<OnboardingProfile>, nextStep);
  };

  const toggleMulti = (val: string) => {
    setSelectedMulti((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  const handleMultiSubmit = <T extends string>(
    field: keyof OnboardingProfile,
    labels: Record<T, string>,
    nextStep: number
  ) => {
    if (selectedMulti.length === 0) return;
    const display = selectedMulti.map((k) => labels[k as T] ?? k).join(", ");
    advance(display, { [field]: selectedMulti as T[] } as Partial<OnboardingProfile>, nextStep);
  };

  // ── Stap-UI ────────────────────────────────────────────────────
  const recoveryPathOptions: { value: RecoveryPath; label: string }[] = [
    { value: "aca", label: "ACA" },
    { value: "coda", label: "CoDA" },
    { value: "both", label: "Allebei" },
    { value: "exploring", label: "Nog aan het ontdekken" },
  ];

  const stageOptions: { value: 1 | 2 | 3 | 4 | 5; label: string }[] = [
    { value: 1, label: "Net begonnen (weken)" },
    { value: 2, label: "Een paar maanden" },
    { value: 3, label: "Meer dan een jaar" },
    { value: 4, label: "Al jaren onderweg" },
    { value: 5, label: "Het gaat en het komt" },
  ];

  const supportNeedOptions: { value: SupportNeed; label: string }[] = [
    { value: "listen", label: "Iemand die luistert" },
    { value: "share", label: "Ervaringen delen" },
    { value: "understand", label: "Begrepen worden zonder advies" },
    { value: "accountability", label: "Iemand die me herinnert aan mijn intenties" },
  ];

  const availabilityOptions: { value: AvailabilitySlot; label: string }[] = [
    { value: "morning", label: "Ochtend" },
    { value: "afternoon", label: "Middag" },
    { value: "evening", label: "Avond" },
    { value: "weekend", label: "Weekend" },
  ];

  const languageOptions: { value: Language; label: string }[] = [
    { value: "nl", label: "Nederlands" },
    { value: "en", label: "English" },
    { value: "both", label: "Beide" },
  ];

  function renderInput() {
    if (step === -1 || isThinking) return null;

    switch (step) {
      case 0:
        return (
          <button
            onClick={() => {
              addUserMsg("OK, start");
              setStep(0.5 as never);
              think(600).then(() => {
                addHavenMsg("Hoe wil je hier heten? Kies iets wat jij fijn vindt — het hoeft niets te zeggen over wie je bent.");
                setStep(0.5 as never);
                setTimeout(() => setStep(0.9 as never), 10);
              });
            }}
            className="w-full bg-primary text-on-primary rounded-full py-3.5 text-label-md active:scale-95 transition-transform"
          >
            OK, begin
          </button>
        );

      // Alias invoer (step 0.9 → we use a numeric trick; eigenlijk step "alias")
      default:
        if (step === (0.9 as never)) {
          return (
            <div className="flex gap-2">
              <input
                autoFocus
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAliasSubmit()}
                placeholder="Jouw naam hier…"
                maxLength={32}
                className="flex-1 bg-surface-container-lowest rounded-full px-5 py-3 text-body-md focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-outline-variant"
              />
              <button
                onClick={handleAliasSubmit}
                disabled={!textInput.trim()}
                className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          );
        }
        return null;

      case 1:
        return <PostcodeInput onConfirm={handlePostcodeConfirm} onSkip={handlePostcodeSkip} />;

      case 2:
        return (
          <div className="flex flex-wrap gap-2">
            {recoveryPathOptions.map((o) => (
              <ChoiceButton
                key={o.value}
                label={o.label}
                onClick={() => handleSingle(o.label, "recoveryPath", o.value, 3)}
              />
            ))}
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-2">
            {stageOptions.map((o) => (
              <ChoiceButton
                key={o.value}
                label={o.label}
                onClick={() => handleSingle(o.label, "recoveryStage", o.value, 4)}
              />
            ))}
          </div>
        );

      case 4: {
        const labels = Object.fromEntries(supportNeedOptions.map((o) => [o.value, o.label])) as Record<SupportNeed, string>;
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {supportNeedOptions.map((o) => (
                <ChoiceButton
                  key={o.value}
                  label={o.label}
                  selected={selectedMulti.includes(o.value)}
                  onClick={() => toggleMulti(o.value)}
                />
              ))}
            </div>
            <button
              disabled={selectedMulti.length === 0}
              onClick={() => handleMultiSubmit("supportNeeds", labels, 5)}
              className="w-full bg-primary text-on-primary rounded-full py-3 text-label-md disabled:opacity-40 active:scale-95 transition-transform"
            >
              Volgende
            </button>
          </div>
        );
      }

      case 5: {
        const labels = Object.fromEntries(availabilityOptions.map((o) => [o.value, o.label])) as Record<AvailabilitySlot, string>;
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {availabilityOptions.map((o) => (
                <ChoiceButton
                  key={o.value}
                  label={o.label}
                  selected={selectedMulti.includes(o.value)}
                  onClick={() => toggleMulti(o.value)}
                />
              ))}
            </div>
            <button
              disabled={selectedMulti.length === 0}
              onClick={() => handleMultiSubmit("availability", labels, 6)}
              className="w-full bg-primary text-on-primary rounded-full py-3 text-label-md disabled:opacity-40 active:scale-95 transition-transform"
            >
              Volgende
            </button>
          </div>
        );
      }

      case 6:
        return (
          <div className="flex gap-2">
            {languageOptions.map((o) => (
              <ChoiceButton
                key={o.value}
                label={o.label}
                onClick={() => handleSingle(o.label, "language", o.value, 7)}
              />
            ))}
          </div>
        );

      case 7:
        return (
          <button
            onClick={onComplete}
            className="w-full bg-primary text-on-primary rounded-full py-3.5 text-label-md active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            Naar mijn verbindingen
            <span className="material-symbols-outlined text-[16px]">spa</span>
          </button>
        );
    }
  }

  // Voortgangsindicator: stap 0-7 = 8 stappen totaal
  const stepNorm = Math.max(0, Math.min(step as number, 7));
  const progress = stepNorm / 7;

  return (
    <div className="fixed inset-0 z-[70] bg-surface flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 h-16 flex items-center justify-between px-6 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary">spa</span>
          <span className="text-label-md text-on-surface">Haven — Onboarding</span>
        </div>
        {/* Subtiele voortgangsbalk */}
        <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </header>

      {/* Berichten */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-4"
      >
        {messages.map((msg) => (
          <Bubble key={msg.id} msg={msg} />
        ))}
        {isThinking && (
          <div className="flex justify-start animate-[fadeSlideUp_0.2s_ease_both]">
            <TypingDots />
          </div>
        )}
      </div>

      {/* Input */}
      {!isThinking && step !== -1 && (
        <div className="flex-shrink-0 glass-panel border-t border-surface-container px-6 py-5 pb-safe animate-[fadeSlideUp_0.25s_ease_both]">
          {renderInput()}
        </div>
      )}
    </div>
  );
}
