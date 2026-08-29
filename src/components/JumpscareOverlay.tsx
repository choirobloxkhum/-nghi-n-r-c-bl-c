import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, HeartHandshake } from 'lucide-react';
import {
  playJumpscareSound,
  startCreepyHorrorAmbiance,
  stopCreepyHorrorAmbiance,
} from '../utils/audio';

const jumpscareImg = 'https://i.ibb.co/6JWLb3TW/4d0082874e93a7a91959637811dc9f9a.jpg';

interface JumpscareOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectYes: () => void;
  soundEnabled: boolean;
  onPlayClickSound: () => void;
}

export const JumpscareOverlay: React.FC<JumpscareOverlayProps> = ({
  isOpen,
  onClose,
  onSelectYes,
  soundEnabled,
  onPlayClickSound,
}) => {
  const [glitchText, setGlitchText] = useState('ỦA ALO SAO BẤM KHUM?!!');
  const [shakeIntensity, setShakeIntensity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      // Play sudden shocking scream & start continuous sinister creepy heartbeat drone
      playJumpscareSound(soundEnabled);
      startCreepyHorrorAmbiance(soundEnabled);

      const texts = [
        'TA NÓI LÌ MÀ KHÔNG NGHE😒',
        'VÔ CHƠI ĐI NHÌN LÀM GÌ NỮA💢',
        'TA NÓI LÌ MÀ KHÔNG NGHE😒💢',
        'VÔ CHƠI ĐI NHÌN LÀM GÌ NỮA😤',
      ];
      setGlitchText(texts[Math.floor(Math.random() * texts.length)]);

      // Screen vibration / intensity pulse
      const interval = setInterval(() => {
        setShakeIntensity((prev) => (prev === 1 ? 1.05 : 1));
      }, 150);

      return () => {
        clearInterval(interval);
        stopCreepyHorrorAmbiance();
      };
    } else {
      stopCreepyHorrorAmbiance();
    }
  }, [isOpen, soundEnabled]);

  const handleCloseOverlay = () => {
    stopCreepyHorrorAmbiance();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleCloseOverlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none cursor-pointer"
    >
      {/* Red flashing alert vignette overlay */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.4, 0.8, 0.3] }}
        transition={{ duration: 0.4, repeat: Infinity }}
        className="absolute inset-0 bg-radial from-transparent via-red-950/60 to-red-900/90 pointer-events-none z-20"
      />

      {/* Dramatic Scanlines / Distortion lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] opacity-40 pointer-events-none z-30" />

      {/* Extreme Close-up Image Container with violent zoom & shake */}
      <motion.div
        initial={{ scale: 0.6, rotate: -4 }}
        animate={{
          scale: [1.15, 1.25, 1.2, 1.3, 1.22],
          rotate: [-1, 2, -2, 1, 0],
          x: [-8, 8, -6, 6, 0],
          y: [-6, 6, -4, 4, 0],
        }}
        transition={{
          duration: 0.25,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="relative w-full h-full flex items-center justify-center z-10"
      >
        <img
          src={jumpscareImg}
          alt="Dramatic Roblox wide-eyed close-up jumpscare"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter contrast-125 brightness-110 saturate-125"
        />
      </motion.div>

      {/* Dramatic Top & Bottom Cinematic Jumpscare Banners */}
      <div className="absolute top-6 left-0 right-0 z-40 flex flex-col items-center justify-center px-4 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.08, 1], y: [0, -3, 0] }}
          transition={{ duration: 0.2, repeat: Infinity }}
          className="px-6 py-2 rounded-2xl bg-red-600/90 border-2 border-white text-white font-black text-xl sm:text-3xl uppercase tracking-wider shadow-2xl shadow-red-600/80 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] flex items-center gap-3"
        >
          <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-bounce" />
          <span>{glitchText}</span>
          <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-bounce" />
        </motion.div>
      </div>

      {/* Bottom Emergency Action Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-8 left-0 right-0 z-40 flex flex-col sm:flex-row items-center justify-center gap-4 px-6 max-w-xl mx-auto w-full"
      >
        <button
          onClick={() => {
            stopCreepyHorrorAmbiance();
            onPlayClickSound();
            onClose();
            onSelectYes();
          }}
          className="w-full sm:flex-1 py-4 px-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 border-3 border-white text-white font-black text-xl sm:text-2xl shadow-[0_10px_30px_rgba(16,185,129,0.8)] transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 animate-pulse cursor-pointer"
        >
          <HeartHandshake className="w-7 h-7" />
          <span>QUAY XE CHỌN CÓ NGAY! 🏃‍♂️</span>
        </button>

        <button
          onClick={() => {
            stopCreepyHorrorAmbiance();
            onPlayClickSound();
            onClose();
          }}
          className="py-3 px-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/40 text-white font-bold text-sm backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
        >
          Đóng (Hết hồn chưa 👻)
        </button>
      </div>
    </div>
  );
};

