// KRITIEK: Altijd client-side — keywords NOOIT naar server sturen

const CRISIS_SIGNALS: string[] = [
  "wil niet meer leven",
  "wil dood zijn",
  "einde aan mijn leven",
  "geen zin meer in het leven",
  "zelfmoord",
  "zelfdoding",
  "suïcide",
  "suicide",
  "pillen innemen",
  "mezelf iets aandoen",
  "mezelf snijden",
  "snijden",
  "pols doorsnijden",
  "niet meer hier willen zijn",
  "iedereen beter af zonder mij",
  "ik red het niet meer",
  "het is hopeloos",
  "geen uitweg",
  "niemand kan me helpen",
  "te zwaar om te dragen",
  "wil stoppen met leven",
];

export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: "low" | "medium" | "high";
}

export function detectCrisisSignals(text: string): CrisisDetectionResult {
  const lower = text.toLowerCase();
  const matched = CRISIS_SIGNALS.filter((s) => lower.includes(s));

  return {
    isCrisis: matched.length > 0,
    severity:
      matched.length >= 3 ? "high" : matched.length >= 1 ? "medium" : "low",
  };
}

export function sanitizeForServer(text: string): string {
  return text.slice(0, 2000);
}
