"use client";

import { useState, useEffect } from "react";

const SESSION_KEY = "ft_session_id_v1";

export function useSession(): string | null {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      setSessionId(stored);
      return;
    }
    fetch("/api/session", { method: "POST" })
      .then((r) => r.json())
      .then((data: { sessionId: string }) => {
        localStorage.setItem(SESSION_KEY, data.sessionId);
        setSessionId(data.sessionId);
      })
      .catch(() => {
        const fallback = crypto.randomUUID();
        localStorage.setItem(SESSION_KEY, fallback);
        setSessionId(fallback);
      });
  }, []);

  return sessionId;
}
