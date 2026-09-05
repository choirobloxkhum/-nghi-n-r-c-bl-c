// 24-Hour Leaderboard Ranking Snapshot Helper
// Đảm bảo cố định bảng xếp hạng top 3 trong chu kỳ 24 giờ để tránh giật lag layout,
// trong khi số tim/robux của từng nhân vật vẫn cập nhật nhảy số theo thời gian thực (Real-time).

export interface LeaderboardSnapshot {
  lastUpdated: number; // timestamp in milliseconds
  topCharacterIds: string[];
}

const STORAGE_KEY = 'roblox_rp_leaderboard_24h_snapshot_v2';
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export function getLeaderboardSnapshot(currentSortedIds: string[]): {
  topIds: string[];
  lastUpdated: number;
  remainingHours: number;
  isExpired: boolean;
} {
  const now = Date.now();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: LeaderboardSnapshot = JSON.parse(raw);
      const elapsed = now - parsed.lastUpdated;
      if (elapsed < TWENTY_FOUR_HOURS_MS && parsed.topCharacterIds && parsed.topCharacterIds.length > 0) {
        const remainingHours = Math.max(1, Math.ceil((TWENTY_FOUR_HOURS_MS - elapsed) / (1000 * 60 * 60)));
        return {
          topIds: parsed.topCharacterIds,
          lastUpdated: parsed.lastUpdated,
          remainingHours,
          isExpired: false,
        };
      }
    }
  } catch {
    // ignore
  }

  // 24 hours elapsed or fresh initialization: Take current top 3
  const initialTop = currentSortedIds.slice(0, 3);
  const newSnapshot: LeaderboardSnapshot = {
    lastUpdated: now,
    topCharacterIds: initialTop,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSnapshot));
  } catch {
    // ignore
  }

  return {
    topIds: initialTop,
    lastUpdated: now,
    remainingHours: 24,
    isExpired: true,
  };
}

export function forceRefreshLeaderboardSnapshot(currentSortedIds: string[]): {
  topIds: string[];
  lastUpdated: number;
  remainingHours: number;
} {
  const now = Date.now();
  const newSnapshot: LeaderboardSnapshot = {
    lastUpdated: now,
    topCharacterIds: currentSortedIds.slice(0, 3),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSnapshot));
  } catch {
    // ignore
  }
  return {
    topIds: newSnapshot.topCharacterIds,
    lastUpdated: now,
    remainingHours: 24,
  };
}
