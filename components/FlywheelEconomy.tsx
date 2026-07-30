import React, { useState } from 'react';
import { TaskItem, UserState } from '@/types/game';
import { INITIAL_TASKS, PITY_THRESHOLD } from '@/utils/constants';
import { CheckCircle2, Copy, ExternalLink, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { sound } from '@/utils/sound';

interface FlywheelEconomyProps {
  userState: UserState;
  onCompleteTask: (taskId: string, rewardPulls: number) => void;
  onOpenConnectModal: () => void;
}

export const FlywheelEconomy: React.FC<FlywheelEconomyProps> = ({
  userState,
  onCompleteTask,
  onOpenConnectModal
}) => {
  const [copiedRef, setCopiedRef] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  const handleTaskClick = (task: TaskItem) => {
    if (!userState.isConnected) {
      onOpenConnectModal();
      return;
    }

    if (userState.completedTasks[task.id]) return;

    if (task.link) {
      window.open(task.link, '_blank');
    }

    sound.playCoin();
    onCompleteTask(task.id, task.rewardPulls);

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, isCompleted: true } : t))
    );
  };

  const handleCopyReferral = () => {
    if (!userState.isConnected || !userState.walletAddress) {
      onOpenConnectModal();
      return;
    }
    const refLink = `${window.location.origin}/?ref=${userState.walletAddress}`;
    navigator.clipboard.writeText(refLink);
    setCopiedRef(true);
    sound.playCoin();

    // Also award referral test reward if not already claimed
    if (!userState.completedTasks['refer_friend']) {
      onCompleteTask('refer_friend', 2);
    }

    setTimeout(() => setCopiedRef(false), 3000);
  };

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="font-pixel text-2xl sm:text-3xl text-parchment-100 tracking-wider mb-2">
          PULL ECONOMY (THE FLYWHEEL)
        </h2>
        <p className="font-pixel text-sm text-amber-400 uppercase tracking-widest">
          More pulls, more loot.
        </p>
      </div>

      {/* 4 Core Rules Callout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-stone-900 border-2 border-stone-800 hover:border-amber-500/50 rounded-xl p-4 flex flex-col justify-between transition-all">
          <div>
            <span className="font-pixel text-xs text-amber-400 uppercase tracking-wider block mb-1">
              REFER A FRIEND
            </span>
            <p className="text-xs text-stone-300 font-sans">
              Share your custom link. Every friend who connects awards both of you.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between">
            <span className="font-pixel text-sm text-emerald-400">+2 PULLS</span>
            <button
              onClick={handleCopyReferral}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-parchment-200 rounded text-[11px] font-pixel transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>{copiedRef ? 'COPIED!' : 'COPY LINK'}</span>
            </button>
          </div>
        </div>

        <div className="bg-stone-900 border-2 border-stone-800 hover:border-amber-500/50 rounded-xl p-4 flex flex-col justify-between transition-all">
          <div>
            <span className="font-pixel text-xs text-amber-400 uppercase tracking-wider block mb-1">
              COME BACK TOMORROW
            </span>
            <p className="text-xs text-stone-300 font-sans">
              Daily goblin rations for active lever pullers. Never let your streak die.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between">
            <span className="font-pixel text-sm text-emerald-400">+1 PULL</span>
            <button
              onClick={() => handleTaskClick(tasks.find((t) => t.id === 'daily_claim')!)}
              disabled={!!userState.completedTasks['daily_claim']}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-pixel transition-colors ${
                userState.completedTasks['daily_claim']
                  ? 'bg-emerald-900/40 text-emerald-400 cursor-default'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
              }`}
            >
              <span>
                {userState.completedTasks['daily_claim'] ? 'CLAIMED' : 'CLAIM TODAY'}
              </span>
            </button>
          </div>
        </div>

        <div className="bg-stone-900 border-2 border-stone-800 hover:border-amber-500/50 rounded-xl p-4 flex flex-col justify-between transition-all">
          <div>
            <span className="font-pixel text-xs text-amber-400 uppercase tracking-wider block mb-1">
              SHARE YOUR RESULT
            </span>
            <p className="text-xs text-stone-300 font-sans">
              Every pull outcome card has a one-click share button to unlock a bonus spin.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between">
            <span className="font-pixel text-sm text-emerald-400">+1 BONUS PULL</span>
            <span className="text-[10px] font-pixel text-stone-400">VIA CARD MODAL</span>
          </div>
        </div>

        <div className="bg-stone-900 border-2 border-amber-600/60 rounded-xl p-4 flex flex-col justify-between transition-all shadow-lg shadow-amber-500/5">
          <div>
            <span className="font-pixel text-xs text-amber-400 uppercase tracking-wider block mb-1">
              NO LUCK YET?
            </span>
            <p className="text-xs text-stone-300 font-sans">
              5 empty pulls guarantees your next one hits. Bad luck protection is built in.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between">
            <span className="font-pixel text-xs text-amber-400">
              {userState.pityCounter} / {PITY_THRESHOLD} PITY
            </span>
            <span className="text-[10px] font-pixel text-emerald-400">GUARANTEED HIT</span>
          </div>
        </div>
      </div>

      {/* Interactive Flywheel Tasks Table */}
      <div className="bg-stone-900/80 border-2 border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
          <h3 className="font-pixel text-sm text-parchment-200 tracking-wider">
            EARN MORE PULLS (INTERACTIVE TASKS)
          </h3>
          <span className="font-pixel text-xs text-stone-400">
            CLICK ANY TASK TO COMPLETE
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => {
            const isCompleted = !!userState.completedTasks[task.id];
            return (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-stone-950/60 border-stone-800/80 opacity-75'
                    : 'bg-stone-900 border-stone-700 hover:border-amber-500/50 hover:bg-stone-850 shadow'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-pixel text-xs sm:text-sm text-parchment-100">
                        {task.title}
                      </h4>
                      {task.link && (
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </div>
                    <p className="text-xs text-stone-400 font-sans mt-0.5">
                      {task.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-2 sm:mt-0">
                  <span
                    className={`font-pixel text-xs px-2.5 py-1 rounded ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {task.rewardText}
                  </span>

                  <button
                    disabled={isCompleted}
                    className={`px-3 py-1.5 rounded font-pixel text-xs tracking-wider transition-colors ${
                      isCompleted
                        ? 'bg-stone-800 text-stone-500 cursor-default'
                        : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-sm'
                    }`}
                  >
                    {isCompleted ? 'COMPLETED' : 'CLAIM PULL'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
