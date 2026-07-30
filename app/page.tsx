'use client';

import React, { useState, useEffect } from 'react';
import { UserState, PullResult, TaskItem } from '@/types/game';
import { Navbar } from '@/components/Navbar';
import { SlotMachine } from '@/components/SlotMachine';
import { FlywheelEconomy } from '@/components/FlywheelEconomy';
import { Footer } from '@/components/Footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import { RewardTiersModal } from '@/components/RewardTiersModal';
import { HowItWorksModal } from '@/components/HowItWorksModal';
import { PullHistoryModal } from '@/components/PullHistoryModal';
import { RewardCardModal } from '@/components/RewardCardModal';

export default function GobbozHomePage() {
  const [userState, setUserState] = useState<UserState>({
    isConnected: false,
    walletAddress: null,
    twitter: '',
    referralCode: '',
    referredUsers: [],
    pullsRemaining: 1,
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
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activeCardModalResult, setActiveCardModalResult] =
    useState<PullResult | null>(null);

  const [dbTasks, setDbTasks] = useState<TaskItem[]>([]);

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

  // Fetch user state from backend if connected
  useEffect(() => {
    async function fetchUserState() {
      if (!userState.isConnected || !userState.walletAddress) return;

      try {
        const res = await fetch(
          `/api/user?wallet=${encodeURIComponent(userState.walletAddress)}`
        );
        if (res.ok) {
          const data = await res.json();
          setUserState((prev) => {
            const tasksObj: Record<string, boolean> = { ...prev.completedTasks };
            if (Array.isArray(data.completedTasks)) {
              data.completedTasks.forEach((t: string) => {
                tasksObj[t] = true;
              });
            } else if (data.completedTasks && typeof data.completedTasks === 'object') {
              Object.assign(tasksObj, data.completedTasks);
            }

            return {
              ...prev,
              isConnected: true,
              pullsRemaining:
                data.pullsLeft !== undefined
                  ? data.pullsLeft
                  : prev.pullsRemaining,
              twitter: data.twitterHandle || data.twitter || prev.twitter,
              referralCode: data.referralCode || prev.referralCode,
              completedTasks:
                Object.keys(tasksObj).length > 0
                  ? tasksObj
                  : prev.completedTasks
            };
          });
        }
      } catch (err) {
        console.error('Failed to fetch user state:', err);
      }
    }

    fetchUserState();
  }, [userState.isConnected, userState.walletAddress]);

  interface OnboardingResult {
    walletAddress?: string | null;
    twitter?: string;
    twitterHandle?: string;
    pullsLeft?: number;
    pullsRemaining?: number;
    referralCode?: string;
    referredUsers?: string[];
    completedTasks?: string[] | Record<string, boolean>;
  }

  const handleOnboardingSuccess = (userData: OnboardingResult) => {
    const tasksObj: Record<string, boolean> = { ...userState.completedTasks };
    if (Array.isArray(userData.completedTasks)) {
      userData.completedTasks.forEach((t: string) => {
        tasksObj[t] = true;
      });
    } else if (userData.completedTasks && typeof userData.completedTasks === 'object') {
      Object.assign(tasksObj, userData.completedTasks);
    }

    setUserState((prev) => {
      const addr = userData.walletAddress || prev.walletAddress;
      return {
        ...prev,
        isConnected: !!addr,
        walletAddress: addr || null,
        twitter:
          userData.twitter !== undefined
            ? userData.twitter
            : userData.twitterHandle !== undefined
            ? userData.twitterHandle
            : prev.twitter,
        pullsRemaining:
          userData.pullsLeft !== undefined
            ? userData.pullsLeft
            : userData.pullsRemaining !== undefined
            ? userData.pullsRemaining
            : prev.pullsRemaining,
        referralCode: userData.referralCode || prev.referralCode,
        referredUsers: userData.referredUsers || prev.referredUsers,
        completedTasks: Object.keys(tasksObj).length > 0 ? tasksObj : prev.completedTasks
      };
    });
  };

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

  const handlePullCompleted = (
    result: PullResult & { user?: { pullsLeft?: number } }
  ) => {
    setUserState((prev) => {
      const newHistory = [result, ...prev.history];
      return {
        ...prev,
        pullsRemaining:
          result.user?.pullsLeft !== undefined
            ? result.user.pullsLeft
            : result.pullsRemaining,
        totalPullsDone: prev.totalPullsDone + 1,
        history: newHistory
      };
    });

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#ECE3C6] text-[#262320] flex flex-col font-sans selection:bg-[#5D7C3B] selection:text-[#ECE3C6]">
      {/* Top Navbar */}
      <Navbar
        userState={userState}
        onOpenConnectModal={() => {
          setOnboardingStep(1);
          setIsOnboardingModalOpen(true);
        }}
        onDisconnect={handleDisconnect}
        onToggleSound={handleToggleSound}
        onOpenHowItWorksModal={() => setIsHowItWorksModalOpen(true)}
        onOpenRewardTiersModal={() => setIsRewardTiersModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
      />

      {/* Main Content Body - Side by Side Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Compact Title / Header Banner */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="font-heading text-[1.75rem] min-[400px]:text-3xl sm:text-5xl md:text-6xl text-[#262320] uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(58,51,43,0.15)] leading-tight">
            PULL THE LEVER. <span className="text-[#5D7C3B] block sm:inline">LOOT THE LIST.</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#3A332B] mt-1 max-w-2xl mx-auto tracking-wide font-medium">
            Every goblin&apos;s got a lever to pull and something to steal. Yours might be a whitelist spot.
          </p>
        </div>

        {/* Side-by-Side Grid: Left = Tasks / Pull Economy, Right = 3-Reel Slot Machine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tasks & Pull Economy */}
          <div className="lg:col-span-5 w-full">
            <FlywheelEconomy
              userState={userState}
              onCompleteTask={handleCompleteTask}
              onOpenConnectModal={() => {
                setOnboardingStep(1);
                setIsOnboardingModalOpen(true);
              }}
              tasksDB={dbTasks}
            />
          </div>

          {/* Right Column: Centerpiece 3-Reel Slot Machine */}
          <div className="lg:col-span-7 w-full flex justify-center">
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
          </div>
        </div>
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

      {/* 3-Step Onboarding / Signup Modal */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        initialStep={onboardingStep}
        onClose={() => setIsOnboardingModalOpen(false)}
        onSuccess={handleOnboardingSuccess}
        currentUser={userState.isConnected ? userState : null}
      />

      {/* Parchment How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksModalOpen}
        onClose={() => setIsHowItWorksModalOpen(false)}
      />

      {/* Parchment Reward Tiers Modal */}
      <RewardTiersModal
        isOpen={isRewardTiersModalOpen}
        onClose={() => setIsRewardTiersModalOpen(false)}
      />

      {/* Parchment Pull History Modal */}
      <PullHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={userState.history}
        onOpenCard={(res) => setActiveCardModalResult(res)}
      />

      {/* Canvas Shareable Result Card Modal */}
      <RewardCardModal
        isOpen={!!activeCardModalResult}
        result={activeCardModalResult}
        onClose={() => setActiveCardModalResult(null)}
        onShareBonusClaimed={handleShareBonusClaimed}
        twitterHandle={userState.twitter}
      />
    </div>
  );
}
