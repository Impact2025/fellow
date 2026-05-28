export const PEER_SUPPORT_CONFIG = {
  maxTextChars: 1500,
  maxAudioSeconds: 180,
  cooldownMinutes: 10,
  maxMessagesPerDay: 10,
  maxActivePeerConnections: 2,
  disclaimer:
    "Fellow Travellers zijn medeherstellenden, geen professionals. Bij crisis: bel 113. Je kunt een verbinding altijd verbreken.",
} as const;

const MODERATION_TRIGGERS = [
  "buiten de app afspreken",
  "telefoonnummer",
  "instagram",
  "whatsapp",
  "telegram",
  "ik vind je mooi",
  "wil je mijn vriendin",
  "wil je mijn vriend",
  "ik ben verliefd",
];

export function moderateMessage(text: string): { ok: boolean; reason?: string } {
  const lower = text.toLowerCase();
  const hit = MODERATION_TRIGGERS.find((t) => lower.includes(t));
  if (hit) return { ok: false, reason: "Dit bericht valt buiten de grenzen van peer-support." };
  if (text.length > PEER_SUPPORT_CONFIG.maxTextChars)
    return { ok: false, reason: "Bericht is te lang." };
  return { ok: true };
}

export function cooldownUntil(sentAt: Date): Date {
  return new Date(sentAt.getTime() + PEER_SUPPORT_CONFIG.cooldownMinutes * 60_000);
}
