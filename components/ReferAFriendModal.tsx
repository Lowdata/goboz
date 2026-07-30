import React from 'react';
import { Sparkles, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReferAFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
}

export const ReferAFriendModal: React.FC<ReferAFriendModalProps> = ({
  isOpen,
  onClose,
  referralCode
}) => {
  if (!isOpen) return null;

  const handleCopyLink = () => {
    const link = referralCode ? `${window.location.origin}/?ref=${referralCode}` : window.location.origin;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied! (+1 PULL per friend)');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      {/* Parchment Scroll Modal */}
      <div className="relative w-full max-w-lg flex flex-col items-center">
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
          {/* Background Skull Watermark */}
          <div className="absolute right-4 bottom-4 w-32 h-32 opacity-15 pointer-events-none">
            <img src="/skull.png" alt="" className="w-full h-full object-contain" />
          </div>

          {/* Header Banner */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#5C3D22]/30">
            <div className="flex items-center gap-3">
              <img src="/skullpixel-rmbg.png" alt="Gobboz Skull" className="w-10 h-10 object-contain drop-shadow" />
              <div>
                <h2 className="font-heading text-xl sm:text-3xl text-[#AC2E21] tracking-wider font-bold">
                  OUT OF PULLS?
                </h2>
                <p className="font-mono text-xs sm:text-sm text-[#8B4A2B] uppercase tracking-widest font-bold">
                  THE MACHINE HUNGERS FOR SOULS
                </p>
              </div>
            </div>
          </div>

          <div className="scroll-divider" />

          {/* Content */}
          <div className="flex flex-col items-center text-center space-y-6 my-6">
            <div className="w-20 h-20 bg-[#3A332B]/10 rounded-full flex items-center justify-center border-4 border-[#3A332B]/20">
              <Users className="w-10 h-10 text-[#8B4A2B]" />
            </div>
            
            <p className="font-sans text-sm sm:text-base text-[#3A332B] font-medium leading-relaxed max-w-sm">
              Your luck hasn't run dry yet. Invite your fellow goblins to the raid. You'll get <strong className="text-[#5D7C3B] font-bold">+1 PULL</strong> for every friend that connects their wallet using your link.
            </p>

            <button
              onClick={handleCopyLink}
              className="w-full max-w-xs flex items-center justify-center gap-3 py-4 px-6 bg-[#C49B33] hover:bg-[#B38D2C] text-[#262320] border-4 border-[#3A332B] font-pixel text-sm tracking-wider rounded-xl shadow-[4px_4px_0px_0px_#262320] active:translate-y-1 transition-all group"
            >
              <Sparkles className="w-5 h-5 group-hover:animate-pulse text-[#763D52]" />
              COPY REFERRAL LINK
            </button>
          </div>

          <div className="scroll-divider" />

          {/* Sign-off */}
          <div className="scroll-signoff">
            — sealed in shadow, bound in dust —
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
