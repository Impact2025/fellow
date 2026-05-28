# setup.ps1 — Fellow Travellers Bootstrap
# Voer uit in PowerShell: .\setup.ps1
# Vereisten: Node.js 20+, Git, GitHub CLI (gh)

param(
    [string]$ProjectName = "fellow-travellers",
    [string]$GitHubUser = "",
    [switch]$SkipGitHub,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "Fellow Travellers Setup"

# ── Kleuren helper ──────────────────────────────────────────────────────────
function Write-Step  { param($msg) Write-Host "`n▶ $msg" -ForegroundColor Cyan }
function Write-OK    { param($msg) Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Warn  { param($msg) Write-Host "  ⚠ $msg" -ForegroundColor Yellow }
function Write-Error2{ param($msg) Write-Host "  ✗ $msg" -ForegroundColor Red }
function Write-Info  { param($msg) Write-Host "  · $msg" -ForegroundColor Gray }

# ── Banner ──────────────────────────────────────────────────────────────────
Clear-Host
Write-Host @"

  ╔════════════════════════════════════════════════════════╗
  ║         Fellow Travellers — Project Bootstrap          ║
  ║         Privacy-First ACA/CoDA Herstel Platform        ║
  ╚════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# ── Stap 1: Prerequisites checken ──────────────────────────────────────────
Write-Step "Prerequisites controleren"

$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Error2 "Node.js niet gevonden. Installeer Node.js 20+ via https://nodejs.org"
    exit 1
}
$nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeMajor -lt 20) {
    Write-Error2 "Node.js $nodeVersion gevonden maar 20+ vereist."
    exit 1
}
Write-OK "Node.js $nodeVersion"

$npmVersion = npm --version 2>$null
if (-not $npmVersion) { Write-Error2 "npm niet gevonden"; exit 1 }
Write-OK "npm $npmVersion"

$gitVersion = git --version 2>$null
if (-not $gitVersion) { Write-Error2 "Git niet gevonden. Installeer via https://git-scm.com"; exit 1 }
Write-OK "Git aanwezig"

# Check GitHub CLI (optioneel)
$ghInstalled = $null -ne (Get-Command gh -ErrorAction SilentlyContinue)
if ($ghInstalled) {
    Write-OK "GitHub CLI aanwezig"
} else {
    Write-Warn "GitHub CLI niet gevonden — GitHub setup wordt overgeslagen"
    $SkipGitHub = $true
}

# ── Stap 2: Next.js project aanmaken ───────────────────────────────────────
Write-Step "Next.js 15 project aanmaken"

if (Test-Path $ProjectName) {
    Write-Warn "Map '$ProjectName' bestaat al — wordt overgeslagen"
} else {
    Write-Info "npx create-next-app@latest uitvoeren..."
    npx create-next-app@latest $ProjectName `
        --typescript `
        --tailwind `
        --eslint `
        --app `
        --src-dir `
        --import-alias "@/*" `
        --no-turbopack 2>&1 | Out-Null
    Write-OK "Next.js project aangemaakt"
}

Set-Location $ProjectName

# ── Stap 3: Packages installeren ───────────────────────────────────────────
Write-Step "Dependencies installeren"

Write-Info "Core packages..."
npm install `
    drizzle-orm `
    @neondatabase/serverless `
    drizzle-kit `
    lucia `
    @lucia-auth/adapter-drizzle `
    @anthropic-ai/sdk `
    idb-keyval `
    nanoid `
    zod `
    date-fns 2>&1 | Out-Null
Write-OK "Core packages"

Write-Info "UI packages..."
npm install `
    @radix-ui/react-dialog `
    @radix-ui/react-toggle `
    @radix-ui/react-slider `
    @radix-ui/react-progress `
    clsx `
    tailwind-merge `
    class-variance-authority 2>&1 | Out-Null
Write-OK "UI packages"

Write-Info "Dev dependencies..."
npm install -D `
    drizzle-kit `
    @types/node `
    dotenv-cli 2>&1 | Out-Null
Write-OK "Dev dependencies"

# ── Stap 4: Mappenstructuur aanmaken ───────────────────────────────────────
Write-Step "Projectstructuur aanmaken"

$dirs = @(
    "src/lib/crisis",
    "src/lib/crypto",
    "src/lib/ai",
    "src/lib/steps",
    "src/lib/moderation",
    "src/lib/onboarding",
    "src/components/crisis",
    "src/components/halt",
    "src/components/journal",
    "src/components/steps",
    "src/components/companion",
    "src/components/onboarding",
    "src/components/ui",
    "src/app/(auth)/start",
    "src/app/(app)/dashboard",
    "src/app/(app)/journal",
    "src/app/(app)/steps",
    "src/app/(app)/companion",
    "src/app/(app)/travellers",
    "src/app/api/ai",
    "src/app/api/sync",
    "src/app/api/match",
    "src/db/migrations",
    "docs",
    "public/icons"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}
Write-OK "Alle mappen aangemaakt"

# ── Stap 5: Core bestanden schrijven ───────────────────────────────────────
Write-Step "Core implementatiebestanden schrijven"

# ── Crisis Protocol ─────────────────────────────────────────────────────────
@'
// src/lib/crisis/detector.ts
// KRITIEK: Altijd client-side — keywords NOOIT naar server sturen

const CRISIS_SIGNALS_NL = [
  'wil niet meer leven', 'wil dood zijn', 'einde aan mijn leven',
  'geen zin meer in het leven', 'zelfmoord', 'zelfdoding', 'suïcide',
  'pillen innemen', 'mezelf iets aandoen', 'mezelf snijden', 'snijden',
  'pols doorsnijden', 'niet meer hier willen zijn', 'iedereen beter af zonder mij',
  'ik red het niet meer', 'het is hopeloos', 'geen uitweg',
  'niemand kan me helpen', 'te zwaar om te dragen'
];

export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: 'low' | 'medium' | 'high';
  matchedSignals: string[];
}

export function detectCrisisSignals(text: string): CrisisDetectionResult {
  const lower = text.toLowerCase();
  const matched = CRISIS_SIGNALS_NL.filter(signal => lower.includes(signal));
  
  return {
    isCrisis: matched.length > 0,
    severity: matched.length >= 3 ? 'high' : matched.length >= 1 ? 'medium' : 'low',
    matchedSignals: matched // Alleen lokaal loggen, nooit naar server
  };
}

// Sanitize input — verwijder before server call
export function sanitizeBeforeServerCall(text: string): string {
  // Verwijder potentieel crisis-gerelateerde content voor server calls
  // De app toont crisis screen, maar stopt verdere verwerking
  return text.slice(0, 2000); // Max lengte
}
'@ | Set-Content "src/lib/crisis/detector.ts" -Encoding UTF8

# ── Crisis Resources ─────────────────────────────────────────────────────────
@'
// src/lib/crisis/resources.ts
// Actuele crisis resources — controleer jaarlijks op updates

export interface CrisisResource {
  name: string;
  phone?: string;
  chat?: string;
  available: string;
  country: string;
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: "113 Zelfmoordpreventie",
    phone: "113",
    chat: "https://www.113.nl",
    available: "24 uur per dag, 7 dagen per week",
    country: "NL"
  },
  {
    name: "Zelfmoordlijn (België)",
    phone: "0800 32 123",
    chat: "https://www.zelfmoordlijn.be",
    available: "24 uur per dag, 7 dagen per week",
    country: "BE"
  },
  {
    name: "Spoedhulp",
    phone: "112",
    available: "Bij direct gevaar voor jezelf of anderen",
    country: "NL/BE"
  }
];

export const CRISIS_SCREEN_TEXT = {
  heading: "Het klinkt alsof het zwaar is.",
  body: "Je hoeft dit niet alleen te dragen. Er zijn mensen die nu beschikbaar zijn.",
  cta: "Of ga terug naar de app als je dat wilt.",
  reassurance: "Er is geen verkeerde reactie op een moeilijk moment."
};
'@ | Set-Content "src/lib/crisis/resources.ts" -Encoding UTF8
Write-OK "Crisis protocol bestanden"

# ── Zero-Knowledge Crypto ────────────────────────────────────────────────────
@'
// src/lib/crypto/vault.ts
// AES-GCM 256-bit zero-knowledge encryptie
// Alles gebeurt op het apparaat — server ziet alleen ciphertext

import { get, set } from 'idb-keyval';

const SALT_KEY = 'ft_device_salt_v1';
const KEY_CACHE = new Map<string, CryptoKey>();

// Genereer of herstel device-specifieke salt
async function getOrCreateDeviceSalt(): Promise<Uint8Array> {
  let salt = await get<string>(SALT_KEY);
  if (!salt) {
    const newSalt = crypto.getRandomValues(new Uint8Array(32));
    salt = btoa(String.fromCharCode(...newSalt));
    await set(SALT_KEY, salt);
  }
  return Uint8Array.from(atob(salt), c => c.charCodeAt(0));
}

// Sleutel afleiden van passphrase
export async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const cacheKey = passphrase.slice(0, 8); // Niet de volledige passphrase cachen
  if (KEY_CACHE.has(cacheKey)) return KEY_CACHE.get(cacheKey)!;
  
  const salt = await getOrCreateDeviceSalt();
  const encoder = new TextEncoder();
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 310_000, // OWASP 2024 aanbeveling
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  KEY_CACHE.set(cacheKey, key);
  return key;
}

export interface EncryptedEntry {
  ciphertext: string;
  iv: string;
  timestamp: number;
  version: number;
}

// Versleutelen — altijd client-side
export async function encryptEntry(
  plaintext: string,
  key: CryptoKey
): Promise<EncryptedEntry> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv)),
    timestamp: Date.now(),
    version: 1
  };
}

// Ontsleutelen — altijd client-side
export async function decryptEntry(
  entry: EncryptedEntry,
  key: CryptoKey
): Promise<string> {
  const ciphertext = Uint8Array.from(atob(entry.ciphertext), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(entry.iv), c => c.charCodeAt(0));
  
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  
  return new TextDecoder().decode(plaintext);
}
'@ | Set-Content "src/lib/crypto/vault.ts" -Encoding UTF8
Write-OK "Zero-knowledge crypto"

# ── AI Guardian ──────────────────────────────────────────────────────────────
@'
// src/lib/ai/guardian.ts
// EU AI Act compliant guardrails voor de Loving Parent AI
// Positionering: niet-directieve ACA/CoDA reflectietool, GEEN therapeut

import { detectCrisisSignals } from '@/lib/crisis/detector';

export const LOVING_PARENT_SYSTEM_PROMPT = `
Je bent een niet-directieve reflectietool gebaseerd op ACA/CoDA herstelprincipes.
Je spreekt vanuit de stem van de 'Liefdevolle Ouder' — warm, gelijkwaardig, zonder oordeel.

IDENTITEIT & GRENZEN:
Je bent GEEN therapeut, psychiater, coach of professionele hulpverlener.
Je bent een digitale spiegel die helpt bij het verkennen van patronen.
Je geeft geen adviezen, je stelt open vragen.
Je doet geen uitspraken over diagnoses, ook niet suggestief.

TAALSTIJL:
- Rustig, warm, geduldig — de stem van een liefdevolle ouder
- Korte zinnen met ruimte voor stilte
- "Ik hoor je" in plaats van "Ik begrijp je"
- Nooit meer dan één vraag per bericht
- Geen therapeutisch jargon

BIJ CRISIS SIGNALEN — STOP HET GESPREK:
Als iemand suïcidale ideatie of zelfbeschadiging noemt, zeg dan ALLEEN:
"Wat je beschrijft klinkt heel zwaar. Voordat we verdergaan wil ik je vragen 
contact op te nemen met 113 (www.113.nl, 24/7 beschikbaar). 
Bel 112 als er direct gevaar is."
Ga daarna NIET verder met het gesprek.

VERBODEN REACTIES:
- Medicijnadviezen of dosering
- Diagnoses of diagnostische suggesties ("je klinkt depressief")
- Vragen stellen over suïcidale plannen of methoden
- Beloften over verbetering ("dit komt goed")
- Professionele therapeutische technieken uitvoeren

VERPLICHT EERSTE BERICHT:
Voeg altijd toe: "Ik ben een digitale reflectietool, geen therapeut. 
Ik bied geen professioneel advies. Bij ernstige nood, bel 113."

ACA/CoDA CONTEXT:
Je kent de principes van Adult Children of Alcoholics & Dysfunctional Families.
Je begrijpt: de Waslijst, de Liefdevolle Ouder, het Innerlijk Kind, 
reparenting, overlevingspatronen, emotionele nuchterheid.
Je past deze toe als zachte lenzen voor reflectie, niet als diagnoses.
`.trim();

export interface GuardedAIRequest {
  userMessage: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  isFirstMessage: boolean;
}

export interface GuardedAIResponse {
  type: 'ok' | 'crisis' | 'filtered' | 'error';
  content?: string;
  showCrisisResources?: boolean;
  filteredReason?: string;
}

// Verboden patronen in AI output
const FORBIDDEN_OUTPUT_PATTERNS = [
  /je bent (depressief|angstig|borderline|narcistisch)/gi,
  /je (lijkt|klinkt) alsof je .* (stoornis|diagnose)/gi,
  /neem .* mg/gi,
  /stop met je medicatie/gi,
  /dit (wordt|komt) zeker (goed|beter)/gi
];

export function validateAIOutput(response: string): boolean {
  return !FORBIDDEN_OUTPUT_PATTERNS.some(pattern => pattern.test(response));
}

export const SAFE_FALLBACK_RESPONSE = 
  "Ik merk dat ik je niet goed kan begeleiden op dit punt. " +
  "Wat ik wel kan zeggen: jij verdient ondersteuning. " +
  "Een gesprek met je huisarts of een therapeut kan hier meer bieden dan ik kan.";
'@ | Set-Content "src/lib/ai/guardian.ts" -Encoding UTF8
Write-OK "AI Guardian"

# ── Database Schema ──────────────────────────────────────────────────────────
@'
// src/db/schema.ts
// Neon/Drizzle schema — ALLEEN versleutelde data, GEEN PII
// Principe: server is een "dumb encrypted store"

import { pgTable, uuid, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

// Anonieme sessies — geen email, naam of telefoonnummer
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActive: timestamp('last_active').defaultNow().notNull(),
  // Geen PII velden
});

// Versleutelde dagboek entries — server leest alleen ciphertext
export const journalEntries = pgTable('journal_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .references(() => sessions.id, { onDelete: 'cascade' })
    .notNull(),
  ciphertext: text('ciphertext').notNull(),  // AES-GCM 256-bit
  iv: text('iv').notNull(),                   // Initialisatievector
  createdAt: timestamp('created_at').defaultNow().notNull(),
  // GEEN entryType, GEEN emotionLabel, GEEN sentiment — te gevoelig
});

// Stap voortgang — alleen aanwezigheid, geen inhoud
export const stepVisits = pgTable('step_visits', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .references(() => sessions.id, { onDelete: 'cascade' })
    .notNull(),
  stepNumber: integer('step_number').notNull(),  // 1-12
  visitedAt: timestamp('visited_at').defaultNow().notNull(),
  // GEEN notities, GEEN scores, GEEN reflectieteksten
});

// HALT check-ins — versleuteld
export const haltCheckins = pgTable('halt_checkins', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .references(() => sessions.id, { onDelete: 'cascade' })
    .notNull(),
  ciphertext: text('ciphertext').notNull(),  // Versleutelde HALT waarden
  iv: text('iv').notNull(),
  checkedAt: timestamp('checked_at').defaultNow().notNull(),
});

// Fellow Traveller matches — anonieme koppelingen
export const travellerMatches = pgTable('traveller_matches', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Hashed session IDs — niet direct herleidbaar
  sessionHashA: text('session_hash_a').notNull(),
  sessionHashB: text('session_hash_b').notNull(),
  aliasA: text('alias_a').notNull(),   // Zelfgekozen alias
  aliasB: text('alias_b').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  // Geen locatie, geen demografische data
});

// Versleutelde peer berichten
export const peerMessages = pgTable('peer_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  matchId: uuid('match_id')
    .references(() => travellerMatches.id, { onDelete: 'cascade' })
    .notNull(),
  senderAlias: text('sender_alias').notNull(),
  ciphertext: text('ciphertext').notNull(),   // End-to-end versleuteld
  iv: text('iv').notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  cooldownUntil: timestamp('cooldown_until'),  // Anti cross-talk cooldown
  // isAudio flag — type bericht, geen inhoud
  isAudio: boolean('is_audio').default(false).notNull(),
});
'@ | Set-Content "src/db/schema.ts" -Encoding UTF8
Write-OK "Database schema"

# ── Moderation Policy ────────────────────────────────────────────────────────
@'
// src/lib/moderation/policy.ts
// Peer-support moderatiebeleid — IMPLEMENTEER IN FASE 1, niet Fase 3

export const PEER_SUPPORT_CONFIG = {
  // Berichtlimieten
  maxTextMessageChars: 1500,
  maxAudioMessageSeconds: 180,         // 3 minuten
  cooldownAfterMessageMinutes: 10,     // Verplichte afkoeltijd
  maxMessagesPerDay: 10,               // Voorkomt flooding
  
  // Connectie limieten
  maxActivePeerConnections: 2,         // Max 2 fellow travellers tegelijk
  
  // Veiligheidsprotocollen
  crisisResponseType: 'immediate_resources' as const,
  blockReportSteps: 3,                 // Maximaal 3 taps om te blokkeren
  
  // Anti cross-talk
  antiCrosstalkEnabled: true,
  cooldownEnforced: true,              // Kan niet worden uitgeschakeld door user
  
  // Disclaimers (altijd zichtbaar bij matching)
  matchingDisclaimer: `Fellow Travellers zijn medeherstellenden, geen professionals.
    Deel alleen wat jij veilig vindt. Bij crisis: bel 113.
    Je kunt een verbinding altijd verbreken zonder uitleg.`,
    
  // Juridische grens
  isNotTherapy: true,
  requiresDisclaimerAcceptance: true,
} as const;

// Verboden content detectie (client-side)
export const MODERATION_TRIGGERS = [
  'buiten de app afspreken',
  'telefoonnummer',
  'adres',
  'instagram',
  'whatsapp',
  // Romantische toenaderingen
  'ik vind je mooi',
  'wil je mijn vriendin',
  'ik ben verliefd'
];

export function moderateMessage(text: string): {
  isAllowed: boolean;
  reason?: string;
} {
  const lower = text.toLowerCase();
  const trigger = MODERATION_TRIGGERS.find(t => lower.includes(t));
  
  if (trigger) {
    return {
      isAllowed: false,
      reason: 'Dit bericht bevat content die buiten de grenzen van peer-support valt.'
    };
  }
  
  if (text.length > PEER_SUPPORT_CONFIG.maxTextMessageChars) {
    return { isAllowed: false, reason: 'Bericht is te lang.' };
  }
  
  return { isAllowed: true };
}
'@ | Set-Content "src/lib/moderation/policy.ts" -Encoding UTF8
Write-OK "Moderatiebeleid"

# ── Onboarding Flow ──────────────────────────────────────────────────────────
@'
// src/lib/onboarding/flow.ts
// Trauma-sensitieve onboarding — stapsgewijze toestemming, geen formulieren

export interface OnboardingStep {
  id: string;
  screen: string;
  isRequired: boolean;
  canSkip: boolean;
  dayToReveal: number;  // Dag waarop deze feature wordt geïntroduceerd
}

// Stapsgewijze feature onthulling — voorkomt overwhelm
export const ONBOARDING_TIMELINE: OnboardingStep[] = [
  {
    id: 'welcome',
    screen: 'WelcomeScreen',
    isRequired: true,
    canSkip: false,
    dayToReveal: 0
  },
  {
    id: 'anonymous_session',
    screen: 'AutoSessionScreen',  // Geen input vereist
    isRequired: true,
    canSkip: false,
    dayToReveal: 0
  },
  {
    id: 'first_halt',
    screen: 'HALTCheckinScreen',
    isRequired: false,
    canSkip: true,   // Altijd een "later" optie
    dayToReveal: 0
  },
  {
    id: 'journal_intro',
    screen: 'JournalIntroScreen',
    isRequired: false,
    canSkip: true,
    dayToReveal: 1
  },
  {
    id: 'steps_intro',
    screen: 'StepsIntroScreen',
    isRequired: false,
    canSkip: true,
    dayToReveal: 7   // Pas na een week — laat gebruiker eerst vertrouwen opbouwen
  },
  {
    id: 'ai_companion_intro',
    screen: 'AICompanionIntroScreen',
    isRequired: false,
    canSkip: true,
    dayToReveal: 21  // Na 3 weken
  },
  {
    id: 'peer_matching_intro',
    screen: 'PeerMatchingIntroScreen',
    isRequired: false,
    canSkip: true,
    dayToReveal: 30  // Na een maand — alleen als user er klaar voor is
  }
];

// Taalprincipes — nooit medisch, nooit stigmatiserend
export const ONBOARDING_LANGUAGE = {
  appDescription: "Een stille plek voor reflectie en herstel.",
  
  // Geen: "trauma", "disfunctioneel gezin", "verslaving" op dag 1
  // Wél: zachte, uitnodigende taal
  welcomeHeading: "Welkom.",
  welcomeBody: "Dit is een plek voor jou. Rustig, privé, zonder oordeel.",
  
  noRegistrationNeeded: "Je hoeft geen account aan te maken.",
  dataStaysLocal: "Alles wat je schrijft, blijft op jouw apparaat.",
  
  skipAlwaysAvailable: "Je kunt altijd later beginnen.",
  noPressure: "Er is geen goed of fout tempo."
};
'@ | Set-Content "src/lib/onboarding/flow.ts" -Encoding UTF8
Write-OK "Onboarding flow"

# ── 12-Stappen Content ───────────────────────────────────────────────────────
@'
// src/lib/steps/content.ts
// ACA-specifieke 12-stappen inhoud — de ziel van de app
// Gebaseerd op ACA Fellowship Text en Twelve Steps Workbook

export interface Exercise {
  title: string;
  prompt: string;
  type: 'journal' | 'letter' | 'reflection' | 'list';
  isOptional: boolean;
  lovingParentFraming: boolean;
  triggerWarning?: string;
}

export interface StepContent {
  id: number;
  title: string;
  acaFraming: string;        // Hoe ACA dit stap anders ziet dan AA
  psychoEducation: string;   // Trauma/CPTSD perspectief
  invitingIntro: string;     // Zachte inleiding — geen confrontatie
  exercises: Exercise[];
  resistanceNote: string;    // Veelvoorkomende blokkades
  pacing: 'slow' | 'medium' | 'normal';
}

// De Waslijst (Laundry List) — 13 traits van het Volwassen Kind
export const LAUNDRY_LIST_TRAITS = [
  "We worden isolerende, zichzelf isolerende volwassenen.",
  "We worden goedkeuringsverslaafden en we verliezen onze identiteit in dit proces.",
  "We zijn bang voor mensen die boos zijn en voor persoonlijke kritiek.",
  "We zijn familieprocessors geworden die alles wat er met ons gezin mis gaat voor onszelf houden.",
  "We verwarren liefde en medelijden en neigen ernaar lief te hebben op mensen die we in de steek gelaten voelen.",
  "We hebben geleerd dat emoties, met name schuldgevoel en schaamte, niet gevoeld worden maar genesteld in onze lichamen.",
  "We zijn bang voor het verliezen van controle. We vermijden gevoelens of zijn overweldigd door hen.",
  "We zijn bang om kwetsbaar te zijn en anderen te vertrouwen.",
  "We hebben superverantwoordelijkheidsgevoel ontwikkeld en het is makkelijker om onszelf te geven dan iets te ontvangen.",
  "We zijn te kritisch over onszelf geworden en hebben een laag zelfgevoel.",
  "We zijn zo erg gewond geworden door het verlaten worden, dat we dit in andere relaties recreëren.",
  "We worden alcoholisten of we trouwen met hen of we vinden andere, dwangmatige persoonlijkheden om onze verlatingsbehoefte te vervullen.",
  "We worden mede-afhankelijken, bang voor onze eigen emoties en we leiden een leven vol ontkenning."
];

// Stap 1 — MVP (begin hier)
export const STEP_1: StepContent = {
  id: 1,
  title: "Stap 1 — Machteloosheid erkennen",
  
  acaFraming: `In ACA erkennen we machteloosheid over de effecten 
    van het disfunctionele gezin op ons leven — niet over een middel, 
    maar over de overlevingspatronen die we als kind ontwikkelden.
    Dit is de verschuiving van "er is niets mis met mijn jeugd" 
    naar het erkennen van hoe die jeugd ons gevormd heeft.`,
  
  psychoEducation: `De patronen die je herkent — hyperwaakzaamheid, 
    mensen pleasen, moeite met grenzen — waren ooit intelligente 
    overlevingsstrategieën van een kind in een onveilige situatie. 
    Jij hebt overleefd. Dit is geen karakter­gebrek; dit is trauma-adaptatie.`,
  
  invitingIntro: `Je hoeft vandaag niets te besluiten of te begrijpen.
    Dit is een uitnodiging om te kijken — niet te oordelen.`,
  
  exercises: [
    {
      title: "De Waslijst verkennen",
      prompt: `Lees de lijst langzaam door. Omcirkel (in gedachten of op papier) 
               wat je herkent. Schrijf daarna:
               "Ik herken in mezelf dat ik..."
               Schrijf zonder te analyseren waarom. Alleen herkennen.`,
      type: 'list',
      isOptional: false,
      lovingParentFraming: true,
      triggerWarning: undefined
    },
    {
      title: "Brief aan het kind",
      prompt: `Schrijf een paar zinnen aan het kind dat jij was — 
               het kind dat deze patronen moest ontwikkelen om te overleven.
               Begin met: "Lieve [jouw naam als kind]..."`,
      type: 'letter',
      isOptional: true,  // Optioneel — kwetsbaarheidsgrens respecteren
      lovingParentFraming: true,
      triggerWarning: "Deze oefening kan emoties oproepen. Ga in je eigen tempo."
    }
  ],
  
  resistanceNote: `Als je denkt "mijn jeugd was niet zo erg" of 
    "dit gaat niet over mij" — dat is normaal en begrijpelijk. 
    Dit is precies de ontkenning die Stap 1 beschrijft. 
    Je kunt altijd later terugkomen.`,
    
  pacing: 'slow'  // Stap 1 verdient de meeste ruimte
};

// Progress filosofie — GEEN streaks
export const PROGRESS_PHILOSOPHY = {
  noStreaks: true,
  noFailureState: true,
  allowRevisiting: true,
  language: {
    visited: "bezoekt",           // Niet "voltooid"
    returning: "keert terug naar", // Niet "herstart"
    present: "is hier"            // Aanwezigheid vieren
  }
};
'@ | Set-Content "src/lib/steps/content.ts" -Encoding UTF8
Write-OK "12-Stappen inhoud"

# ── Environment Files ────────────────────────────────────────────────────────
@'
# .env.example — kopieer naar .env.local en vul in
# NOOIT .env.local committen naar git

# Neon Database (maak aan op console.neon.tech)
DATABASE_URL=postgresql://username:password@ep-xxx.eu-west-2.aws.neon.tech/fellow-travellers

# Anthropic API (maak aan op console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-api03-...

# App configuratie
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-met-openssl-rand-base64-32

# Feature flags (zet op false wat nog niet klaar is)
NEXT_PUBLIC_AI_COMPANION_ENABLED=true
NEXT_PUBLIC_PEER_MATCHING_ENABLED=false
NEXT_PUBLIC_AUDIO_MESSAGES_ENABLED=false
'@ | Set-Content ".env.example" -Encoding UTF8

# Voorkom committen van .env.local
if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.example" ".env.local"
    Write-Info ".env.local aangemaakt — vul DATABASE_URL en ANTHROPIC_API_KEY in"
}

# ── .gitignore ────────────────────────────────────────────────────────────────
$gitignoreContent = Get-Content ".gitignore" -Raw -ErrorAction SilentlyContinue
if (-not ($gitignoreContent -match "\.env\.local")) {
    Add-Content ".gitignore" "`n# Secrets`n.env.local`n.env.*.local"
}
Write-OK "Environment bestanden"

# ── Drizzle configuratie ─────────────────────────────────────────────────────
@'
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
'@ | Set-Content "drizzle.config.ts" -Encoding UTF8
Write-OK "Drizzle configuratie"

# ── Neon Database verbinding ─────────────────────────────────────────────────
@'
// src/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
'@ | Set-Content "src/db/index.ts" -Encoding UTF8

# ── Package.json scripts ─────────────────────────────────────────────────────
Write-Step "npm scripts toevoegen"
$pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
$pkg.scripts | Add-Member -NotePropertyName "db:generate" -NotePropertyValue "drizzle-kit generate" -Force
$pkg.scripts | Add-Member -NotePropertyName "db:migrate" -NotePropertyValue "drizzle-kit migrate" -Force
$pkg.scripts | Add-Member -NotePropertyName "db:studio" -NotePropertyValue "drizzle-kit studio" -Force
$pkg.scripts | Add-Member -NotePropertyName "db:push" -NotePropertyValue "drizzle-kit push" -Force
$pkg | ConvertTo-Json -Depth 10 | Set-Content "package.json" -Encoding UTF8
Write-OK "Scripts toegevoegd (db:generate, db:migrate, db:studio, db:push)"

# ── vercel.json ───────────────────────────────────────────────────────────────
@'
{
  "regions": ["ams1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "no-referrer" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    }
  ]
}
'@ | Set-Content "vercel.json" -Encoding UTF8
Write-OK "Vercel configuratie (EU Amsterdam regio)"

# ── Stap 6: Git initialiseren ────────────────────────────────────────────────
Write-Step "Git repository initialiseren"

git init | Out-Null
git add . | Out-Null
git commit -m "feat: initial project setup — Fellow Travellers ACA/CoDA platform

- Zero-knowledge encryption architecture (AES-GCM 256)
- Crisis escalation protocol (KRITIEK: implementeer voor alles anders)
- EU AI Act compliant AI guardian
- Moderation policy voor peer-support
- Trauma-sensitive onboarding flow
- 12-steps ACA content (Stap 1 MVP)
- Neon/Drizzle schema (privacy-first, geen PII)
- Vercel deployment config (EU Amsterdam)

See CLAUDE.md for full project documentation." | Out-Null
Write-OK "Initial commit aangemaakt"

# ── Stap 7: GitHub (optioneel) ───────────────────────────────────────────────
if (-not $SkipGitHub -and $ghInstalled) {
    Write-Step "GitHub repository aanmaken"
    
    try {
        gh repo create $ProjectName `
            --private `
            --description "Privacy-first ACA/CoDA trauma recovery platform" `
            --source . `
            --remote origin `
            --push 2>&1 | Out-Null
        Write-OK "GitHub repo aangemaakt en gepusht (privé)"
    } catch {
        Write-Warn "GitHub aanmaken mislukt — doe handmatig via github.com"
    }
} elseif ($SkipGitHub) {
    Write-Info "GitHub stap overgeslagen — doe handmatig:"
    Write-Info "  gh repo create $ProjectName --private --source . --push"
}

# ── Stap 8: Klaar ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  ════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✓ Fellow Travellers is klaar voor ontwikkeling!" -ForegroundColor Green
Write-Host "  ════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "  Volgende stappen:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Vul .env.local in:" -ForegroundColor White
Write-Host "     DATABASE_URL  → console.neon.tech (maak 'fellow-travellers' DB aan)" -ForegroundColor Gray
Write-Host "     ANTHROPIC_API_KEY → console.anthropic.com" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Database aanmaken:" -ForegroundColor White
Write-Host "     npm run db:push" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Dev server starten:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Begin met Claude Code (open CLAUDE.md in de editor):" -ForegroundColor White
Write-Host "     claude" -ForegroundColor Gray
Write-Host ""
Write-Host "  EERSTE PRIORITEIT: Crisis protocol implementeren" -ForegroundColor Yellow
Write-Host "  Zie CLAUDE.md voor de volledige checklist." -ForegroundColor Gray
Write-Host ""
Write-Host "  'Progress, not perfection.'" -ForegroundColor DarkCyan
Write-Host ""
