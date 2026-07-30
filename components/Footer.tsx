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
    <footer className="w-full bg-[#E6DEC4] border-t-4 border-[#3A332B] text-[#262320] mt-16">
      {/* Big Hero Footer CTA Box */}
      <div className="max-w-5xl mx-auto px-4 py-14 text-center">

        <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#5D7C3B] text-[#ECE3C6] rounded-full mb-4 border-2 border-[#3A332B] shadow-[2px_2px_0px_0px_#3A332B]">
          <Sparkles className="w-4 h-4 text-[#F4C567]" />
          <span className="font-pixel text-xs tracking-wider uppercase">
            DONT SLEEP ON DA SHINIES
          </span>
        </div>

        <div className="flex justify-center mb-3">
          <img
            src="/logogoboz-removebg-preview.png"
            alt="Gobboz Logo"
            className="h-12 sm:h-16 w-auto object-contain drop-shadow-[0_2px_4px_rgba(58,51,43,0.3)] hover:scale-105 transition-transform"
          />
        </div>

        <h2 className="font-heading text-2xl sm:text-4xl text-[#262320] tracking-wider mb-3 max-w-2xl mx-auto leading-tight">
          THE MACHINE DOESN&apos;T CARE IF YOU&apos;RE LUCKY. IT CARES IF YOU PULL.
        </h2>

        <p className="text-[#3A332B] font-sans max-w-lg mx-auto mb-8 text-sm sm:text-base font-medium">
          Every goblin&apos;s got a lever to pull and something to steal. Yours might be a whitelist spot. No kings. No masters. Only da tribe.
        </p>

        {userState.isConnected ? (
          <button
            onClick={onScrollToMachine}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C49B33] hover:bg-[#B38D2C] text-[#262320] font-pixel text-sm rounded-xl border-2 border-[#3A332B] shadow-[4px_4px_0px_0px_#262320] transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>YANK THE LEVER NOW ({userState.pullsRemaining} PULLS LEFT)</span>
          </button>
        ) : (
          <button
            onClick={onOpenConnectModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5D7C3B] hover:bg-[#4E6B30] text-[#ECE3C6] font-pixel text-sm rounded-xl border-2 border-[#3A332B] shadow-[4px_4px_0px_0px_#262320] transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>CONNECT WALLET &amp; PULL</span>
          </button>
        )}
      </div>

      {/* Tribal Bottom Strip - Dark Ink Brush Banner from Image 2 */}
      <div className="w-full bg-[#262320] border-t-2 border-[#3A332B] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-pixel text-xs sm:text-sm tracking-wider">
            <img src="/skullpixel-rmbg.png" alt="Skull" className="w-5 h-5 object-contain inline" />
            <span className="text-[#5D7C3B]">GIB SHINY.</span>
            <span className="text-[#763D52]">KRUMP HUMIES.</span>
            <span className="text-[#ECE3C6]">JOIN DA TRIBE.</span>
            <img src="/skullpixel-rmbg.png" alt="Skull" className="w-5 h-5 object-contain inline" />
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-[#ECE3C6]/80 font-bold">
            <a href="https://x.com/gobbozhq" target="_blank" rel="noreferrer" className="hover:text-[#5D7C3B] transition-colors">
              TWITTER / X
            </a>
            <a href="https://discord.gg/gobboz" target="_blank" rel="noreferrer" className="hover:text-[#5D7C3B] transition-colors">
              DISCORD
            </a>
            <span className="text-[#ECE3C6]/50">© 2026 GOBBOZ TRIBE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
