import React from 'react';
import { 
  ClipboardCheck, 
  RotateCcw, 
  Sparkles,
  Bell
} from 'lucide-react';
import { DashboardStats } from '../types';

interface NavbarProps {
  activeTab: string;
  stats: DashboardStats | null;
  onResetData: () => void;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  stats, 
  onResetData, 
  onTabChange 
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                OnboardFlow
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                Automated System
              </span>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {stats && (
              <div className="hidden md:flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold">{stats.activeOnboarding} Active Onboarding</span>
                </div>

                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-100">
                  <span className="font-semibold">{stats.pendingTasks} Pending Tasks</span>
                </div>

                {stats.overdueTasks > 0 && (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-100 font-medium">
                    <Bell className="w-3.5 h-3.5 text-rose-500" />
                    <span>{stats.overdueTasks} Overdue</span>
                  </div>
                )}
              </div>
            )}

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetData}
              title="Reset to initial realistic demo data"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Quick Add Employee Shortcut */}
            <button
              onClick={() => onTabChange('add-employee')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ New Hire</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
