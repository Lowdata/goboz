import React from 'react';
import { UserState } from '@/types/game';
import { Play, Sparkles, Skull } from 'lucide-react';

interface FooterProps {
  userState: UserState;
  onOpenConnectModal: () => void;
  onScrollToMachine: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  userState,
  onOpenConnectModal,
  onScrollToMachine
}) => {
  return (
    <footer className="w-full bg-stone-950 border-t-4 border-stone-800 text-stone-300 mt-20">
      {/* Big Hero Footer CTA Box */}
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        {/* Bigger Crown and Sword Artwork in Footer */}
        <div className="flex justify-center mb-6">
          <img
            src="/crownandswordimage.png"
            alt="Gobboz Crown and Sword"
            className="w-36 sm:w-48 h-auto object-contain drop-shadow-[0_0_30px_rgba(217,165,68,0.6)] hover:scale-105 transition-transform"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-xs text-amber-400 tracking-wider">
            DONT SLEEP ON DA SHINIES
          </span>
        </div>

        <h2 className="font-heading text-2xl sm:text-4xl text-parchment-100 tracking-wider mb-3 max-w-2xl mx-auto leading-tight">
          THE MACHINE DOESN&apos;T CARE IF YOU&apos;RE LUCKY. IT CARES IF YOU PULL.
        </h2>

        <p className="text-stone-400 font-sans max-w-lg mx-auto mb-8 text-sm sm:text-base">
          Every pull gets you closer to a guaranteed whitelist spot or a Triple Gem jackpot. No kings. No masters. Only da tribe.
        </p>

        {userState.isConnected ? (
          <button
            onClick={onScrollToMachine}
            className="btn btn-primary"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>YANK THE LEVER NOW ({userState.pullsRemaining} PULLS LEFT)</span>
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
      </div>

      {/* Tribal Bottom Strip */}
      <div className="w-full bg-stone-900 border-t border-stone-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💀</span>
            <span className="font-logo text-sm text-parchment-200 tracking-wider">
              GIB SHINY. KRUMP HUMIES. JOIN DA TRIBE. 💀
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-stone-500">
            <a href="https://x.com/gobbozhq" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
              TWITTER / X
            </a>
            <a href="https://discord.gg/gobboz" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
              DISCORD
            </a>
            <span className="text-stone-600">© 2026 GOBBOZ TRIBE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
