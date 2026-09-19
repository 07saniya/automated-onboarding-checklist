import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Laptop, 
  Users, 
  Briefcase,
  AlertCircle,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Employee, ChecklistTask, TaskCategory, TaskPhase, AssigneeRole, TaskPriority } from '../types';
import { previewChecklist, saveChecklist } from '../services/api';

interface GenerateChecklistProps {
  employees: Employee[];
  onChecklistSaved: () => void;
  onNavigateTab: (tab: string, employeeId?: string) => void;
}

const CATEGORIES: TaskCategory[] = [
  'General & HR',
  'IT & Equipment',
  'Department Training',
  'Team & Culture',
  'Milestones'
];

const PHASES: TaskPhase[] = [
  'Pre-boarding',
  'Day 1',
  'Week 1',
  'Day 30',
  'Day 60',
  'Day 90'
];

const ROLES: AssigneeRole[] = [
  'New Hire',
  'IT Admin',
  'HR Manager',
  'Direct Manager',
  'Assigned Buddy'
];

export const GenerateChecklist: React.FC<GenerateChecklistProps> = ({
  employees,
  onChecklistSaved,
  onNavigateTab
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    employees[0]?.id || ''
  );

  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('Senior Software Engineer');
  const [hardware, setHardware] = useState('MacBook Pro 16" M3 Max');

  const [generatedTasks, setGeneratedTasks] = useState<ChecklistTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New custom task modal / form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Department Training');
  const [newPhase, setNewPhase] = useState<TaskPhase>('Week 1');
  const [newAssignee, setNewAssignee] = useState<AssigneeRole>('New Hire');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');
  const [newDaysOffset, setNewDaysOffset] = useState<number>(3);
  const [newDesc, setNewDesc] = useState('');

  // Selected employee object
  const activeEmployee = employees.find(e => e.id === selectedEmployeeId);

  // Sync department & role when active employee changes
  useEffect(() => {
    if (activeEmployee) {
      setDepartment(activeEmployee.department);
      setRole(activeEmployee.role);
      setHardware(activeEmployee.hardware);
      handleGenerate(activeEmployee.id);
    }
  }, [selectedEmployeeId]);

  const handleGenerate = async (empId?: string) => {
    setLoading(true);
    setSaveSuccess(false);
    try {
      const res = await previewChecklist({
        employeeId: empId || selectedEmployeeId,
        department,
        role,
        hardware
      });
      setGeneratedTasks(res.tasks);
    } catch (err: any) {
      console.error('Failed to preview checklist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setGeneratedTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const baseDate = activeEmployee ? new Date(activeEmployee.startDate) : new Date();
    const dueDateObj = new Date(baseDate);
    dueDateObj.setDate(dueDateObj.getDate() + Number(newDaysOffset));

    const customTask: ChecklistTask = {
      id: `task-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      phase: newPhase,
      assigneeRole: newAssignee,
      priority: newPriority,
      status: 'Pending',
      dueDate: dueDateObj.toISOString().split('T')[0],
      description: newDesc.trim(),
      notes: '',
      completedAt: null
    };

    setGeneratedTasks(prev => [customTask, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleSaveAndAssign = async () => {
    if (!selectedEmployeeId) {
      alert('Please select an employee to assign this checklist.');
      return;
    }

    setSaving(true);
    try {
      await saveChecklist(selectedEmployeeId, generatedTasks);
      setSaveSuccess(true);
      
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      onChecklistSaved();
      setTimeout(() => {
        onNavigateTab('task-management', selectedEmployeeId);
      }, 1500);
    } catch (err: any) {
      alert(`Error saving checklist: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Group tasks by phase for structured display
  const tasksByPhase = PHASES.reduce((acc, phase) => {
    acc[phase] = generatedTasks.filter(t => t.phase === phase);
    return acc;
  }, {} as Record<TaskPhase, ChecklistTask[]>);

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Automated Generation Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Generate Onboarding Checklist</h1>
        <p className="text-sm text-slate-600">
          Rule-based checklist synthesis customized by department, technical tooling, hardware provisioning, and time-phased milestones.
        </p>
      </div>

      {/* Configuration & Selection Panel */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Employee Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Employee Target
            </label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department} - {emp.role})
                </option>
              ))}
            </select>
          </div>

          {/* Department Rule */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Department Template Rules
            </label>
            <input
              type="text"
              readOnly
              value={department}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-700 cursor-not-allowed"
            />
          </div>

          {/* Action to Re-Synthesize */}
          <div className="flex items-end">
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{loading ? 'Synthesizing...' : 'Regenerate Tasks'}</span>
            </button>
          </div>

        </div>

        {/* Info pills */}
        {activeEmployee && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Assigned Profile:</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium">
              {activeEmployee.role}
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-medium">
              {activeEmployee.hardware}
            </span>
            <span>•</span>
            <span className="text-slate-500">
              Mentor: <span className="font-medium text-slate-700">{activeEmployee.mentor}</span>
            </span>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-3 shadow-xs animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold">Checklist successfully saved and assigned!</h4>
            <p className="text-xs text-emerald-700">Redirecting you to Task Management...</p>
          </div>
        </div>
      )}

      {/* Generated Tasks Breakdown */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span>Generated Checklist Blueprint</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                {generatedTasks.length} Total Tasks
              </span>
            </h2>
            <p className="text-xs text-slate-500">Review, customize, and add custom tasks before assigning</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Add Custom Task</span>
            </button>

            <button
              onClick={handleSaveAndAssign}
              disabled={saving || generatedTasks.length === 0}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Assigning...' : 'Assign & Save Checklist'}</span>
            </button>
          </div>
        </div>

        {/* Phased Timeline Cards */}
        {PHASES.map((phase) => {
          const tasks = tasksByPhase[phase] || [];
          if (tasks.length === 0) return null;

          return (
            <div key={phase} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{phase}</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {tasks.length} task{tasks.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="font-bold text-slate-900 text-sm">{task.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          task.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : task.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-medium">
                          {task.category}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-slate-600 leading-relaxed text-xs">{task.description}</p>
                      )}

                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                        <span>Owner: <strong className="text-slate-600 font-medium">{task.assigneeRole}</strong></span>
                        <span>•</span>
                        <span>Target Due: <strong className="text-slate-600 font-medium">{task.dueDate}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      title="Remove task from template"
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Custom Onboarding Task</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddCustomTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete SOC2 Security Questionnaire"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Timeline Phase
                  </label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as TaskPhase)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assignee Role
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value as AssigneeRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Days from Start Date
                </label>
                <input
                  type="number"
                  value={newDaysOffset}
                  onChange={(e) => setNewDaysOffset(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Instructions / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details for this onboarding milestone..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
