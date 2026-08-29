// Quản lý tài khoản Gmail và quy tắc thả Robux cho nhân vật Roblox RP Hub

const GMAIL_STORAGE_KEY = 'roblox_rp_current_user_gmail_v3';
const GMAIL_VOTES_MAP_KEY = 'roblox_rp_gmail_votes_map_v3';

export function getActiveGmail(): string {
  if (typeof window === 'undefined') return '';
  try {
    const saved = localStorage.getItem(GMAIL_STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch {
    // ignore
  }
  return '';
}

export function setActiveGmail(email: string): string {
  const normalized = (email || '').trim().toLowerCase();
  if (typeof window !== 'undefined') {
    try {
      if (normalized) {
        localStorage.setItem(GMAIL_STORAGE_KEY, normalized);
      } else {
        localStorage.removeItem(GMAIL_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }
  return normalized;
}

export const setActiveGmailInStorage = setActiveGmail;

export function getGmailVotesMap(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(GMAIL_VOTES_MAP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // ignore
  }
  return {};
}

export function getGmailVotedCharacters(email?: string): string[] {
  const targetEmail = (email !== undefined ? email : getActiveGmail()).trim().toLowerCase();
  if (!targetEmail) return [];
  const map = getGmailVotesMap();
  return Array.isArray(map[targetEmail]) ? map[targetEmail] : [];
}

export function hasGmailVotedForCharacter(characterId: string, email?: string): boolean {
  const targetEmail = (email !== undefined ? email : getActiveGmail()).trim().toLowerCase();
  if (!targetEmail) return false;
  const votedList = getGmailVotedCharacters(targetEmail);
  return votedList.includes(characterId);
}

export function recordGmailVoteForCharacter(characterId: string, email?: string): boolean {
  const targetEmail = (email !== undefined ? email : getActiveGmail()).trim().toLowerCase();
  if (!targetEmail || typeof window === 'undefined') return false;

  try {
    const map = getGmailVotesMap();
    const currentList = Array.isArray(map[targetEmail]) ? map[targetEmail] : [];

    if (currentList.includes(characterId)) {
      return false; // Đã vote trước đó
    }

    map[targetEmail] = [...currentList, characterId];
    localStorage.setItem(GMAIL_VOTES_MAP_KEY, JSON.stringify(map));
    return true;
  } catch {
    return false;
  }
}

export function resetAllGmailVotes() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(GMAIL_VOTES_MAP_KEY);
  } catch {
    // ignore
  }
}

