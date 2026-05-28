export type RecoveryPath = "aca" | "coda" | "both" | "exploring";
export type SupportNeed = "listen" | "share" | "understand" | "accountability";
export type AvailabilitySlot = "morning" | "afternoon" | "evening" | "weekend";
export type Language = "nl" | "en" | "both";

export interface OnboardingProfile {
  alias: string;
  postcode: string;
  city: string;
  province: string;
  provinceCode: string;
  recoveryPath: RecoveryPath;
  recoveryStage: 1 | 2 | 3 | 4 | 5;
  supportNeeds: SupportNeed[];
  availability: AvailabilitySlot[];
  language: Language;
}

export interface MatchVector {
  sessionHash: string;
  alias: string;
  vector: number[];
  regionCode: string;
}

export interface MatchCandidate {
  alias: string;
  score: number;
  label: "sterk" | "goed" | "mogelijk";
  tags: string[];
  colorClass: string;
  accentColor: string;
}
