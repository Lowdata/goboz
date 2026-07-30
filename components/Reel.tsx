import React, { useEffect, useState } from 'react';
import { SymbolId } from '@/types/game';
import { SYMBOLS, SYMBOL_LIST } from '@/utils/constants';
import { SymbolIcon } from './SymbolIcon';
import { sound } from '@/utils/sound';

interface ReelProps {
  finalSymbolId: SymbolId;
  isSpinning: boolean;
  stopDelayMs: number;
  onReelStop?: () => void;
  reelIndex: number;
}

export const Reel: React.FC<ReelProps> = ({
  finalSymbolId,
  isSpinning,
  stopDelayMs,
  onReelStop,
  reelIndex
}) => {
  const [currentSymbol, setCurrentSymbol] = useState<SymbolId>(finalSymbolId);
  const [isLocallySpinning, setIsLocallySpinning] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let stopTimeoutId: NodeJS.Timeout | null = null;

    if (isSpinning) {
      setIsLocallySpinning(true);
      // Rapidly cycle symbols to simulate spinning reels
      intervalId = setInterval(() => {
        const randIndex = Math.floor(Math.random() * SYMBOL_LIST.length);
        setCurrentSymbol(SYMBOL_LIST[randIndex].id);
      }, 70);

      // Schedule stopping left, center, right in sequence (~400ms apart)
      stopTimeoutId = setTimeout(() => {
        if (intervalId) clearInterval(intervalId);
        setCurrentSymbol(finalSymbolId);
        setIsLocallySpinning(false);
        sound.playReelStop();
        if (onReelStop) onReelStop();
      }, stopDelayMs);
    } else {
      setIsLocallySpinning(false);
      setCurrentSymbol(finalSymbolId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (stopTimeoutId) clearTimeout(stopTimeoutId);
    };
  }, [isSpinning, finalSymbolId, stopDelayMs, onReelStop]);

  const symbolData = SYMBOLS[currentSymbol];

  return (
    <div
      className={`relative w-20 sm:w-24 md:w-28 lg:w-32 xl:w-36 h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 bg-[#F7F2E4] border-4 rounded-xl flex flex-col items-center justify-center overflow-hidden transition-all shadow-[4px_4px_0px_0px_#3A332B] ${
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
