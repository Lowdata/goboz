import React, { useState } from 'react';
import { Reel } from './Reel';
import { Lever } from './Lever';
import { SymbolId, PullResult, UserState } from '@/types/game';
import { PITY_THRESHOLD } from '@/utils/constants';
import { sound } from '@/utils/sound';
import { Sparkles, AlertCircle } from 'lucide-react';

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

  const pityProgress = Math.min(userState.pityCounter, PITY_THRESHOLD);
  const pityPercent = (pityProgress / PITY_THRESHOLD) * 100;

  return (
    <div className="w-full flex flex-col items-center my-6">
      {/* Decorative Crown & Sword Ornament Above Machine */}
      <div className="relative mb-4 flex items-center justify-center gap-6">
        <img
          src="/crownandswordimage.png"
          alt="Gobboz Crown and Sword"
          className="w-24 sm:w-36 h-auto object-contain drop-shadow-[0_0_25px_rgba(217,165,68,0.6)] hover:scale-105 transition-transform"
        />
        <img
          src="/skull.png"
          alt="Gobboz Skull"
          className="w-20 sm:w-28 h-auto object-contain drop-shadow-[0_0_25px_rgba(127,168,62,0.6)] hover:scale-105 transition-transform"
        />
      </div>

      {/* Main Machine Casing */}
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 border-4 sm:border-8 border-stone-700 rounded-3xl p-4 sm:p-8 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Background Dungeon Skull Watermark */}
        <div className="absolute right-4 top-4 w-32 h-32 opacity-5 pointer-events-none">
          <img src="/skull.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Decorative corner rivets */}
        <div className="absolute top-3 left-3 w-3 h-3 bg-stone-600 rounded-full border border-stone-500 shadow" />
        <div className="absolute top-3 right-3 w-3 h-3 bg-stone-600 rounded-full border border-stone-500 shadow" />
        <div className="absolute bottom-3 left-3 w-3 h-3 bg-stone-600 rounded-full border border-stone-500 shadow" />
        <div className="absolute bottom-3 right-3 w-3 h-3 bg-stone-600 rounded-full border border-stone-500 shadow" />

        {/* Header Marquee Banner */}
        <div className="w-full bg-stone-950 border-2 border-stone-800 rounded-xl py-3 px-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2">
            <img src="/skull.png" alt="Gobboz" className="w-6 h-6 object-contain" />
            <span className="font-heading text-xs sm:text-sm text-amber-400 tracking-wider">
              GOBBOZ ONE-ARMED BANDIT
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenRewardTiersModal}
              className="px-2.5 py-1 bg-[#5C3D22]/20 hover:bg-[#5C3D22]/40 border border-[#5C3D22]/50 rounded text-amber-400 font-heading text-[11px] uppercase tracking-wider transition-all"
            >
              VIEW TIERS
            </button>
            <div className="flex items-center gap-2 bg-stone-900 px-3 py-1 rounded border border-stone-700">
              <span className="font-mono text-[11px] text-stone-400 uppercase">
                YOUR PULLS:
              </span>
              <span className="font-heading text-sm text-amber-400">
                {userState.isConnected ? userState.pullsRemaining : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Center Slot Reels + Right Lever Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 my-4">
          {/* Reels Display Housing */}
          <div className="relative bg-stone-950 border-4 border-amber-600/80 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col items-center">
            {/* Payline Label Banner */}
            <div className="absolute -top-3 px-3 py-0.5 bg-amber-500 text-stone-950 font-pixel text-[10px] rounded shadow-md uppercase tracking-wider">
              WINNING COMBOS PAY OUT
            </div>

            {/* 3 Reels with ~0.4s sequential stop delay for suspense */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2">
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
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="w-2 h-2 rounded-full bg-sky-500" />
              </div>
              <span className="font-pixel text-[10px] text-stone-400">
                MATCH 3x OR 2x TO LOOT
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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

        {/* Pity Timer & Bad Luck Protection Bar */}
        <div className="mt-6 pt-4 border-t border-stone-800 w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-stone-300">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="font-pixel text-xs text-parchment-200">
                NO LUCK YET? 5 EMPTY PULLS GUARANTEES YOUR NEXT ONE HITS.
              </span>
            </div>
            <span className="font-pixel text-xs text-amber-400">
              {pityProgress} / {PITY_THRESHOLD} PITY
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-stone-950 border border-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                pityProgress >= PITY_THRESHOLD
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-amber-500'
              }`}
              style={{ width: `${Math.max(pityPercent, 5)}%` }}
            />
          </div>

          {pityProgress >= PITY_THRESHOLD && (
            <p className="mt-2 text-center font-pixel text-[11px] text-amber-400 animate-bounce">
              🔥 GUARANTEED LOOT ON YOUR NEXT PULL! YANK THE LEVER NOW! 🔥
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
