"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SafeScreen from "@/components/crisis/SafeScreen";
import { useCrisisDetector } from "@/hooks/useCrisisDetector";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const DISCLAIMER = "Ik ben een digitale reflectietool, geen therapeut. Ik bied geen professioneel advies. Bij ernstige nood, bel 113.";

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0 mb-1">
        <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'wght' 200" }}>spa</span>
      </div>
      <div className="bg-surface-container-high rounded-2xl rounded-bl-none px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-outline animate-bounce"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 items-end ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0 mb-1">
          <span
            className="material-symbols-outlined text-primary text-[18px]"
            style={{ fontVariationSettings: "'wght' 200" }}
          >
            spa
          </span>
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-body-md leading-relaxed ${
          isUser
            ? "bg-primary text-on-primary rounded-br-sm"
            : "bg-surface-container-high text-on-surface rounded-bl-sm"
        } ${msg.isStreaming ? "opacity-80" : ""}`}
      >
        {msg.content}
        {msg.isStreaming && (
          <span
            className="inline-block w-0.5 h-4 bg-current ml-1 align-middle"
            style={{ animation: "blink 1s step-end infinite" }}
          />
        )}
      </div>
    </div>
  );
}

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welkom. ${DISCLAIMER}\n\nWat is er vandaag aanwezig voor jou?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { showCrisisScreen, check, dismiss } = useCrisisDetector();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    if (check(text)) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", isStreaming: true },
    ]);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error("API error");

      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const json = await res.json();
        if (json.type === "crisis") {
          setMessages((prev) => prev.map((m) =>
            m.id === assistantId
              ? { ...m, isStreaming: false, content: "Wat je beschrijft klinkt heel zwaar. Voordat we verdergaan wil ik je vragen contact op te nemen met 113 (www.113.nl, 24/7 beschikbaar). Bel 112 als er direct gevaar is." }
              : m
          ));
          setIsLoading(false);
          return;
        }
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: accumulated, isStreaming: true } : m)
        );
      }
      setMessages((prev) =>
        prev.map((m) => m.id === assistantId ? { ...m, content: accumulated || "...", isStreaming: false } : m)
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Ik merk dat ik je op dit punt niet goed kan bereiken. Probeer het straks opnieuw.", isStreaming: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (showCrisisScreen) return <SafeScreen onDismiss={dismiss} />;

  return (
    <main className="flex flex-col h-[100dvh] max-w-screen-md mx-auto">

      {/* ── Header ── */}
      <header className="flex-shrink-0 glass-panel border-b border-outline-variant/20 z-50">
        <div className="flex justify-between items-center px-6 h-16 max-w-screen-md mx-auto">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
              <span
                className="material-symbols-outlined text-primary text-[18px]"
                style={{ fontVariationSettings: "'wght' 200" }}
              >
                spa
              </span>
            </div>
            <div>
              <h1 className="text-label-md text-primary leading-none">Haven Companion</h1>
              <p className="text-label-sm text-outline font-normal tracking-normal mt-0.5">
                Geen therapeut · Reflectietool
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/30 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </Link>
        </div>
      </header>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
        {/* Privacy pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-primary text-[14px]">lock</span>
            <span className="text-label-sm text-on-surface-variant font-normal tracking-normal">
              Berichten verlaten dit apparaat niet
            </span>
          </div>
        </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {isLoading && messages[messages.length - 1]?.isStreaming === false && (
          <TypingIndicator />
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 glass-panel border-t border-surface-container px-5 py-4 pb-safe">
        <div className="flex items-end gap-3 max-w-screen-md mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Deel wat er in je omgaat..."
              disabled={isLoading}
              className="w-full bg-surface-container-lowest rounded-2xl px-4 py-3 text-body-md resize-none overflow-hidden focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-outline-variant disabled:opacity-50 transition-all"
              style={{ minHeight: "48px" }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 hover:opacity-90 active:scale-90 transition-all disabled:opacity-35 disabled:cursor-not-allowed atmospheric-shadow"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
        <p className="text-label-sm text-center text-outline font-normal tracking-normal mt-2 opacity-60">
          Geen therapeut · Bij crisis: bel 113 of 112
        </p>
      </div>

    </main>
  );
}
