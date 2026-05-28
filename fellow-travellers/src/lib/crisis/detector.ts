// KRITIEK: Altijd client-side — keywords NOOIT naar server sturen

// Directe signalen
const CRISIS_SIGNALS: string[] = [
  // Expliciete doodswens
  "wil niet meer leven",
  "wil dood zijn",
  "wil dood",
  "liever dood",
  "dood willen zijn",
  "dood zijn is beter",
  "einde aan mijn leven",
  "een einde aan mijn bestaan",
  "leven beëindigen",
  "mijn leven beëindigen",
  "geen zin meer in het leven",
  "wil stoppen met leven",
  "ophouden met leven",
  "niet meer willen leven",
  "er niet meer willen zijn",

  // Suïcidale termen NL/BE
  "zelfmoord",
  "zelfdoding",
  "suïcide",
  "suicide",
  "me van kant maken",
  "mezelf van kant",
  "van kant gaan",

  // Methoden
  "pillen innemen",
  "te veel pillen",
  "overdosis",
  "mezelf iets aandoen",
  "mezelf snijden",
  "pols doorsnijden",
  "mezelf beschadigen",
  "mezelf pijn doen",

  // Eufemismen & metaforen
  "voor altijd slapen",
  "voor altijd rusten",
  "niet meer wakker worden",
  "nooit meer wakker worden",
  "levensmoe",
  "moe van het leven",
  "moe van mijn leven",

  // Omschrijvingen wanhoop/isolatie
  "iedereen beter af zonder mij",
  "niemand zou me missen",
  "niemand kan me helpen",
  "ik red het niet meer",
  "het is hopeloos",
  "geen uitweg",
  "geen uitweg meer",
  "te zwaar om te dragen",
  "niet meer hier willen zijn",
  "ik verdien het niet om te leven",
];

// Soft patronen voor complexere uitdrukkingen (regex)
const SOFT_CRISIS_PATTERNS: RegExp[] = [
  /voor altijd (slapen|rusten|weg zijn)/i,
  /niet meer (wakker worden|bestaan|hier zijn)/i,
  /een einde maken aan (mijn|het|alles)/i,
  /wereld (verlaten|achter me laten)/i,
  /iedereen (is )?beter af zonder/i,
  /niemand zou (me|het) (missen|merken)/i,
  /te (moe|mop) om (nog )?door te gaan/i,
];

export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: "low" | "medium" | "high";
  matchedKeywords: number;
}

export function detectCrisisSignals(text: string): CrisisDetectionResult {
  const lower = text.toLowerCase();
  const keywordMatches = CRISIS_SIGNALS.filter((s) => lower.includes(s));
  const patternMatch = SOFT_CRISIS_PATTERNS.some((p) => p.test(text));

  const total = keywordMatches.length + (patternMatch ? 1 : 0);

  return {
    isCrisis: total > 0,
    severity: total >= 3 ? "high" : total >= 1 ? "medium" : "low",
    matchedKeywords: total,
  };
}

export function sanitizeForServer(text: string): string {
  return text.slice(0, 2000);
}
