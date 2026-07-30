import React, { useEffect, useState } from 'react';
import { SymbolId } from '@/types/game';
import { SYMBOL_LIST } from '@/utils/constants';
import { SymbolIcon } from './SymbolIcon';
import { sound } from '@/utils/sound';

interface ReelProps {
  finalSymbolId: SymbolId;
  isSpinning: boolean;
  stopDelayMs: number;
  onReelStop?: () => void;
  reelIndex: number;
  inMachineWindow?: boolean;
}

export const Reel: React.FC<ReelProps> = ({
  finalSymbolId,
  isSpinning,
  stopDelayMs,
  onReelStop,
  inMachineWindow = false
}) => {
  const [currentSymbol, setCurrentSymbol] = useState<SymbolId>(finalSymbolId);
  const [isLocallySpinning, setIsLocallySpinning] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let stopTimeoutId: NodeJS.Timeout | null = null;

    if (isSpinning) {
      const raf = requestAnimationFrame(() => {
        setIsLocallySpinning(true);
      });
      intervalId = setInterval(() => {
        const randIndex = Math.floor(Math.random() * SYMBOL_LIST.length);
        setCurrentSymbol(SYMBOL_LIST[randIndex].id);
      }, 70);

      stopTimeoutId = setTimeout(() => {
        if (intervalId) clearInterval(intervalId);
        setCurrentSymbol(finalSymbolId);
        setIsLocallySpinning(false);
        sound.playReelStop();
        if (onReelStop) onReelStop();
      }, stopDelayMs);

      return () => {
        cancelAnimationFrame(raf);
        if (intervalId) clearInterval(intervalId);
        if (stopTimeoutId) clearTimeout(stopTimeoutId);
      };
    } else {
      const raf = requestAnimationFrame(() => {
        setIsLocallySpinning(false);
        setCurrentSymbol(finalSymbolId);
      });
      return () => {
        cancelAnimationFrame(raf);
      };
    }
  }, [isSpinning, finalSymbolId, stopDelayMs, onReelStop]);

  if (inMachineWindow) {
    return (
      <div
        className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden transition-all ${
          isLocallySpinning
            ? 'bg-[#E6DEC4] animate-pulse'
            : 'bg-[#F4EFE6]'
        }`}
      >
        {/* Top & Bottom cylinder shadow */}
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#3A332B]/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[#3A332B]/20 to-transparent z-10 pointer-events-none" />

        {/* Spinning Symbol Icon */}
        <div
          className={`z-20 transition-all duration-75 flex flex-col items-center justify-center p-2 sm:p-3 ${
            isLocallySpinning ? 'blur-[1px] scale-90 opacity-80' : 'scale-100 opacity-100'
          }`}
        >
          <div className="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center">
            <SymbolIcon symbolId={currentSymbol} size={48} showLabel={false} />
          </div>
          <span className="font-pixel text-[9px] sm:text-[10px] uppercase text-[#3A332B] mt-2 font-bold tracking-wider">
            {SYMBOL_LIST.find((s) => s.id === currentSymbol)?.name}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-16 sm:w-20 md:w-24 lg:w-24 xl:w-28 h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 bg-[#F7F2E4] border-4 rounded-xl flex flex-col items-center justify-center overflow-hidden transition-all shadow-[4px_4px_0px_0px_#3A332B] ${
        isLocallySpinning
          ? 'border-[#5D7C3B] bg-[#ECE3C6] animate-pulse'
          : 'border-[#3A332B]'
      }`}
      style={{
        background: isLocallySpinning ? '#EBE3CA' : '#F7F2E4'
      }}
    >
      {/* Top & Bottom Subtle Shadow for cylindrical reel depth */}
      <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#3A332B]/15 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#3A332B]/15 to-transparent z-10 pointer-events-none" />

      {/* Center Winning Payline Highlight Frame */}
      <div className="absolute inset-x-2 inset-y-6 border-2 border-dashed border-[#C49B33]/60 rounded pointer-events-none z-10" />

      {/* Spinning Symbol Icon */}
      <div
        className={`z-20 transition-all duration-75 flex flex-col items-center justify-center ${
          isLocallySpinning ? 'blur-[1px] scale-95 opacity-80' : 'scale-100 opacity-100'
        }`}
      >
        <SymbolIcon symbolId={currentSymbol} size={72} showLabel={!isLocallySpinning} />
      </div>

      {/* Corner rivet screws */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-[#3A332B] rounded-full" />
      <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3A332B] rounded-full" />
      <div className="absolute bottom-1.5 left-1.5 w-2 h-2 bg-[#3A332B] rounded-full" />
      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-[#3A332B] rounded-full" />
    </div>
  );
};
