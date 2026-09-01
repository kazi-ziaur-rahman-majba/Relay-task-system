import toast from 'react-hot-toast';
import { TaskHeader } from '@/features/tasks/TaskHeader';
import { useTaskStorage } from '@/hooks/useTaskStorage';
import { RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const { resetToDefaultSeed, tasks } = useTaskStorage();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset task data back to the default 250 seed tasks?')) {
      resetToDefaultSeed();
      toast.success('System restored back to default 250 seed tasks.');
    }
  };

  return (
    <div className="min-h-full bg-[#F7F7F7] text-slate-900 font-sans antialiased">
      <main className="w-full max-w-full px-1 sm:px-6 py-1 sm:py-4 space-y-3 sm:space-y-6">
        {/* Header */}
        <TaskHeader
          title="Settings & Data Management"
          description="Manage system configurations and dataset resetting"
        />

        <div className="max-w-2xl">
          {/* Card 1: Data Management */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#FE9F43] flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Demo Data Reset</h3>
                <p className="text-xs text-slate-500 font-medium">Restore default dataset</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Currently loaded with <strong className="text-slate-900">{tasks.length} tasks</strong> in local storage.
              Clicking below will clear any local edits and restore the original 250 seed task items.
            </p>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#FE9F43] hover:bg-[#FF6E22] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
            >
              <RefreshCw className="w-4 h-4" />
              Restore Default 250 Seed Tasks
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
