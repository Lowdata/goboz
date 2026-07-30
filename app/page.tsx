'use client';

import React, { useState, useEffect } from 'react';
import { UserState, PullResult } from '@/types/game';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SlotMachine } from '@/components/SlotMachine';
import { HowItWorks } from '@/components/HowItWorks';
import { FlywheelEconomy } from '@/components/FlywheelEconomy';
import { LoreAndSneakPeeks } from '@/components/LoreAndSneakPeeks';
import { PullHistory } from '@/components/PullHistory';
import { Footer } from '@/components/Footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import { RewardTiersModal } from '@/components/RewardTiersModal';
import { RewardCardModal } from '@/components/RewardCardModal';

export default function GobbozHomePage() {
  const [userState, setUserState] = useState<UserState>({
    isConnected: false,
    walletAddress: null,
    twitter: '',
    referralCode: '',
    referredUsers: [],
    pullsRemaining: 100, // Default 100 pulls for testing
    pityCounter: 0,
    totalPullsDone: 0,
    referralCount: 0,
    streakCount: 1,
    history: [],
    completedTasks: {},
    soundEnabled: true
  });

  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [isRewardTiersModalOpen, setIsRewardTiersModalOpen] = useState(false);
  const [activeCardModalResult, setActiveCardModalResult] =
    useState<PullResult | null>(null);

  const [dbTasks, setDbTasks] = useState<any[]>([]);
  const [globalStats, setGlobalStats] = useState({
    totalPulls: 4892,
    wlSpotsClaimed: 318
  });

  // Fetch tasks from MongoDB on initial load
  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch('/api/tasks');
        if (res.ok) {
          const data = await res.json();
          setDbTasks(data);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    }
    fetchTasks();
  }, []);

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

  const handleOnboardingSuccess = (user: { walletAddress: string; twitter?: string; referralCode?: string; referredUsers?: string[]; pullsLeft?: number; pityCounter?: number; completedTasks?: string[] }) => {
    const tasksMap: Record<string, boolean> = {};
    if (user.completedTasks && Array.isArray(user.completedTasks)) {
      user.completedTasks.forEach((tid: string) => {
        tasksMap[tid] = true;
      });
    }
    setUserState((prev) => ({
      ...prev,
      isConnected: true,
      walletAddress: user.walletAddress,
      twitter: user.twitter || '',
      referralCode: user.referralCode || '',
      referredUsers: user.referredUsers || [],
      pullsRemaining: typeof user.pullsLeft === 'number' ? user.pullsLeft : prev.pullsRemaining,
      pityCounter: user.pityCounter || 0,
      referralCount: user.referredUsers?.length || 0,
      completedTasks: tasksMap
    }));
  };

  useEffect(() => {
    fetch('/api/user').then(async (res) => {
      if (res.ok) handleOnboardingSuccess(await res.json());
    }).catch(() => undefined);
  }, []);

  const handleDisconnect = () => {
    setUserState((prev) => ({
      ...prev,
      isConnected: false,
      walletAddress: null,
      twitter: '',
      referralCode: '',
      referredUsers: []
    }));
  };

  const handleToggleSound = () => {
    setUserState((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  };

  const handlePullCompleted = (result: PullResult & { user?: { pullsLeft?: number; pityCounter?: number } }) => {
    setUserState((prev) => {
      const newHistory = [result, ...prev.history];
      return {
        ...prev,
        pullsRemaining: result.user?.pullsLeft !== undefined ? result.user.pullsLeft : result.pullsRemaining,
        pityCounter: result.user?.pityCounter !== undefined ? result.user.pityCounter : result.pityCounter,
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

  const handleCompleteTask = async (taskId: string, rewardPulls: number) => {
    if (!userState.isConnected || !userState.walletAddress) {
      setOnboardingStep(1);
      setIsOnboardingModalOpen(true);
      return;
    }

    try {
      const res = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId
        })
      });

      if (res.ok) {
        const data = await res.json();
        setUserState((prev) => ({
          ...prev,
          pullsRemaining:
            data.user?.pullsLeft !== undefined
              ? data.user.pullsLeft
              : data.pullsLeft !== undefined
                ? data.pullsLeft
                : prev.pullsRemaining + rewardPulls,
          completedTasks: {
            ...prev.completedTasks,
            [taskId]: true
          }
        }));
      } else {
        const err = await res.json();
        console.error('Failed to complete task:', err);
      }
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  const handleShareBonusClaimed = () => {
    if (userState.completedTasks['share_result']) return;
    void handleCompleteTask('share_result', 1);
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
        onOpenConnectModal={() => {
          setOnboardingStep(1);
          setIsOnboardingModalOpen(true);
        }}
        onDisconnect={handleDisconnect}
        onToggleSound={handleToggleSound}
        onOpenRewardTiersModal={() => setIsRewardTiersModalOpen(true)}
        stats={globalStats}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pb-12">
        {/* Hero Section */}
        <HeroSection
          userState={userState}
          onOpenConnectModal={() => {
            setOnboardingStep(1);
            setIsOnboardingModalOpen(true);
          }}
          onScrollToMachine={scrollToMachine}
          onOpenRewardTiersModal={() => setIsRewardTiersModalOpen(true)}
        />

        <LoreAndSneakPeeks />

        {/* Anchor for scrolling to slot machine */}
        <div id="slot-machine-anchor" className="scroll-mt-24" />

        {/* Centerpiece 3-Reel Slot Machine */}
        <SlotMachine
          userState={userState}
          onPullCompleted={handlePullCompleted}
          onOpenConnectModal={() => {
            setOnboardingStep(1);
            setIsOnboardingModalOpen(true);
          }}
          onRequireTwitter={() => {
            setOnboardingStep(2);
            setIsOnboardingModalOpen(true);
          }}
          onOpenRewardTiersModal={() => setIsRewardTiersModalOpen(true)}
        />

        {/* How It Works Strip (3-Step Strip) */}
        <HowItWorks />

        {/* Pull Economy Section (The Flywheel) */}
        <FlywheelEconomy
          userState={userState}
          onCompleteTask={handleCompleteTask}
          onOpenConnectModal={() => {
            setOnboardingStep(1);
            setIsOnboardingModalOpen(true);
          }}
          tasksDB={dbTasks}
        />

        {/* Past Pulls History */}
        <PullHistory
          history={userState.history}
          onOpenCard={(res) => setActiveCardModalResult(res)}
        />
      </main>

      {/* Footer CTA & Tribal Tagline */}
      <Footer
        userState={userState}
        onOpenConnectModal={() => {
          setOnboardingStep(1);
          setIsOnboardingModalOpen(true);
        }}
        onScrollToMachine={scrollToMachine}
      />

      {/* 3-Step Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        initialStep={onboardingStep}
        onClose={() => setIsOnboardingModalOpen(false)}
        onSuccess={handleOnboardingSuccess}
        currentUser={userState.isConnected ? userState : null}
      />

      {/* Parchment Reward Tiers Modal */}
      <RewardTiersModal
        isOpen={isRewardTiersModalOpen}
        onClose={() => setIsRewardTiersModalOpen(false)}
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
