import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AddEmployee } from './components/AddEmployee';
import { GenerateChecklist } from './components/GenerateChecklist';
import { TaskManagement } from './components/TaskManagement';
import { ChecklistHistory } from './components/ChecklistHistory';
import { 
  fetchStats, 
  fetchEmployees, 
  fetchChecklists, 
  fetchTasks, 
  fetchHistory, 
  createEmployee, 
  deleteEmployee, 
  updateTask, 
  addTask, 
  deleteTask, 
  resetDatabase,
  archiveChecklist
} from './services/api';
import { 
  DashboardStats, 
  Employee, 
  Checklist, 
  ChecklistTask, 
  HistoryItem, 
  AuditLog 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLog[]>([]);
  const [selectedEmpForTasks, setSelectedEmpForTasks] = useState<string>('ALL');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data from backend
  const loadAllData = async () => {
    try {
      const [statsData, empData, clData, tasksData, histData] = await Promise.all([
        fetchStats(),
        fetchEmployees(),
        fetchChecklists(),
        fetchTasks(),
        fetchHistory()
      ]);

      setStats(statsData);
      setEmployees(empData);
      setChecklists(clData);
      setTasks(tasksData);
      setHistory(histData.history);
      setAuditLog(histData.auditLog);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data from API:', err);
      setError(err.message || 'Could not connect to the onboarding server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleTabChange = (tab: string, employeeId?: string) => {
    setActiveTab(tab);
    if (employeeId) {
      setSelectedEmpForTasks(employeeId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddEmployee = async (empData: any) => {
    await createEmployee(empData);
    await loadAllData();
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this employee and their checklists?')) {
      return;
    }
    await deleteEmployee(id);
    await loadAllData();
  };

  const handleUpdateTask = async (taskId: string, update: Partial<ChecklistTask>) => {
    await updateTask(taskId, update);
    await loadAllData();
  };

  const handleAddTask = async (empId: string, taskData: any) => {
    await addTask(empId, taskData);
    await loadAllData();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(taskId);
    await loadAllData();
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset all onboarding records back to initial realistic demo data?')) {
      return;
    }
    setLoading(true);
    await resetDatabase();
    await loadAllData();
  };

  const handleArchiveEmployee = async (empId: string) => {
    await archiveChecklist(empId);
    await loadAllData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        stats={stats}
        onResetData={handleResetData}
        onTabChange={handleTabChange}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          stats={stats}
        />

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold">Backend Connection Notice:</span>
                <span>{error}</span>
              </div>
              <button
                onClick={loadAllData}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-slate-600">Connecting to OnboardFlow Engine...</p>
            </div>
          ) : (
            <>
              {/* 🏠 1. Dashboard */}
              {activeTab === 'dashboard' && (
                <Dashboard
                  stats={stats}
                  employees={employees}
                  checklists={checklists}
                  onNavigateTab={handleTabChange}
                />
              )}

              {/* 👤 2. Add Employee */}
              {activeTab === 'add-employee' && (
                <AddEmployee
                  employees={employees}
                  onAddEmployee={handleAddEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                  onNavigateTab={handleTabChange}
                />
              )}

              {/* 📋 3. Generate Checklist */}
              {activeTab === 'generate-checklist' && (
                <GenerateChecklist
                  employees={employees}
                  onChecklistSaved={loadAllData}
                  onNavigateTab={handleTabChange}
                />
              )}

              {/* ✅ 4. Task Management */}
              {activeTab === 'task-management' && (
                <TaskManagement
                  tasks={tasks}
                  employees={employees}
                  selectedEmployeeId={selectedEmpForTasks}
                  onUpdateTask={handleUpdateTask}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                />
              )}

              {/* 🕒 5. Checklist History */}
              {activeTab === 'checklist-history' && (
                <ChecklistHistory
                  history={history}
                  auditLog={auditLog}
                  employees={employees}
                  onArchiveEmployee={handleArchiveEmployee}
                />
              )}
            </>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">OnboardFlow</span>
            <span>•</span>
            <span>Automated Onboarding Checklist System</span>
          </div>
          <div>
            <span>Status: <strong className="text-emerald-600 font-semibold">Active & Synced</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
}
