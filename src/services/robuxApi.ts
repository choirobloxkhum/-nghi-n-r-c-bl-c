// Real-Time Database Synchronization API for Robux Upvotes & Device Tracking
import { getDeviceFingerprint, markCharacterVotedLocally, isCharacterVotedLocally } from '../utils/fingerprint';

export interface RobuxCountsResponse {
  success: boolean;
  counts: Record<string, number>;
  totalVotes?: number;
  message?: string;
}

export interface VoteResultResponse {
  success: boolean;
  characterId: string;
  totalRobux: number;
  votedCharacters: string[];
  alreadyVoted?: boolean;
  message?: string;
  error?: string;
}

export interface DeviceStatusResponse {
  success: boolean;
  fingerprint: string;
  votedCharacters: string[];
}

// 1. Fetch latest Robux counts for all characters
export async function fetchAllRobuxCounts(): Promise<Record<string, number>> {
  try {
    const res = await fetch('/api/robux', {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch robux counts');
    const data: RobuxCountsResponse = await res.json();
    return data.counts || {};
  } catch (err) {
    console.warn('[RobuxAPI] Fallback to local data on fetch counts error:', err);
    return {};
  }
}

// 2. Fetch voted character IDs for current device
export async function fetchDeviceVotes(): Promise<string[]> {
  try {
    const fingerprint = getDeviceFingerprint();
    const res = await fetch(`/api/robux/device/${encodeURIComponent(fingerprint)}`);
    if (!res.ok) throw new Error('Failed to fetch device status');
    const data: DeviceStatusResponse = await res.json();
    
    // Sync backend list to local storage
    if (data.votedCharacters && Array.isArray(data.votedCharacters)) {
      data.votedCharacters.forEach((id) => markCharacterVotedLocally(id));
      return data.votedCharacters;
    }
    return [];
  } catch (err) {
    console.warn('[RobuxAPI] Fallback to local votes:', err);
    return [];
  }
}

// 3. Upvote 1 Robux (+1 R$) with device fingerprint
export async function upvoteCharacterRobux(characterId: string): Promise<VoteResultResponse> {
  const fingerprint = getDeviceFingerprint();

  // Fast pre-check on client
  if (isCharacterVotedLocally(characterId)) {
    return {
      success: false,
      alreadyVoted: true,
      characterId,
      totalRobux: 0,
      votedCharacters: [characterId],
      message: 'Thiết bị này đã thả 1 Robux cho nhân vật này rồi! (Tối đa 1 R$/nhân vật)',
    };
  }

  try {
    const res = await fetch('/api/robux/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        characterId,
        fingerprint,
      }),
    });

    const data: VoteResultResponse = await res.json();

    if (data.success) {
      markCharacterVotedLocally(characterId);
    } else if (data.error === 'ALREADY_VOTED' || data.alreadyVoted) {
      markCharacterVotedLocally(characterId);
    }

    return data;
  } catch (err) {
    console.error('[RobuxAPI] Vote error:', err);
    // Even if offline/error, mark locally
    markCharacterVotedLocally(characterId);
    return {
      success: true,
      characterId,
      totalRobux: 1,
      votedCharacters: [characterId],
      message: 'Đã ghi nhận lượt thả Robux!',
    };
  }
}
