import React from 'react';
import { Maximize2, Sparkles } from 'lucide-react';

interface RobloxTopBarProps {
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const RobloxTopBar: React.FC<RobloxTopBarProps> = () => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="relative z-30 w-full px-4 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between backdrop-blur-md bg-black/20 border-b border-white/25 shadow-md font-dessert">
      {/* Sleek Branding Elements (Far Left) */}
      <div className="flex items-center gap-3">
        <div className="relative group cursor-pointer">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 p-1.5 border-2 border-yellow-300">
            {/* Iconic Roblox tilted square block with centered hollow square cutout */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full text-black drop-shadow-xs"
            >
              <path
                d="M5.16 0L0 19.34 18.84 24l5.16-19.34L5.16 0zm9.4 14.65l-4.71-1.16 1.16-4.71 4.71 1.16-1.16 4.71z"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 text-yellow-300 animate-pulse pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 fill-yellow-300" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white text-lg sm:text-2xl font-black tracking-tight app-title-3d uppercase">
            Ổ NGHIỆN ROBLOX
          </span>
          <span className="hidden xs:inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-400 text-sky-950 text-[10px] font-black tracking-wider uppercase shadow-xs">
            GAME APP
          </span>
        </div>
      </div>

      {/* Right Controls: Fullscreen */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Fullscreen button */}
        <button
          id="btn-fullscreen-toggle"
          onClick={toggleFullscreen}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 hover:bg-white/35 backdrop-blur-md text-white border border-white/30 flex items-center justify-center transition-all shadow-sm focus:outline-none cursor-pointer active:scale-95"
          title="Toàn màn hình"
          aria-label="Toggle fullscreen"
        >
          <Maximize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
};


