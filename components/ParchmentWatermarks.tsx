import React, { useEffect, useState } from 'react';
import { SymbolIcon } from './SymbolIcon';
import { SymbolId } from '@/types/game';

const WATERMARK_SYMBOLS: SymbolId[] = ['gem', 'boot', 'rusty_dagger', 'gold_coin', 'skull', 'mushroom'];

interface Watermark {
  id: number;
  symbol: SymbolId;
  top: string;
  left: string;
  rotation: number;
  size: number;
  opacity: number;
}

export const ParchmentWatermarks = () => {
  const [watermarks, setWatermarks] = useState<Watermark[]>([]);

  useEffect(() => {
    // Generate randomly only on client side to avoid hydration mismatch
    const generated: Watermark[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      symbol: WATERMARK_SYMBOLS[Math.floor(Math.random() * WATERMARK_SYMBOLS.length)],
      top: `${5 + Math.random() * 90}%`,
      left: `${5 + Math.random() * 90}%`,
      rotation: Math.random() * 360,
      size: 40 + Math.random() * 60, // 40-100px
      opacity: 0.05 + Math.random() * 0.05 // 0.05 - 0.10
    }));
    setWatermarks(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {watermarks.map((mark) => (
        <div
          key={mark.id}
          className="absolute"
          style={{
            top: mark.top,
            left: mark.left,
            transform: `rotate(${mark.rotation}deg)`,
            opacity: mark.opacity,
            filter: 'grayscale(100%) contrast(150%)',
          }}
        >
          <SymbolIcon symbolId={mark.symbol} size={mark.size} />
        </div>
      ))}
    </div>
  );
};
