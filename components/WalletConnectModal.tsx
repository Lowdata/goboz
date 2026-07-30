import React, { useState } from 'react';
import { X, Wallet, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { sound } from '@/utils/sound';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  const [customAddress, setCustomAddress] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleWalletSelect = (walletName: string, mockAddr: string) => {
    setSelectedWallet(walletName);
    sound.playCoin();

    setTimeout(() => {
      onConnect(mockAddr);
      onClose();
    }, 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddress.trim()) return;
    sound.playCoin();
    onConnect(customAddress.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-stone-900 border-4 border-amber-600 rounded-2xl shadow-2xl p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-800 hover:bg-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <h3 className="font-pixel text-xl text-parchment-100 tracking-wider mb-1">
          CONNECT WALLET
        </h3>
        <p className="text-xs text-stone-300 font-sans mb-6">
          Every goblin gets <span className="text-emerald-400 font-semibold">100 FREE PULLS (TEST MODE)</span> on connection. Select a wallet to start looting:
        </p>

        {/* 3 Popular Wallets Grid */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() =>
              handleWalletSelect(
                'Phantom',
                '7Gob...X92q_phantom_solana'
              )
            }
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
              selectedWallet === 'Phantom'
                ? 'bg-amber-500/20 border-amber-500'
                : 'bg-stone-950 border-stone-800 hover:border-amber-500/50 hover:bg-stone-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-500/50 flex items-center justify-center text-lg">
                👻
              </div>
              <span className="font-pixel text-xs text-parchment-100">
                PHANTOM (SOLANA)
              </span>
            </div>
            <span className="text-[10px] font-pixel text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
              +100 PULLS
            </span>
          </button>

          <button
            onClick={() =>
              handleWalletSelect('MetaMask', '0x71C...8E2B_metamask_evm')
            }
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
              selectedWallet === 'MetaMask'
                ? 'bg-amber-500/20 border-amber-500'
                : 'bg-stone-950 border-stone-800 hover:border-amber-500/50 hover:bg-stone-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-900/50 border border-orange-500/50 flex items-center justify-center text-lg">
                🦊
              </div>
              <span className="font-pixel text-xs text-parchment-100">
                METAMASK (EVM)
              </span>
            </div>
            <span className="text-[10px] font-pixel text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
              +100 PULLS
            </span>
          </button>

          <button
            onClick={() =>
              handleWalletSelect('Solflare', '8Gob...9Z1t_solflare_solana')
            }
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
              selectedWallet === 'Solflare'
                ? 'bg-amber-500/20 border-amber-500'
                : 'bg-stone-950 border-stone-800 hover:border-amber-500/50 hover:bg-stone-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-900/50 border border-amber-500/50 flex items-center justify-center text-lg">
                🔥
              </div>
              <span className="font-pixel text-xs text-parchment-100">
                SOLFLARE
              </span>
            </div>
            <span className="text-[10px] font-pixel text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
              +100 PULLS
            </span>
          </button>
        </div>

        {/* Custom address input for testing */}
        <div className="pt-4 border-t border-stone-800 text-left">
          <label className="block font-pixel text-[11px] text-stone-400 mb-2 uppercase">
            OR PASTE CUSTOM WALLET ADDRESS (DEMO):
          </label>
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              placeholder="e.g. 0xGobbozWallet...1234"
              className="flex-1 px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-sm text-parchment-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg font-pixel text-xs flex items-center justify-center transition-colors shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
          <Shield className="w-3.5 h-3.5 text-stone-400" />
          <span>No signatures required to pull the demo lever.</span>
        </div>
      </div>
    </div>
  );
};
