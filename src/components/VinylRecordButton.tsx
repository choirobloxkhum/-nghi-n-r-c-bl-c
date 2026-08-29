import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Volume1, Volume2 } from 'lucide-react';
import { useCharacterVoice } from '../utils/characterVoice';
import { setChillBgmVolume } from '../utils/chillBgm';

interface VinylRecordButtonProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  playlistUrl?: string;
  className?: string;
  isHellMode?: boolean;
}

export const VinylRecordButton: React.FC<VinylRecordButtonProps> = ({
  isPlaying,
  onTogglePlay,
  className = '',
  isHellMode = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; char: string }[]>([]);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [ytReady, setYtReady] = useState(false);
  const { playingId } = useCharacterVoice();
  const isVoiceDucking = Boolean(playingId);

  // Extract YouTube ID from link: Hell mode uses GYEpWL5khmc, Normal mode uses -amHlcPIpgM
  const videoId = isHellMode ? 'GYEpWL5khmc' : '-amHlcPIpgM';

  // Handle YouTube iframe messages when isPlaying or videoId changes
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;

    try {
      const command = isPlaying
        ? '{"event":"command","func":"playVideo","args":""}'
        : '{"event":"command","func":"pauseVideo","args":""}';
      
      iframeRef.current.contentWindow.postMessage(command, '*');
    } catch {
      // ignore
    }
  }, [isPlaying, ytReady, videoId]);

  // Audio Ducking: Lower the vinyl record music volume when character voice is speaking
  useEffect(() => {
    const targetVolume = isVoiceDucking ? 15 : 85;
    
    // 1. YouTube Iframe player volume adjustment
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const volumeCommand = JSON.stringify({
          event: 'command',
          func: 'setVolume',
          args: [targetVolume],
        });
        iframeRef.current.contentWindow.postMessage(volumeCommand, '*');
      } catch {
        // ignore
      }
    }

    // 2. Synthesizer procedural audio volume adjustment if active
    try {
      setChillBgmVolume(isVoiceDucking ? 0.12 : 0.6);
    } catch {
      // ignore
    }
  }, [isVoiceDucking, isPlaying, ytReady]);

  // Spawn floating music notes / sparkles when playing
  useEffect(() => {
    if (!isPlaying) {
      setSparkles([]);
      return;
    }

    const interval = setInterval(() => {
      const notes = ['🎵', '🎶', '✨', '💿', '💎'];
      const newSparkle = {
        id: Date.now() + Math.random(),
        x: Math.random() * 20 - 10,
        y: -10,
        char: notes[Math.floor(Math.random() * notes.length)],
      };

      setSparkles((prev) => [...prev.slice(-3), newSparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 1400);
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      id="vinyl-audio-control-container"
      className={`relative z-40 flex items-center select-none font-dessert ${className}`}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
    >
      {/* Hidden YouTube Audio IFrame Player for Background Music */}
      <div className="sr-only pointer-events-none absolute opacity-0 w-0 h-0 overflow-hidden">
        <iframe
          ref={iframeRef}
          id="youtube-bgm-iframe"
          title="Roblox Chill BGM Playlist"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${videoId}&playsinline=1&controls=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
          allow="autoplay; encrypted-media"
          onLoad={() => {
            setYtReady(true);
            if (isPlaying && iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                '*'
              );
              // Apply initial volume
              iframeRef.current.contentWindow.postMessage(
                JSON.stringify({
                  event: 'command',
                  func: 'setVolume',
                  args: [isVoiceDucking ? 15 : 85],
                }),
                '*'
              );
            }
          }}
        />
      </div>

      {/* Floating Animated Music Notes / Sparkles */}
      <AnimatePresence>
        {sparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ opacity: 0, y: 0, x: sp.x, scale: 0.6 }}
            animate={{ opacity: 1, y: -35, x: sp.x * 1.5, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            className="absolute top-0 right-2 pointer-events-none text-xs drop-shadow-md z-50 select-none"
          >
            {sp.char}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Interactive Tooltip on Hover */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end pointer-events-none whitespace-nowrap z-50"
          >
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-white backdrop-blur-md border border-white/25 shadow-xl flex flex-col items-start gap-0.5">
              <div className="flex items-center gap-1 text-[11px] font-black text-amber-300">
                {isVoiceDucking ? (
                  <Volume1 className="w-3 h-3 text-pink-400 animate-pulse" />
                ) : (
                  <Music className="w-3 h-3 animate-bounce" />
                )}
                <span>
                  {isPlaying
                    ? isVoiceDucking
                      ? 'NHẠC ĐANG TỰ GIẢM NHỎ (NGHE GIỌNG)'
                      : 'ĐANG PHÁT NHẠC ĐĨA THAN'
                    : 'NHẠC ĐANG TẮT'}
                </span>
              </div>
              <span className="text-[9px] text-slate-300">
                {isPlaying
                  ? isVoiceDucking
                    ? 'Nhạc đĩa than đang giảm âm lượng để bạn nghe rõ giọng nói'
                    : 'Nhấn đĩa than để tắt nhạc'
                  : 'Nhấn đĩa than để bật nhạc'}
              </span>
            </div>
            {/* Tiny arrow pointing to vinyl */}
            <div className="w-2 h-2 bg-slate-900/90 border-r border-b border-white/25 rotate-[-45deg] -mr-1 -mt-2.5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VINYL RECORD BUTTON */}
      <motion.button
        id="btn-vinyl-record"
        onClick={onTogglePlay}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        title={
          isPlaying
            ? isVoiceDucking
              ? 'Nhạc đĩa than đang tự giảm nhỏ để nghe giọng nhân vật'
              : 'Tạm dừng nhạc (Click vinyl)'
            : 'Phát nhạc Roblox (Click vinyl)'
        }
        aria-label="Toggle Vinyl Audio"
        className="relative group cursor-pointer focus:outline-none p-0.5 rounded-full"
      >
        {/* Dynamic Motion-Blur Aura Ring & Soundwave Glow when Playing */}
        <div
          className={`absolute -inset-1 rounded-full transition-all duration-500 pointer-events-none ${
            isPlaying
              ? isVoiceDucking
                ? 'bg-gradient-to-tr from-pink-400/40 via-amber-400/30 to-sky-400/40 blur-sm opacity-60'
                : 'bg-gradient-to-tr from-sky-400/60 via-amber-400/50 to-emerald-400/60 blur-sm opacity-90 animate-pulse'
              : 'opacity-0'
          }`}
        />

        {/* Outer Motion-Blur Spin Halo when actively rotating */}
        {isPlaying && (
          <div
            className={`absolute -inset-0.5 rounded-full border border-dashed animate-spin pointer-events-none ${
              isVoiceDucking
                ? 'border-pink-300/60 [animation-duration:8s]'
                : 'border-sky-300/80 [animation-duration:5s]'
            }`}
          />
        )}

        {/* VINYL LP DISK BODY (Responsive size for Mobile & Desktop) */}
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-[#111115] shadow-lg border border-[#2b2b36] flex items-center justify-center overflow-hidden">
          {/* ROTATING DISK CONTAINER */}
          <div
            className={`w-full h-full rounded-full relative flex items-center justify-center transition-transform ${
              isPlaying ? (isVoiceDucking ? 'animate-spin [animation-duration:6s]' : 'animate-spin [animation-duration:3.2s]') : ''
            }`}
          >
            {/* Micro-Grooves Concentric Rings (Realistic LP Texture) */}
            <div
              className="absolute inset-0.5 rounded-full pointer-events-none opacity-40"
              style={{
                background:
                  'repeating-radial-gradient(circle, rgba(255,255,255,0.15) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.08) 3px)',
              }}
            />

            {/* Specular Radial Sheen Reflections (Conic Sheen effect) */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none opacity-25"
              style={{
                background:
                  'conic-gradient(from 30deg at 50% 50%, rgba(255,255,255,0.4) 0deg, transparent 40deg, rgba(255,255,255,0.3) 90deg, transparent 130deg, rgba(255,255,255,0.4) 180deg, transparent 220deg, rgba(255,255,255,0.3) 270deg, transparent 310deg, rgba(255,255,255,0.4) 360deg)',
              }}
            />

            {/* Center Label: Vibrant Colorful Round Label */}
            <div className="relative w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-tr from-[#ec4899] via-[#f59e0b] to-[#38bdf8] border border-white/60 shadow-inner flex items-center justify-center">
              {/* Retro typography ring */}
              <span className="text-[6px] sm:text-[7px] font-black text-white tracking-tighter drop-shadow-xs">
                RBLX
              </span>

              {/* Center Spindle Hole */}
              <div className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#111115] border border-amber-200/90 shadow-2xs" />
            </div>
          </div>

          {/* Top Glassy Reflection Overlay (Fixed stationary gloss) */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />

          {/* Subtle Stylized Tonearm (Needle Arm) on the Edge */}
          <div
            className={`absolute top-0.5 right-0.5 origin-top-right transition-transform duration-500 pointer-events-none z-10 ${
              isPlaying ? 'rotate-[12deg] scale-90 opacity-90' : '-rotate-[25deg] scale-75 opacity-60'
            }`}
          >
            <div className="w-3 sm:w-3.5 h-0.5 bg-slate-300 rounded-full shadow-xs border-t border-white" />
            <div className="w-1 h-1 rounded-full bg-amber-400 ml-2.5 -mt-0.5 border border-amber-600 shadow-xs" />
          </div>
        </div>

        {/* Small Audio Ducking Indicator Dot when character voice is active */}
        {isPlaying && isVoiceDucking && (
          <div
            title="Nhạc đĩa than đang giảm nhỏ để nghe rõ giọng nhân vật"
            className="absolute -top-1 -left-1 px-1 py-0.2 bg-pink-500 text-white text-[8px] font-black rounded-full shadow-md animate-pulse border border-white/80"
          >
            -vol
          </div>
        )}
      </motion.button>
    </div>
  );
};

