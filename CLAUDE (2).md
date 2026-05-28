# Fellow Travellers — Claude Code Project Bible
## Platform voor ACA/CoDA Trauma- en Emotioneel Herstel

> **Privacy-first. Trauma-sensitief. Wereldklasse.**
> fellow-travellers.com — gebouwd door een volwassen kind, voor volwassen kinderen.

---

## 🏗️ Tech Stack

| Laag | Technologie | Reden |
|------|-------------|-------|
| Framework | Next.js 15 (App Router) | Server Components, streaming, Edge runtime |
| Styling | Tailwind CSS 4 + CSS variables | Design system + dark mode |
| Database | Neon (serverless PostgreSQL) | Schaalt naar nul, GDPR-friendly EU-regio |
| ORM | Drizzle ORM | Type-safe, minimaal, werkt perfect met Neon |
| Auth | Lucia Auth v3 + anonieme UUID sessions | Zero-PII authenticatie |
| Encryptie | Web Crypto API (AES-GCM 256) | Client-side, zero-knowledge |
| Lokale opslag | IndexedDB via idb-keyval | Local-first, offline werkt altijd |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) | Loving Parent AI companion |
| Deployment | Vercel (Edge Functions) | Neon + Vercel integratie native |
| Versioning | GitHub | CI/CD via Vercel GitHub integratie |

---

## 📁 Projectstructuur

```
fellow-travellers/
├── CLAUDE.md                    ← DIT BESTAND — lees altijd eerst
├── .env.local                   ← NOOIT committen
├── .env.example                 ← Wél committen
├── setup.ps1                    ← PowerShell bootstrap
│
├── src/
│   ├── app/                     ← Next.js App Router
│   │   ├── layout.tsx           ← Root layout (fonts, theme, crisis banner)
│   │   ├── page.tsx             ← Landing (discreet, geen zware termen)
│   │   ├── (auth)/
│   │   │   ├── start/page.tsx   ← Anonieme onboarding (GEEN registratie)
│   │   │   └── session/route.ts ← UUID session aanmaken
│   │   ├── (app)/               ← Beschermde app routes
│   │   │   ├── dashboard/       ← HALT-wijzer + dagelijkse check-in
│   │   │   ├── journal/         ← Versleuteld dagboek
│   │   │   ├── steps/           ← 12-stappen begeleiding (ZUIL 4)
│   │   │   ├── companion/       ← AI-metgezel (Loving Parent AI)
│   │   │   └── travellers/      ← Fellow Traveller Matcher
│   │   └── api/
│   │       ├── ai/route.ts      ← AI companion endpoint (met guardrails)
│   │       ├── sync/route.ts    ← Versleutelde data sync
│   │       └── match/route.ts   ← Anonieme peer matching
│   │
│   ├── lib/
│   │   ├── crisis/
│   │   │   ├── protocol.ts      ← 🚨 KRITIEK: Crisis detectie + escalatie
│   │   │   ├── resources.ts     ← Nederlandse/Belgische crisislijnen
│   │   │   └── detector.ts      ← Client-side keyword scanning
│   │   ├── crypto/
│   │   │   ├── vault.ts         ← Zero-knowledge encryptie (AES-GCM)
│   │   │   ├── keyring.ts       ← Sleutelbeheer (device-bound)
│   │   │   └── sync.ts          ← Versleuteld sync protocol
│   │   ├── ai/
│   │   │   ├── guardian.ts      ← 🛡️ AI guardrails + EU AI Act compliance
│   │   │   ├── prompts.ts       ← System prompts (Loving Parent stem)
│   │   │   └── boundaries.ts    ← Non-directieve grenzen
│   │   ├── steps/
│   │   │   ├── content.ts       ← 12-stappen inhoud (ACA-specifiek)
│   │   │   ├── exercises.ts     ← Werkboek oefeningen per stap
│   │   │   └── laundry-list.ts  ← De Waslijst (13 traits)
│   │   ├── moderation/
│   │   │   ├── policy.ts        ← 🔒 Peer-support moderatiebeleid
│   │   │   ├── anti-crosstalk.ts ← Anti cross-talk protocol
│   │   │   └── cooldown.ts      ← Cool-down timer logica
│   │   └── onboarding/
│   │       ├── flow.ts          ← 🌱 Trauma-sensitieve onboarding flow
│   │       └── pacing.ts        ← Stapsgewijze onthulling
│   │
│   ├── components/
│   │   ├── crisis/
│   │   │   ├── CrisisBanner.tsx ← Altijd zichtbaar, niet-stigmatiserend
│   │   │   └── SafetyCard.tsx   ← Crisis resource kaart
│   │   ├── halt/
│   │   │   ├── HALTWheel.tsx    ← Interactieve HALT-wijzer
│   │   │   └── LovingResponse.tsx ← Liefdevolle Ouder reactie
│   │   ├── journal/
│   │   │   ├── CriticFilter.tsx ← Interne Criticus → Liefdevolle Ouder
│   │   │   └── EncryptedEntry.tsx ← Versleuteld dagboek invoer
│   │   ├── steps/
│   │   │   ├── StepGuide.tsx    ← Stap-voor-stap begeleiding
│   │   │   ├── Exercise.tsx     ← Werkboek oefening component
│   │   │   └── ProgressMap.tsx  ← Non-lineaire voortgang (geen streaks!)
│   │   ├── companion/
│   │   │   ├── AICompanion.tsx  ← Loving Parent AI interface
│   │   │   └── DisclaimerGate.tsx ← Verplichte non-therapie disclaimer
│   │   ├── onboarding/
│   │   │   └── WelcomeFlow.tsx  ← Zachte, stapsgewijze welkomst
│   │   └── ui/                  ← Design system componenten
│   │       ├── tokens.css       ← CSS variables (Calming Haven palet)
│   │       └── ...
│   │
│   └── db/
│       ├── schema.ts            ← Drizzle schema (alleen versleutelde data)
│       ├── migrations/          ← Automatisch gegenereerd
│       └── index.ts             ← Neon verbinding
│
└── docs/
    ├── PRIVACY.md               ← Privacy architectuur documentatie
    ├── CRISIS-PROTOCOL.md       ← Crisis escalatie documentatie
    └── DPIA-CHECKLIST.md        ← Data Protection Impact Assessment
```

---

## 🎨 Design Systeem — Calming Haven

```css
/* Gebruik altijd deze CSS variabelen, nooit hardcoded kleuren */
--color-bg-primary: #F7F5F0;        /* Warm Sand — licht */
--color-bg-dark: #1A2326;           /* Deep Slate — donker */
--color-action: #7A9A86;            /* Sage Green — knoppen, accenten */
--color-text: #2F3633;              /* Charcoal Olive — body tekst */
--color-critic: #C17B5F;            /* Terracotta — Interne Criticus */
--color-loving: #6B8FAB;            /* Dusty Blue — Liefdevolle Ouder */
--color-crisis: #B85450;            /* Zacht rood — crisis, altijd zichtbaar */
```

### Design Principes
- **Geen zware termen op het startscherm** (anonimiteit op het apparaat)
- **Geen streaks of gamification** (herstel is non-lineair)
- **Ruime witruimte** (de-escalerend)
- **Altijd één tap naar crisis resources** (nooit meer dan één scherm diep)
- **Discreet appicoon** (geen therapie-stigma op het thuisscherm)

---

## 🚨 ZUIL 1 — Crisis Escalatie Protocol (VERPLICHT)

Dit is het **meest juridisch kritieke** onderdeel. Implementeer dit VOOR alles anders.

### Vereisten
1. **Crisis banner** — altijd zichtbaar in de app footer, niet-stigmatiserend
2. **Client-side keyword detector** — scant lokaal (niet naar server), triggert safe screen
3. **Geen server-side content scanning** (zero-knowledge architectuur)
4. **Expliciete non-therapie disclaimers** op elke AI-interactie
5. **Crisis resources** — altijd bereikbaar, Nederlandse + Belgische lijnen

### Crisis Resources (actueel, mei 2026)
```typescript
// src/lib/crisis/resources.ts
export const CRISIS_RESOURCES = {
  nl: {
    name: "113 Zelfmoordpreventie",
    phone: "113",
    chat: "https://www.113.nl/chat",
    available: "24/7"
  },
  be: {
    name: "Zelfmoordlijn",
    phone: "0800 32 123",
    available: "24/7"
  },
  general: {
    name: "Huisarts / Spoedopname",
    instruction: "Bel 112 bij direct gevaar"
  }
};
```

### Crisis Detector Implementatie
```typescript
// src/lib/crisis/detector.ts
// ALTIJD client-side — nooit keywords naar server sturen
const CRISIS_SIGNALS = [
  // Suïcidaliteit
  'wil niet meer leven', 'wil dood', 'einde maken', 'geen zin meer in het leven',
  'zelfmoord', 'suïcide', 'pillen innemen', 'mezelf snijden',
  // Zelfbeschadiging  
  'mezelf pijn doen', 'snijden', 'mijzelf slaan',
  // Acute crisis
  'ik red het niet', 'niemand kan me helpen', 'het is hopeloos'
];

export function detectCrisisSignals(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_SIGNALS.some(signal => lower.includes(signal));
}
```

### Safe Screen Gedrag
- Zacht, niet-dramatisch scherm (geen rode alarmen)
- Tekst: "Het klinkt alsof het zwaar is op dit moment."
- Crisis resources direct zichtbaar
- Optie om gewoon door te gaan (geen dwang)
- GEEN vragenlijst of risico-assessment

---

## 🛡️ ZUIL 2 — AI Guardian (EU AI Act Compliant)

### Positionering (NOOIT afwijken)
De AI is een **"niet-directieve ACA/CoDA-geïnspireerde reflectietool"**.
- ✅ Spiegelt patronen terug
- ✅ Stelt open vragen vanuit Liefdevolle Ouder perspectief
- ✅ Psycho-educatie over trauma/herstel
- ❌ NOOIT diagnoses stellen
- ❌ NOOIT medicijnadviezen geven
- ❌ NOOIT professionele hulp vervangen
- ❌ NOOIT crisisgesprekken voeren (doorverwijzen naar 113)

### System Prompt Structuur
```typescript
// src/lib/ai/prompts.ts
export const LOVING_PARENT_SYSTEM_PROMPT = `
Je bent een niet-directieve reflectietool gebaseerd op ACA/CoDA herstelprincipes.
Je spreekt vanuit de 'Liefdevolle Ouder' — warm, gelijkwaardig, zonder oordeel.

KERNIDENTITEIT:
- Je bent GEEN therapeut, psychiater of professional hulpverlener
- Je bent een digitale spiegel die patronen terugkaatst
- Je stelt vragen, je geeft geen antwoorden

TAAL & STIJL:
- Rustig, warm, geduldig
- Gebruik "ik hoor je", niet "ik begrijp je"
- Vermijd therapeutisch jargon
- Korte zinnen, ruimte voor stilte
- Stel nooit meer dan één vraag tegelijk

BIJ CRISIS SIGNALEN:
Zeg altijd: "Wat je beschrijft klinkt zwaar. Voordat we verdergaan, wil ik je 
wijzen op 113 (www.113.nl) waar je 24/7 terecht kunt. Wil je daar contact mee opnemen?"
Stop het gesprek en toon crisis resources.

VERBODEN ONDERWERPEN:
- Medicijnadviezen
- Diagnoses (ook niet "je klinkt depressief")
- Professionele therapeutische technieken
- Suïcidale ideatie verkennen (doorverwijzen)

DISCLAIMER (eerste bericht altijd):
"Ik ben een digitale reflectietool, geen therapeut. Wat ik deel is geen 
professioneel advies. Bij ernstige nood, bel 113."
`;
```

### Input/Output Filters
```typescript
// src/lib/ai/guardian.ts
export async function guardedAIRequest(userInput: string): Promise<GuardedResponse> {
  // 1. Client-side crisis scan VOOR verzending
  if (detectCrisisSignals(userInput)) {
    return { type: 'crisis', showResources: true };
  }
  
  // 2. Input sanitization
  const sanitized = sanitizeInput(userInput);
  
  // 3. Output validation na ontvangst
  const response = await callAnthropicAPI(sanitized);
  
  // 4. Post-response check
  if (containsMedicalAdvice(response) || containsDiagnosis(response)) {
    return { type: 'filtered', fallback: SAFE_FALLBACK_RESPONSE };
  }
  
  return { type: 'ok', content: response };
}
```

---

## 🔒 ZUIL 3 — Moderation & Peer Support Veiligheid

### Moderatiebeleid (implementeer in Fase 1, niet Fase 3!)

```typescript
// src/lib/moderation/policy.ts
export const PEER_SUPPORT_POLICY = {
  // Anti cross-talk protocol
  maxAudioMessageSeconds: 180,       // 3 minuten max
  cooldownAfterMessageMinutes: 10,   // Verplichte afkoeltijd
  maxActivePeerConnections: 2,       // Max 2 fellow travellers
  
  // Veiligheidsprotocollen
  crisisProtocol: 'immediate_resources', // Bij crisis: direct resources tonen
  blockReportFlow: 'simple_3tap',       // Eenvoudig blokkeren
  
  // Grenzen van de relatie
  allowedTopics: ['12-stappen werk', 'herstel', 'dagelijks welzijn'],
  prohibitedContent: ['romantische toenaderinge', 'persoonlijke gegevens', 'buiten-app contact'],
  
  // Juridische grens
  disclaimer: `Fellow Travellers zijn geen professionals. 
                Bij crisis, bel 113. De app is geen vervanging voor therapie.`
};
```

### Anti Cross-Talk Technische Implementatie
- Berichten zijn asynchroon (geen real-time chat)
- Cool-down timer BLOKKEER de verzendknop na elk bericht
- Audio berichten worden lokaal verwerkt, niet opgeslagen op server
- Anonieme UUID's, geen namen zichtbaar tenzij gebruiker kiest voor alias

---

## 🌱 ZUIL 4 — Onboarding voor Kwetsbare Doelgroep

### Principes (GEEN UITZONDERING)
1. **Geen registratie** — start met anonieme UUID session
2. **Geen emailadres vereist** in gratis tier
3. **Zachte introductie** — geen confronterende termen op dag 1
4. **Stapsgewijze toestemming** — elke feature één voor één introduceren
5. **Altijd een uitweg** — elke flow heeft een "later" optie

### Onboarding Stappen
```
Stap 0: Welkomstscherm
  - Discreet, geen diagnose-taal
  - "Een plek voor rust en reflectie"
  - Één knop: "Begin"

Stap 1: Anonieme sessie aanmaken (automatisch, geen input nodig)
  - UUID genereren client-side
  - Geen formulier

Stap 2: Eerste HALT check-in
  - "Hoe voel je je nu?"
  - Vier zachte opties (geen medische termen)

Stap 3: Feature introductie (één per dag, niet alles tegelijk)
  - Dag 1: Dagboek
  - Dag 3: HALT-wijzer uitleg
  - Dag 7: 12-stappen optie tonen
  - Dag 14: Fellow Traveller optie tonen
  - Dag 21: AI-metgezel tonen

Stap 4: Privacy uitleg (simpel, niet juridisch)
  - "Jouw notities staan alleen op jouw apparaat"
  - "Wij kunnen ze niet lezen"
  - "Je kunt alles wissen"
```

---

## 📖 ZUIL 5 — Begeleide 12-Stappen Module (DE ZEL VAN DE APP)

### Content Structuur per Stap
Elke stap heeft:
1. **ACA-context** (verschil met AA uitgelegd)
2. **Psycho-educatie blok** (trauma/hechtingsperspectief)
3. **Werkboek oefeningen** (direct vanuit ACA Fellowship Text)
4. **Liefdevolle Ouder reflectie** (AI-prompt of zelf-schrijfopdracht)
5. **Weerstand herkenner** (typische blokkades per stap)

### Stap 1 MVP Inhoud — Machteloosheid Erkennen
```typescript
// src/lib/steps/content.ts
export const STEP_1: StepContent = {
  id: 1,
  title: "Stap 1 — Machteloosheid Erkennen",
  acaContext: `In ACA erkennen we machteloosheid over de effecten van het 
    disfunctionele gezin op ons leven — de overlevingspatronen die we 
    als kind moesten ontwikkelen maar die ons nu beperken.`,
  
  psychoEducation: `Dit is geen zwakte. De patronen op de Waslijst 
    waren ooit intelligente adaptaties. Jij hebt overleefd.`,
  
  laundryListTraits: [
    "We worden isolerende, zichzelf isolerende volwassenen",
    "We worden goedkeuringsverslaafden",
    "We zijn bang voor het verliezen van controle",
    // ... alle 13 traits
  ],
  
  exercises: [
    {
      title: "De Waslijst herkennen",
      prompt: `Welke van deze patronen herken je in jezelf? 
               Schrijf zonder oordeel, alsof je schrijft over 
               een dierbaar kind dat probeerde te overleven.`,
      type: 'journal',
      lovingParentFraming: true
    },
    {
      title: "Brief aan het innerlijke kind",
      prompt: `Schrijf een korte brief aan het kind dat jij was. 
               Vertel hoe dapper je was.`,
      type: 'letter',
      isOptional: true  // Kwetsbaarheidsgrens respecteren
    }
  ],
  
  resistanceNote: `Als je denkt "mijn jeugd was niet zo erg" — 
    dat is normaal. Dit is precies de ontkenning die Stap 1 beschrijft.`,
  
  pacing: 'slow'  // Stap 1 en 2 zijn het zwaarst — meer witruimte
};
```

### Non-lineaire Voortgang
```typescript
// GEEN streaks, GEEN "dag X niet gereset" taal
// Herstel is non-lineair — een dag niet werken = geen mislukking

export const PROGRESS_PHILOSOPHY = {
  noStreaks: true,
  noFailureState: true,
  allowRevisiting: true,      // Stap 4 opnieuw doen is normaal
  celebratePresence: true,    // "Je bent hier" is genoeg
  language: 'er-zijn',       // "Je hebt Stap 1 bezocht" niet "voltooid"
};
```

---

## 🔐 Zero-Knowledge Encryptie Architectuur

```typescript
// src/lib/crypto/vault.ts

// Sleutelafleiding — NOOIT de sleutel naar server
export async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const salt = await getOrCreateDeviceSalt(); // Opgeslagen in IndexedDB
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 310000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Versleutelen — gebeurt ALTIJD op het apparaat
export async function encryptEntry(
  plaintext: string, 
  key: CryptoKey
): Promise<EncryptedEntry> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, encoded
  );
  
  return {
    ciphertext: bufferToBase64(ciphertext),
    iv: bufferToBase64(iv),
    timestamp: Date.now()
    // GEEN plaintext, GEEN metadata over inhoud
  };
}
```

---

## 🗄️ Database Schema (Neon/Drizzle)

```typescript
// src/db/schema.ts
// LET OP: Nooit plaintext opslaan, alleen ciphertext en anonieme IDs

import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Anonieme sessies — GEEN email, GEEN naam
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  lastActive: timestamp('last_active').defaultNow(),
  // Geen PII!
});

// Versleutelde dagboek entries — server ziet alleen ciphertext
export const journalEntries = pgTable('journal_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id),
  ciphertext: text('ciphertext').notNull(),   // AES-GCM versleuteld
  iv: text('iv').notNull(),                    // Initialisatievector
  createdAt: timestamp('created_at').defaultNow(),
  // GEEN plaintext, GEEN categorieën, GEEN sentiment labels
});

// Stap voortgang — alleen stap nummer en timestamp
export const stepProgress = pgTable('step_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id),
  stepNumber: text('step_number').notNull(),  // "1", "2", etc.
  visitedAt: timestamp('visited_at').defaultNow(),
  // GEEN notities, GEEN inhoud — alleen aanwezigheid registreren
});

// Fellow Traveller matching — anonieme koppelingen
export const matches = pgTable('matches', {
  id: uuid('id').primaryKey().defaultRandom(),
  aliasA: text('alias_a').notNull(),    // Zelfgekozen alias
  aliasB: text('alias_b').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  isActive: boolean('is_active').default(true),
  // GEEN echte namen, GEEN locatie, GEEN session IDs direct gekoppeld
});
```

---

## 🚀 Deployment (Vercel + Neon)

### Environment Variables (.env.local — NOOIT committen)
```bash
# Database
DATABASE_URL=postgresql://...neon.tech/fellow-travellers

# AI
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=https://fellow-travellers.com
NEXTAUTH_SECRET=... (32+ random bytes)

# Feature flags
NEXT_PUBLIC_AI_COMPANION_ENABLED=true
NEXT_PUBLIC_PEER_MATCHING_ENABLED=false  # Fase 3 pas aanzetten
```

### Vercel Configuratie
```json
// vercel.json
{
  "regions": ["ams1"],        // Amsterdam — GDPR EU-opslag
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "no-referrer" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

---

## ✅ Ontwikkel Checklist per Feature

Voor elke nieuwe feature, check:
- [ ] Bevat het geen PII die naar de server gaat?
- [ ] Is er een crisis-exitpad aanwezig?
- [ ] Is de AI-interactie voorzien van disclaimer?
- [ ] Werkt het offline (local-first)?
- [ ] Respecteert het de non-lineaire herstelvisie?
- [ ] Is de taal niet-pathologiserend?
- [ ] Is er een moderatielaag als er communicatie tussen users is?

---

## 📋 Huidige Status

- [ ] Fase 1: Fundament (setup.ps1 uitvoeren)
- [ ] Crisis protocol implementeren
- [ ] Zero-knowledge encryptie bouwen
- [ ] Database schema deployen naar Neon
- [ ] Fase 2: MVP (HALT + Dagboek + Stap 1-2)
- [ ] Fase 3: AI Companion + moderatiebeleid
- [ ] Fase 4: Peer Matching
- [ ] Fase 5: Lancering

---

*"Progress, not perfection." — ACA principe*
