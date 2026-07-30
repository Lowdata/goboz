import React, { useEffect, useRef, useState } from 'react';
import { PullResult } from '@/types/game';
import { SYMBOLS, OUTCOME_TIERS } from '@/utils/constants';
import { SymbolIcon } from './SymbolIcon';
import { GoblinAvatar } from './GoblinAvatar';
import confetti from 'canvas-confetti';
import { Download, Share2, X, Sparkles, CheckCircle2 } from 'lucide-react';

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

    setIsShareClaimed(false);

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
    const tweetText = `Just pulled the @Gobboz lever and landed: ${symbolsText} (${tier.title})!\n\n${tier.description}\n\nPull the Lever. Loot the List. WE GIB. WE GRIB. WE GOBBOZ. 💀🗡️\n\n#Gobboz #NFT #Allowlist`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    window.open(shareUrl, '_blank');

    if (!isShareClaimed) {
      setIsShareClaimed(true);
      onShareBonusClaimed();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border-4 border-amber-600 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center p-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-stone-800 hover:bg-stone-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center gap-2 mb-2 px-3 py-1 bg-stone-800 border border-stone-700 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-pixel text-xs text-amber-400 uppercase tracking-widest">
            {tier.badge}
          </span>
        </div>

        {/* Goblin Art Header */}
        <div className="my-3">
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
            size={100}
            className="rounded-xl mx-auto shadow-amber-500/20"
          />
        </div>

        {/* Title */}
        <h3 className="font-pixel text-2xl text-parchment-100 tracking-wider mb-1">
          {tier.title}
        </h3>
        <p className="text-sm text-stone-300 font-sans mb-4 px-4">
          {tier.description}
        </p>

        {/* Reeled Combo Display */}
        <div className="w-full bg-stone-950 border-2 border-stone-800 rounded-xl p-4 mb-4">
          <p className="font-pixel text-[10px] text-stone-400 uppercase tracking-wider mb-3">
            YOUR LEVER COMBO:
          </p>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {result.symbols.map((sym, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-stone-900 border border-stone-800 rounded-lg p-2 w-20"
              >
                <SymbolIcon symbolId={sym} size={48} showLabel />
              </div>
            ))}
          </div>
        </div>

        {/* Bonus Reward Notification */}
        {result.bonusSpinAwarded && (
          <div className="w-full bg-amber-500/10 border border-amber-500/40 rounded-lg py-2 px-4 mb-4 flex items-center justify-center gap-2 text-amber-300 text-xs font-pixel">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>+1 FREE LEVER SPIN AWARDED TO YOUR BALANCE!</span>
          </div>
        )}

        {/* Share & Download Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={handleShareToX}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-pixel text-xs tracking-wider rounded-xl shadow-lg shadow-sky-500/20 active:translate-y-0.5 transition-all"
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
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-stone-800 hover:bg-stone-700 text-parchment-200 border border-stone-700 font-pixel text-xs tracking-wider rounded-xl shadow active:translate-y-0.5 transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>DOWNLOAD CARD (PNG)</span>
          </button>
        </div>

        {isShareClaimed && (
          <p className="mt-3 text-xs text-emerald-400 font-pixel flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Bonus pull unlocked! Check your balance.</span>
          </p>
        )}

        {/* Hidden Canvas for PNG rendering */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-stone-800 w-full flex justify-between items-center text-[11px] text-stone-500 font-mono">
          <span>Looter: {result.walletAddress.substring(0, 6)}...{result.walletAddress.substring(result.walletAddress.length - 4)}</span>
          <span>GOBBOZ #001</span>
        </div>
      </div>
    </div>
  );
};
