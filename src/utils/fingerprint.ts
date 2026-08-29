// Browser & Device Fingerprinting for Anonymous Single-Vote Rule
// Creates a persistent and resilient device identifier without requiring user login

const STORAGE_FINGERPRINT_KEY = 'roblox_rp_device_fingerprint_v3';
const STORAGE_LOCAL_VOTES_PREFIX = 'roblox_rp_has_voted_char_';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

// Generate simple hash from string
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Extract hardware and browser signals to build a unique device signature
export function generateDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'server_render_env';

  // 1. Check existing stored fingerprint in LocalStorage or Cookies first
  try {
    const fromStorage = localStorage.getItem(STORAGE_FINGERPRINT_KEY);
    if (fromStorage && fromStorage.trim().length >= 8) {
      setCookie(STORAGE_FINGERPRINT_KEY, fromStorage);
      return fromStorage;
    }
    const fromCookie = getCookie(STORAGE_FINGERPRINT_KEY);
    if (fromCookie && fromCookie.trim().length >= 8) {
      localStorage.setItem(STORAGE_FINGERPRINT_KEY, fromCookie);
      return fromCookie;
    }
  } catch {
    // ignore
  }

  // 2. Hardware and browser characteristics
  const nav = window.navigator;
  const screen = window.screen;

  const signals = [
    nav.userAgent || '',
    nav.language || '',
    nav.languages ? nav.languages.join(',') : '',
    screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
    screen.availWidth + 'x' + screen.availHeight,
    new Date().getTimezoneOffset().toString(),
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    (nav as unknown as { hardwareConcurrency?: number }).hardwareConcurrency?.toString() || '',
    (nav as unknown as { deviceMemory?: number }).deviceMemory?.toString() || '',
    (nav as unknown as { maxTouchPoints?: number }).maxTouchPoints?.toString() || '',
  ];

  // 3. Canvas rendering signature
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Roblox RP 💖 Ổ Nghiện', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Roblox RP 💖 Ổ Nghiện', 4, 17);
      signals.push(canvas.toDataURL());
    }
  } catch {
    // ignore
  }

  const rawString = signals.join('###');
  const hashPart = simpleHash(rawString);
  const randomPart = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const fingerprint = `dev_${hashPart}_${randomPart}`;

  // Store in LocalStorage and Cookies for maximum longevity
  try {
    localStorage.setItem(STORAGE_FINGERPRINT_KEY, fingerprint);
    setCookie(STORAGE_FINGERPRINT_KEY, fingerprint);
  } catch {
    // ignore
  }

  return fingerprint;
}

// Get the current active device fingerprint
let cachedFingerprint: string | null = null;
export function getDeviceFingerprint(): string {
  if (cachedFingerprint) return cachedFingerprint;
  cachedFingerprint = generateDeviceFingerprint();
  return cachedFingerprint;
}

// LocalStorage helpers for instant client-side single-vote checking
export function isCharacterVotedLocally(characterId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(`${STORAGE_LOCAL_VOTES_PREFIX}${characterId}`) === 'true';
  } catch {
    return false;
  }
}

export function markCharacterVotedLocally(characterId: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_LOCAL_VOTES_PREFIX}${characterId}`, 'true');
  } catch {
    // ignore
  }
}

export function getLocalVotedCharactersList(allCharacterIds: string[]): string[] {
  if (typeof window === 'undefined') return [];
  return allCharacterIds.filter((id) => isCharacterVotedLocally(id));
}
