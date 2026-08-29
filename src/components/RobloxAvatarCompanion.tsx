import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

const avatarImg = 'https://i.ibb.co/sLXrS2L/FB-IMG-1787048727875.jpg';

interface RobloxAvatarCompanionProps {
  dialogue?: string;
  reaction?: 'idle' | 'happy' | 'scared' | 'excited';
  onClickAvatar: () => void;
}

export const RobloxAvatarCompanion: React.FC<RobloxAvatarCompanionProps> = ({
  dialogue = 'Welcome my roblox\nkid ദ്ദി(~ ` ᴗ - ~) ✧',
  reaction = 'idle',
  onClickAvatar,
}) => {
  const displayText = dialogue || 'Welcome my roblox\nkid ദ്ദി(~ ` ᴗ - ~) ✧';

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Dynamic Speech Bubble with animated entry */}
      <AnimatePresence mode="wait">
        <motion.div
          key={displayText}
          initial={{ opacity: 0, y: 10, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          className="relative mb-3.5 max-w-[320px] sm:max-w-[460px] bg-white text-slate-900 px-6 py-3 rounded-[24px] shadow-[0_12px_28px_rgba(0,0,0,0.18)] border-3 border-slate-900 text-center font-bold text-sm sm:text-base leading-snug flex flex-col items-center justify-center font-dessert"
        >
          {/* Subtle sparkle decor on bubble corner */}
          <div className="absolute -top-2.5 -right-2 w-6 h-6 rounded-full bg-amber-300 border-2 border-slate-900 flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-amber-900 text-amber-900 stroke-none animate-spin [animation-duration:8s]" />
          </div>

          {displayText.split('\n').map((line, idx) => (
            <span key={idx} className="tracking-wide block">
              {line}
            </span>
          ))}
          
          {/* Speech bubble arrow pointer */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-3 border-b-3 border-slate-900 rotate-45" />
        </motion.div>
      </AnimatePresence>

      {/* Avatar Card Frame: Perfectly Round (Gentle breathing float & interactive click) */}
      <motion.div
        animate={{
          y: reaction === 'excited' ? [-4, 4, -4] : [0, -6, 0],
          rotate: reaction === 'scared' ? [-3, 3, -3] : [0, 0, 0],
        }}
        transition={{
          duration: reaction === 'excited' ? 0.35 : 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
        whileTap={{ scale: 0.92 }}
        onClick={onClickAvatar}
        className="cursor-pointer group relative"
        title="Bấm vào mình nè! ✨"
      >
        {/* Glowing Aura circle behind avatar */}
        <div className="absolute -inset-2.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-pink-300 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />

        {/* Floating Heart / Tap hint badge */}
        <div className="absolute -top-2 -right-1 z-20 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-[10px] shadow-md border border-white flex items-center gap-1 animate-bounce">
          <Heart className="w-2.5 h-2.5 fill-white stroke-none" />
          <span>Tap!</span>
        </div>

        {/* Round Avatar Container with Golden border */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-b from-[#FDE047] via-[#FBBF24] to-[#F59E0B] shadow-2xl border-4 border-white overflow-visible flex items-center justify-center">
          {/* Yellow curler on top of hair */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 sm:w-9 h-2.5 sm:h-3.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 rounded-full border border-black/70 z-20 flex items-center justify-around px-1 shadow-xs">
            <span className="w-0.5 h-1 sm:h-1.5 bg-black/40 rounded-full" />
            <span className="w-0.5 h-1 sm:h-1.5 bg-black/40 rounded-full" />
            <span className="w-0.5 h-1 sm:h-1.5 bg-black/40 rounded-full" />
          </div>

          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden shadow-inner relative">
            <img
              src={avatarImg}
              alt="Avatar Maruko Meme"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[center_30%] scale-110 transform group-hover:scale-120 transition-transform duration-300"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
