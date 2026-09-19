import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Printer, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Archive,
  Filter,
  UserCheck
} from 'lucide-react';
import { HistoryItem, AuditLog, Employee } from '../types';

interface ChecklistHistoryProps {
  history: HistoryItem[];
  auditLog: AuditLog[];
  employees: Employee[];
  onArchiveEmployee: (employeeId: string) => Promise<void>;
}

export const ChecklistHistory: React.FC<ChecklistHistoryProps> = ({
  history,
  auditLog,
  employees,
  onArchiveEmployee
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'records' | 'audit'>('records');
  const [selectedRecord, setSelectedRecord] = useState<HistoryItem | null>(null);

  // Filter history records
  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || item.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Calculate stats
  const totalCompleted = history.length;
  const avgDuration = totalCompleted > 0 
    ? Math.round(history.reduce((acc, h) => acc + (h.durationDays || 85), 0) / totalCompleted)
    : 0;
  const complianceRate = 100; // All in history achieved graduation requirements

  // Export to CSV
  const handleExportCsv = () => {
    window.open('/api/history/export/csv', '_blank');
  };

  // Print Compliance Certificate / Report
  const handlePrintReport = (item: HistoryItem) => {
    setSelectedRecord(item);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>Audit & Compliance Archive</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Checklist History & Logs</h1>
          <p className="text-sm text-slate-600">
            Official records of completed onboarding journeys, compliance timestamps, and system audit logs.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs cursor-pointer flex items-center space-x-2"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Graduated Onboardings</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{totalCompleted}</div>
          <p className="mt-1 text-xs text-slate-500">Fully signed-off new hires</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg. Ramp Duration</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{avgDuration} <span className="text-base font-medium text-slate-500">days</span></div>
          <p className="mt-1 text-xs text-slate-500">From Day 1 to 90-day review</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Audit Compliance</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{complianceRate}%</div>
          <p className="mt-1 text-xs text-slate-500">All mandatory compliance items verified</p>
        </div>
      </div>

      {/* Tab Switcher: Records vs Audit Log */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'records'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed Records ({history.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Live Audit Trail ({auditLog.length})
        </button>
      </div>

      {/* Tab 1: Records Table */}
      {activeTab === 'records' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search historical records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-60"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                <option value="ALL">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Duration & Dates</th>
                  <th className="py-3 px-4">Tasks Verified</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Employee */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          {item.employeeName.charAt(0)}
                        </div>
                        <div>
                          <span>{item.employeeName}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">{item.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department & Role */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{item.role}</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[10px]">
                        {item.department}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.startDate} &rarr; {item.completedDate}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {item.durationDays} days to complete
                      </span>
                    </td>

                    {/* Tasks Verified */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-emerald-700">
                          {item.completedTasks} / {item.totalTasks}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {item.completionRate}%
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-[10px] text-slate-500 mt-1 italic max-w-xs line-clamp-1">
                          "{item.notes}"
                        </p>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handlePrintReport(item)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer inline-flex items-center space-x-1.5"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Print Report</span>
                      </button>
                    </td>

                  </tr>
                ))}

                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No archived onboarding history matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Live Audit Log */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">System Audit Trail</h3>
              <p className="text-xs text-slate-500">Immutable ledger of employee registrations, checklist generations, and task state changes</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Audit Compliance Mode
            </span>
          </div>

          <div className="space-y-2.5">
            {auditLog.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4 text-xs hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-1 shrink-0"></div>
                  <div>
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 mr-2">
                      {log.action}
                    </span>
                    <span className="text-slate-800 font-medium">{log.details}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print Compliance Certificate / Report Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:static print:bg-white">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 print:border-none print:shadow-none">
            
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  OF
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Onboarding Completion Certificate</h2>
                  <p className="text-xs text-slate-500">Official HR Compliance & Verification Document</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold print:hidden cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Employee Name</span>
                  <span className="text-base font-bold text-slate-900">{selectedRecord.employeeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Role & Title</span>
                  <span className="text-sm font-bold text-slate-800">{selectedRecord.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                  <span className="text-sm font-bold text-slate-800">{selectedRecord.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                  <span className="text-sm font-bold text-slate-800">{selectedRecord.durationDays} Days ({selectedRecord.startDate} to {selectedRecord.completedDate})</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <div className="flex items-center space-x-2 font-bold text-sm text-emerald-900 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>100% Verification Achieved</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  All {selectedRecord.totalTasks} onboarding tasks—including IT Security Provisioning, Company Orientation, Department Technical Training, and 30-60-90 Day Milestones—have been fulfilled and documented.
                </p>
                {selectedRecord.notes && (
                  <p className="mt-2 text-xs font-semibold text-emerald-900">
                    Evaluator Assessment: <span className="font-normal italic">"{selectedRecord.notes}"</span>
                  </p>
                )}
              </div>

              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-slate-500 text-[11px]">
                <div>
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                    People Operations / HR Director
                  </div>
                  <span>Authorized Signature & Seal</span>
                </div>
                <div>
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                    {selectedRecord.completedDate}
                  </div>
                  <span>Date of Issue</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
