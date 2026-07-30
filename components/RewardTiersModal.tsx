'use client';

import React from 'react';
import { X, Trophy, Sparkles, ShieldCheck } from 'lucide-react';
import { OUTCOME_TIERS, PITY_THRESHOLD } from '@/utils/constants';
import { SymbolId } from '@/types/game';

interface RewardTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewardTiersModal: React.FC<RewardTiersModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const tiers = Object.values(OUTCOME_TIERS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      {/* Parchment Scroll Container */}
      <div className="relative w-full max-w-3xl bg-[#E9D9AC] border-4 border-[#5C3D22] rounded-3xl p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh] text-stone-900 selection:bg-amber-500 selection:text-stone-950">
        {/* Background Skull Watermark */}
        <div className="absolute right-4 bottom-4 w-40 h-40 opacity-10 pointer-events-none">
          <img src="/SKULL.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Header Banner */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b-2 border-[#5C3D22]/30">
          <div className="flex items-center gap-3">
            <img src="/SKULL.png" alt="Gobboz Skull" className="w-10 h-10 object-contain drop-shadow" />
            <div>
              <h2 className="font-heading text-xl sm:text-3xl text-stone-950 tracking-wider">
                CAVERN REWARD TIERS
              </h2>
              <p className="font-mono text-xs sm:text-sm text-[#5C3D22] uppercase tracking-widest">
                WHAT DA MACHINE HOLDS FOR DA TRIBE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-950/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Reward Cards List */}
        <div className="space-y-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="p-6 bg-stone-950/5 border-2 border-[#5C3D22]/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden group hover:border-[#5C3D22] transition-all"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tier.emoji}</span>
                  <h3 className="font-heading text-lg sm:text-xl text-stone-950 tracking-wide">
                    {tier.title}
                  </h3>
                </div>
                <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* Symbol Example Badge */}
              <div className="flex sm:flex-col items-center justify-center gap-2 px-4 py-3 bg-[#5C3D22]/10 rounded-xl border border-[#5C3D22]/20">
                <div className="font-mono text-xs font-bold text-[#5C3D22] uppercase tracking-wider">
                  EXAMPLE PULL
                </div>
                <div className="flex items-center gap-1.5 text-xl">
                  {tier.id === 'triple_gem' && '💎 💎 💎'}
                  {tier.id === 'guaranteed_wl' && '🍄 🍄 🍄'}
                  {tier.id === 'fcfs_raffle' && '🪙 🪙 🗡️'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bad Luck Protection Note */}
        <div className="mt-8 p-5 bg-[#5C3D22]/10 border-2 border-[#5C3D22]/40 rounded-2xl flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 shrink-0 text-[#5C3D22] mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h4 className="font-heading text-stone-950 tracking-wide mb-1 uppercase">
              BAD LUCK PROTECTION ({PITY_THRESHOLD} PULLS)
            </h4>
            <p className="font-sans text-stone-700 leading-relaxed">
              Every <strong>{PITY_THRESHOLD} consecutive non-matching pulls</strong> triggers a guaranteed tribal loot drop! The machine never lets a loyal goblin leave empty-handed.
            </p>
          </div>
        </div>

        {/* Close Button Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-stone-950 hover:bg-stone-800 text-parchment-100 font-heading text-sm tracking-widest uppercase rounded-xl shadow-lg transition-all"
          >
            CLOSE PARCHMENT
          </button>
        </div>
      </div>
    </div>
  );
};
