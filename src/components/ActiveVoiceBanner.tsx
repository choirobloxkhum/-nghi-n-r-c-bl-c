import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Square } from 'lucide-react';
import { RPCharacter } from '../types';
import { useCharacterVoice } from '../utils/characterVoice';

interface ActiveVoiceBannerProps {
  characters: RPCharacter[];
}

export const ActiveVoiceBanner: React.FC<ActiveVoiceBannerProps> = ({ characters }) => {
  const { playingId, stopVoice } = useCharacterVoice();

  if (!playingId) return null;

  const activeChar = characters.find((c) => c.id === playingId);
  if (!activeChar) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed bottom-6 left-4 sm:left-6 z-40 max-w-sm sm:max-w-md bg-slate-950/90 backdrop-blur-xl border-2 border-pink-500/80 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-[0_8px_30px_rgba(244,63,94,0.4)] text-white flex items-center gap-2.5 sm:gap-3.5"
      >
        {/* Character Avatar with Pulsing Ring */}
        <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-pink-400 shrink-0 shadow-sm">
          {activeChar.avatarUrl ? (
            <img
              src={activeChar.avatarUrl}
              alt={activeChar.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-pink-900 flex items-center justify-center text-pink-200 font-bold">
              🎙️
            </div>
          )}
          <div className="absolute inset-0 ring-2 ring-pink-400 animate-ping opacity-30 rounded-xl" />
        </div>

        {/* Text & Waveform */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-pink-400 text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <Volume2 className="w-3.5 h-3.5 animate-bounce stroke-[2.5]" />
            <span>Đang phát giọng nói</span>
          </div>
          <h4 className="text-white font-black text-xs sm:text-sm truncate">
            {activeChar.name}
          </h4>
          {/* Animated Wave Equalizer */}
          <div className="flex items-center gap-0.5 mt-1 h-2">
            {[40, 90, 60, 100, 75, 45, 85, 60, 95, 50, 80].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-gradient-to-t from-pink-500 to-rose-300 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.4 + (i % 4) * 0.15}s`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Stop Button */}
        <button
          onClick={stopVoice}
          title="Dừng phát giọng nói"
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-pink-600 hover:bg-pink-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
        >
          <Square className="w-3.5 h-3.5 fill-white stroke-none" />
          <span className="hidden sm:inline">Dừng</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
