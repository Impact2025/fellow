"use client";

import { CRISIS_RESOURCES, CRISIS_TEXT } from "@/lib/crisis/resources";

interface SafeScreenProps {
  onDismiss: () => void;
}

export default function SafeScreen({ onDismiss }: SafeScreenProps) {
  return (
    <div className="fixed inset-0 z-[150] bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-primary text-4xl">favorite</span>
      </div>

      <h2 className="text-2xl font-semibold text-on-surface mb-3 max-w-sm">
        {CRISIS_TEXT.heading}
      </h2>
      <p className="text-on-surface-variant text-base mb-2 max-w-sm leading-relaxed">
        {CRISIS_TEXT.body}
      </p>
      <p className="text-outline text-sm mb-8 max-w-xs">{CRISIS_TEXT.reassurance}</p>

      <div className="w-full max-w-sm space-y-3 mb-8">
        {CRISIS_RESOURCES.map((r) => (
          <a
            key={r.name}
            href={r.phone ? `tel:${r.phone.replace(/\s/g, "")}` : r.chat}
            target={r.chat ? "_blank" : undefined}
            rel={r.chat ? "noopener noreferrer" : undefined}
            className="flex items-center justify-between w-full p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors"
          >
            <div className="text-left">
              <p className="font-semibold text-on-surface text-sm">{r.name}</p>
              <p className="text-outline text-xs">{r.available}</p>
            </div>
            <span className="text-lg font-bold text-primary">{r.phone ?? "Chat"}</span>
          </a>
        ))}
      </div>

      <button
        onClick={onDismiss}
        className="text-sm text-outline hover:text-on-surface transition-colors underline-offset-2 hover:underline"
      >
        {CRISIS_TEXT.returnLabel}
      </button>
    </div>
  );
}
