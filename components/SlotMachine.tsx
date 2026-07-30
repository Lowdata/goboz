import React, { useState } from 'react';
import { Reel } from './Reel';
import { Lever } from './Lever';
import { SymbolId, PullResult, UserState } from '@/types/game';
import { sound } from '@/utils/sound';

interface SlotMachineProps {
  userState: UserState;
  onPullCompleted: (result: PullResult) => void;
  onOpenConnectModal: () => void;
  onRequireTwitter?: () => void;
  onOpenRewardTiersModal?: () => void;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  userState,
  onPullCompleted,
  onOpenConnectModal,
  onRequireTwitter,
  onOpenRewardTiersModal
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetSymbols, setTargetSymbols] = useState<[SymbolId, SymbolId, SymbolId]>([
    'skull',
    'mushroom',
    'gold_coin'
  ]);
  const [pendingResult, setPendingResult] = useState<PullResult | null>(null);

  const handleStartSpin = async () => {
    if (!userState.isConnected || !userState.walletAddress) {
      onOpenConnectModal();
      return;
    }

    if (userState.pullsRemaining <= 0 || isSpinning) return;

    setIsSpinning(true);
    setPendingResult(null);

    try {
      const res = await fetch('/api/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (!res.ok) {
        const errData = await res.json();
        if (errData.error === 'TWITTER_REQUIRED') {
          if (onRequireTwitter) {
            onRequireTwitter();
          } else {
            alert(errData.message || 'You must link your Twitter handle before pulling the lever!');
          }
        } else {
          alert(errData.error || 'Failed to pull lever');
        }
        setIsSpinning(false);
        return;
      }

      const data = await res.json();
      setTargetSymbols(data.symbols);
      setPendingResult(data);
    } catch (err) {
      console.error('Error pulling lever:', err);
      setIsSpinning(false);
    }
  };

  // Called when the 3rd reel finishes stopping
  const handleFinalReelStop = () => {
    setIsSpinning(false);
    if (pendingResult) {
      if (pendingResult.tierId === 'triple_gem') {
        sound.playJackpot();
      } else if (pendingResult.tierId === 'guaranteed_wl') {
        sound.playWin();
      } else if (pendingResult.tierId === 'fcfs_raffle') {
        sound.playWin();
      } else {
        sound.playNoMatch();
      }
      onPullCompleted(pendingResult);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main Machine Casing */}
      <div className="relative w-full max-w-3xl bg-[#F7F2E4] border-4 border-[#3A332B] rounded-3xl p-3 sm:p-5 md:p-6 shadow-[8px_8px_0px_0px_#3A332B] overflow-hidden">
        {/* Background Dungeon Skull Watermark */}
        <div className="absolute right-4 top-4 w-32 h-32 opacity-10 pointer-events-none">
          <img src="/skullpixel-rmbg.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Decorative corner rivets */}
        <div className="absolute top-3 left-3 w-3 h-3 bg-[#3A332B] rounded-full" />
        <div className="absolute top-3 right-3 w-3 h-3 bg-[#3A332B] rounded-full" />
        <div className="absolute bottom-3 left-3 w-3 h-3 bg-[#3A332B] rounded-full" />
        <div className="absolute bottom-3 right-3 w-3 h-3 bg-[#3A332B] rounded-full" />

        {/* Header Marquee Banner */}
        <div className="w-full bg-[#5D7C3B] text-[#ECE3C6] border-2 border-[#3A332B] rounded-xl py-3 px-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[2px_2px_0px_0px_#3A332B]">
          <div className="flex items-center gap-2">
            <img src="/skullpixel-rmbg.png" alt="Gobboz Skull" className="w-6 h-6 object-contain" />
            <span className="font-heading text-xs sm:text-sm tracking-wider font-bold">
              GOBBOZ ONE-ARMED BANDIT
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenRewardTiersModal}
              className="px-3 py-1.5 bg-[#ECE3C6] hover:bg-[#E2D8B9] text-[#262320] border-2 border-[#3A332B] rounded-lg font-pixel text-xs tracking-wider transition-all shadow-[2px_2px_0px_0px_#262320]"
            >
              VIEW TIERS
            </button>
            <div className="flex items-center gap-2 bg-[#763D52] text-[#ECE3C6] px-3.5 py-1.5 rounded-lg border-2 border-[#3A332B] shadow-[2px_2px_0px_0px_#262320]">
              <span className="font-pixel text-xs uppercase">
                YOUR PULLS:
              </span>
              <span className="font-pixel text-sm font-bold text-[#F4C567]">
                {userState.isConnected ? userState.pullsRemaining : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Center Slot Reels + Right Lever Container */}
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 md:gap-5 my-3 w-full">
          {/* Reels Display Housing */}
          <div className="relative bg-[#ECE3C6] border-4 border-[#3A332B] rounded-2xl p-3 sm:p-5 md:p-6 shadow-inner flex flex-col items-center w-full max-w-full">
            {/* Payline Label Banner */}
            <div className="absolute -top-3.5 px-3.5 py-1 bg-[#763D52] text-[#ECE3C6] font-pixel text-[10px] rounded-lg border-2 border-[#3A332B] shadow-[2px_2px_0px_0px_#3A332B] uppercase tracking-wider">
              WINNING COMBOS PAY OUT
            </div>

            {/* 3 Reels with ~0.4s sequential stop delay for suspense */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-2 w-full">
              <Reel
                reelIndex={0}
                finalSymbolId={targetSymbols[0]}
                isSpinning={isSpinning}
                stopDelayMs={800}
              />
              <Reel
                reelIndex={1}
                finalSymbolId={targetSymbols[1]}
                isSpinning={isSpinning}
                stopDelayMs={1200}
              />
              <Reel
                reelIndex={2}
                finalSymbolId={targetSymbols[2]}
                isSpinning={isSpinning}
                stopDelayMs={1600}
                onReelStop={handleFinalReelStop}
              />
            </div>

            {/* Glowing Payline Indicator LEDs */}
            <div className="w-full flex justify-between items-center mt-4 px-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5D7C3B] border border-[#3A332B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#C49B33] border border-[#3A332B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#763D52] border border-[#3A332B]" />
              </div>
              <span className="font-pixel text-[10px] text-[#262320] font-bold">
                MATCH 3x OR 2x TO LOOT
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#763D52] border border-[#3A332B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#C49B33] border border-[#3A332B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#5D7C3B] border border-[#3A332B]" />
              </div>
            </div>
          </div>

          {/* Mechanical Lever Assembly */}
          <div className="flex flex-col items-center justify-center">
            <Lever
              onPull={handleStartSpin}
              disabled={
                !userState.isConnected || userState.pullsRemaining <= 0
              }
              isSpinning={isSpinning}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
