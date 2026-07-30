import React from 'react';
import { PullResult } from '@/types/game';
import { OUTCOME_TIERS } from '@/utils/constants';
import { SymbolIcon } from './SymbolIcon';
import { History, Share2, X } from 'lucide-react';

interface PullHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PullResult[];
  onOpenCard: (result: PullResult) => void;
}

export const PullHistoryModal: React.FC<PullHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onOpenCard
}) => {
  if (!isOpen) return null;

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
        <div className="relative w-full bg-[#E7D6A6] border-x-4 border-[#3A2A20] p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[85vh] text-[#262320]">
          {/* Background Skull Watermark */}
          <div className="absolute right-4 bottom-4 w-40 h-40 opacity-10 pointer-events-none">
            <img src="/skullpixel-rmbg.png" alt="" className="w-full h-full object-contain" />
          </div>

          {/* Header Banner */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#5C3D22]/30">
            <div className="flex items-center gap-3">
              <History className="w-8 h-8 text-[#8B4A2B]" />
              <div>
                <h2 className="font-heading text-xl sm:text-3xl text-[#262320] tracking-wider font-bold">
                  LEVER PULL HISTORY
                </h2>
                <p className="font-mono text-xs sm:text-sm text-[#8B4A2B] uppercase tracking-widest font-bold">
                  YOUR RECORDED COMBO OUTCOMES ({history.length})
                </p>
              </div>
            </div>
          </div>

          <div className="scroll-divider" />

          {history.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-[#3A332B]/30 rounded-2xl">
              <p className="font-pixel text-base text-[#262320] mb-2 font-bold">
                NO LEVER PULLS RECORDED YET
              </p>
              <p className="font-sans text-sm text-[#3A332B] font-medium">
                Yank the greasy lever to spin the reels and claim your first loot card!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {history.map((pull, idx) => {
                const tier = OUTCOME_TIERS[pull.tierId];
                return (
                  <div
                    key={pull.id || idx}
                    onClick={() => {
                      onOpenCard(pull);
                      onClose();
                    }}
                    className="bg-[#3A332B]/10 border-2 border-[#3A332B]/30 hover:border-[#5D7C3B] rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-1 shadow-sm group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          style={{
                            color: tier.color,
                            backgroundColor: tier.bgColor,
                            borderColor: tier.borderColor
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-pixel uppercase border-2"
                        >
                          {tier.badge}
                        </span>
                        <span className="text-xs font-mono text-[#3A332B] font-bold">
                          #{history.length - idx}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-2 my-3 bg-[#262320] py-2 rounded-lg border-2 border-[#3A332B]">
                        {pull.symbols.map((sym, sIdx) => (
                          <SymbolIcon key={sIdx} symbolId={sym} size={32} />
                        ))}
                      </div>

                      <h3 className="font-pixel text-sm text-[#262320] text-center font-bold">
                        {tier.title}
                      </h3>
                    </div>

                    <div className="mt-3 pt-2 border-t-2 border-[#3A332B]/20 flex items-center justify-between text-[11px] font-pixel text-[#3A332B]">
                      <span>{new Date(pull.timestamp).toLocaleTimeString()}</span>
                      <span className="text-[#8B4A2B] group-hover:text-[#5D7C3B] flex items-center gap-1 font-bold">
                        <Share2 className="w-3 h-3" />
                        <span>VIEW CARD</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
              BACK TO MACHINE
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
