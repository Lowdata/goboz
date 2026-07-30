'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Sparkles, AlertCircle, Check, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialStep?: number;
  currentUser?: any;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialStep = 1,
  currentUser = null
}) => {
  const [step, setStep] = useState<number>(initialStep);
  const [walletAddress, setWalletAddress] = useState<string>(currentUser?.walletAddress || '');
  const [twitterHandle, setTwitterHandle] = useState<string>(currentUser?.twitter || '');
  const [inviteCode, setInviteCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setError(null);
      setSuccessMsg(null);
      if (currentUser?.walletAddress) {
        setWalletAddress(currentUser.walletAddress);
      }
      if (currentUser?.twitter) {
        setTwitterHandle(currentUser.twitter);
      }
    }
  }, [isOpen, initialStep, currentUser]);

  if (!isOpen) return null;

  // STEP 1: Connect MetaMask Wallet
  const handleConnectMetaMask = async () => {
    setLoading(true);
    setError(null);
    try {
      let address = '';
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        if (accounts && accounts.length > 0) {
          address = accounts[0];
        }
      } else {
        // Fallback for demo/testing if MetaMask extension is not installed
        address = '0xGobboz_' + Math.random().toString(36).substring(2, 10).toLowerCase();
      }

      if (!address) {
        throw new Error('Could not retrieve MetaMask wallet address.');
      }

      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect wallet.');
      }

      setWalletAddress(data.walletAddress);
      onSuccess(data);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'MetaMask connection failed.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Save Twitter
  const handleSaveTwitter = async (skip: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!skip && !twitterHandle.trim()) {
        setError('Please enter your Twitter handle or choose Skip for now.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          twitter: skip ? '' : twitterHandle.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save Twitter handle.');
      }

      onSuccess(data);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to update Twitter handle.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Submit Invite Code
  const handleApplyInvite = async () => {
    if (!inviteCode.trim()) {
      setError('Please enter a referral code.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          inviteCode: inviteCode.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to apply invite code.');
      }

      setSuccessMsg('+2 BONUS PULLS AWARDED! Welcome to DA TRIBE!');
      onSuccess(data);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to apply referral code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-stone-950 border-4 border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-parchment-100">
        {/* Background Dungeon Watermark */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 opacity-10 pointer-events-none">
          <img src="/SKULL.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Header Badge */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <img src="/SKULL.png" alt="Gobboz Skull" className="w-8 h-8 object-contain" />
            <div>
              <span className="font-heading text-lg sm:text-xl text-parchment-100 tracking-wider">
                GOBLIN ONBOARDING
              </span>
              <div className="font-mono text-xs text-amber-400">
                STEP {step} OF 3
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-amber-500 shadow-md shadow-amber-500/20' : 'bg-stone-800'
              }`}
            />
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-xl flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-950/80 border border-green-500/50 rounded-xl flex items-center gap-2 text-xs text-green-300">
            <Check className="w-4 h-4 shrink-0 text-green-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: METAMASK ONLY */}
        {step === 1 && (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-2xl">
              <h3 className="font-heading text-lg text-amber-400 mb-2">
                1. CONNECT METAMASK WALLET
              </h3>
              <p className="text-xs text-stone-300 font-sans max-w-sm mx-auto leading-relaxed">
                Connect your MetaMask wallet to enter the goblin cavern. Every goblin gets <strong>+3 INITIAL LEVER PULLS</strong> automatically!
              </p>
            </div>

            <button
              onClick={handleConnectMetaMask}
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-heading text-sm sm:text-base tracking-widest uppercase rounded-xl shadow-2xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                alt="MetaMask"
                className="w-6 h-6"
              />
              <span>{loading ? 'CONNECTING WALLET...' : 'CONNECT METAMASK WALLET'}</span>
            </button>
          </div>
        )}

        {/* STEP 2: TWITTER LINK */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-2xl">
              <h3 className="font-heading text-lg text-amber-400 mb-2">
                2. LINK TWITTER / X (REQUIRED FOR MACHINE)
              </h3>
              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                You can skip this step initially to browse the cavern, but <strong>you cannot pull the slot machine lever until your Twitter handle is provided</strong>.
              </p>
            </div>

            <div>
              <label className="block font-mono text-xs text-stone-400 mb-2">
                YOUR TWITTER HANDLE
              </label>
              <input
                type="text"
                placeholder="@GobbozHQ"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="w-full px-4 py-3 bg-stone-900 border-2 border-stone-800 rounded-xl text-parchment-100 font-mono text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleSaveTwitter(false)}
                disabled={loading || !twitterHandle.trim()}
                className="flex-1 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-stone-950 font-heading text-sm tracking-widest uppercase rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {loading ? 'SAVING...' : 'SAVE & NEXT'}
              </button>

              <button
                onClick={() => handleSaveTwitter(true)}
                disabled={loading}
                className="py-3 px-6 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white font-mono text-xs tracking-wider uppercase rounded-xl border border-stone-800 transition-colors"
              >
                SKIP FOR NOW
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INVITE CODE */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-2xl">
              <h3 className="font-heading text-lg text-amber-400 mb-2">
                3. ADD INVITATION CODE (OPTIONAL)
              </h3>
              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                Got a referral code from a fellow Goblin? Enter it below to award <strong>+2 BONUS PULLS</strong> to both you and your referrer!
              </p>
            </div>

            <div>
              <label className="block font-mono text-xs text-stone-400 mb-2">
                INVITATION CODE
              </label>
              <input
                type="text"
                placeholder="GOB-XXXX"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-stone-900 border-2 border-stone-800 rounded-xl text-parchment-100 font-mono text-sm uppercase focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleApplyInvite}
                disabled={loading || !inviteCode.trim()}
                className="flex-1 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-stone-950 font-heading text-sm tracking-widest uppercase rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {loading ? 'APPLYING...' : 'APPLY CODE (+2 PULLS)'}
              </button>

              <button
                onClick={onClose}
                disabled={loading}
                className="py-3 px-6 bg-stone-900 hover:bg-stone-800 text-parchment-100 font-heading text-sm tracking-wider uppercase rounded-xl border border-stone-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>ENTER CAVERN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
