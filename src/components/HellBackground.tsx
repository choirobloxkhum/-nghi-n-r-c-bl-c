import React from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, Skull } from 'lucide-react';
import diemVuongBgImage from '../assets/images/diem_vuong_hell_bg_1787400265339.jpg';

export const HellBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. DIÊM VƯƠNG / DIÊM LA ĐIỆN ARTWORK WALLPAPER */}
      <div className="absolute inset-0">
        <img
          src={diemVuongBgImage}
          alt="Diêm La Điện Underworld Palace Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transform filter brightness-95 contrast-115"
        />
      </div>

      {/* 2. ATMOSPHERIC COLOR GRADING & READABILITY MASKS (HARMONIZED CRIMSON & IMPERIAL PURPLE) */}
      {/* Dark top-to-bottom vignette gradient blending Deep Crimson and Yama Violet */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#11030e]/88 via-[#18051e]/75 to-[#0b020a]/92 backdrop-blur-[0.5px]" />

      {/* Center radial gradient shadow to soften detail behind foreground UI cards */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(14,3,18,0.75)_80%)]" />

      {/* Bottom glowing dual red-purple magma and soul-fire accent */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-red-950/40 via-purple-900/25 to-transparent" />

      {/* 3. ROTATING DIÊM VƯƠNG ANCIENT TALISMAN RUNIC GLYPH */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] opacity-20 pointer-events-none"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg 20deg, rgba(220,38,38,0.7) 20deg 35deg, transparent 35deg 60deg, rgba(168,85,247,0.7) 60deg 75deg, transparent 75deg 120deg, rgba(220,38,38,0.7) 120deg 135deg, transparent 135deg 180deg, rgba(147,51,234,0.7) 180deg 195deg, transparent 195deg 240deg, rgba(239,68,68,0.7) 240deg 255deg, transparent 255deg 300deg, rgba(168,85,247,0.7) 300deg 315deg, transparent 315deg 360deg)',
        }}
      />

      {/* 4. FLOATING DIÊM VƯƠNG RUNE EMBLEM */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 left-[8%] hidden lg:flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-red-900/90 via-purple-900/90 to-black/95 border border-purple-400/60 shadow-[0_0_20px_rgba(220,38,38,0.6)] backdrop-blur-sm"
      >
        <Flame className="w-5 h-5 text-red-400 fill-purple-500 animate-pulse" />
      </motion.div>

      {/* 5. BLOOD-AMETHYST MOON AURA PULSE IN TOP RIGHT */}
      <div className="absolute top-12 right-[12%] hidden sm:block w-36 h-36 rounded-full pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full rounded-full bg-gradient-to-tr from-red-600/30 to-purple-600/30 blur-2xl"
        />
      </div>

      {/* 6. UPWARD FLOATING SOUL EMBERS & MA TRƠI / SPIRIT SPARKS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(28)].map((_, i) => {
          const isCrimson = i % 3 === 0;
          const isViolet = i % 3 === 1;
          const particleColor = isCrimson
            ? 'bg-gradient-to-t from-red-600 via-rose-500 to-amber-300 shadow-[0_0_8px_#ef4444]'
            : isViolet
            ? 'bg-gradient-to-t from-purple-600 via-fuchsia-400 to-pink-200 shadow-[0_0_8px_#c084fc]'
            : 'bg-gradient-to-t from-red-700 via-purple-500 to-amber-200 shadow-[0_0_8px_#a855f7]';

          return (
            <motion.div
              key={`hell-ember-${i}`}
              animate={{
                y: ['105vh', '-10vh'],
                x: [0, i % 2 === 0 ? 30 : -30, i % 2 === 0 ? -15 : 15],
                opacity: [0, 0.85, 0],
                scale: [0.3, 1.2, 0.2],
              }}
              transition={{
                duration: 3.8 + (i % 5) * 1.2,
                repeat: Infinity,
                delay: (i * 0.2) % 3.8,
                ease: 'easeOut',
              }}
              className={`absolute rounded-full ${particleColor}`}
              style={{
                left: `${(i * 100) / 28 + 1}%`,
                width: `${3 + (i % 4) * 2}px`,
                height: `${3 + (i % 4) * 2}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
