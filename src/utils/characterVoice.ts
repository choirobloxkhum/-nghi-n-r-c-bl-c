import { useEffect, useState } from 'react';
import { RPCharacter } from '../types';

let currentAudio: HTMLAudioElement | null = null;
let currentPlayingCharId: string | null = null;
let listeners: Array<(charId: string | null) => void> = [];

function notifyListeners() {
  listeners.forEach((listener) => listener(currentPlayingCharId));
}

export function subscribeVoiceState(listener: (charId: string | null) => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getCurrentPlayingVoiceCharId(): string | null {
  return currentPlayingCharId;
}

export function playCharacterVoice(
  character: RPCharacter | { id: string; voiceUrl?: string; name?: string; avatarUrl?: string },
  onEndedCallback?: () => void
): boolean {
  if (typeof window === 'undefined') return false;

  const voiceUrl = 'voiceUrl' in character ? character.voiceUrl : undefined;
  if (!voiceUrl) {
    return false;
  }

  // If already playing this exact character, stop or replay
  if (currentAudio && currentPlayingCharId === character.id) {
    if (!currentAudio.paused) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentPlayingCharId = null;
      notifyListeners();
      return false;
    }
  }

  // Stop any previously playing voice
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }

  try {
    const audio = new Audio(voiceUrl);
    currentAudio = audio;
    currentPlayingCharId = character.id;
    notifyListeners();

    audio.onended = () => {
      if (currentPlayingCharId === character.id) {
        currentPlayingCharId = null;
        notifyListeners();
        if (onEndedCallback) onEndedCallback();
      }
    };

    audio.onerror = () => {
      if (currentPlayingCharId === character.id) {
        currentPlayingCharId = null;
        notifyListeners();
      }
    };

    audio.play().catch(() => {
      currentPlayingCharId = null;
      notifyListeners();
    });

    return true;
  } catch {
    currentPlayingCharId = null;
    notifyListeners();
    return false;
  }
}

export function stopCharacterVoice() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }
  if (currentPlayingCharId !== null) {
    currentPlayingCharId = null;
    notifyListeners();
  }
}

export function useCharacterVoice() {
  const [playingId, setPlayingId] = useState<string | null>(getCurrentPlayingVoiceCharId());

  useEffect(() => {
    const unsubscribe = subscribeVoiceState((id) => {
      setPlayingId(id);
    });
    return unsubscribe;
  }, []);

  return {
    playingId,
    isPlaying: (id: string) => playingId === id,
    playVoice: playCharacterVoice,
    stopVoice: stopCharacterVoice,
  };
}
