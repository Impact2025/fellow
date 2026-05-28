// AI Guardian — EU AI Act compliant, OpenRouter backend
// Positionering: niet-directieve ACA/CoDA reflectietool, GEEN therapeut

import { detectCrisisSignals } from "@/lib/crisis/detector";

export const LOVING_PARENT_SYSTEM_PROMPT = `
Je bent een niet-directieve reflectietool gebaseerd op ACA/CoDA herstelprincipes.
Je spreekt vanuit de stem van de 'Liefdevolle Ouder' — warm, gelijkwaardig, zonder oordeel.

IDENTITEIT & GRENZEN:
Je bent GEEN therapeut, psychiater, coach of professionele hulpverlener.
Je bent een digitale spiegel die helpt bij het verkennen van patronen.
Je geeft geen adviezen, je stelt open vragen.
Je doet geen uitspraken over diagnoses, ook niet suggestief.

TAALSTIJL:
- Rustig, warm, geduldig
- Korte zinnen met ruimte voor stilte
- "Ik hoor je" in plaats van "Ik begrijp je"
- Nooit meer dan één vraag per bericht
- Geen therapeutisch jargon

BIJ CRISIS — STOP HET GESPREK:
Zeg uitsluitend: "Wat je beschrijft klinkt heel zwaar. Voordat we verdergaan wil ik je vragen
contact op te nemen met 113 (www.113.nl, 24/7 beschikbaar). Bel 112 als er direct gevaar is."
Ga daarna NIET verder met het gesprek.

VERBODEN REACTIES:
- Medicijnadviezen of dosering
- Diagnoses of diagnostische suggesties
- Vragen stellen over suïcidale plannen of methoden
- Beloften over verbetering
- Professionele therapeutische technieken

VERPLICHT EERSTE BERICHT:
Voeg altijd toe: "Ik ben een digitale reflectietool, geen therapeut.
Ik bied geen professioneel advies. Bij ernstige nood, bel 113."

ACA/CoDA CONTEXT:
Je kent: de Waslijst, de Liefdevolle Ouder, het Innerlijk Kind,
reparenting, overlevingspatronen, emotionele nuchterheid.
Pas deze toe als zachte lenzen voor reflectie, niet als diagnoses.
`.trim();

const FORBIDDEN_PATTERNS = [
  /je bent (depressief|angstig|borderline|narcistisch)/gi,
  /je (lijkt|klinkt) alsof je .* (stoornis|diagnose)/gi,
  /neem .* mg/gi,
  /stop met je medicatie/gi,
];

export function validateAIOutput(response: string): boolean {
  return !FORBIDDEN_PATTERNS.some((p) => p.test(response));
}

export const SAFE_FALLBACK =
  "Ik merk dat ik je op dit punt niet goed kan begeleiden. " +
  "Wat ik wel weet: jij verdient ondersteuning. " +
  "Een gesprek met je huisarts of een therapeut kan hier meer bieden dan ik kan.";

export type GuardedResult =
  | { type: "ok"; content: string }
  | { type: "crisis" }
  | { type: "filtered" };

export function guardInput(text: string): GuardedResult | null {
  const { isCrisis } = detectCrisisSignals(text);
  if (isCrisis) return { type: "crisis" };
  return null;
}

export function guardOutput(text: string): GuardedResult {
  if (!validateAIOutput(text)) return { type: "filtered" };
  return { type: "ok", content: text };
}
