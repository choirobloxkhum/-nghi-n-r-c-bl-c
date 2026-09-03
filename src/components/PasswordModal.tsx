import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Unlock, Play, ChevronRight } from 'lucide-react';
import { RPCharacter } from '../types';
import { playUiClick } from '../utils/audio';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: RPCharacter | null;
  soundEnabled: boolean;
  isHellMode?: boolean;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  character,
  soundEnabled,
  isHellMode = false,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Reset state when opened with a new character
  React.useEffect(() => {
    if (isOpen) {
      setPasswordInput('');
      setError('');
      setIsUnlocked(false);
    }
  }, [isOpen, character]);

  if (!character) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playUiClick(soundEnabled);
    if (passwordInput.toLowerCase().trim() === character.password?.toLowerCase()) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Mật khẩu chưa đúng nha, nghĩ kỹ lại nè! ❌');
    }
  };

  const handlePlayReal = () => {
    playUiClick(soundEnabled);
    if (character.playUrl) {
      window.open(character.playUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-md rounded-3xl overflow-hidden border-2 ${
              isHellMode 
                ? 'bg-gradient-to-b from-[#3f0f0f] to-black border-red-900 shadow-[0_10px_40px_rgba(220,38,38,0.3)]' 
                : 'bg-[#fffdf0] border-amber-200 shadow-[0_15px_40px_rgba(245,158,11,0.25)]'
            }`}
          >
            {/* Header */}
            <div className={`relative h-24 flex items-center justify-center ${
              isHellMode
                ? 'bg-gradient-to-r from-red-900 via-red-950 to-black'
                : 'bg-gradient-to-r from-amber-400 to-amber-600'
            }`}>
              <div className={`absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] ${
                isHellMode ? 'mix-blend-overlay' : ''
              }`} />
              <div className={`absolute -bottom-10 w-20 h-20 rounded-full border-4 shadow-lg overflow-hidden z-10 ${
                isHellMode ? 'border-black bg-black' : 'border-white bg-white'
              }`}>
                <img src={character.avatarUrl} alt={character.name} className="w-full h-full object-cover" />
              </div>
              <button
                onClick={onClose}
                className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors z-20 ${
                  isHellMode ? 'bg-black/20 text-white hover:bg-black/40' : 'bg-white/30 text-amber-950 hover:bg-white/50'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="pt-14 pb-8 px-6 text-center">
              <h3 className={`text-xl font-black mb-1 ${isHellMode ? 'text-red-50' : 'text-stone-800'}`}>
                {character.name}
              </h3>
              <p className={`text-sm font-medium mb-6 ${isHellMode ? 'text-red-400/80' : 'text-stone-500'}`}>
                Khu vực riêng tư - Yêu cầu mật khẩu
              </p>

              {!isUnlocked ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {character.passwordHint && (
                    <div className={`rounded-xl p-3 text-sm border shadow-sm text-left relative mt-4 ${
                      isHellMode 
                        ? 'bg-red-950/40 border-red-900/60 text-red-200' 
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      <div className={`absolute -top-3 left-4 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isHellMode
                          ? 'bg-red-900 text-red-100'
                          : 'bg-amber-400 text-amber-950'
                      }`}>
                        Gợi ý
                      </div>
                      <p className="font-semibold mb-1 mt-1">{character.passwordHint}</p>
                      <p className={`italic text-xs font-medium ${isHellMode ? 'text-red-400/80' : 'text-amber-700/80'}`}>
                        Pass không viết hoa, không viết dấu, không khoảng cách.
                      </p>
                    </div>
                  )}

                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${isHellMode ? 'text-red-600/70' : 'text-stone-400'}`} />
                    </div>
                    <input
                      type="text"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl leading-5 transition-all font-medium focus:outline-none focus:ring-4 ${
                        isHellMode
                          ? 'bg-black/40 border-red-900/50 text-red-100 placeholder-red-800 focus:ring-red-900/40 focus:border-red-700'
                          : 'bg-white border-amber-300 text-stone-900 placeholder-stone-400 focus:ring-amber-500/30 focus:border-orange-400 shadow-inner'
                      }`}
                      placeholder="Nhập mật khẩu..."
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-sm font-bold ${isHellMode ? 'text-red-500' : 'text-red-500'}`}
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl transition-all ${
                      isHellMode
                        ? 'bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 hover:to-red-900 text-red-50 border border-red-800/50 shadow-[0_4px_15px_rgba(153,27,27,0.3)] active:scale-95'
                        : 'bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-[0_4px_0_rgb(234,88,12)] active:translate-y-1 active:shadow-[0_0px_0_rgb(234,88,12)]'
                    }`}
                  >
                    <span>Mở khóa</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex justify-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner border-2 ${
                      isHellMode
                        ? 'bg-red-950/60 text-red-500 border-red-900/50'
                        : 'bg-green-100 text-green-500 border-green-200'
                    }`}>
                      <Unlock className="w-8 h-8" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={`text-lg font-bold mb-1 ${isHellMode ? 'text-red-100' : 'text-stone-800'}`}>
                      Đã mở khóa thành công!
                    </h4>
                    <p className={`text-sm ${isHellMode ? 'text-red-400/80' : 'text-stone-500'}`}>
                      Bây giờ bạn có thể tương tác với {character.name}
                    </p>
                  </div>

                  <button
                    onClick={handlePlayReal}
                    className={`w-full flex items-center justify-center gap-2 font-black py-4 px-4 rounded-xl transition-all ${
                      isHellMode
                        ? 'bg-gradient-to-r from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 text-white shadow-red-900/40 border border-red-700/50 active:scale-95'
                        : 'bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-[0_4px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-[0_0px_0_rgb(21,128,61)]'
                    }`}
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>CHƠI NGAY</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
