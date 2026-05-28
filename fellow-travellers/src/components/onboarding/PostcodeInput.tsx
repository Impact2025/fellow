"use client";

import { useState, useEffect, useRef } from "react";

interface Result {
  city: string;
  province: string;
  provinceCode: string;
}

interface Props {
  onConfirm: (postcode: string, city: string, province: string, provinceCode: string) => void;
  onSkip: () => void;
}

function formatPostcode(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  const letters = raw.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
  if (digits.length === 4 && letters.length > 0) return `${digits} ${letters}`;
  return digits;
}

function isComplete(raw: string): boolean {
  return /^\d{4}\s?[a-zA-Z]{2}$/.test(raw.trim());
}

export default function PostcodeInput({ onConfirm, onSkip }: Props) {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clean = raw.trim().replace(/\s/g, "");
    if (!isComplete(raw)) {
      setResult(null);
      setError(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/postcode?code=${encodeURIComponent(clean)}`);
        const data = await res.json() as Result & { error?: string };
        if (!res.ok || data.error) {
          setError("Postcode niet gevonden — probeer een ander nummer.");
          setResult(null);
        } else {
          setResult(data);
        }
      } catch {
        setError("Verbindingsfout — controleer je internet.");
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [raw]);

  return (
    <div className="space-y-3 w-full">
      <div className="relative">
        <input
          type="text"
          inputMode="text"
          autoComplete="postal-code"
          placeholder="1234 AB"
          value={raw}
          onChange={(e) => setRaw(formatPostcode(e.target.value))}
          maxLength={7}
          className="w-full bg-surface-container-lowest rounded-2xl px-5 py-3.5 text-body-md text-on-surface tracking-widest focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-outline-variant"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>

      {result && (
        <div className="px-4 py-3 bg-primary-fixed/30 rounded-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
          <div>
            <p className="text-label-md text-on-surface">{result.city}</p>
            <p className="text-label-sm text-on-surface-variant">{result.province}</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-label-sm text-error px-1">{error}</p>
      )}

      <div className="flex gap-2 pt-1">
        {result && (
          <button
            onClick={() => onConfirm(raw.trim(), result.city, result.province, result.provinceCode)}
            className="flex-1 bg-primary text-on-primary rounded-full py-3 text-label-md active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            Gebruik {result.city}
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        )}
        <button
          onClick={onSkip}
          className={`${result ? "px-5" : "flex-1"} border border-outline-variant text-on-surface-variant rounded-full py-3 text-label-md active:scale-95 transition-transform`}
        >
          Liever niet
        </button>
      </div>
    </div>
  );
}
