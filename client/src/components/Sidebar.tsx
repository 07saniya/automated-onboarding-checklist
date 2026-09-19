import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  FileSpreadsheet, 
  CheckSquare, 
  History,
  ChevronRight
} from 'lucide-react';
import { DashboardStats } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  stats: DashboardStats | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, stats }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      emoji: '🏠',
      badge: null
    },
    {
      id: 'add-employee',
      label: 'Add Employee',
      icon: UserPlus,
      emoji: '👤',
      badge: stats ? `${stats.totalEmployees}` : null
    },
    {
      id: 'generate-checklist',
      label: 'Generate Checklist',
      icon: FileSpreadsheet,
      emoji: '📋',
      badge: 'Auto'
    },
    {
      id: 'task-management',
      label: 'Task Management',
      icon: CheckSquare,
      emoji: '✅',
      badge: stats ? `${stats.pendingTasks + stats.inProgressTasks}` : null
    },
    {
      id: 'checklist-history',
      label: 'Checklist History',
      icon: History,
      emoji: '🕒',
      badge: stats ? `${stats.fullyOnboarded}` : null
    }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white lg:min-h-[calc(100vh-4rem)] border-b lg:border-b-0 lg:border-r border-slate-200 p-4">
      {/* Navigation Label */}
      <div className="hidden lg:block px-3 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
        Navigation
      </div>

      {/* Nav List - Horizontal scroll on mobile, vertical stack on desktop */}
      <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal shrink-0 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg leading-none" role="img" aria-label={item.label}>
                  {item.emoji}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center space-x-1.5 ml-2">
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                      isActive
                        ? 'bg-indigo-200 text-indigo-800'
                        : item.badge === 'Auto'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="hidden lg:inline w-4 h-4 text-indigo-600 ml-1" />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Help Card on Desktop */}
      <div className="hidden lg:block mt-8 p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-100/80">
        <div className="flex items-center space-x-2 text-indigo-900 font-semibold text-xs mb-1">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span>Automated Logic</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Onboarding checklists are automatically customized based on the new hire's department and required hardware.
        </p>
      </div>
    </aside>
  );
};
