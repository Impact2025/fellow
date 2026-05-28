import type { OnboardingProfile } from "./types";

// 13-dimensionale vector — alle waarden 0.0 – 1.0
// Dimensies: [aca, coda, stage, listen, share, understand, accountability,
//             morning, afternoon, evening, weekend, langNl, langEn]
export function buildVector(p: OnboardingProfile): number[] {
  const aca = p.recoveryPath === "aca" || p.recoveryPath === "both" ? 1 : 0;
  const coda = p.recoveryPath === "coda" || p.recoveryPath === "both" ? 1 : 0;
  const stage = (p.recoveryStage - 1) / 4;

  const listen = p.supportNeeds.includes("listen") ? 1 : 0;
  const share = p.supportNeeds.includes("share") ? 1 : 0;
  const understand = p.supportNeeds.includes("understand") ? 1 : 0;
  const accountability = p.supportNeeds.includes("accountability") ? 1 : 0;

  const morning = p.availability.includes("morning") ? 1 : 0;
  const afternoon = p.availability.includes("afternoon") ? 1 : 0;
  const evening = p.availability.includes("evening") ? 1 : 0;
  const weekend = p.availability.includes("weekend") ? 1 : 0;

  const langNl = p.language === "nl" || p.language === "both" ? 1 : 0;
  const langEn = p.language === "en" || p.language === "both" ? 1 : 0;

  return [aca, coda, stage, listen, share, understand, accountability,
          morning, afternoon, evening, weekend, langNl, langEn];
}

export async function hashSessionId(sessionId: string): Promise<string> {
  const data = new TextEncoder().encode(sessionId);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
