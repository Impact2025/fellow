"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "expired")
      setError("Je inloglink is verlopen of al gebruikt. Vraag hieronder een nieuwe aan.");
    else if (err === "invalid")
      setError("Ongeldige inloglink. Vraag hieronder een nieuwe aan.");
  }, []);

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Er is iets misgegaan. Probeer opnieuw.");
        return;
      }
      setSent(true);
    } catch {
      setError("Verbindingsfout. Controleer je internet en probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F7F5F0" }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 480,
            height: 480,
            top: "-10%",
            left: "-10%",
            background: "radial-gradient(circle, rgba(71,101,83,0.10) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 320,
            height: 320,
            bottom: "5%",
            right: "-5%",
            background: "radial-gradient(circle, rgba(107,143,171,0.10) 0%, transparent 70%)",
          }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <div className="w-full max-w-sm space-y-8">

          {/* Logo */}
          <div className="text-center space-y-3">
            <div
              className="w-20 h-20 mx-auto flex items-center justify-center shadow-lg"
              style={{
                background: "#C8EBD4",
                borderRadius: 24,
              }}
            >
              <span
                className="material-symbols-outlined text-[40px]"
                style={{ color: "#476553", fontVariationSettings: "'FILL' 1, 'wght' 300" }}
              >
                shield_lock
              </span>
            </div>
            <div>
              <h1 className="text-headline-lg text-primary font-semibold tracking-tight">
                Haven
              </h1>
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                Je geest verdient rust
              </p>
            </div>
          </div>

          {/* Card */}
          {!sent ? (
            <div
              className="rounded-[32px] p-8 space-y-6"
              style={{
                background: "white",
                boxShadow: "0 2px 16px rgba(71,101,83,0.08)",
              }}
            >
              <div>
                <h2 className="text-headline-md text-on-surface font-semibold">
                  Welkom bij Haven
                </h2>
                <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  Voer je e-mailadres in. We sturen je een tijdelijke inloglink — geen wachtwoord nodig.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="rounded-2xl px-4 py-3 flex gap-2.5 items-start"
                  style={{ background: "rgba(184,84,80,0.08)" }}
                >
                  <span
                    className="material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5"
                    style={{ color: "#B85450" }}
                  >
                    error
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "#7A1F1C" }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Input */}
              <div className="space-y-4">
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] pointer-events-none"
                    style={{ color: "#9E9E9E" }}
                  >
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="jouw@email.com"
                    autoComplete="email"
                    autoFocus
                    className="w-full pl-12 pr-4 py-4 rounded-2xl text-base text-on-surface placeholder:text-outline-variant outline-none transition-all"
                    style={{
                      background: "#F7F5F0",
                      border: "1.5px solid transparent",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.border = "1.5px solid rgba(71,101,83,0.4)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.border = "1.5px solid transparent")
                    }
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!email.trim() || loading}
                  className="w-full py-4 rounded-full text-label-md font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                  style={{
                    background: email.trim() && !loading ? "#476553" : "#C5C6C1",
                    color: "white",
                    cursor: email.trim() && !loading ? "pointer" : "not-allowed",
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      />
                      Bezig…
                    </>
                  ) : (
                    <>
                      Stuur inloglink
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>

              <p
                className="text-xs text-center leading-relaxed"
                style={{ color: "#9E9E9E" }}
              >
                Geen wachtwoord. Geen persoonlijke data opgeslagen op onze servers.
                <br />
                Nieuw? We maken automatisch een account voor je aan.
              </p>
            </div>
          ) : (
            /* Sent state */
            <div
              className="rounded-[32px] p-8 space-y-6 text-center"
              style={{
                background: "white",
                boxShadow: "0 2px 16px rgba(71,101,83,0.08)",
              }}
            >
              {/* Animated icon */}
              <div className="relative w-20 h-20 mx-auto">
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: "rgba(71,101,83,0.15)" }}
                />
                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "#C8EBD4" }}
                >
                  <span
                    className="material-symbols-outlined text-[38px]"
                    style={{ color: "#476553", fontVariationSettings: "'FILL' 1" }}
                  >
                    mark_email_read
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-headline-md text-on-surface font-semibold">
                  Check je inbox!
                </h2>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  We stuurden een inloglink naar
                  <br />
                  <strong className="text-on-surface">{email}</strong>
                </p>
              </div>

              <div
                className="rounded-2xl px-4 py-3 space-y-2 text-left"
                style={{ background: "#F7F5F0" }}
              >
                {[
                  { icon: "timer", text: "Link is 15 minuten geldig" },
                  { icon: "folder", text: "Controleer ook je spam / ongewenste mail" },
                  { icon: "devices", text: "Klik de link op hetzelfde apparaat" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ color: "#9E9E9E" }}
                    >
                      {icon}
                    </span>
                    <span className="text-xs" style={{ color: "#727973" }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSent(false);
                  setEmail("");
                  setError("");
                }}
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: "#476553" }}
              >
                Ander e-mailadres gebruiken
              </button>
            </div>
          )}

          {/* Crisis banner space */}
          <div className="h-8" />
        </div>
      </main>

      {/* Inline crisis footer (layout heeft geen BottomNavBar op /login) */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-2 px-4 py-2 text-xs border-t"
        style={{
          background: "rgba(247,245,240,0.95)",
          borderColor: "rgba(0,0,0,0.06)",
          color: "#727973",
        }}
      >
        <span
          className="material-symbols-outlined text-[14px]"
          style={{ color: "#476553" }}
        >
          emergency
        </span>
        <span>
          In crisis?{" "}
          <a href="tel:113" className="font-semibold underline-offset-2 hover:underline" style={{ color: "#476553" }}>
            113
          </a>{" "}
          (NL) ·{" "}
          <a href="tel:0800321234" className="font-semibold underline-offset-2 hover:underline" style={{ color: "#476553" }}>
            0800 32 123
          </a>{" "}
          (BE) · Direct gevaar:{" "}
          <a href="tel:112" className="font-semibold underline-offset-2 hover:underline" style={{ color: "#476553" }}>
            112
          </a>
        </span>
      </div>
    </div>
  );
}
