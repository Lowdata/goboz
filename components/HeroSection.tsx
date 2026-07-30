import React from 'react';
import { UserState } from '@/types/game';
import { Play, Sparkles, Trophy } from 'lucide-react';

interface HeroSectionProps {
  userState: UserState;
  onOpenConnectModal: () => void;
  onScrollToMachine: () => void;
  onOpenRewardTiersModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userState,
  onOpenConnectModal,
  onScrollToMachine,
  onOpenRewardTiersModal
}) => {
  return (
    <section className="w-full max-w-5xl mx-auto pt-8 pb-4 px-4 text-center">
      {/* Ribbon */}
      <div className="ribbon">
        <span>💀</span>
        <span>WE GIB. WE GRIB. WE GOBBOZ.</span>
        <span>💀</span>
      </div>

      {/* Big Logo Mark */}
      <div className="logo-mark">
        GOBBO<span className="z2">Z</span>
      </div>

      {/* Tagline */}
      <div className="tagline">
        THE <span className="g">LEVER MACHINE</span> — <span className="p">LOOT</span> AWAITS
      </div>

      {/* Decorative Tribal Crest Artwork */}
      <div className="flex items-center justify-center gap-4 my-6">
        <img
          src="/skull.png"
          alt="Gobboz Skull"
          className="w-16 sm:w-24 h-auto object-contain drop-shadow-[0_0_20px_rgba(127,168,62,0.5)] hover:scale-110 transition-transform"
        />
        <img
          src="/crownandswordimage.png"
          alt="Gobboz Crown & Sword"
          className="w-20 sm:w-28 h-auto object-contain drop-shadow-[0_0_20px_rgba(217,165,68,0.5)] hover:scale-110 transition-transform"
        />
      </div>

      {/* Main Headline */}
      <h1 className="headline font-heading">
        Pull the lever. <span className="hl">Loot the list.</span>
      </h1>

      {/* Subhead */}
      <p className="subhead font-sans">
        Every goblin&apos;s got a lever to pull and something to steal. Yours might be a whitelist spot, a Triple Gem jackpot, or greasy tribal loot.
      </p>

      {/* Hero Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {userState.isConnected ? (
          <button
            onClick={onScrollToMachine}
            className="btn btn-primary"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>PULL LEVER ({userState.pullsRemaining} PULLS LEFT)</span>
          </button>
        ) : (
          <button
            onClick={onOpenConnectModal}
            className="btn btn-primary"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>CONNECT WALLET &amp; PULL</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenRewardTiersModal}
          className="btn btn-ghost"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>VIEW REWARD TIERS</span>
        </button>
      </div>
    </section>
  );
};
