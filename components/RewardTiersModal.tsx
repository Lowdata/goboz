'use client';

import React from 'react';
import { OUTCOME_TIERS } from '@/utils/constants';

interface RewardTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewardTiersModal: React.FC<RewardTiersModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const tiers = [
    OUTCOME_TIERS.guaranteed_wl,
    OUTCOME_TIERS.triple_gem,
    OUTCOME_TIERS.fcfs_raffle,
    OUTCOME_TIERS.no_match
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      {/* Parchment Scroll Modal */}
      <div className="relative w-full max-w-2xl flex flex-col items-center">
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

        {/* Parchment Scroll Body */}
        <div className="relative w-full bg-[#E7D6A6] border-x-4 border-[#3A2A20] p-6 sm:p-10 shadow-2xl parchment-unroll max-h-[85vh] text-[#262320]">
          {/* Background Crown & Sword Watermark */}
          <div className="absolute right-4 bottom-4 w-44 h-44 opacity-15 pointer-events-none">
            <img src="/crownandswordimage.png" alt="" className="w-full h-full object-contain" />
          </div>

          {/* Header Banner */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#5C3D22]/30">
            <div className="flex items-center gap-3">
              <img src="/skullpixel-rmbg.png" alt="Gobboz Skull" className="w-10 h-10 object-contain drop-shadow" />
              <div>
                <h2 className="font-heading text-xl sm:text-3xl text-[#262320] tracking-wider font-bold">
                  CAVERN REWARD TIERS
                </h2>
                <p className="font-mono text-xs sm:text-sm text-[#8B4A2B] uppercase tracking-widest font-bold">
                  WHAT DA MACHINE HOLDS FOR DA TRIBE
                </p>
              </div>
            </div>
          </div>

          <div className="scroll-divider" />

          {/* Reward Cards List */}
          <div className="space-y-4">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="p-5 bg-[#3A332B]/5 border-2 border-[#3A332B]/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden group hover:border-[#5D7C3B] transition-all"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg sm:text-xl text-[#262320] tracking-wide font-bold">
                      {tier.title}
                    </h3>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[#3A332B] leading-relaxed font-medium">
                    {tier.description}
                  </p>
                </div>

                {/* Symbol Example Badge */}
                <div className="flex sm:flex-col items-center justify-center gap-2 px-4 py-3 bg-[#3A332B]/10 rounded-xl border border-[#3A332B]/20">
                  <div className="font-mono text-xs font-bold text-[#8B4A2B] uppercase tracking-wider">
                    EXAMPLE PULL
                  </div>
                  <div className="flex items-center gap-1.5 text-xl">
                    {tier.id === 'guaranteed_wl' && '🍄 🍄 🍄'}
                    {tier.id === 'triple_gem' && '💎 💎 💎'}
                    {tier.id === 'fcfs_raffle' && '🪙 🪙 🗡️'}
                    {tier.id === 'no_match' && '🪙 🍄 💀'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sign-off */}
          <div className="scroll-signoff">
            — sealed in shadow, bound in dust —
          </div>

          {/* Close Button Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#5D7C3B] hover:bg-[#4E6B30] text-[#ECE3C6] font-pixel text-xs tracking-widest rounded-xl transition-all shadow-[4px_4px_0px_0px_#262320] border-2 border-[#3A332B]"
            >
              CLOSE PARCHMENT
            </button>
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
