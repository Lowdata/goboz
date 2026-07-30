import React from 'react';
import { UserState } from '@/types/game';
import { Volume2, VolumeX, Wallet, Trophy, HelpCircle, History } from 'lucide-react';
import { sound } from '@/utils/sound';

interface NavbarProps {
  userState: UserState;
  onOpenConnectModal: () => void;
  onDisconnect: () => void;
  onToggleSound: () => void;
  onOpenHowItWorksModal?: () => void;
  onOpenRewardTiersModal?: () => void;
  onOpenHistoryModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userState,
  onOpenConnectModal,
  onDisconnect,
  onToggleSound,
  onOpenHowItWorksModal,
  onOpenRewardTiersModal,
  onOpenHistoryModal
}) => {
  const handleSoundToggle = () => {
    sound.setEnabled(!userState.soundEnabled);
    onToggleSound();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#EBE3CA]/95 backdrop-blur-md border-b-2 border-[#3A332B] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <img
            src="/logogoboz-removebg-preview.png"
            alt="Gobboz Logo"
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_2px_4px_rgba(58,51,43,0.3)] hover:scale-105 transition-transform"
          />
          <div className="hidden sm:block">
            <p className="font-mono text-[10px] text-[#763D52] font-bold uppercase tracking-widest">
              WE GIB. WE GRIB. WE GOBBOZ.
            </p>
          </div>
        </div>

        {/* Right Controls - Small Icons for Parchment Modals + Sound + Wallet */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          {/* How It Works Modal Button */}
          <button
            onClick={onOpenHowItWorksModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F7F2E4] hover:bg-[#5D7C3B] text-[#262320] hover:text-[#ECE3C6] border-2 border-[#3A332B] rounded-lg font-pixel text-[11px] uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_#262320]"
            title="How It Works"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">HOW IT WORKS</span>
          </button>

          {/* View Reward Tiers Modal Button */}
          <button
            onClick={onOpenRewardTiersModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F7F2E4] hover:bg-[#5D7C3B] text-[#262320] hover:text-[#ECE3C6] border-2 border-[#3A332B] rounded-lg font-pixel text-[11px] uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_#262320]"
            title="View Reward Tiers"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">TIERS</span>
          </button>

          {/* Pull History Modal Button */}
          <button
            onClick={onOpenHistoryModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F7F2E4] hover:bg-[#5D7C3B] text-[#262320] hover:text-[#ECE3C6] border-2 border-[#3A332B] rounded-lg font-pixel text-[11px] uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_#262320]"
            title="View Pull History"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">HISTORY</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={onToggleSound}
            className="p-1.5 bg-[#F7F2E4] hover:bg-[#EBE3CA] text-[#262320] border-2 border-[#3A332B] rounded-lg transition-all shadow-[2px_2px_0px_0px_#262320]"
            title={userState.soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {userState.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#5D7C3B]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#763D52]" />
            )}
          </button>

          {/* Wallet Button */}
          {userState.isConnected && userState.walletAddress ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F2E4] border-2 border-[#3A332B] rounded-lg shadow-[2px_2px_0px_0px_#262320]">
                <span className="w-2 h-2 rounded-full bg-[#5D7C3B] animate-pulse" />
                <span className="font-pixel text-xs text-[#5D7C3B]">
                  {userState.pullsRemaining} PULLS
                </span>
              </div>

              <button
                onClick={onDisconnect}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#763D52] hover:bg-[#5E3041] text-[#ECE3C6] border-2 border-[#3A332B] rounded-lg font-pixel text-xs transition-all shadow-[2px_2px_0px_0px_#262320]"
                title="Click to disconnect wallet"
              >
                <Wallet className="w-4 h-4 text-[#ECE3C6]" />
                <span>
                  {userState.walletAddress.substring(0, 4)}...
                  {userState.walletAddress.substring(
                    userState.walletAddress.length - 4
                  )}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenConnectModal}
              className="flex items-center gap-2 px-3.5 sm:px-5 py-2 bg-[#5D7C3B] hover:bg-[#4C6930] text-[#ECE3C6] font-pixel text-xs tracking-wider rounded-lg border-2 border-[#3A332B] shadow-[3px_3px_0px_0px_#262320] active:translate-y-0.5 transition-all"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">CONNECT WALLET &amp; PULL</span>
              <span className="sm:hidden">CONNECT</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

