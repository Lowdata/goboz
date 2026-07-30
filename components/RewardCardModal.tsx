import React, { useEffect, useRef, useState } from 'react';
import { PullResult } from '@/types/game';
import { SYMBOLS, OUTCOME_TIERS } from '@/utils/constants';
import { SymbolIcon } from './SymbolIcon';
import { GoblinAvatar } from './GoblinAvatar';
import confetti from 'canvas-confetti';
import { Download, Share2, Sparkles, CheckCircle2 } from 'lucide-react';

interface RewardCardModalProps {
  result: PullResult | null;
  isOpen: boolean;
  onClose: () => void;
  onShareBonusClaimed: () => void;
}

export const RewardCardModal: React.FC<RewardCardModalProps> = ({
  result,
  isOpen,
  onClose,
  onShareBonusClaimed
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isShareClaimed, setIsShareClaimed] = useState(false);

  useEffect(() => {
    if (!isOpen || !result) return;

    const raf = requestAnimationFrame(() => {
      setIsShareClaimed(false);
    });

    // Trigger confetti on Jackpot or Guaranteed WL!
    if (result.tierId === 'triple_gem' || result.tierId === 'guaranteed_wl') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F5B82E', '#38BDF8', '#10B981', '#FACC15']
        });
      } catch {
        // ignore if canvas-confetti fails
      }
    }

    // Render Canvas Reward Card for PNG download
    const renderCanvasCard = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 800;
      const height = 1000;
      canvas.width = width;
      canvas.height = height;

      // Card Background
      const tier = OUTCOME_TIERS[result.tierId];
      ctx.fillStyle = '#18181B'; // dark zinc
      ctx.fillRect(0, 0, width, height);

      // Tribal Border
      ctx.strokeStyle = '#4A3C31';
      ctx.lineWidth = 16;
      ctx.strokeRect(16, 16, width - 32, height - 32);

      // Inner gold/tier border
      ctx.strokeStyle = tier.color;
      ctx.lineWidth = 6;
      ctx.strokeRect(32, 32, width - 64, height - 64);

      // Header Title
      ctx.fillStyle = '#F4EFE6';
      ctx.font = 'bold 52px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GOBBOZ LOOT MACHINE', width / 2, 110);

      // Subheader Motto
      ctx.fillStyle = '#A3E635';
      ctx.font = '28px "Courier New", monospace';
      ctx.fillText('WE GIB. WE GRIB. WE GOBBOZ.', width / 2, 160);

      // Tier Title Banner
      ctx.fillStyle = tier.color;
      ctx.font = 'bold 44px "Courier New", monospace';
      ctx.fillText(tier.title.toUpperCase(), width / 2, 260);

      // Badge Box
      ctx.fillStyle = tier.bgColor;
      ctx.fillRect(width / 2 - 240, 290, 480, 50);
      ctx.strokeStyle = tier.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(width / 2 - 240, 290, 480, 50);

      ctx.fillStyle = tier.color;
      ctx.font = 'bold 24px "Courier New", monospace';
      ctx.fillText(tier.badge, width / 2, 323);

      // Symbols Section Header
      ctx.fillStyle = '#F4EFE6';
      ctx.font = '32px "Courier New", monospace';
      ctx.fillText('LEVER COMBO LANDED:', width / 2, 420);

      // Symbols emojis & names
      const symbolsText = result.symbols
        .map((s) => `${SYMBOLS[s].emoji} ${SYMBOLS[s].name}`)
        .join('  |  ');
      ctx.fillStyle = '#F5B82E';
      ctx.font = 'bold 30px "Courier New", monospace';
      ctx.fillText(symbolsText, width / 2, 490);

      // Reward Description
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '26px "Courier New", monospace';
      ctx.fillText(tier.description, width / 2, 600);

      // Wallet Address & Timestamp
      ctx.fillStyle = '#94A3B8';
      ctx.font = '22px "Courier New", monospace';
      ctx.fillText(`Looter: ${result.walletAddress}`, width / 2, 740);

      const dateStr = new Date(result.timestamp).toLocaleDateString();
      ctx.fillText(`Claimed On: ${dateStr}`, width / 2, 780);

      // Footer Motto
      ctx.fillStyle = '#713F12';
      ctx.fillRect(40, height - 120, width - 80, 60);
      ctx.fillStyle = '#F4EFE6';
      ctx.font = 'bold 26px "Courier New", monospace';
      ctx.fillText('GIB SHINY. KRUMP HUMIES. JOIN DA TRIBE.', width / 2, height - 82);
    };

    renderCanvasCard();

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const tier = OUTCOME_TIERS[result.tierId];

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `gobboz-loot-${result.tierId}-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareToX = () => {
    const symbolsText = result.symbols.map((s) => SYMBOLS[s].emoji).join(' ');
    const tweetText = `Just pulled the @GobbozHQ lever and landed: ${symbolsText} (${tier.title})!\n\n${tier.description}\n\nPull the Lever. Loot the List. WE GIB. WE GRIB. WE GOBBOZ. 💀🗡️\n\n#Gobboz #NFT #Allowlist`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    window.open(shareUrl, '_blank');

    if (!isShareClaimed) {
      setIsShareClaimed(true);
      onShareBonusClaimed();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg flex flex-col items-center">
        {/* Red Wax Seal Close Button */}
        <button
          onClick={onClose}
          className="wax-seal"
          aria-label="Close"
          title="Close Scroll"
        >
          ✕
        </button>

        {/* Top Wooden Rod */}
        <div className="rod rod-top">
          <span className="rod-cap left" />
          <span className="rod-cap right" />
        </div>

        {/* Parchment Body */}
        <div className="relative w-full bg-[#E7D6A6] border-x-4 border-[#3A2A20] p-6 sm:p-8 shadow-2xl parchment-unroll max-h-[85vh] text-[#262320] flex flex-col items-center text-center">
          {/* Background Crown & Sword Watermark */}
          <div className="absolute right-4 bottom-4 w-44 h-44 opacity-15 pointer-events-none">
            <img src="/crownandswordimage.png" alt="" className="w-full h-full object-contain" />
          </div>

          {/* Top Header Badge */}
          <div className="flex items-center gap-2 mb-3 px-3.5 py-1 bg-[#763D52] text-[#ECE3C6] border-2 border-[#3A332B] rounded-full shadow-[2px_2px_0px_0px_#3A332B]">
            <Sparkles className="w-4 h-4 text-[#F4C567]" />
            <span className="font-pixel text-xs text-[#ECE3C6] uppercase tracking-widest font-bold">
              {tier.badge}
            </span>
          </div>

          {/* Goblin Art Header */}
          <div className="my-2">
            <GoblinAvatar
              variant={
                result.tierId === 'triple_gem'
                  ? 'shaman'
                  : result.tierId === 'guaranteed_wl'
                  ? 'berserker'
                  : result.tierId === 'fcfs_raffle'
                  ? 'raider'
                  : 'default'
              }
              size={90}
              className="rounded-xl mx-auto border-2 border-[#3A332B] shadow-[4px_4px_0px_0px_#3A332B]"
            />
          </div>

          {/* Title */}
          <h3 className="font-heading text-2xl text-[#262320] tracking-wider mb-1 font-bold">
            {tier.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#3A332B] font-sans mb-4 px-4 font-medium">
            {tier.description}
          </p>

          {/* Reeled Combo Display */}
          <div className="w-full bg-[#F7F2E4] border-2 border-[#3A332B] rounded-xl p-4 mb-4 shadow-[4px_4px_0px_0px_#3A332B]">
            <p className="font-pixel text-[10px] text-[#5D7C3B] uppercase tracking-wider mb-3 font-bold">
              YOUR LEVER COMBO:
            </p>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {result.symbols.map((sym, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-[#EBE3CA] border-2 border-[#3A332B] rounded-lg p-2 w-20 shadow-sm"
                >
                  <SymbolIcon symbolId={sym} size={48} showLabel />
                </div>
              ))}
            </div>
          </div>

          {/* Bonus Reward Notification */}
          {result.bonusSpinAwarded && (
            <div className="w-full bg-[#5D7C3B]/20 border-2 border-[#5D7C3B] rounded-lg py-2 px-4 mb-4 flex items-center justify-center gap-2 text-[#262320] text-xs font-pixel font-bold">
              <Sparkles className="w-4 h-4 text-[#5D7C3B] animate-spin" />
              <span>+1 FREE LEVER SPIN AWARDED TO YOUR BALANCE!</span>
            </div>
          )}

          {/* Share & Download Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={handleShareToX}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-[#5D7C3B] hover:bg-[#4E6B30] text-[#ECE3C6] border-2 border-[#3A332B] font-pixel text-xs tracking-wider rounded-xl shadow-[4px_4px_0px_0px_#262320] active:translate-y-0.5 transition-all"
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
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-[#C49B33] hover:bg-[#B38D2C] text-[#262320] border-2 border-[#3A332B] font-pixel text-xs tracking-wider rounded-xl shadow-[4px_4px_0px_0px_#262320] active:translate-y-0.5 transition-all"
            >
              <Download className="w-4 h-4 text-[#262320]" />
              <span>DOWNLOAD CARD (PNG)</span>
            </button>
          </div>

          {isShareClaimed && (
            <p className="mt-3 text-xs text-[#5D7C3B] font-pixel flex items-center justify-center gap-1 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Bonus pull unlocked! Check your balance.</span>
            </p>
          )}

          {/* Hidden Canvas for PNG rendering */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Footer info */}
          <div className="mt-4 pt-3 border-t-2 border-[#3A332B]/30 w-full flex justify-between items-center text-[11px] text-[#3A332B] font-mono font-bold">
            <span>Looter: {result.walletAddress.substring(0, 6)}...{result.walletAddress.substring(result.walletAddress.length - 4)}</span>
            <span>GOBBOZ #001</span>
          </div>
        </div>

        {/* Bottom Wooden Rod */}
        <div className="rod rod-bottom">
          <span className="rod-cap left" />
          <span className="rod-cap right" />
        </div>
      </div>
    </div>
  );
};
