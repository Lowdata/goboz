import React, { useState } from 'react';
import { TaskItem, UserState } from '@/types/game';
import { INITIAL_TASKS } from '@/utils/constants';
import { CheckCircle2, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { sound } from '@/utils/sound';
import toast from 'react-hot-toast';

interface FlywheelEconomyProps {
  userState: UserState;
  onCompleteTask: (taskId: string, rewardPulls: number) => void;
  onOpenConnectModal: () => void;
  tasksDB?: TaskItem[];
}

export const FlywheelEconomy: React.FC<FlywheelEconomyProps> = ({
  userState,
  onCompleteTask,
  onOpenConnectModal,
  tasksDB
}) => {
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const tasks = (tasksDB && tasksDB.length > 0 ? tasksDB : INITIAL_TASKS).filter(
    (task) => !['connect_wallet', 'refer_friend', 'share_result'].includes(task.id)
  );

  const handleTaskClick = (task?: TaskItem) => {
    if (!task) return;
    if (!userState.isConnected) {
      onOpenConnectModal();
      return;
    }

    if (userState.completedTasks[task.id] || completingTask) return;

    if (task.link) {
      window.open(task.link, '_blank', 'noopener,noreferrer');
    }

    sound.playCoin();
    setCompletingTask(task.id);
    window.setTimeout(() => {
      onCompleteTask(task.id, task.rewardPulls);
      setCompletingTask(null);
    }, 5000);
  };

  const handleDailyClaim = () => {
    if (!userState.isConnected) {
      onOpenConnectModal();
      return;
    }
    if (userState.completedTasks['daily_claim']) return;
    sound.playCoin();
    onCompleteTask('daily_claim', 1);
  };

  const handleCopyReferral = () => {
    if (!userState.isConnected || !userState.walletAddress) {
      onOpenConnectModal();
      return;
    }
    const refCode = userState.referralCode || userState.walletAddress;
    const refLink = `${window.location.origin}/?ref=${refCode}`;
    navigator.clipboard.writeText(refLink);
    toast.success("Referral link copied!");
    sound.playCoin();
  };

  return (
    <section className="w-full flex flex-col gap-6">
      {/* Pull economy rules cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#F7F2E4] border-2 border-[#3A332B] rounded-xl p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_#3A332B] transition-all">
          <div>
            <span className="font-pixel text-xs text-[#5D7C3B] font-bold uppercase tracking-wider block mb-1">
              CONNECT WALLET
            </span>
            <p className="text-xs text-[#262320] font-sans">
              1 free pull on wallet connect.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#3A332B]/20">
            <span className="font-pixel text-sm text-[#5D7C3B] font-bold">+1 FREE PULL</span>
          </div>
        </div>
        <div className="relative bg-[#F7F2E4] border-2 border-[#3A332B] rounded-xl p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_#3A332B] hover:shadow-[4px_4px_0px_0px_#763D52] hover:border-[#763D52] transition-all ring-4 ring-[#763D52]/40 animate-pulse">
          <div>
            <span className="font-pixel text-xs text-[#763D52] font-bold uppercase tracking-wider block mb-1">
              REFER A FRIEND
            </span>
            <p className="text-xs text-[#262320] font-sans">
              +2 pull on referral that connects a new wallet.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#3A332B]/20 flex items-center justify-between">
            <span className="font-pixel text-sm text-[#763D52] font-bold">+2 PULLS</span>
            <button
              onClick={handleCopyReferral}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ECE3C6] hover:bg-[#E2D8B9] text-[#262320] border border-[#3A332B] rounded text-[10px] font-pixel shadow-[2px_2px_0px_0px_#763D52] transition-all active:translate-y-0.5"
            >
              <Copy className="w-3.5 h-3.5 text-[#5D7C3B]" />
              <span>{userState.referralCode ? `CODE: ${userState.referralCode}` : 'COPY LINK'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Flywheel Tasks Table */}
      <div className="bg-[#F7F2E4] border-2 border-[#3A332B] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#3A332B]">
        <div className="bg-[#763D52] text-[#ECE3C6] px-3.5 py-2.5 rounded-xl border-2 border-[#3A332B] mb-4 flex items-center justify-between shadow-[2px_2px_0px_0px_#3A332B]">
          <h3 className="font-pixel text-xs sm:text-sm tracking-wider">
            EARN MORE PULLS (INTERACTIVE TASKS)
          </h3>
          <span className="font-pixel text-[10px] text-[#ECE3C6]/90 hidden sm:inline">
            CLICK TO COMPLETE
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => {
            const isCompleted = !!userState.completedTasks[task.id];
            const isCompleting = completingTask === task.id;
            return (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-[#5D7C3B]/20 border-[#5D7C3B] opacity-85'
                    : 'bg-[#ECE3C6] hover:bg-[#E2D8B9] border-[#3A332B] shadow-[2px_2px_0px_0px_#3A332B]'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-[#3A332B] ${
                      isCompleted
                        ? 'bg-[#5D7C3B] text-[#ECE3C6]'
                        : 'bg-[#C49B33] text-[#262320]'
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
                      <h4 className="font-pixel text-xs sm:text-sm text-[#262320] font-bold">
                        {task.title}
                      </h4>
                      {task.link && (
                        <ExternalLink className="w-3.5 h-3.5 text-[#5D7C3B]" />
                      )}
                    </div>
                    <p className="text-xs text-[#3A332B] font-sans mt-0.5">
                      {task.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-2 sm:mt-0">
                  <span
                    className={`font-pixel text-xs px-2.5 py-1 rounded border ${
                      isCompleted
                        ? 'bg-[#5D7C3B]/20 text-[#5D7C3B] font-bold border-[#5D7C3B]'
                        : 'bg-[#763D52]/20 text-[#763D52] font-bold border-[#763D52]'
                    }`}
                  >
                    {task.rewardText}
                  </span>

                  <button
                    disabled={isCompleted || isCompleting}
                    className={`px-3.5 py-1.5 rounded-lg font-pixel text-xs tracking-wider border-2 border-[#3A332B] transition-all ${
                      isCompleted
                        ? 'bg-[#ECE3C6] text-[#3A332B] cursor-default opacity-60'
                        : 'bg-[#C49B33] hover:bg-[#B38D2C] text-[#262320] shadow-[2px_2px_0px_0px_#262320]'
                    }`}
                  >
                    {isCompleted ? 'COMPLETED' : isCompleting ? 'MARKING IN 5S...' : 'CLAIM PULL'}
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
