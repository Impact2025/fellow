// Server slaat uitsluitend ciphertext op — nooit plaintext, nooit PII
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

// Gebruikers geïdentificeerd via SHA-256 hash van e-mailadres — nooit plaintext
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  emailHash: text("email_hash").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at").defaultNow().notNull(),
});

// Magic link tokens — plaintext e-mail alleen hier, maximaal 15 minuten, eenmalig
export const magicTokens = pgTable("magic_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: text("token").notNull().unique(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActive: timestamp("last_active").defaultNow().notNull(),
});

export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  ciphertext: text("ciphertext").notNull(),
  iv: text("iv").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stepVisits = pgTable("step_visits", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  stepNumber: integer("step_number").notNull(),
  visitedAt: timestamp("visited_at").defaultNow().notNull(),
});

export const haltCheckins = pgTable("halt_checkins", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  ciphertext: text("ciphertext").notNull(),
  iv: text("iv").notNull(),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
});

export const travellerMatches = pgTable("traveller_matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionHashA: text("session_hash_a").notNull(),
  sessionHashB: text("session_hash_b").notNull(),
  aliasA: text("alias_a").notNull(),
  aliasB: text("alias_b").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const peerMessages = pgTable("peer_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id")
    .references(() => travellerMatches.id, { onDelete: "cascade" })
    .notNull(),
  senderAlias: text("sender_alias").notNull(),
  ciphertext: text("ciphertext").notNull(),
  iv: text("iv").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  cooldownUntil: timestamp("cooldown_until"),
  isAudio: boolean("is_audio").default(false).notNull(),
});

// Anoniem matching-profiel — server ziet NOOIT naam of exacte locatie
// supportVector: JSON array van 13 floats (0-1), zie lib/matching/vectorize.ts
// regionCode: 2-letter provinciecode (NL) — nooit postcode of gemeente
export const matchProfiles = pgTable("match_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionHash: text("session_hash").notNull().unique(),
  alias: text("alias").notNull(),
  supportVector: text("support_vector").notNull(),
  regionCode: text("region_code").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
