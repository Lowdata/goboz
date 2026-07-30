import React from 'react';
import { Wallet, PlayCircle, Trophy } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'CONNECT',
      description: 'Link your wallet. Every goblin gets one free pull.',
      icon: <Wallet className="w-8 h-8 text-amber-400" />
    },
    {
      step: '02',
      title: 'PULL',
      description: 'Yank the lever. Watch the reels land.',
      icon: <PlayCircle className="w-8 h-8 text-amber-400" />
    },
    {
      step: '03',
      title: 'LOOT',
      description: 'Match symbols, claim your tier — WL, raffle entry, or the big one.',
      icon: <Trophy className="w-8 h-8 text-amber-400" />
    }
  ];

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4">
      <div className="text-center mb-8">
        <div className="banner banner--green flex items-center justify-center gap-2">
          <img src="/skull.png" alt="" className="w-5 h-5 object-contain" /> HOW IT WORKS
        </div>
        <p className="font-mono text-xs text-parchment-dim uppercase tracking-widest mt-1">
          THREE STEPS TO TRIBAL GLORY
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item, index) => (
          <div
            key={item.step}
            className="relative bg-stone-900/90 border-4 border-stone-800 hover:border-amber-500/60 rounded-2xl p-6 transition-all group hover:-translate-y-1 shadow-xl"
          >
            {/* Step Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-pixel text-3xl text-stone-700 group-hover:text-amber-500/80 transition-colors">
                {item.step}
              </span>
              <div className="p-3 bg-stone-800 rounded-xl border border-stone-700 group-hover:border-amber-500/50 transition-colors">
                {item.icon}
              </div>
            </div>

            <h3 className="font-pixel text-lg text-parchment-100 tracking-wider mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-stone-300 font-sans leading-relaxed">
              {item.description}
            </p>

            {/* Tribal corner accent */}
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-stone-700 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
};
