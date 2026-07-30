import React, { useEffect, useRef, useState } from 'react';
import { PullResult } from '@/types/game';
import { OUTCOME_TIERS } from '@/utils/constants';
import confetti from 'canvas-confetti';
import { Download, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface RewardCardModalProps {
  result: PullResult | null;
  isOpen: boolean;
  onClose: () => void;
  onShareBonusClaimed: () => void;
  twitterHandle?: string;
}

export const RewardCardModal: React.FC<RewardCardModalProps> = ({
  result,
  isOpen,
  onClose,
  onShareBonusClaimed,
  twitterHandle
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isShareClaimed, setIsShareClaimed] = useState(false);

  useEffect(() => {
    if (!isOpen || !result) return;

    const raf = requestAnimationFrame(() => {
      setIsShareClaimed(false);
    });

    if (result.tierId === 'triple_gem' || result.tierId === 'guaranteed_wl') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F5B82E', '#38BDF8', '#10B981', '#FACC15']
        });
      } catch {}
    }

    return () => cancelAnimationFrame(raf);
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: 'transparent'
      });
      const link = document.createElement('a');
      link.download = `gobboz-loot-${result.tierId}-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to generate image', err);
    }
  };

  const handleShareToX = () => {
    const tier = OUTCOME_TIERS[result.tierId];
    const tweetText = `Just pulled the @GobbozHQ lever and landed: ${tier.title}!\n\nPull the Lever. Loot the List. WE GIB. WE GRIB. WE GOBBOZ.\n\n#Gobboz #NFT`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    window.open(shareUrl, '_blank');

    if (!isShareClaimed) {
      setIsShareClaimed(true);
      onShareBonusClaimed();
    }
  };

  const walletDisplay = `${result.walletAddress.substring(0, 6)}...${result.walletAddress.substring(result.walletAddress.length - 4)}`;

  let artSrc = '/art-loss.png';
  let title = twitterHandle ? (twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`) : walletDisplay;
  let typeLine = 'NOTHING · EMPTY HANDED';
  let symbolIcon = '/skull.png';
  let rulesText = 'This goblin pulled the lever and got absolutely nothing. The machine takes, and the machine laughs.';
  let flavorText = 'Better luck next time, scrub.';
  let stamp = 'LOSS';
  
  if (result.tierId === 'guaranteed_wl' || result.tierId === 'triple_gem') {
    artSrc = '/art-gtd.png';
    typeLine = 'GUARANTEED · MINT SECURED';
    symbolIcon = '/treasure.png'; 
    rulesText = 'This goblin pulled the lever and walked away with a guaranteed spot. No raffle. No waiting. Just loot.';
    flavorText = "The machine doesn't gamble on goblins like this.";
    stamp = 'GTD';
  } else if (result.tierId === 'fcfs_raffle') {
    artSrc = '/art-fcfs.png';
    typeLine = 'FIRST COME FIRST SERVED · CLAIM WINDOW OPEN';
    symbolIcon = '/swordremovebg.png';
    rulesText = "This goblin earned a claim spot. Speed matters — the machine doesn't hold loot for stragglers.";
    flavorText = "Fast hands keep what slow hands drop.";
    stamp = 'FCFS';
  }

  const dateStr = new Date(result.timestamp).toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto pt-10 pb-10">
      <div className="relative w-full max-w-sm flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 w-10 h-10 bg-[#763D52] hover:bg-[#5D2B3D] text-[#ECE3C6] rounded-full border-2 border-[#3A332B] shadow-[2px_2px_0px_0px_#262320] flex items-center justify-center font-bold text-lg"
          aria-label="Close"
        >
          ✕
        </button>

        <div 
          ref={cardRef} 
          className="relative w-full aspect-[2.5/3.5] bg-[#111111] p-[3%] rounded-[1rem] shadow-2xl flex flex-col font-sans"
        >
          <div className="w-full h-full bg-[#AC2E21] border-2 border-[#111111] rounded-lg flex flex-col p-2 relative shadow-inner overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/30 pointer-events-none rounded-lg"></div>

            <div className="relative z-10 bg-[#E8E2D6] border-2 border-[#111111] rounded-sm shadow-sm flex items-center justify-between px-3 py-1.5 mb-2">
              <h2 className="font-mono font-bold text-lg text-black tracking-wide leading-none">{title}</h2>
              <div className="w-5 h-5 bg-[#C4C4C4] border-2 border-[#111111] rounded-full flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
                <img src={symbolIcon} alt="Symbol" className="w-3 h-3 object-contain" />
              </div>
            </div>

            <div className="relative z-10 w-full flex-1 bg-[#111111] border-2 border-[#111111] rounded-sm overflow-hidden mb-2 shadow-inner">
              <img src={artSrc} alt="Card Art" className="w-full h-full object-cover object-center" />
            </div>

            <div className="relative z-10 bg-[#E8E2D6] border-2 border-[#111111] rounded-sm shadow-sm flex items-center justify-between px-3 py-1 mb-2">
              <span className="font-mono font-bold text-sm text-black tracking-wide leading-none">{typeLine}</span>
              <img src="/skull.png" alt="Set" className="w-3 h-3 object-contain" />
            </div>

            <div className="relative z-10 bg-[#E8E2D6] border-2 border-[#111111] rounded-sm shadow-sm flex flex-col p-3 mb-1 min-h-[30%]">
              <p className="font-mono text-base text-black leading-snug mb-3">
                {rulesText}
              </p>
              
              <div className="w-[80%] mx-auto h-[1px] bg-black/30 mb-2"></div>
              
              <p className="font-mono italic text-sm text-black/80 leading-snug">
                {flavorText}
              </p>
            </div>

            <div className="relative z-10 flex justify-between items-end px-1 pt-0.5 text-white/90 text-[10px] font-sans">
              <div className="flex flex-col">
                <span className="font-bold">{dateStr}</span>
                <span className="opacity-80">GOBBOZ TM & © 2026</span>
              </div>
              <div className="font-heading text-lg drop-shadow-md">
                {stamp}
              </div>
            </div>

          </div>
        </div>

        <div className="w-full flex flex-col gap-3 mt-6">
          <button
            onClick={handleShareToX}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#5D7C3B] hover:bg-[#4E6B30] text-[#ECE3C6] border-2 border-[#3A332B] font-pixel text-xs tracking-wider rounded-xl shadow-[4px_4px_0px_0px_#262320] active:translate-y-0.5 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {isShareClaimed
                ? 'SHARED (+1 BONUS PULL ADDED!)'
                : 'SHARE TO X (+1 BONUS PULL)'}
            </span>
          </button>

          <button
            onClick={handleDownloadPng}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#C49B33] hover:bg-[#B38D2C] text-[#262320] border-2 border-[#3A332B] font-pixel text-xs tracking-wider rounded-xl shadow-[4px_4px_0px_0px_#262320] active:translate-y-0.5 transition-all"
          >
            <Download className="w-4 h-4 text-[#262320]" />
            <span>DOWNLOAD COLLECTIBLE CARD</span>
          </button>
          
          {isShareClaimed && (
            <p className="text-xs text-[#5D7C3B] font-pixel flex items-center justify-center gap-1 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Bonus pull unlocked! Check your balance.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
