'use client';

import React, { useState, useEffect } from 'react';
import { UserState, PullResult } from '@/types/game';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SlotMachine } from '@/components/SlotMachine';
import { HowItWorks } from '@/components/HowItWorks';
import { FlywheelEconomy } from '@/components/FlywheelEconomy';
import { RewardTiers } from '@/components/RewardTiers';
import { LoreAndSneakPeeks } from '@/components/LoreAndSneakPeeks';
import { PullHistory } from '@/components/PullHistory';
import { Footer } from '@/components/Footer';
import { WalletConnectModal } from '@/components/WalletConnectModal';
import { RewardCardModal } from '@/components/RewardCardModal';

export default function GobbozHomePage() {
  const [userState, setUserState] = useState<UserState>({
    isConnected: false,
    walletAddress: null,
    pullsRemaining: 100, // Default 100 pulls for testing
    pityCounter: 0,
    totalPullsDone: 0,
    referralCount: 0,
    streakCount: 1,
    history: [],
    completedTasks: {},
    soundEnabled: true
  });

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [activeCardModalResult, setActiveCardModalResult] =
    useState<PullResult | null>(null);

  const [globalStats, setGlobalStats] = useState({
    totalPulls: 4892,
    wlSpotsClaimed: 318
  });

  // Check URL for referral param on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refAddr = params.get('ref');
      if (refAddr && !userState.completedTasks['referred_by']) {
        console.log('Referred by goblin:', refAddr);
      }
    }
  }, [userState.completedTasks]);

  const handleConnectWallet = (address: string) => {
    setUserState((prev) => {
      const isFirstConnect = !prev.completedTasks['connect_wallet'];
      const newPulls = isFirstConnect
        ? prev.pullsRemaining + 100
        : Math.max(prev.pullsRemaining, 100);

      return {
        ...prev,
        isConnected: true,
        walletAddress: address,
        pullsRemaining: newPulls,
        completedTasks: {
          ...prev.completedTasks,
          connect_wallet: true
        }
      };
    });
  };

  const handleDisconnect = () => {
    setUserState((prev) => ({
      ...prev,
      isConnected: false,
      walletAddress: null
    }));
  };

  const handleToggleSound = () => {
    setUserState((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  };

  const handlePullCompleted = (result: PullResult) => {
    setUserState((prev) => {
      const newHistory = [result, ...prev.history];
      return {
        ...prev,
        pullsRemaining: result.pullsRemaining,
        pityCounter: result.pityCounter,
        totalPullsDone: prev.totalPullsDone + 1,
        history: newHistory
      };
    });

    // Update simulated global stats
    setGlobalStats((prev) => ({
      totalPulls: prev.totalPulls + 1,
      wlSpotsClaimed:
        result.tierId === 'guaranteed_wl' || result.tierId === 'triple_gem'
          ? prev.wlSpotsClaimed + 1
          : prev.wlSpotsClaimed
    }));

    // Open shareable result card automatically!
    setActiveCardModalResult(result);
  };

  const handleCompleteTask = (taskId: string, rewardPulls: number) => {
    setUserState((prev) => ({
      ...prev,
      pullsRemaining: prev.pullsRemaining + rewardPulls,
      completedTasks: {
        ...prev.completedTasks,
        [taskId]: true
      }
    }));
  };

  const handleShareBonusClaimed = () => {
    if (userState.completedTasks['share_result']) return;
    setUserState((prev) => ({
      ...prev,
      pullsRemaining: prev.pullsRemaining + 1,
      completedTasks: {
        ...prev.completedTasks,
        share_result: true
      }
    }));
  };

  const scrollToMachine = () => {
    const el = document.getElementById('slot-machine-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-parchment-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        userState={userState}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onDisconnect={handleDisconnect}
        onToggleSound={handleToggleSound}
        stats={globalStats}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pb-12">
        {/* Hero Section */}
        <HeroSection
          userState={userState}
          onOpenConnectModal={() => setIsConnectModalOpen(true)}
          onScrollToMachine={scrollToMachine}
        />

        {/* Anchor for scrolling to slot machine */}
        <div id="slot-machine-anchor" className="scroll-mt-24" />

        {/* Centerpiece 3-Reel Slot Machine */}
        <SlotMachine
          userState={userState}
          onPullCompleted={handlePullCompleted}
          onOpenConnectModal={() => setIsConnectModalOpen(true)}
        />

        {/* How It Works Strip (3-Step Strip) */}
        <HowItWorks />

        {/* Pull Economy Section (The Flywheel) */}
        <FlywheelEconomy
          userState={userState}
          onCompleteTask={handleCompleteTask}
          onOpenConnectModal={() => setIsConnectModalOpen(true)}
        />

        {/* Anchor for Reward Tiers */}
        <div id="rewards" className="scroll-mt-24" />

        {/* Reward Tiers Section (What's in the machine) */}
        <RewardTiers />

        {/* Gobboz Lore, Sneak Peeks & Raffle Details */}
        <LoreAndSneakPeeks />

        {/* Past Pulls History */}
        <PullHistory
          history={userState.history}
          onOpenCard={(res) => setActiveCardModalResult(res)}
        />
      </main>

      {/* Footer CTA & Tribal Tagline */}
      <Footer
        userState={userState}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onScrollToMachine={scrollToMachine}
      />

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnect={handleConnectWallet}
      />

      {/* Canvas Shareable Result Card Modal */}
      <RewardCardModal
        isOpen={!!activeCardModalResult}
        result={activeCardModalResult}
        onClose={() => setActiveCardModalResult(null)}
        onShareBonusClaimed={handleShareBonusClaimed}
      />
    </div>
  );
}
