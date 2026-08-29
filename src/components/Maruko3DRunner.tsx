import React from 'react';
import { motion } from 'motion/react';

const marukoFaceImg = 'https://i.ibb.co/sLXrS2L/FB-IMG-1787048727875.jpg';

interface Maruko3DRunnerProps {
  isCompleted?: boolean;
}

export const Maruko3DRunner: React.FC<Maruko3DRunnerProps> = ({ isCompleted = false }) => {
  return (
    <div className="relative flex flex-col items-center justify-end select-none pointer-events-none">
      {/* Dynamic Runner Container with Forward Lean and Stride Bobbing */}
      <motion.div
        animate={
          !isCompleted
            ? {
                y: [0, -5, 0, -5, 0],
                rotate: [10, 7, 10, 7, 10],
              }
            : {
                y: [0, -12, 0],
                rotate: [0, -3, 3, 0],
                scale: [1, 1.1, 1],
              }
        }
        transition={{
          duration: !isCompleted ? 0.34 : 0.55,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative flex flex-col items-center origin-bottom filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
      >
        {/* === 1. HEAD (The girl with yellow roller & Roblox woman face) === */}
        <div className="relative z-30 mb-[-4px] flex flex-col items-center">
          {/* Yellow Roller Curler on top */}
          <div className="w-5 h-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 rounded-full border border-black/80 shadow-xs mb-[-3px] z-10 flex items-center justify-center">
            <div className="w-full flex justify-around px-0.5">
              <span className="w-0.5 h-1 bg-black/40 rounded-full" />
              <span className="w-0.5 h-1 bg-black/40 rounded-full" />
              <span className="w-0.5 h-1 bg-black/40 rounded-full" />
            </div>
          </div>

          {/* Circular Cutout Head Frame */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-black/80 shadow-sm bg-amber-100/90 relative">
            <img
              src={marukoFaceImg}
              alt="Maruko Roblox Girl"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-110 object-[center_28%]"
            />
          </div>
        </div>

        {/* === 2. 3D BLOCKY TORSO & ARMS === */}
        <div className="relative z-20 flex items-center justify-center">
          {/* BACK/LEFT ARM (Swings opposite to Right Arm) */}
          <motion.div
            animate={
              !isCompleted
                ? {
                    rotate: [45, -50, 45],
                  }
                : {
                    rotate: [-30, -50, -30],
                  }
            }
            transition={{
              duration: !isCompleted ? 0.34 : 0.55,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-2.5 h-6 bg-gradient-to-b from-white via-white to-[#fecaca] rounded-md border-[1.5px] border-black/80 origin-top absolute -left-2 top-0.5 shadow-sm -z-10"
          >
            {/* Hand */}
            <div className="w-2.5 h-2 bg-[#fed7aa] rounded-full border-t border-black/60 absolute bottom-0" />
          </motion.div>

          {/* 3D BLOCKY TORSO (Red Pinafore Dress over White Top) */}
          <div className="w-8 sm:w-9 h-7 sm:h-8 rounded-md bg-gradient-to-b from-white via-[#dc2626] to-[#b91c1c] border-[1.5px] border-black/90 shadow-md relative overflow-hidden flex flex-col items-center">
            {/* White Shirt Collar */}
            <div className="w-4 h-1.5 bg-white rounded-b-sm border-b border-black/60 z-10" />
            {/* Red Pinafore Straps */}
            <div className="w-full flex justify-between px-1 mt-[-1px] z-10">
              <div className="w-1.5 h-3 bg-[#b91c1c] border border-black/40 rounded-xs" />
              <div className="w-1.5 h-3 bg-[#b91c1c] border border-black/40 rounded-xs" />
            </div>
            {/* 3D Blocky Side Shading */}
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-black/20" />
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/20" />
          </div>

          {/* FRONT/RIGHT ARM (Swings with running motion) */}
          <motion.div
            animate={
              !isCompleted
                ? {
                    rotate: [-55, 45, -55],
                  }
                : {
                    rotate: [30, 60, 30],
                  }
            }
            transition={{
              duration: !isCompleted ? 0.34 : 0.55,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-2.5 h-6 bg-gradient-to-b from-white via-white to-[#fecaca] rounded-md border-[1.5px] border-black/80 origin-top absolute -right-2 top-0.5 shadow-sm z-30"
          >
            {/* Hand */}
            <div className="w-2.5 h-2 bg-[#fed7aa] rounded-full border-t border-black/60 absolute bottom-0" />
          </motion.div>
        </div>

        {/* === 3. 3D BLOCKY RUNNING LEGS (Alternating realistic sprint stride) === */}
        <div className="relative z-10 flex gap-1 mt-[-2px]">
          {/* LEFT LEG (Back stride) */}
          <motion.div
            animate={
              !isCompleted
                ? {
                    rotate: [-50, 50, -50],
                    y: [0, -2, 0],
                  }
                : {
                    rotate: [-10, 0, -10],
                    y: [0, 0, 0],
                  }
            }
            transition={{
              duration: !isCompleted ? 0.34 : 0.55,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-3 h-6 bg-gradient-to-b from-[#fed7aa] via-white to-[#dc2626] rounded-b-sm border-[1.5px] border-black/90 origin-top shadow-sm flex flex-col justify-end items-center"
          >
            {/* Red Sneaker/Shoe */}
            <div className="w-3.5 h-2.5 bg-[#991b1b] rounded-sm border-t border-black/60 relative -right-0.5 shadow-inner" />
          </motion.div>

          {/* RIGHT LEG (Front stride - Opposite phase) */}
          <motion.div
            animate={
              !isCompleted
                ? {
                    rotate: [50, -50, 50],
                    y: [-2, 0, -2],
                  }
                : {
                    rotate: [10, 0, 10],
                    y: [0, 0, 0],
                  }
            }
            transition={{
              duration: !isCompleted ? 0.34 : 0.55,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-3 h-6 bg-gradient-to-b from-[#fed7aa] via-white to-[#dc2626] rounded-b-sm border-[1.5px] border-black/90 origin-top shadow-sm flex flex-col justify-end items-center"
          >
            {/* Red Sneaker/Shoe */}
            <div className="w-3.5 h-2.5 bg-[#991b1b] rounded-sm border-t border-black/60 relative -right-0.5 shadow-inner" />
          </motion.div>
        </div>
      </motion.div>

      {/* === 4. RUNNING SPEED PARTICLES & DUST PUFFS ON THE PROGRESS BAR === */}
      {!isCompleted && (
        <div className="absolute -bottom-0.5 -left-4 flex items-center gap-0.5 pointer-events-none">
          <motion.span
            animate={{
              opacity: [0, 0.9, 0],
              x: [-2, -14],
              scale: [0.5, 1],
            }}
            transition={{
              duration: 0.28,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="text-[10px] text-white/90 font-bold"
          >
            💨
          </motion.span>
          <div className="w-3 h-1 bg-white/40 rounded-full blur-[0.5px] animate-pulse" />
        </div>
      )}
    </div>
  );
};
