import React from 'react';
import { UserState } from '@/types/game';
import { Volume2, VolumeX, Wallet, Trophy, Users } from 'lucide-react';
import { sound } from '@/utils/sound';

interface NavbarProps {
  userState: UserState;
  onOpenConnectModal: () => void;
  onDisconnect: () => void;
  onToggleSound: () => void;
  stats: { totalPulls: number; wlSpotsClaimed: number };
}

export const Navbar: React.FC<NavbarProps> = ({
  userState,
  onOpenConnectModal,
  onDisconnect,
  onToggleSound,
  stats
}) => {
  const handleSoundToggle = () => {
    sound.setEnabled(!userState.soundEnabled);
    onToggleSound();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/90 backdrop-blur-md border-b-2 border-stone-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div>
            <div className="brand">
              <span className="skull">💀</span>
              <span>GOBBO</span>
              <span className="z">Z</span>
            </div>
            <p className="font-mono text-[10px] text-parchment-dim uppercase tracking-widest mt-0.5">
              WE GIB. WE GRIB. WE GOBBOZ.
            </p>
          </div>
        </div>

        {/* Live Social Proof Stats Ticker */}
        <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 bg-stone-900 border border-stone-800 rounded-full text-xs font-pixel text-stone-400">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-parchment-200">{stats.totalPulls.toLocaleString()}</span>
            <span>goblins pulled</span>
          </div>
          <div className="w-1 h-3 bg-stone-700" />
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-parchment-200">{stats.wlSpotsClaimed.toLocaleString()}</span>
            <span>WL spots claimed</span>
          </div>
        </div>

        {/* Action Buttons: Sound & Wallet */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle Button */}
          <button
            onClick={handleSoundToggle}
            className="p-2 rounded-lg bg-stone-900 border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-white transition-colors"
            title={userState.soundEnabled ? 'Mute Retro Sound' : 'Unmute Retro Sound'}
          >
            {userState.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-amber-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-stone-500" />
            )}
          </button>

          {/* Wallet Button */}
          {userState.isConnected && userState.walletAddress ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-stone-900 border border-emerald-500/50 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-pixel text-xs text-emerald-400">
                  {userState.pullsRemaining} PULLS
                </span>
              </div>

              <button
                onClick={onDisconnect}
                className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-red-950/40 border border-stone-700 hover:border-red-500/50 rounded-lg text-parchment-200 font-pixel text-xs transition-all"
                title="Click to disconnect wallet"
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
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
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-pixel text-xs tracking-wider rounded-lg shadow-lg shadow-amber-500/20 active:translate-y-0.5 transition-all"
            >
              <Wallet className="w-4 h-4" />
              <span>CONNECT WALLET &amp; PULL</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Stats Bar */}
      <div className="lg:hidden w-full bg-stone-900/60 border-t border-stone-800 py-1.5 px-4 flex justify-between items-center text-[10px] font-pixel text-stone-400">
        <span>{stats.totalPulls.toLocaleString()} goblins pulled</span>
        <span>{stats.wlSpotsClaimed.toLocaleString()} WL spots claimed</span>
      </div>
    </header>
  );
};
