import { get, set } from "idb-keyval";

const SALT_KEY = "ft_device_salt_v1";

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length) as Uint8Array<ArrayBuffer>;
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

async function getOrCreateDeviceSalt(): Promise<Uint8Array<ArrayBuffer>> {
  let stored = await get<string>(SALT_KEY);
  if (!stored) {
    const salt = crypto.getRandomValues(new Uint8Array(32));
    stored = bytesToBase64(salt);
    await set(SALT_KEY, stored);
  }
  return base64ToBytes(stored);
}

export async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const salt = await getOrCreateDeviceSalt();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 310_000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export interface EncryptedEntry {
  ciphertext: string;
  iv: string;
  timestamp: number;
  version: 1;
}

export async function encryptEntry(
  plaintext: string,
  key: CryptoKey
): Promise<EncryptedEntry> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return {
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    iv: bytesToBase64(iv),
    timestamp: Date.now(),
    version: 1,
  };
}

export async function decryptEntry(
  entry: EncryptedEntry,
  key: CryptoKey
): Promise<string> {
  const ciphertext = base64ToBytes(entry.ciphertext);
  const iv = base64ToBytes(entry.iv);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return new TextDecoder().decode(plain);
}
