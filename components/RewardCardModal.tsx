import React, { useEffect, useRef, useState } from 'react';
import { PullResult } from '@/types/game';
import { OUTCOME_TIERS } from '@/utils/constants';
import confetti from 'canvas-confetti';
import { Download, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import toast from 'react-hot-toast';

interface RewardCardModalProps {
  result: PullResult | null;
  isOpen: boolean;
  onClose: () => void;
  onShareBonusClaimed: () => void;
  twitterHandle?: string;
  referralCode?: string;
}

export const RewardCardModal: React.FC<RewardCardModalProps> = ({
  result,
  isOpen,
  onClose,
  onShareBonusClaimed,
  twitterHandle,
  referralCode
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !result) return;

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

  const handleShareToX = async () => {
    let tierText = '';
    if (result.tierId === 'guaranteed_wl' || result.tierId === 'triple_gem') {
      tierText = 'GUARANTEED WHITELIST';
    } else if (result.tierId === 'fcfs_raffle') {
      tierText = 'FIRST COME FIRST SERVE';
    } else {
      tierText = OUTCOME_TIERS[result.tierId].title;
    }
    
    const link = referralCode ? `${window.location.origin}/?ref=${referralCode}` : window.location.origin;
    
    let tweetText = `Just pulled the @GobbozHQ lever and landed: ${tierText}!\n\nPull the Lever. Loot the List. WE GIB. WE GRIB. WE GOBBOZ.\n\nPlay now and get +1 pull with my link!\n${link}\n\n#Gobboz #NFT`;
    
    if (result.tierId === 'no_match') {
      tweetText = `Just pulled the @GobbozHQ lever and got absolutely nothing. The machine takes, and the machine laughs. 💀\n\nTry your luck and get +1 pull with my referral link!\n${link}\n\n#Gobboz #NFT`;
    }
    
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    
    window.open(shareUrl, '_blank');
    onShareBonusClaimed();
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="fixed top-4 right-4 md:top-8 md:right-8 z-50 w-10 h-10 bg-[#763D52] hover:bg-[#5D2B3D] text-[#ECE3C6] rounded-full border-2 border-[#3A332B] shadow-[2px_2px_0px_0px_#262320] flex items-center justify-center font-bold text-lg transition-transform hover:scale-105"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="min-h-[100dvh] flex items-center justify-center p-4 py-16">
        <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          
          {/* Card Container */}
          <div className="relative w-full max-w-[260px] sm:max-w-sm flex-shrink-0">
            <div 
              ref={cardRef} 
              className="relative w-full aspect-[2.5/3.5] bg-[#111111] p-[3%] rounded-[1rem] shadow-2xl flex flex-col font-sans"
            >
              <div className="w-full h-full bg-[#AC2E21] border-2 border-[#111111] rounded-lg flex flex-col p-2 sm:p-3 relative shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/30 pointer-events-none rounded-lg"></div>

              <div className="relative z-10 bg-[#E8E2D6] border-2 border-[#111111] rounded-sm shadow-sm flex items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2 mb-1.5 sm:mb-2">
                <h2 className="font-mono font-bold text-[13px] sm:text-[15px] md:text-lg text-black tracking-wide leading-none truncate pr-2">{title}</h2>
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#C4C4C4] border-2 border-[#111111] rounded-full flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
                  <img src={symbolIcon} alt="Symbol" className="w-4 h-4 sm:w-3 sm:h-3 object-contain" />
                </div>
              </div>

              <div className="relative z-10 w-full flex-1 min-h-[90px] sm:min-h-[120px] bg-[#111111] border-2 border-[#111111] rounded-sm overflow-hidden mb-1.5 sm:mb-2 shadow-inner">
                <img src={artSrc} alt="Card Art" className="w-full h-full object-cover object-center" />
              </div>

              <div className="relative z-10 bg-[#E8E2D6] border-2 border-[#111111] rounded-sm shadow-sm flex items-center justify-between px-2 py-1 sm:px-3 sm:py-1.5 mb-1.5 sm:mb-2">
                <span className="font-mono font-bold text-[9px] sm:text-[11px] md:text-[12px] text-black tracking-wide leading-tight sm:leading-none">{typeLine}</span>
                <img src="/skull.png" alt="Set" className="w-3 h-3 sm:w-4 sm:h-4 object-contain ml-1.5 sm:ml-2 flex-shrink-0" />
              </div>

              <div className="relative z-10 bg-[#E8E2D6] border-2 border-[#111111] rounded-sm shadow-sm flex flex-col p-2 sm:p-3 mb-1 min-h-[25%] sm:min-h-[30%]">
                <p className="font-mono text-[11px] sm:text-[13px] md:text-[14px] text-black leading-snug mb-2 sm:mb-3 font-semibold">
                  {rulesText}
                </p>
                
                <div className="w-[80%] mx-auto h-[1px] bg-black/30 mb-1.5 sm:mb-2"></div>
                
                <p className="font-mono italic text-[9px] sm:text-[11px] md:text-[12px] text-black/80 leading-snug">
                  {flavorText}
                </p>
              </div>

              <div className="relative z-10 flex justify-between items-end px-1 pt-0.5 sm:pt-1 text-white/90 text-[8px] sm:text-[10px] font-sans">
                <div className="flex flex-col leading-tight">
                  <span className="font-bold">{dateStr}</span>
                  <span className="opacity-80">GOBBOZ TM & © 2026</span>
                </div>
                <div className="font-heading text-sm sm:text-lg drop-shadow-md">
                  {stamp}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Container */}
          <div className="w-full flex flex-col items-center md:items-start justify-center gap-4 md:max-w-xs mt-6 md:mt-0">
            {result.tierId !== 'no_match' && (
              <div className="text-center md:text-left font-pixel text-xs sm:text-sm text-[#FACC15] animate-pulse drop-shadow-md">
                POST YOUR CARD ON X TO CLAIM YOUR SPOT 👇
              </div>
            )}
            <div className="flex flex-row gap-4">
              <button
                onClick={handleShareToX}
                className="w-14 h-14 flex items-center justify-center bg-[#5D7C3B] hover:bg-[#4E6B30] text-[#ECE3C6] border-2 border-[#3A332B] rounded-full shadow-[4px_4px_0px_0px_#262320] active:translate-y-0.5 transition-all flex-shrink-0"
                title="Share to X"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={handleDownloadPng}
                className="w-14 h-14 flex items-center justify-center bg-[#C49B33] hover:bg-[#B38D2C] text-[#262320] border-2 border-[#3A332B] rounded-full shadow-[4px_4px_0px_0px_#262320] active:translate-y-0.5 transition-all flex-shrink-0"
                title="Download Collectible Card"
              >
                <Download className="w-5 h-5 text-[#262320]" />
              </button>
            </div>

            {result.tierId === 'no_match' && (
              <button
                onClick={() => {
                  const link = referralCode ? `${window.location.origin}/?ref=${referralCode}` : window.location.origin;
                  const tweetText = `Just pulled the @GobbozHQ lever and got absolutely nothing. The machine takes, and the machine laughs. 💀\n\nTry your luck and get +1 pull with my referral link!\n${link}\n\n#Gobboz #NFT`;
                  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
                  window.open(shareUrl, '_blank');
                }}
                className="flex items-center justify-center gap-2 py-3.5 px-4 bg-[#763D52] hover:bg-[#5D2B3D] text-[#ECE3C6] border-2 border-[#3A332B] font-pixel text-xs tracking-wider rounded-xl shadow-[4px_4px_0px_0px_#262320] shadow-[#763D52]/50 animate-pulse active:translate-y-0.5 transition-all flex-shrink-0"
                title="Invite a Friend"
              >
                <Sparkles className="w-5 h-5" />
                <span>INVITE A FRIEND (+1 PULL)</span>
              </button>
            )}
          </div>
      </div>
    </div>
    </div>
  );
};
