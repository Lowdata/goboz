import React from 'react';
import { UserState } from '@/types/game';
import { Play, Sparkles, Trophy } from 'lucide-react';

interface HeroSectionProps {
  userState: UserState;
  onOpenConnectModal: () => void;
  onScrollToMachine: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userState,
  onOpenConnectModal,
  onScrollToMachine
}) => {
  return (
    <section className="w-full max-w-5xl mx-auto pt-8 pb-4 px-4 text-center">
      {/* Small Alpha Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-stone-900 border-2 border-stone-800 rounded-full mb-6 shadow">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="font-pixel text-xs text-amber-400 tracking-wider uppercase">
          GOBBOZ ONE-ARMED BANDIT LOOT MACHINE
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-parchment-100 tracking-wider mb-4 leading-tight drop-shadow-lg">
        PULL THE LEVER. <span className="text-amber-400">LOOT THE LIST.</span>
      </h1>

      {/* Subhead */}
      <p className="text-base sm:text-lg text-stone-300 font-sans max-w-2xl mx-auto mb-8 leading-relaxed">
        Every goblin&apos;s got a lever to pull and something to steal. Yours might be a whitelist spot, a Triple Gem jackpot, or greasy tribal loot.
      </p>

      {/* Hero Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {userState.isConnected ? (
          <button
            onClick={onScrollToMachine}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-pixel text-sm tracking-widest uppercase rounded-xl shadow-2xl shadow-amber-500/25 transition-all transform hover:-translate-y-1"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>PULL LEVER ({userState.pullsRemaining} PULLS LEFT)</span>
          </button>
        ) : (
          <button
            onClick={onOpenConnectModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-pixel text-sm tracking-widest uppercase rounded-xl shadow-2xl shadow-amber-500/25 transition-all transform hover:-translate-y-1"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>CONNECT WALLET &amp; PULL</span>
          </button>
        )}

        <a
          href="#rewards"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-stone-900 hover:bg-stone-800 text-parchment-200 border-2 border-stone-800 rounded-xl font-pixel text-xs tracking-wider uppercase transition-colors"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>VIEW REWARD TIERS</span>
        </a>
      </div>
    </section>
  );
};
