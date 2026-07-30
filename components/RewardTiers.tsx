import React from 'react';
import { OUTCOME_TIERS } from '@/utils/constants';

export const RewardTiers: React.FC = () => {
  const tiersList = [
    OUTCOME_TIERS.guaranteed_wl,
    OUTCOME_TIERS.triple_gem,
    OUTCOME_TIERS.fcfs_raffle,
    OUTCOME_TIERS.no_match
  ];

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4">
      <div className="text-center mb-8">
        <div className="banner banner--ink">
          <span className="skull">💀</span> WHAT&apos;S IN THE MACHINE
        </div>
        <p className="font-mono text-xs text-parchment-dim uppercase tracking-widest mt-1">
          REWARD TIERS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {tiersList.map((tier) => (
          <div
            key={tier.id}
            style={{
              borderColor: tier.borderColor,
              backgroundColor: 'rgba(24, 24, 27, 0.9)'
            }}
            className="border-2 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  style={{
                    backgroundColor: tier.bgColor,
                    color: tier.color,
                    borderColor: tier.borderColor
                  }}
                  className="px-3 py-1 rounded-full text-[11px] font-pixel uppercase tracking-widest border"
                >
                  {tier.badge}
                </span>

                <span className="text-2xl" role="img" aria-label={tier.name}>
                  {tier.emoji}
                </span>
              </div>

              <h3
                style={{ color: tier.color }}
                className="font-pixel text-xl sm:text-2xl tracking-wider mb-2"
              >
                {tier.title}
              </h3>

              <p className="text-stone-200 text-sm sm:text-base font-sans leading-relaxed">
                {tier.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-pixel text-stone-400">
              <span>OUTCOME TYPE</span>
              <span style={{ color: tier.color }} className="uppercase">
                {tier.id === 'guaranteed_wl'
                  ? 'GUARANTEED WHITELIST (WL)'
                  : tier.id === 'triple_gem'
                  ? 'FREE LEVER SPIN'
                  : tier.id === 'fcfs_raffle'
                  ? 'FCFS'
                  : 'BETTER LUCK, GOBLIN'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
