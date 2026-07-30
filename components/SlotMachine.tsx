import React, { useState } from 'react';
import { Reel } from './Reel';
import { SymbolId, PullResult, UserState } from '@/types/game';
import { sound } from '@/utils/sound';

interface SlotMachineProps {
  userState: UserState;
  onPullCompleted: (result: PullResult) => void;
  onOpenConnectModal: () => void;
  onRequireTwitter?: () => void;
  onOpenRewardTiersModal?: () => void;
  onRequireReferral?: () => void;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  userState,
  onPullCompleted,
  onOpenConnectModal,
  onRequireTwitter,
  onOpenRewardTiersModal,
  onRequireReferral
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

    if (userState.pullsRemaining <= 0) {
      if (onRequireReferral) {
        onRequireReferral();
      }
      return;
    }

    if (isSpinning) return;

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
      {/* Main Machine Housing Card */}
      <div className="relative w-full max-w-3xl bg-[#F7F2E4] border-4 border-[#3A332B] rounded-3xl p-3 sm:p-5 md:p-6 shadow-[8px_8px_0px_0px_#3A332B] overflow-hidden">
        {/* Decorative corner rivets */}
        <div className="absolute top-3 left-3 w-3 h-3 bg-[#3A332B] rounded-full" />
        <div className="absolute top-3 right-3 w-3 h-3 bg-[#3A332B] rounded-full" />
        <div className="absolute bottom-3 left-3 w-3 h-3 bg-[#3A332B] rounded-full" />
        <div className="absolute bottom-3 right-3 w-3 h-3 bg-[#3A332B] rounded-full" />

        {/* Header Marquee Banner */}
        <div className="w-full bg-[#5D7C3B] text-[#ECE3C6] border-2 border-[#3A332B] rounded-xl py-3 px-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[2px_2px_0px_0px_#3A332B]">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/skull.png" alt="Gobboz Skull" className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow" />
            <span className="font-heading text-sm sm:text-base tracking-wider font-bold">
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

        {/* Center Retro Slot Machine Graphic Asset Container with Integrated Lever */}
        <div className="w-full flex flex-col items-center justify-center my-2">
          <div 
            className="relative w-full max-w-[620px] select-none mx-auto overflow-hidden sm:overflow-visible"
            style={{ aspectRatio: '816 / 624' }}
          >
            {/* Layer 1: Base Machine Casing (Opaque Background) */}
            <img
              src="/slot-machine/slot-machine1.png"
              alt="Gobboz Retro Slot Machine Base"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
            />

            {/* Layer 2: Three Reels Positioned Exactly Inside the Transparent Cutout Windows (z-10) */}
            <div
              className="absolute z-10"
              style={{
                top: '39.42%',
                left: '28.06%',
                width: '13.3%',
                height: '33.65%'
              }}
            >
              <Reel
                reelIndex={0}
                finalSymbolId={targetSymbols[0]}
                isSpinning={isSpinning}
                stopDelayMs={800}
                inMachineWindow={true}
              />
            </div>

            <div
              className="absolute z-10"
              style={{
                top: '39.42%',
                left: '44.00%',
                width: '13.3%',
                height: '33.65%'
              }}
            >
              <Reel
                reelIndex={1}
                finalSymbolId={targetSymbols[1]}
                isSpinning={isSpinning}
                stopDelayMs={1200}
                inMachineWindow={true}
              />
            </div>

            <div
              className="absolute z-10"
              style={{
                top: '39.42%',
                left: '59.93%',
                width: '13.3%',
                height: '33.65%'
              }}
            >
              <Reel
                reelIndex={2}
                finalSymbolId={targetSymbols[2]}
                isSpinning={isSpinning}
                stopDelayMs={1600}
                onReelStop={handleFinalReelStop}
                inMachineWindow={true}
              />
            </div>

            {/* Layer 3: Slot Machine Frame with Transparent Reel Cutouts (z-20) */}
            <img
              src="/slot-machine/slot-machine4.png"
              alt="Gobboz Retro Slot Machine Frame"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
            />

            {/* Layer 5: Interactive Lever Overlay covering the whole machine (z-40) */}
            <button
              type="button"
              onClick={() => {
                if (userState.isConnected && userState.pullsRemaining <= 0) {
                  if (onRequireReferral) onRequireReferral();
                  return;
                }
                sound.playLeverPull();
                handleStartSpin();
              }}
              disabled={isSpinning || !userState.isConnected}
              className={`absolute inset-0 w-full h-full z-40 focus:outline-none transition-transform appearance-none bg-transparent ${
                !userState.isConnected || isSpinning
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer active:scale-[0.99]'
              }`}
              title={
                !userState.isConnected
                  ? 'Connect wallet to spin'
                  : userState.pullsRemaining <= 0
                  ? 'No pulls remaining'
                  : isSpinning
                  ? 'Spinning...'
                  : 'Click anywhere on machine to spin!'
              }
            >
              <img
                src={isSpinning ? '/slot-machine/slot-machine3.png' : '/slot-machine/slot-machine2.png'}
                alt="Pull Lever"
                className="w-full h-full object-contain pointer-events-none"
              />
            </button>
          </div>

          {/* Action Button Below Machine for Easy Mobile / Desktop Access */}
          <button
            type="button"
            onClick={() => {
              if (userState.isConnected && userState.pullsRemaining <= 0) {
                if (onRequireReferral) onRequireReferral();
                return;
              }
              sound.playLeverPull();
              handleStartSpin();
            }}
            disabled={isSpinning || !userState.isConnected}
            className={`mt-4 w-full max-w-[260px] py-3.5 px-6 font-pixel text-xs sm:text-sm tracking-wider uppercase rounded-xl border-4 transition-all shadow-[4px_4px_0px_0px_#262320] flex items-center justify-center gap-2 ${
              !userState.isConnected
                ? 'bg-[#E6DEC4] border-[#3A332B] text-[#3A332B] cursor-not-allowed opacity-70'
                : isSpinning
                ? 'bg-[#763D52] border-[#3A332B] text-[#ECE3C6] cursor-wait animate-pulse'
                : userState.pullsRemaining <= 0
                ? 'bg-[#E6DEC4] hover:bg-[#D5CCB4] border-[#3A332B] text-[#3A332B] active:translate-y-1 cursor-pointer'
                : 'bg-[#C49B33] hover:bg-[#B38D2C] border-[#3A332B] text-[#262320] active:translate-y-1 cursor-pointer'
            }`}
          >
            {isSpinning ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ECE3C6] animate-ping" />
                <span>SPINNING REELS...</span>
              </>
            ) : !userState.isConnected ? (
              <span>CONNECT WALLET TO PULL</span>
            ) : userState.pullsRemaining <= 0 ? (
              <span>NO PULLS REMAINING</span>
            ) : (
              <span>PULL LEVER TO LOOT</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
