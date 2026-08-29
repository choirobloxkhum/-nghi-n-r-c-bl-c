import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Dices, Star, Heart, Flame } from 'lucide-react';
import { playUiClick } from '../utils/audio';

interface GachaWheelBannerProps {
  onOpenGacha: () => void;
  soundEnabled: boolean;
}

export const GachaWheelBanner: React.FC<GachaWheelBannerProps> = ({
  onOpenGacha,
  soundEnabled,
}) => {
  const handleClick = () => {
    playUiClick(soundEnabled);
    onOpenGacha();
  };

  return (
    <div className="relative w-full my-6 sm:my-10">
      {/* Outer Glow Halo Effect */}
      <div className="absolute -inset-1 sm:-inset-1.5 bg-gradient-to-r from-purple-600 via-amber-400 to-pink-500 rounded-3xl sm:rounded-[32px] blur-md opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse pointer-events-none" />

      {/* Main Banner Container */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#2a0845] via-[#1a0836] to-[#0f041e] border-2 sm:border-3 border-amber-300/90 shadow-[0_12px_36px_rgba(42,8,69,0.5)] p-4 sm:p-7 overflow-hidden text-white flex flex-col items-center justify-center text-center">
        {/* Roblox studs pattern overlay */}
        <div className="absolute inset-0 roblox-stud-pattern opacity-15 pointer-events-none" />

        {/* Ambient Decorative Lighting */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-purple-500/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-amber-400/25 rounded-full blur-2xl pointer-events-none" />

        {/* Floating Sparkle / Star Icons in corners */}
        <div className="absolute top-3 left-4 text-amber-300/70 animate-bounce [animation-duration:3s] pointer-events-none hidden sm:block">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute bottom-3 right-4 text-pink-300/70 animate-bounce [animation-duration:2.5s] [animation-delay:1s] pointer-events-none hidden sm:block">
          <Star className="w-5 h-5 fill-pink-300/50" />
        </div>
        <div className="absolute top-3 right-5 text-yellow-300/60 animate-spin [animation-duration:8s] pointer-events-none hidden sm:block">
          <Dices className="w-5 h-5" />
        </div>

        {/* Top Mini Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400/20 via-purple-400/30 to-pink-400/20 border border-amber-300/50 text-amber-300 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-3 sm:mb-4 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
          <span>Vòng Quay Định Mệnh Roblox RP</span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
        </div>

        {/* The Big CTA Gacha Button */}
        <motion.button
          whileHover={{ scale: 1.025, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleClick}
          className="relative group w-full max-w-2xl py-3.5 sm:py-5 px-4 sm:px-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-yellow-300 hover:via-amber-300 hover:to-yellow-400 border-2 sm:border-3 border-white text-amber-950 font-black shadow-[0_0_25px_rgba(251,191,36,0.7),inset_0_2px_4px_rgba(255,255,255,0.8)] active:shadow-inner transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-between gap-2.5 sm:gap-4"
        >
          {/* Shimmer Light Sweep Effect across button */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 pointer-events-none" />

          {/* Left Side: Animated 3D Spinning Mystery Block Icon */}
          <div className="relative shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 border-2 border-purple-300 shadow-md flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform duration-300">
            {/* Studs on mystery box */}
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/40 rounded-full" />
            <div className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-white/40 rounded-full" />
            <div className="relative text-lg sm:text-2xl font-black text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] animate-pulse">
              ?
            </div>
            {/* Tiny stars around box */}
            <Sparkles className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300 fill-yellow-300 animate-spin [animation-duration:3s]" />
          </div>

          {/* Center Text: Exact User Requested 2-Line Layout */}
          <div className="flex-1 text-center px-1 flex flex-col items-center justify-center gap-0.5 sm:gap-1">
            <div className="text-base sm:text-xl md:text-2xl font-black tracking-wide text-amber-950 uppercase drop-shadow-xs flex items-center justify-center gap-1">
              <span>🎲QUAY GACHA🎲</span>
            </div>
            <div className="text-xs sm:text-base md:text-lg font-black tracking-tight text-amber-900 uppercase">
              CHỌN CHỒNG CHỨ ĐỪNG ĐỂ CHỒNG CHỌN
            </div>
          </div>

          {/* Right Side: Animated 3D Lucky Wheel / Dice Icon */}
          <div className="relative shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 border-2 border-pink-200 shadow-md flex items-center justify-center text-white transform group-hover:-rotate-12 transition-transform duration-300">
            <Dices className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5] drop-shadow-sm animate-bounce [animation-duration:2s]" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
          </div>
        </motion.button>

        {/* Catchy Subtext below the button: Exact User Requested Text */}
        <p className="mt-2.5 sm:mt-3.5 text-amber-200/90 text-xs sm:text-sm md:text-base font-bold tracking-wide flex items-center justify-center gap-1.5 drop-shadow-xs">
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-rose-400 text-rose-400 shrink-0 inline animate-pulse" />
          <span>Hôm nay embe muốn thị tẩm anh chồng nào đây?</span>
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-rose-400 text-rose-400 shrink-0 inline animate-pulse" />
        </p>
      </div>
    </div>
  );
};
