import React from 'react';
import { PullResult } from '@/types/game';
import { OUTCOME_TIERS } from '@/utils/constants';
import { SymbolIcon } from './SymbolIcon';
import { History, Share2 } from 'lucide-react';

interface PullHistoryProps {
  history: PullResult[];
  onOpenCard: (result: PullResult) => void;
}

export const PullHistory: React.FC<PullHistoryProps> = ({
  history,
  onOpenCard
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-500" />
          <h2 className="font-pixel text-lg sm:text-xl text-parchment-100 tracking-wider">
            YOUR LEVER PULL HISTORY ({history.length})
          </h2>
        </div>
        <span className="text-xs font-pixel text-stone-400">
          CLICK ANY TO VIEW SHARE CARD
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((pull, idx) => {
          const tier = OUTCOME_TIERS[pull.tierId];
          return (
            <div
              key={pull.id || idx}
              onClick={() => onOpenCard(pull)}
              className="bg-stone-900 border-2 border-stone-800 hover:border-amber-500/50 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    style={{
                      color: tier.color,
                      backgroundColor: tier.bgColor,
                      borderColor: tier.borderColor
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-pixel uppercase border"
                  >
                    {tier.badge}
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    #{history.length - idx}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 my-3 bg-stone-950 py-2 rounded-lg border border-stone-800">
                  {pull.symbols.map((sym, sIdx) => (
                    <SymbolIcon key={sIdx} symbolId={sym} size={32} />
                  ))}
                </div>

                <h3 className="font-pixel text-sm text-parchment-100 text-center">
                  {tier.title}
                </h3>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] font-pixel text-stone-400">
                <span>{new Date(pull.timestamp).toLocaleTimeString()}</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  <span>VIEW CARD</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
