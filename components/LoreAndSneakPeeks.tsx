import React from 'react';
import { GoblinAvatar } from './GoblinAvatar';
import { Sword, Skull, Crown, ShieldCheck, Clock, Award, Info } from 'lucide-react';

export const LoreAndSneakPeeks: React.FC = () => {
  return (
    <section className="w-full max-w-5xl mx-auto my-14 px-4">
      {/* Lore & Sneak Peeks Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left: GOBBOZ LORE */}
        <div className="lg:col-span-6 bg-stone-900/90 border-4 border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div>
            <div className="mb-4">
              <div className="banner banner--green">
                <span className="skull">💀</span> GOBBOZ LORE
              </div>
            </div>

            <div className="space-y-4 text-stone-300 font-sans text-sm sm:text-base leading-relaxed">
              <p>
                Long ago, goblins lived underground, stealing shinies and causing chaos.
              </p>
              <p>
                One day, the humans built cages, locked the Gobboz away, and thought they had won.
              </p>
              <p className="font-semibold text-amber-400">
                But Gobboz don&apos;t stay caged.
              </p>
              <p>
                We escaped. We spread. We meme. Now we&apos;re taking over the internet—one gobbo, one gobbo at a time.
              </p>
            </div>

            <div className="mt-6">
              <div className="banner banner--plum">
                <span className="skull">💀</span> WHY A LEVER, NOT A WHEEL
              </div>
              <p className="text-stone-300 font-sans text-sm sm:text-base leading-relaxed mt-2">
                Goblins hoard loot — they don&apos;t spin roulette wheels in velvet rooms. A one-armed bandit stuffed with rusty daggers and stolen gems fits the tribe: torch-lit, primitive, perfectly Gobbo.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-stone-800 flex items-center justify-between">
            <span className="font-pixel text-sm sm:text-base text-emerald-400 tracking-wider uppercase">
              NO KINGS. NO MASTERS. ONLY DA TRIBE.
            </span>
            <Sword className="w-6 h-6 text-stone-500" />
          </div>
        </div>

        {/* Right: SNEAK PEEKS */}
        <div className="lg:col-span-6 bg-stone-900/90 border-4 border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="mb-4">
              <div className="banner banner--ink">
                <span className="skull">💀</span> SNEAK PEEKS
              </div>
            </div>

            {/* 3 Pixel Goblins Showcase */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="flex flex-col items-center">
                <GoblinAvatar variant="berserker" size={100} className="w-full h-auto aspect-square rounded-xl shadow-md" />
                <span className="mt-2 font-pixel text-[10px] text-stone-400">#0042</span>
              </div>
              <div className="flex flex-col items-center">
                <GoblinAvatar variant="raider" size={100} className="w-full h-auto aspect-square rounded-xl shadow-md" />
                <span className="mt-2 font-pixel text-[10px] text-stone-400">#0188</span>
              </div>
              <div className="flex flex-col items-center">
                <GoblinAvatar variant="shaman" size={100} className="w-full h-auto aspect-square rounded-xl shadow-md" />
                <span className="mt-2 font-pixel text-[10px] text-stone-400">#0777</span>
              </div>
            </div>
          </div>

          {/* Reference quote caption box */}
          <div className="mt-4 p-4 bg-stone-950 border-2 border-dashed border-stone-700 rounded-xl">
            <p className="font-pixel text-xs text-parchment-200 leading-relaxed">
              * Pixelated. Primitive. Perfectly Gobbo. Our gobbos live on the edge of the canvas. Built for the culture. Born for the meme.
            </p>
          </div>
        </div>
      </div>

      {/* Collection Details, Raffle Prize & Requirements 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* COLLECTION DETAILS */}
        <div className="bg-stone-900/90 border-2 border-stone-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-800">
            <Skull className="w-5 h-5 text-emerald-400" />
            <h3 className="font-pixel text-sm text-parchment-100 uppercase tracking-wider">
              COLLECTION DETAILS
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-stone-300 font-sans">
            <li className="flex justify-between">
              <span className="text-stone-400">Style:</span>
              <span className="font-semibold text-parchment-200">Pixel Art</span>
            </li>
            <li className="flex justify-between">
              <span className="text-stone-400">Supply:</span>
              <span className="font-semibold text-parchment-200">TBA</span>
            </li>
            <li className="flex justify-between">
              <span className="text-stone-400">Chain:</span>
              <span className="font-semibold text-parchment-200">Solana / ETH</span>
            </li>
            <li className="flex justify-between">
              <span className="text-stone-400">Mint Price:</span>
              <span className="font-semibold text-parchment-200">TBA (Free / Low)</span>
            </li>
          </ul>
        </div>

        {/* RAFFLE PRIZE */}
        <div className="bg-stone-900/90 border-2 border-stone-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-800">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-pixel text-sm text-parchment-100 uppercase tracking-wider">
              RAFFLE PRIZE
            </h3>
          </div>
          <div className="flex items-center gap-4 py-2">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-500 rounded-xl flex items-center justify-center text-2xl">
              🎁
            </div>
            <div>
              <p className="font-pixel text-xs text-amber-400">
                ALLOWLIST SPOTS
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Guaranteed WL, FCFS Raffles & Mystery Goblin Chests
              </p>
            </div>
          </div>
        </div>

        {/* RAFFLE REQUIREMENTS */}
        <div className="bg-stone-900/90 border-2 border-stone-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-800">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h3 className="font-pixel text-sm text-parchment-100 uppercase tracking-wider">
              REQUIREMENTS
            </h3>
          </div>
          <ol className="space-y-1.5 text-xs text-stone-300 font-sans list-decimal list-inside">
            <li>Follow @GobbozHQ on X</li>
            <li>Like &amp; Repost the collab tweet</li>
            <li>Join Gobboz Discord</li>
            <li>Join Partner Discord (optional)</li>
            <li>Complete AlphaBot Verification</li>
          </ol>
        </div>
      </div>

      {/* Raffle Details & Important Note Footer Box */}
      <div className="bg-stone-950 border-2 border-stone-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl">
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h4 className="font-pixel text-sm text-parchment-100">
              RAFFLE DETAILS
            </h4>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              Winners selected via AlphaBot. Winners sheet includes Discord Username, Discord ID, and Wallet Address.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-stone-900 border border-stone-700 rounded-xl max-w-sm">
          <Info className="w-5 h-5 text-stone-400 shrink-0" />
          <p className="text-[11px] text-stone-300 font-sans">
            Gobboz reserves the right to cancel incomplete entries. <strong>ZOG!</strong>
          </p>
        </div>
      </div>
    </section>
  );
};
