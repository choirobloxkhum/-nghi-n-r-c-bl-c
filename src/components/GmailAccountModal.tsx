import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, X, ShieldCheck, Sparkles, UserCheck, LogOut } from 'lucide-react';
import { RPCharacter } from '../types';

interface GmailAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSaveEmail: (newEmail: string) => void;
  votedCharacters: string[];
  allCharacters: RPCharacter[];
}

export const GmailAccountModal: React.FC<GmailAccountModalProps> = ({
  isOpen,
  onClose,
  currentEmail,
  onSaveEmail,
  votedCharacters,
  allCharacters,
}) => {
  const [inputEmail, setInputEmail] = useState(currentEmail);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setInputEmail(currentEmail);
    setErrorMsg('');
  }, [currentEmail, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputEmail.trim().toLowerCase();
    if (!clean || !clean.includes('@') || clean.length < 5) {
      setErrorMsg('Vui lòng nhập địa chỉ Gmail của bạn (VD: tenban@gmail.com)');
      return;
    }
    setErrorMsg('');
    onSaveEmail(clean);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  const handleClearEmail = () => {
    onSaveEmail('');
    setInputEmail('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-sky-100 overflow-hidden font-dessert"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0284c7] to-[#0369a1] px-5 py-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/40">
                <Mail className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg leading-tight flex items-center gap-1.5">
                  <span>Tài Khoản Gmail Thả Robux</span>
                </h3>
                <p className="text-[11px] text-sky-100 font-bold">Mỗi Gmail chỉ được thả tối đa 1 R$ / nhân vật</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Rule Callout Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm font-bold flex items-start gap-2.5">
              <span className="text-lg">💰</span>
              <div className="space-y-1">
                <p className="text-amber-900 font-black">Quy tắc thả Robux vĩnh viễn:</p>
                <p className="text-amber-800 text-[11.5px] leading-relaxed">
                  Nhập địa chỉ Gmail chính chủ của bạn để thả <strong>1 Robux (+1 R$)</strong> cho nhân vật bạn thích. Hệ thống sẽ ghi nhớ và lưu trữ vĩnh viễn không bao giờ bị mất!
                </p>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Địa chỉ Gmail chính chủ của bạn
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={inputEmail}
                    onChange={(e) => {
                      setInputEmail(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="VD: emailcuaban@gmail.com"
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-bold text-slate-800 outline-none transition-all"
                  />
                </div>
                {errorMsg && <p className="text-xs text-rose-500 font-bold mt-1">{errorMsg}</p>}
              </div>

              {/* Stats of active account */}
              {currentEmail && (
                <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs font-bold text-sky-900">
                  <span className="flex items-center gap-1.5 truncate">
                    <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="truncate">Đang dùng: <strong>{currentEmail}</strong></span>
                  </span>
                  <span className="bg-sky-200 text-sky-950 px-2 py-0.5 rounded-full font-black text-[11px] shrink-0">
                    {votedCharacters.length} / {allCharacters.length} đã thả
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-2 flex items-center gap-2">
                {currentEmail ? (
                  <button
                    type="button"
                    onClick={handleClearEmail}
                    title="Đăng xuất / Đổi tài khoản"
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs cursor-pointer transition-all flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đổi</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                  >
                    Hủy
                  </button>
                )}

                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-extrabold text-xs shadow-md border-t border-white/40 border-b-2 border-sky-700 active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                      <span>Đã lưu thành công!</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-yellow-300" />
                      <span>{currentEmail ? 'Cập Nhật Gmail' : 'Xác Nhận Gmail'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

