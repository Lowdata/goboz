import React from 'react';

export type GoblinVariant = 'berserker' | 'raider' | 'shaman' | 'default';

interface GoblinAvatarProps {
  variant?: GoblinVariant;
  size?: number;
  className?: string;
}

export const GoblinAvatar: React.FC<GoblinAvatarProps> = ({
  variant = 'default',
  size = 120,
  className = ''
}) => {
  const renderAvatarSvg = () => {
    switch (variant) {
      case 'berserker':
        // Horned goblin with red nose and fangs from reference image 1
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
            <rect width="32" height="32" fill="#1E293B" />
            {/* Horns */}
            <rect x="10" y="2" width="4" height="6" fill="#713F12" />
            <rect x="12" y="4" width="4" height="6" fill="#713F12" />
            <rect x="18" y="2" width="4" height="6" fill="#713F12" />
            <rect x="16" y="4" width="4" height="6" fill="#713F12" />
            {/* Ears */}
            <rect x="2" y="12" width="6" height="4" fill="#3B7A2A" />
            <rect x="24" y="12" width="6" height="4" fill="#3B7A2A" />
            {/* Head */}
            <rect x="8" y="8" width="16" height="16" fill="#4C9A38" />
            <rect x="8" y="14" width="16" height="10" fill="#3F822E" />
            {/* Eyes */}
            <rect x="10" y="12" width="4" height="4" fill="#111827" />
            <rect x="18" y="12" width="4" height="4" fill="#111827" />
            <rect x="11" y="13" width="2" height="2" fill="#DC2626" />
            <rect x="19" y="13" width="2" height="2" fill="#DC2626" />
            {/* Nose */}
            <rect x="14" y="14" width="4" height="6" fill="#EF4444" />
            {/* Fangs & drool */}
            <rect x="11" y="20" width="2" height="4" fill="#F8FAFC" />
            <rect x="19" y="20" width="2" height="4" fill="#F8FAFC" />
            <rect x="13" y="22" width="2" height="6" fill="#DC2626" />
            {/* Body */}
            <rect x="10" y="24" width="12" height="8" fill="#2E5A23" />
          </svg>
        );
      case 'raider':
        // Yellowish goblin with purple scarf from reference image 2
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
            <rect width="32" height="32" fill="#1E293B" />
            {/* Ears */}
            <rect x="2" y="12" width="6" height="6" fill="#9CA338" />
            <rect x="24" y="12" width="6" height="6" fill="#9CA338" />
            {/* Head */}
            <rect x="8" y="8" width="16" height="16" fill="#B2BA42" />
            <rect x="8" y="16" width="16" height="8" fill="#9CA338" />
            {/* Eyes */}
            <rect x="10" y="12" width="4" height="4" fill="#FFFFFF" />
            <rect x="18" y="12" width="4" height="4" fill="#FFFFFF" />
            <rect x="12" y="13" width="2" height="2" fill="#111827" />
            <rect x="18" y="13" width="2" height="2" fill="#111827" />
            {/* Nose */}
            <rect x="14" y="14" width="4" height="6" fill="#EF4444" />
            {/* Mouth & Teeth */}
            <rect x="11" y="20" width="10" height="2" fill="#451A03" />
            <rect x="12" y="20" width="2" height="2" fill="#F8FAFC" />
            <rect x="18" y="20" width="2" height="2" fill="#F8FAFC" />
            {/* Purple Scarf */}
            <rect x="8" y="24" width="16" height="4" fill="#5B21B6" />
            <rect x="8" y="26" width="6" height="6" fill="#4C1D95" />
            <rect x="10" y="28" width="12" height="4" fill="#6D28D9" />
          </svg>
        );
      case 'shaman':
        // Green goblin with wild purple hair holding crystal shiny from reference image 3
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
            <rect width="32" height="32" fill="#1E293B" />
            {/* Wild Hair */}
            <rect x="8" y="2" width="16" height="6" fill="#7C3AED" />
            <rect x="6" y="4" width="4" height="4" fill="#6D28D9" />
            <rect x="22" y="4" width="6" height="6" fill="#6D28D9" />
            <rect x="12" y="0" width="8" height="4" fill="#8B5CF6" />
            {/* Ears */}
            <rect x="2" y="12" width="6" height="4" fill="#3B7A2A" />
            <rect x="24" y="12" width="6" height="4" fill="#3B7A2A" />
            {/* Head */}
            <rect x="8" y="8" width="16" height="16" fill="#4C9A38" />
            {/* Eyes */}
            <rect x="10" y="12" width="4" height="4" fill="#FFFFFF" />
            <rect x="18" y="12" width="4" height="4" fill="#FFFFFF" />
            <rect x="11" y="13" width="2" height="2" fill="#111827" />
            <rect x="19" y="13" width="2" height="2" fill="#111827" />
            {/* Nose */}
            <rect x="14" y="14" width="4" height="6" fill="#EF4444" />
            {/* Frown */}
            <rect x="12" y="20" width="8" height="2" fill="#111827" />
            {/* Orange Vest */}
            <rect x="8" y="24" width="8" height="8" fill="#F97316" />
            <rect x="16" y="24" width="8" height="8" fill="#F97316" />
            {/* Blue Crystal in hand */}
            <rect x="24" y="22" width="6" height="8" fill="#38BDF8" />
            <rect x="26" y="20" width="2" height="12" fill="#7DD3FC" />
          </svg>
        );
      default:
        // Default tribal gobbo
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
            <rect width="32" height="32" fill="#1E293B" />
            <rect x="2" y="12" width="6" height="4" fill="#3F822E" />
            <rect x="24" y="12" width="6" height="4" fill="#3F822E" />
            <rect x="8" y="8" width="16" height="16" fill="#4C9A38" />
            <rect x="10" y="12" width="4" height="4" fill="#111827" />
            <rect x="18" y="12" width="4" height="4" fill="#111827" />
            <rect x="11" y="13" width="2" height="2" fill="#EAB308" />
            <rect x="19" y="13" width="2" height="2" fill="#EAB308" />
            <rect x="14" y="14" width="4" height="5" fill="#EF4444" />
            <rect x="11" y="20" width="10" height="2" fill="#451A03" />
            <rect x="12" y="20" width="2" height="4" fill="#FFFFFF" />
            <rect x="18" y="20" width="2" height="4" fill="#FFFFFF" />
            <rect x="10" y="24" width="12" height="8" fill="#334155" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{ width: size, height: size }}
      className={`border-4 border-goblin-dark bg-slate-900 overflow-hidden shadow-lg ${className}`}
    >
      {renderAvatarSvg()}
    </div>
  );
};
