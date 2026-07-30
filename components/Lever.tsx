import React, { useState } from 'react';
import { sound } from '@/utils/sound';

interface LeverProps {
  onPull: () => void;
  disabled: boolean;
  isSpinning: boolean;
}

export const Lever: React.FC<LeverProps> = ({
  onPull,
  disabled,
  isSpinning
}) => {
  const [isPulled, setIsPulled] = useState(false);

  const handleLeverClick = () => {
    if (disabled || isSpinning || isPulled) return;

    sound.playLeverPull();
    setIsPulled(true);
    onPull();

    // Spring back up after the pull animation reaches bottom
    setTimeout(() => {
      setIsPulled(false);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center select-none w-full">
      {/* Mechanical Slot Machine Right-Side Lever Housing */}
      <div
        onClick={handleLeverClick}
        className={`relative w-20 sm:w-24 h-48 sm:h-56 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-950 border-4 border-amber-600/70 rounded-2xl shadow-2xl p-2 sm:p-3 flex flex-col items-center justify-between cursor-pointer group transition-all duration-200 ${
          disabled || isSpinning
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:border-amber-400 hover:shadow-amber-500/20'
        }`}
        title={
          disabled
            ? 'Connect wallet or get more pulls to spin!'
            : isSpinning
            ? 'Reels are spinning...'
            : 'Click to yank the lever!'
        }
      >
        {/* 4 Corner Bolts/Rivets */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-stone-600 border border-stone-500" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-stone-600 border border-stone-500" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-stone-600 border border-stone-500" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-stone-600 border border-stone-500" />

        {/* Top Metallic Label Plate */}
        <div className="px-1.5 py-0.5 bg-stone-950 border border-stone-700 rounded text-[8px] sm:text-[9px] font-pixel text-amber-400 tracking-wider uppercase shadow-inner">
          ONE-ARMED
        </div>

        {/* Vertical Mechanical Track Groove */}
        <div className="relative w-6 sm:w-8 h-32 sm:h-40 bg-stone-950 border-2 border-stone-700 rounded-full shadow-inner flex flex-col items-center overflow-hidden">
          {/* Subtle metal gear teeth in the groove background */}
          <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-20 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-0.5 bg-stone-400"
              />
            ))}
          </div>

          {/* Sliding Shaft & Red Ball Knob Assembly */}
          <div
            className={`absolute z-10 flex flex-col items-center transition-transform ${
              isPulled
                ? 'translate-y-12 sm:translate-y-16 duration-300 ease-in'
                : 'translate-y-1 duration-500 ease-out group-hover:translate-y-0'
            }`}
          >
            {/* Glossy Red & Gold Ball Knob */}
            <div
              className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-tr from-red-700 via-red-500 to-red-400 border-4 border-amber-400 shadow-2xl flex items-center justify-center transition-transform ${
                isPulled ? 'scale-95 brightness-90' : 'group-hover:scale-105 group-hover:brightness-110'
              }`}
            >
              {/* Glossy highlight reflection */}
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-white/60 rounded-full -translate-x-1 sm:-translate-x-2 -translate-y-1 sm:-translate-y-2 blur-[1px]" />
            </div>

            {/* Brushed Metallic Steel Shaft */}
            <div className="w-3 sm:w-4 h-16 sm:h-20 bg-gradient-to-r from-stone-500 via-stone-200 to-stone-600 border-x-2 border-stone-700 shadow-md" />

            {/* Bottom Brass Slider Pivot Joint */}
            <div className="w-6 sm:w-7 h-4 sm:h-5 bg-gradient-to-b from-amber-500 to-amber-700 border-2 border-amber-300 rounded shadow-md" />
          </div>
        </div>

        {/* Bottom Metallic Label Plate */}
        <div className="px-2 py-1 bg-stone-950 border border-stone-700 rounded text-[9px] font-pixel text-stone-400 tracking-wider uppercase shadow-inner">
          BANDIT
        </div>
      </div>

      {/* Arcade Push Button Below Housing */}
      <button
        onClick={handleLeverClick}
        disabled={disabled || isSpinning}
        className={`mt-3 w-full max-w-[140px] py-2.5 px-2.5 font-pixel text-[10px] sm:text-xs tracking-wider uppercase rounded-xl border-4 transition-all shadow-xl flex items-center justify-center gap-1.5 ${
          disabled
            ? 'bg-stone-800 border-stone-700 text-stone-500 cursor-not-allowed'
            : isSpinning
            ? 'bg-emerald-950 border-emerald-500 text-emerald-400 cursor-wait animate-pulse'
            : 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border-amber-300 text-stone-950 hover:from-amber-300 hover:to-amber-500 active:translate-y-1 shadow-amber-500/25'
        }`}
      >
        {isSpinning ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SPINNING...</span>
          </>
        ) : disabled ? (
          <span>NO PULLS</span>
        ) : (
          <>
            <span className="text-sm">🕹️</span>
            <span>PULL LEVER</span>
          </>
        )}
      </button>
    </div>
  );
};
