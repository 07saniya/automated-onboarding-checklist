import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  Briefcase, 
  Laptop, 
  UserCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { DashboardStats, Employee, Checklist } from '../types';

interface DashboardProps {
  stats: DashboardStats | null;
  employees: Employee[];
  checklists: Checklist[];
  onNavigateTab: (tab: string, employeeId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  employees,
  checklists,
  onNavigateTab
}) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3 text-slate-500">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading onboarding dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate per-employee checklist progress
  const employeeProgress = employees.map(emp => {
    const cl = checklists.find(c => c.employeeId === emp.id);
    const total = cl ? cl.tasks.length : 0;
    const completed = cl ? cl.tasks.filter(t => t.status === 'Completed').length : 0;
    const inProgress = cl ? cl.tasks.filter(t => t.status === 'In Progress').length : 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      ...emp,
      totalTasks: total,
      completedTasks: completed,
      inProgressTasks: inProgress,
      percentage,
      checklistId: cl?.id
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Intelligent Onboarding Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to the Onboarding Control Center
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
            Monitor real-time ramp-up progress, automate role-based checklists, and ensure seamless integration for every new team member.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('add-employee')}
              className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-semibold text-sm hover:bg-indigo-50 shadow-sm transition-all cursor-pointer inline-flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Add New Hire</span>
            </button>
            <button
              onClick={() => onNavigateTab('generate-checklist')}
              className="px-4 py-2 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-sm border border-indigo-400/30 transition-all cursor-pointer inline-flex items-center space-x-2"
            >
              <span>Auto-Generate Checklist</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative background glows */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 top-0 w-60 h-60 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Onboarding */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Onboarding</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.activeOnboarding}</span>
            <span className="text-xs text-slate-500">hires in progress</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center space-x-1">
            <span className="font-semibold text-slate-700">{stats.totalEmployees}</span>
            <span>total employees tracked</span>
          </div>
        </div>

        {/* Card 2: Overall Completion Rate */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Completion Rate</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.overallCompletionRate}%</span>
            <span className="text-xs text-emerald-600 font-semibold">Across active tasks</span>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.overallCompletionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Tasks Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tasks Completed</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.completedTasks}</span>
            <span className="text-xs text-slate-500">/ {stats.totalTasks} tasks</span>
          </div>
          <div className="mt-3 flex items-center space-x-3 text-xs text-slate-500">
            <span className="text-amber-600 font-medium">{stats.inProgressTasks} In Progress</span>
            <span>•</span>
            <span className="text-slate-600 font-medium">{stats.pendingTasks} Pending</span>
          </div>
        </div>

        {/* Card 4: Historical & Completed */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Graduated Hires</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.fullyOnboarded}</span>
            <span className="text-xs text-slate-500">fully onboarded</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
            <span>Archived in history</span>
            <button 
              onClick={() => onNavigateTab('checklist-history')}
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              View Log &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Overdue Alert banner if any */}
      {stats.overdueTasks > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Action Required: {stats.overdueTasks} Overdue Task(s)</h4>
              <p className="text-xs text-amber-700">Some onboarding tasks have passed their target completion dates.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('task-management')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Review Overdue Tasks
          </button>
        </div>
      )}

      {/* Active Onboarding Pipeline Table / Cards */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Onboarding Pipeline</h2>
            <p className="text-xs text-slate-500">Real-time progress of currently onboarding employees</p>
          </div>
          <button
            onClick={() => onNavigateTab('add-employee')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>+ Add Another Employee</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {employeeProgress.map((emp) => (
            <div 
              key={emp.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} 
                    alt={emp.name}
                    className="w-12 h-12 rounded-xl object-cover bg-indigo-100 border border-slate-200 shadow-xs" 
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{emp.name}</h3>
                    <p className="text-xs text-slate-600">{emp.role}</p>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100/70 text-indigo-800 font-medium text-[11px]">
                        {emp.department}
                      </span>
                      <span>•</span>
                      <span>{emp.workMode}</span>
                    </div>
                  </div>
                </div>

                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  emp.percentage === 100 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : emp.percentage > 40 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {emp.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span className="font-semibold text-slate-700">
                    {emp.completedTasks} / {emp.totalTasks} tasks completed
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      emp.percentage === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${emp.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Metadata details */}
              <div className="mt-4 pt-3 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div className="flex items-center space-x-1.5 truncate">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Started: {emp.startDate}</span>
                </div>
                <div className="flex items-center space-x-1.5 truncate">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Buddy: {emp.mentor}</span>
                </div>
                <div className="flex items-center space-x-1.5 truncate col-span-2">
                  <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Hardware: {emp.hardware}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-4 flex items-center justify-end space-x-2">
                <button
                  onClick={() => onNavigateTab('task-management', emp.id)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Manage Tasks
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Department Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Breakdown */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Department Progress Breakdown</h3>
          <p className="text-xs text-slate-500 mb-4">Task completion status by organizational division</p>

          <div className="space-y-4">
            {Object.entries(stats.departmentStats).map(([deptName, deptInfo]) => {
              const deptRate = deptInfo.total > 0 ? Math.round((deptInfo.completed / deptInfo.total) * 100) : 0;
              return (
                <div key={deptName} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{deptName} ({deptInfo.employeeCount} hires)</span>
                    <span className="text-slate-500 font-medium">{deptInfo.completed} / {deptInfo.total} tasks ({deptRate}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${deptRate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity & Audit Log */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">Recent Activity Feed</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Live</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">System and onboarding audit events</p>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {stats.recentActivity.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium leading-snug">{log.details}</p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigateTab('checklist-history')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              View Full Audit Trail &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
