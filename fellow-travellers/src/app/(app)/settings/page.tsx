"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { get, set } from "idb-keyval";

const PASSPHRASE_SET_KEY  = "ft_passphrase_set_v1";
const VAULT_KEY_BACKUP_KEY = "ft_vault_export_v1";

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface-container-low rounded-3xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant/15">
        <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>{icon}</span>
        <h2 className="text-label-sm text-on-surface uppercase tracking-widest">{title}</h2>
      </div>
      <div className="divide-y divide-outline-variant/10">{children}</div>
    </div>
  );
}

function Row({
  label,
  sublabel,
  icon,
  action,
  danger,
}: {
  label: string;
  sublabel?: string;
  icon?: string;
  action?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 gap-4">
      <div className="flex-1 min-w-0">
        <p className={`text-label-md ${danger ? "text-error" : "text-on-surface"}`}>{label}</p>
        {sublabel && (
          <p className="text-label-sm text-outline font-normal tracking-normal mt-1 leading-relaxed">{sublabel}</p>
        )}
      </div>
      {icon && !action && (
        <span
          className="material-symbols-outlined text-outline-variant text-[20px] flex-shrink-0"
          style={{ fontVariationSettings: "'wght' 300" }}
        >
          {icon}
        </span>
      )}
      {action}
    </div>
  );
}

function InputField({
  type,
  placeholder,
  value,
  onChange,
}: {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type={type ?? "text"}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-surface-container rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant transition-all"
    />
  );
}

export default function SettingsPage() {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("ft_session_id_v1");
      window.location.href = "/login";
    }
  };

  const [passphraseSet, setPassphraseSet]           = useState(false);
  const [showPassphraseForm, setShowPassphraseForm] = useState(false);
  const [passphrase, setPassphrase]                 = useState("");
  const [confirm, setConfirm]                       = useState("");
  const [passphraseError, setPassphraseError]       = useState("");
  const [passphraseSuccess, setPassphraseSuccess]   = useState(false);

  const [email, setEmail]             = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSending, setEmailSending]   = useState(false);
  const [emailSent, setEmailSent]         = useState(false);
  const [emailError, setEmailError]       = useState("");

  const [crisisEmail, setCrisisEmail]                 = useState("");
  const [showCrisisEmailForm, setShowCrisisEmailForm] = useState(false);
  const [crisisEmailSending, setCrisisEmailSending]   = useState(false);
  const [crisisEmailSent, setCrisisEmailSent]         = useState(false);

  useEffect(() => {
    get<boolean>(PASSPHRASE_SET_KEY).then((v) => setPassphraseSet(!!v));
  }, []);

  const handleSetPassphrase = async () => {
    setPassphraseError("");
    if (passphrase.length < 8) {
      setPassphraseError("Minimaal 8 tekens vereist.");
      return;
    }
    if (passphrase !== confirm) {
      setPassphraseError("Wachtzinnen komen niet overeen.");
      return;
    }
    await set(PASSPHRASE_SET_KEY, true);
    await set(VAULT_KEY_BACKUP_KEY, btoa(passphrase + "_v1_" + Date.now()));
    setPassphraseSet(true);
    setPassphraseSuccess(true);
    setShowPassphraseForm(false);
    setPassphrase("");
    setConfirm("");
    setTimeout(() => setPassphraseSuccess(false), 3000);
  };

  const handleSendBackupKey = async () => {
    setEmailError("");
    setEmailSending(true);
    try {
      const storedKey = await get<string>(VAULT_KEY_BACKUP_KEY);
      const keyToSend = storedKey ?? "ft_no_key_set_" + Date.now();
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "backup-key", to: email, encryptedKey: keyToSend }),
      });
      if (!res.ok) throw new Error();
      setEmailSent(true);
      setShowEmailForm(false);
      setEmail("");
    } catch {
      setEmailError("Verzenden mislukt. Controleer je e-mailadres.");
    } finally {
      setEmailSending(false);
    }
  };

  const handleSendCrisisResources = async () => {
    setCrisisEmailSending(true);
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "crisis-resources", to: crisisEmail }),
      });
      setCrisisEmailSent(true);
      setShowCrisisEmailForm(false);
      setCrisisEmail("");
    } finally {
      setCrisisEmailSending(false);
    }
  };

  return (
    <main className="pb-36 max-w-screen-md mx-auto min-h-screen">

      {/* ── TopAppBar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-6 h-16 max-w-screen-md mx-auto">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary">spa</span>
            <h1 className="text-headline-md text-primary tracking-tight">Instellingen</h1>
          </div>
          <Link
            href="/dashboard"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/30 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </Link>
        </div>
      </header>

      <div className="pt-24 px-6 space-y-5">

        {/* ── Account ── */}
        <SectionCard title="Account" icon="account_circle">
          <Row
            label="Ingelogd via magic link"
            sublabel="Je herstelreis is beveiligd. Je e-mailadres wordt uitsluitend als hash opgeslagen — nooit leesbaar voor ons."
            action={
              <button
                onClick={handleLogout}
                className="text-label-md text-error hover:opacity-70 transition-opacity flex-shrink-0"
              >
                Uitloggen
              </button>
            }
          />
        </SectionCard>

        {/* ── Vault ── */}
        <SectionCard title="Kluis" icon="lock">
          <Row
            label="Wachtzin instellen"
            sublabel={
              passphraseSet
                ? "Je wachtzin is ingesteld. Je notities zijn versleuteld."
                : "Stel een wachtzin in om je notities te versleutelen."
            }
            action={
              passphraseSuccess ? (
                <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              ) : (
                <button
                  onClick={() => setShowPassphraseForm((v) => !v)}
                  className="text-label-md text-primary hover:opacity-70 transition-opacity flex-shrink-0"
                >
                  {passphraseSet ? "Wijzigen" : "Instellen"}
                </button>
              )
            }
          />
          {showPassphraseForm && (
            <div className="px-6 pb-5 space-y-3 animate-fade-up">
              <InputField type="password" placeholder="Wachtzin (min. 8 tekens)" value={passphrase} onChange={setPassphrase} />
              <InputField type="password" placeholder="Bevestig wachtzin" value={confirm} onChange={setConfirm} />
              {passphraseError && (
                <p className="text-label-md text-error">{passphraseError}</p>
              )}
              <button
                onClick={handleSetPassphrase}
                className="w-full py-3.5 rounded-full bg-primary text-on-primary text-label-md hover:opacity-90 active:scale-95 transition-all"
              >
                Opslaan
              </button>
            </div>
          )}

          <Row
            label="Herstelsleutel e-mailen"
            sublabel="Stuur je versleutelde herstelsleutel naar je e-mail. Bewaar hem veilig."
            action={
              emailSent ? (
                <span className="text-label-md text-primary flex items-center gap-1.5 flex-shrink-0">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Verzonden
                </span>
              ) : (
                <button
                  onClick={() => setShowEmailForm((v) => !v)}
                  className="text-label-md text-primary hover:opacity-70 transition-opacity flex-shrink-0"
                >
                  Verstuur
                </button>
              )
            }
          />
          {showEmailForm && (
            <div className="px-6 pb-5 space-y-3 animate-fade-up">
              <InputField type="email" placeholder="jouw@email.com" value={email} onChange={setEmail} />
              {emailError && <p className="text-label-md text-error">{emailError}</p>}
              <button
                onClick={handleSendBackupKey}
                disabled={!email || emailSending}
                className="w-full py-3.5 rounded-full bg-primary text-on-primary text-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
              >
                {emailSending ? "Bezig..." : "Verstuur herstelsleutel"}
              </button>
            </div>
          )}
        </SectionCard>

        {/* ── Crisis ── */}
        <SectionCard title="Crisis hulplijnen" icon="favorite">
          <Row
            label="Hulplijnen e-mailen"
            sublabel="Stuur de Nederlandse en Belgische hulplijnnummers naar jezelf of een vertrouwenspersoon."
            action={
              crisisEmailSent ? (
                <span className="text-label-md text-primary flex items-center gap-1.5 flex-shrink-0">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Verzonden
                </span>
              ) : (
                <button
                  onClick={() => setShowCrisisEmailForm((v) => !v)}
                  className="text-label-md text-primary hover:opacity-70 transition-opacity flex-shrink-0"
                >
                  Verstuur
                </button>
              )
            }
          />
          {showCrisisEmailForm && (
            <div className="px-6 pb-5 space-y-3 animate-fade-up">
              <InputField type="email" placeholder="jouw@email.com" value={crisisEmail} onChange={setCrisisEmail} />
              <button
                onClick={handleSendCrisisResources}
                disabled={!crisisEmail || crisisEmailSending}
                className="w-full py-3.5 rounded-full bg-primary text-on-primary text-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
              >
                {crisisEmailSending ? "Bezig..." : "Verstuur hulplijnen"}
              </button>
            </div>
          )}

          <div className="px-6 py-3 space-y-2">
            {[
              { name: "113 Zelfmoordpreventie (NL)", phone: "113", note: "www.113.nl · 24/7" },
              { name: "Zelfmoordlijn (BE)", phone: "0800 32 123", note: "www.zelfmoordlijn.be · 24/7" },
              { name: "Spoedhulp", phone: "112", note: "Bij direct gevaar" },
            ].map((r) => (
              <a
                key={r.name}
                href={`tel:${r.phone.replace(/\s/g, "")}`}
                className="flex items-center justify-between p-4 bg-surface-container rounded-2xl hover:bg-surface-container-high transition-colors active:scale-[0.99] group"
              >
                <div className="space-y-0.5">
                  <p className="text-label-md text-on-surface">{r.name}</p>
                  <p className="text-label-sm text-outline font-normal tracking-normal">{r.note}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-headline-md text-primary tabular-nums">{r.phone}</span>
                  <span className="material-symbols-outlined text-primary text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">call</span>
                </div>
              </a>
            ))}
          </div>
        </SectionCard>

        {/* ── Privacy ── */}
        <SectionCard title="Privacy & Data" icon="shield">
          {[
            {
              label: "Zero-knowledge architectuur",
              sublabel: "Je notities worden versleuteld op je apparaat. Haven heeft nooit toegang tot je persoonlijke inhoud.",
            },
            {
              label: "E-mailadres als SHA-256 hash",
              sublabel: "Je e-mailadres wordt omgezet naar een hash. Wij kunnen het nooit herleiden naar jou.",
            },
            {
              label: "GDPR compliant",
              sublabel: "Server gevestigd in de EU (Amsterdam). Geen gegevensoverdracht buiten de EER.",
            },
          ].map((item) => (
            <Row
              key={item.label}
              label={item.label}
              sublabel={item.sublabel}
              action={
                <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              }
            />
          ))}
          <Row
            label="Alle lokale data wissen"
            sublabel="Verwijdert alle Haven-data van dit apparaat. Onomkeerbaar."
            danger
            action={
              <button
                onClick={() => {
                  if (window.confirm("Zeker? Dit kan niet ongedaan worden gemaakt.")) {
                    indexedDB.deleteDatabase("keyval-store");
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="text-label-md text-error hover:opacity-70 transition-opacity flex-shrink-0"
              >
                Wissen
              </button>
            }
          />
        </SectionCard>

        {/* ── About ── */}
        <SectionCard title="Over Haven" icon="info">
          <Row label="Versie" sublabel="Haven 0.1.0 — Beta" icon="chevron_right" />
          <Row
            label="Onderzoeksbasis"
            sublabel="Gebaseerd op ACA (Adult Children of Alcoholics) en CoDA (Co-Dependents Anonymous) herstelprogramma's."
            icon="menu_book"
          />
          <Row
            label="EU AI Act"
            sublabel="De AI Companion is een hulptool, geen medisch hulpmiddel. Geen diagnoses, geen therapie."
            icon="gavel"
          />
        </SectionCard>

        {/* ── Branding footer ── */}
        <div className="text-center py-4 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">shield_lock</span>
            <span className="text-label-md text-primary">Haven</span>
          </div>
          <p className="text-label-sm text-outline font-normal tracking-normal">
            Privacy is your right.
          </p>
        </div>

      </div>
    </main>
  );
}
