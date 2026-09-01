import { useState } from 'react';
import toast from 'react-hot-toast';
import { TaskHeader } from '@/features/tasks/TaskHeader';
import { ShortcutsModal } from '@/features/tasks/modals/ShortcutsModal';
import { useTaskStorage } from '@/hooks/useTaskStorage';
import { RefreshCw, Command, Info, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { resetToDefaultSeed, tasks } = useTaskStorage();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset task data back to the default 250 seed tasks?')) {
      resetToDefaultSeed();
      toast.success('System restored back to default 250 seed tasks.');
    }
  };

  return (
    <div className="min-h-full bg-[#F7F7F7] text-slate-900 font-sans antialiased">
      <main className="w-full max-w-full px-3 sm:px-6 py-4 space-y-6">
        {/* Header */}
        <TaskHeader
          title="Settings & System Management"
          description="System configurations, seed reset, and keyboard shortcuts guide"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Data Management */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#FE9F43] flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Demo Data Reset</h3>
                <p className="text-xs text-slate-500 font-medium">Restore default dataset</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Currently loaded with <strong className="text-slate-900">{tasks.length} tasks</strong> in local storage.
              Clicking below will clear any local edits and restore the original 250 seed task items.
            </p>

            <button
              onClick={handleReset}
              className="w-full px-4 py-2.5 bg-[#FE9F43] hover:bg-[#FF6E22] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
            >
              <RefreshCw className="w-4 h-4" />
              Restore Default 250 Seed Tasks
            </button>
          </div>

          {/* Card 2: Keyboard Shortcuts Guide */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Command className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Keyboard Shortcuts</h3>
                <p className="text-xs text-slate-500 font-medium">Quick navigation controls</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              You can press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700 font-mono font-bold shadow-2xs">?</kbd> anywhere in the application to instantly trigger the keyboard shortcuts guide.
            </p>

            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Command className="w-4 h-4 text-slate-500" />
              Open Shortcuts Guide
            </button>
          </div>
        </div>

        {/* System Information Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900">
            <Info className="w-5 h-5 text-[#FE9F43]" />
            <h3 className="text-sm font-extrabold">System Information</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Application Name</span>
              <span className="font-extrabold text-slate-800">WEBNS Task System</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Version</span>
              <span className="font-extrabold text-slate-800">v2.0.0 (Multi-Page Refactor)</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Environment</span>
              <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Production Ready
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Local Storage Status</span>
              <span className="font-extrabold text-slate-800">Active</span>
            </div>
          </div>
        </div>
      </main>

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
