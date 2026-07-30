'use client';

import React, { useState } from 'react';
import { BookOpen, Crown, Skull, Sword, X } from 'lucide-react';

export const LoreAndSneakPeeks: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full max-w-5xl mx-auto my-8 px-4" aria-labelledby="lore-heading">
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-600/50 bg-stone-900 px-5 py-5 shadow-xl sm:px-7">
        <img src="/skull.png" alt="" className="pointer-events-none absolute -left-8 -bottom-10 w-36 opacity-20" />
        <img src="/crownandswordimage.png" alt="" className="pointer-events-none absolute -right-7 -top-8 w-32 rotate-12 opacity-25" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.2em] text-amber-400">THE CAVERN CHRONICLES</p>
            <h2 id="lore-heading" className="mt-1 text-xl">Gobboz Lore</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-300">The cages broke. The tribe escaped. Now every lever pull is another shiny stolen back from the surface.</p>
          </div>
          <button type="button" onClick={() => setIsOpen(true)} className="btn btn-ghost shrink-0 px-5 py-3 text-xs">
            <BookOpen className="h-4 w-4" /> READ THE PARCHMENT
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="parchment-title">
          <div className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-sm border-8 border-wood bg-parchment p-6 text-ink shadow-2xl sm:p-10 parchment-sheet">
            <button type="button" onClick={() => setIsOpen(false)} className="absolute right-4 top-4 rounded p-2 text-ink-soft hover:bg-black/10" aria-label="Close parchment"><X className="h-5 w-5" /></button>
            <div className="mb-7 flex items-center gap-3 border-b-2 border-ink-soft/30 pb-4">
              <Skull className="h-8 w-8 text-gob-green-dark" /><div><p className="font-mono text-[10px] tracking-widest text-ink-soft">GOBBOZ ARCHIVES</p><h2 id="parchment-title" className="text-2xl text-ink">The Full Parchment</h2></div>
            </div>
            <div className="space-y-5 text-sm leading-7 text-ink-soft sm:text-base">
              <p>Long ago, goblins lived below the stone, stealing shinies and causing exactly the right amount of chaos. Then the humans built cages and believed the tribe was finished.</p>
              <p><strong className="text-ink">But Gobboz do not stay caged.</strong> We escaped, we spread, and we meme — one gobbo at a time.</p>
              <div className="rounded border-2 border-ink-soft/30 bg-white/20 p-4"><div className="mb-2 flex items-center gap-2 font-heading text-ink"><Sword className="h-5 w-5" /> WHY A LEVER?</div>Goblins hoard loot. A creaking one-armed bandit full of rusty daggers and stolen gems belongs in this torch-lit cavern.</div>
              <div className="rounded border-2 border-ink-soft/30 bg-white/20 p-4"><div className="mb-2 flex items-center gap-2 font-heading text-ink"><Crown className="h-5 w-5" /> THE PRIZE</div>Pull for allowlist spots, FCFS raffles, and mystery goblin chests. Winners are selected through AlphaBot after the campaign closes.</div>
            </div>
            <p className="mt-8 border-t-2 border-ink-soft/30 pt-4 text-center font-heading text-sm text-gob-green-dark">NO KINGS. NO MASTERS. ONLY DA TRIBE.</p>
          </div>
        </div>
      )}
    </section>
  );
};
