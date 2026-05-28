import type { MatchCandidate } from "./types";

const ADJACENT: Record<string, string[]> = {
  GR: ["FR", "DR"],
  FR: ["GR", "DR"],
  DR: ["GR", "FR", "OV"],
  OV: ["DR", "GE", "FL"],
  FL: ["NH", "OV", "GE", "UT"],
  GE: ["OV", "FL", "UT", "ZH", "NB", "LI"],
  UT: ["NH", "FL", "GE", "ZH"],
  NH: ["FL", "UT", "ZH"],
  ZH: ["NH", "UT", "GE", "ZE", "NB"],
  ZE: ["ZH", "NB"],
  NB: ["ZH", "ZE", "GE", "LI"],
  LI: ["GE", "NB"],
};

// Alias → deterministische kleur (geen random per render)
const PALETTE = [
  { colorClass: "bg-primary-container/20", accentColor: "#476553" },
  { colorClass: "bg-secondary-container/20", accentColor: "#4b6173" },
  { colorClass: "bg-tertiary-fixed/20", accentColor: "#8a4f38" },
];

function regionScore(a: string, b: string): number {
  if (!a || !b || a === "XX" || b === "XX") return 0.3;
  if (a === b) return 1;
  if ((ADJACENT[a] ?? []).includes(b)) return 0.5;
  return 0;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function matchLabel(score: number): MatchCandidate["label"] {
  if (score >= 0.75) return "sterk";
  if (score >= 0.50) return "goed";
  return "mogelijk";
}

function buildTags(myVec: number[], theirVec: number[]): string[] {
  const tags: string[] = [];
  // Herstelpad overlap
  if (myVec[0] === 1 && theirVec[0] === 1) tags.push("ACA");
  if (myVec[1] === 1 && theirVec[1] === 1) tags.push("CoDA");
  // Taaloverlap
  if (myVec[11] === 1 && theirVec[11] === 1) tags.push("Nederlands");
  else if (myVec[12] === 1 && theirVec[12] === 1) tags.push("English");
  // Beschikbaarheidoverlap
  const slots = ["Ochtend", "Middag", "Avond", "Weekend"];
  const slotOffset = 7;
  for (let i = 0; i < 4; i++) {
    if (myVec[slotOffset + i] === 1 && theirVec[slotOffset + i] === 1) {
      tags.push(slots[i]);
      break; // max één tijdstip-tag
    }
  }
  return tags.slice(0, 3);
}

interface RawProfile {
  alias: string;
  vector: number[];
  regionCode: string;
}

export function scoreProfiles(
  mine: RawProfile,
  others: RawProfile[]
): MatchCandidate[] {
  return others
    .map((other, i) => {
      const content = cosineSimilarity(mine.vector, other.vector);
      const region = regionScore(mine.regionCode, other.regionCode);
      const score = 0.85 * content + 0.15 * region;
      const palette = PALETTE[i % PALETTE.length];
      return {
        alias: other.alias,
        score,
        label: matchLabel(score),
        tags: buildTags(mine.vector, other.vector),
        ...palette,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
