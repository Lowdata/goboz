import React from 'react';
import { SymbolId } from '@/types/game';

interface SymbolIconProps {
  symbolId: SymbolId;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export const SymbolIcon: React.FC<SymbolIconProps> = ({
  symbolId,
  size = 64,
  className = '',
  showLabel = false
}) => {
  const getIconSvg = (id: SymbolId) => {
    switch (id) {
      case 'gold_coin':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <rect x="8" y="4" width="16" height="4" fill="#F5B82E" />
            <rect x="4" y="8" width="24" height="16" fill="#F5B82E" />
            <rect x="8" y="24" width="16" height="4" fill="#F5B82E" />
            <rect x="10" y="8" width="12" height="4" fill="#FFE57F" />
            <rect x="12" y="12" width="8" height="8" fill="#B47D12" />
            <rect x="14" y="14" width="4" height="4" fill="#F5B82E" />
            <rect x="6" y="8" width="4" height="4" fill="#FFE57F" />
          </svg>
        );
      case 'rusty_dagger':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <rect x="22" y="4" width="6" height="6" fill="#94A3B8" />
            <rect x="18" y="8" width="6" height="6" fill="#CBD5E1" />
            <rect x="14" y="12" width="6" height="6" fill="#94A3B8" />
            <rect x="10" y="16" width="6" height="6" fill="#64748B" />
            <rect x="12" y="18" width="2" height="2" fill="#B91C1C" />
            <rect x="8" y="18" width="6" height="4" fill="#78350F" />
            <rect x="10" y="14" width="4" height="4" fill="#78350F" />
            <rect x="4" y="24" width="6" height="6" fill="#451A03" />
            <rect x="6" y="22" width="4" height="4" fill="#92400E" />
          </svg>
        );
      case 'mushroom':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <rect x="6" y="8" width="20" height="4" fill="#EF4444" />
            <rect x="4" y="12" width="24" height="8" fill="#EF4444" />
            <rect x="8" y="10" width="4" height="4" fill="#FFFFFF" />
            <rect x="18" y="12" width="6" height="4" fill="#FFFFFF" />
            <rect x="12" y="16" width="4" height="4" fill="#FFFFFF" />
            <rect x="10" y="20" width="12" height="10" fill="#FDE68A" />
            <rect x="8" y="28" width="16" height="2" fill="#451A03" />
            <rect x="12" y="22" width="2" height="6" fill="#D97706" />
          </svg>
        );
      case 'eyeball':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <rect x="4" y="10" width="24" height="12" fill="#FFFFFF" />
            <rect x="8" y="6" width="16" height="4" fill="#E2E8F0" />
            <rect x="8" y="22" width="16" height="4" fill="#E2E8F0" />
            <rect x="12" y="10" width="8" height="12" fill="#10B981" />
            <rect x="14" y="12" width="4" height="8" fill="#065F46" />
            <rect x="14" y="12" width="2" height="2" fill="#FFFFFF" />
            <rect x="4" y="14" width="2" height="4" fill="#EF4444" />
            <rect x="26" y="14" width="2" height="4" fill="#EF4444" />
          </svg>
        );
      case 'boot':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <rect x="8" y="6" width="10" height="14" fill="#854D0E" />
            <rect x="10" y="8" width="4" height="10" fill="#A16207" />
            <rect x="8" y="20" width="20" height="8" fill="#713F12" />
            <rect x="8" y="26" width="20" height="4" fill="#451A03" />
            <rect x="14" y="22" width="4" height="2" fill="#CA8A04" />
            <rect x="12" y="10" width="6" height="2" fill="#EAB308" />
            <rect x="12" y="14" width="6" height="2" fill="#EAB308" />
          </svg>
        );
      case 'torch':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <rect x="12" y="4" width="8" height="6" fill="#F97316" />
            <rect x="14" y="2" width="4" height="4" fill="#FDE047" />
            <rect x="10" y="6" width="12" height="4" fill="#EA580C" />
            <rect x="12" y="10" width="8" height="4" fill="#78350F" />
            <rect x="14" y="14" width="4" height="16" fill="#92400E" />
            <rect x="12" y="18" width="8" height="2" fill="#451A03" />
            <rect x="12" y="24" width="8" height="2" fill="#451A03" />
          </svg>
        );
      case 'skull':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <rect x="6" y="8" width="20" height="14" fill="#F1F5F9" />
            <rect x="8" y="6" width="16" height="4" fill="#E2E8F0" />
            <rect x="4" y="4" width="4" height="6" fill="#166534" />
            <rect x="24" y="4" width="4" height="6" fill="#166534" />
            <rect x="10" y="12" width="4" height="4" fill="#0F172A" />
            <rect x="18" y="12" width="4" height="4" fill="#0F172A" />
            <rect x="14" y="16" width="4" height="2" fill="#64748B" />
            <rect x="10" y="22" width="12" height="6" fill="#E2E8F0" />
            <rect x="12" y="24" width="2" height="4" fill="#0F172A" />
            <rect x="18" y="24" width="2" height="4" fill="#0F172A" />
          </svg>
        );
      case 'gem':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md animate-pulse" style={{ imageRendering: 'pixelated' }}>
            <rect x="10" y="4" width="12" height="4" fill="#7DD3FC" />
            <rect x="6" y="8" width="20" height="6" fill="#38BDF8" />
            <rect x="8" y="14" width="16" height="6" fill="#0284C7" />
            <rect x="12" y="20" width="8" height="6" fill="#0369A1" />
            <rect x="14" y="26" width="4" height="4" fill="#075985" />
            <rect x="10" y="8" width="4" height="4" fill="#E0F2FE" />
            <rect x="18" y="10" width="4" height="2" fill="#E0F2FE" />
          </svg>
        );
    }
  };

  const getSymbolName = (id: SymbolId) => {
    switch (id) {
      case 'gold_coin': return 'Gold Coin';
      case 'rusty_dagger': return 'Rusty Dagger';
      case 'mushroom': return 'Mushroom';
      case 'eyeball': return 'Eyeball';
      case 'boot': return 'Boot';
      case 'torch': return 'Torch';
      case 'skull': return 'Skull';
      case 'gem': return 'Gem';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div 
        style={{ width: size, height: size }} 
        className="flex items-center justify-center transition-transform group-hover:scale-105"
      >
        {getIconSvg(symbolId)}
      </div>
      {showLabel && (
        <span className="mt-1.5 text-[10px] font-pixel tracking-wider text-parchment-200 uppercase text-center truncate w-full">
          {getSymbolName(symbolId)}
        </span>
      )}
    </div>
  );
};
