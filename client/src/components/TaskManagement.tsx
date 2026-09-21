import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Plus, 
  Trash2, 
  MessageSquare, 
  User, 
  Layers, 
  List, 
  Kanban,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChecklistTask, Employee, TaskCategory, TaskPriority, TaskStatus } from '../types';

interface TaskManagementProps {
  tasks: ChecklistTask[];
  employees: Employee[];
  selectedEmployeeId?: string;
  onUpdateTask: (taskId: string, update: Partial<ChecklistTask>) => Promise<void>;
  onAddTask: (employeeId: string, taskData: any) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  employees,
  selectedEmployeeId: initialEmpId,
  onUpdateTask,
  onAddTask,
  onDeleteTask
}) => {
  const [empFilter, setEmpFilter] = useState<string>(initialEmpId || 'ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  // Notes editing state
  const [activeNoteTaskId, setActiveNoteTaskId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Add Task Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('General & HR');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAssignee, setNewAssignee] = useState('New Hire');

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesEmp = empFilter === 'ALL' || task.employeeId === empFilter;
    const matchesCat = categoryFilter === 'ALL' || task.category === categoryFilter;
    const matchesPri = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.employeeName && task.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesEmp && matchesCat && matchesPri && matchesStatus && matchesSearch;
  });

  // Calculate statistics for active filtered employee
  const totalCount = filteredTasks.length;
  const completedCount = filteredTasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = filteredTasks.filter(t => t.status === 'In Progress').length;
  const pendingCount = filteredTasks.filter(t => t.status === 'Pending').length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleStatusToggle = async (task: ChecklistTask) => {
  let nextStatus: TaskStatus;

  if (task.status === 'Pending') {
    nextStatus = 'In Progress';
  } else if (task.status === 'In Progress') {
    nextStatus = 'Completed';
  } else {
    nextStatus = 'Pending';
  }

  try {
    // Update the task through the backend
    await onUpdateTask(task.id, { status: nextStatus });

    console.log(
      `Task ${task.id} changed from ${task.status} to ${nextStatus}`
    );

    if (nextStatus === 'Completed') {
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Confetti is optional
      }
    }
  } catch (err: any) {
    console.error('Error updating task:', err);
    alert(`Error updating task: ${err.message}`);
  }
};
  const handleSaveNote = async (taskId: string) => {
    try {
      await onUpdateTask(taskId, { notes: noteText });
      setActiveNoteTaskId(null);
      setNoteText('');
    } catch (err: any) {
      alert(`Error saving note: ${err.message}`);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetEmpId = empFilter !== 'ALL' ? empFilter : employees[0]?.id;
    if (!targetEmpId) {
      alert('Please select an employee first.');
      return;
    }

    try {
      await onAddTask(targetEmpId, {
        title: newTitle.trim(),
        category: newCategory,
        priority: newPriority,
        dueDate: newDueDate,
        assigneeRole: newAssignee,
        status: 'Pending'
      });
      setShowAddModal(false);
      setNewTitle('');
    } catch (err: any) {
      alert(`Error adding task: ${err.message}`);
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'Completed') return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate && dueDate < today;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <CheckSquare className="w-4 h-4" />
            <span>Execution & Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Task Management</h1>
          <p className="text-sm text-slate-600">
            Track, complete, and collaborate on onboarding tasks across all departments and roles.
          </p>
        </div>

        {/* View Switcher & Add Task */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Employee Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Employee Filter
            </label>
            <select
              value={empFilter}
              onChange={(e) => setEmpFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            >
              <option value="ALL">All Employees ({tasks.length} tasks)</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            >
              <option value="ALL">All Categories</option>
              <option value="General & HR">General & HR</option>
              <option value="IT & Equipment">IT & Equipment</option>
              <option value="Department Training">Department Training</option>
              <option value="Team & Culture">Team & Culture</option>
              <option value="Milestones">Milestones</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Search Tasks
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search title, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

        </div>

        {/* Progress Summary Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-slate-500">
              Showing <strong className="text-slate-800">{filteredTasks.length}</strong> tasks
            </span>
            <span className="text-emerald-700 font-semibold">{completedCount} Completed</span>
            <span className="text-amber-700 font-semibold">{inProgressCount} In Progress</span>
            <span className="text-slate-600 font-semibold">{pendingCount} Pending</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Completion: {completionPercentage}%</span>
            <div className="w-24 sm:w-36 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Board (Kanban) View */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Pending */}
          <div className="rounded-2xl bg-slate-100/70 border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Circle className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">To Do (Pending)</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                {filteredTasks.filter(t => t.status === 'Pending').length}
              </span>
            </div>

            <div className="space-y-3 min-h-[400px]">
              {filteredTasks
                .filter(t => t.status === 'Pending')
                .map(task => renderTaskCard(task))}
              {filteredTasks.filter(t => t.status === 'Pending').length === 0 && (
                <div className="h-32 flex items-center justify-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  No pending tasks
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="rounded-2xl bg-amber-50/50 border border-amber-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-amber-900 text-xs uppercase tracking-wider">In Progress</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 font-bold text-xs">
                {filteredTasks.filter(t => t.status === 'In Progress').length}
              </span>
            </div>

            <div className="space-y-3 min-h-[400px]">
              {filteredTasks
                .filter(t => t.status === 'In Progress')
                .map(task => renderTaskCard(task))}
              {filteredTasks.filter(t => t.status === 'In Progress').length === 0 && (
                <div className="h-32 flex items-center justify-center text-xs text-amber-500/70 border-2 border-dashed border-amber-200 rounded-xl">
                  No active tasks in progress
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="rounded-2xl bg-emerald-50/50 border border-emerald-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-emerald-900 text-xs uppercase tracking-wider">Completed</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-bold text-xs">
                {filteredTasks.filter(t => t.status === 'Completed').length}
              </span>
            </div>

            <div className="space-y-3 min-h-[400px]">
              {filteredTasks
                .filter(t => t.status === 'Completed')
                .map(task => renderTaskCard(task))}
              {filteredTasks.filter(t => t.status === 'Completed').length === 0 && (
                <div className="h-32 flex items-center justify-center text-xs text-emerald-500/70 border-2 border-dashed border-emerald-200 rounded-xl">
                  No completed tasks yet
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* List / Table View */}
      {viewMode === 'list' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-12">Status</th>
                  <th className="py-3 px-4">Task Details</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Category & Phase</th>
                  <th className="py-3 px-4">Priority & Due</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleStatusToggle(task)}
                        title={`Click to change status (Currently ${task.status})`}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          task.status === 'Completed'
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : task.status === 'In Progress'
                            ? 'bg-amber-400 text-white'
                            : 'border-2 border-slate-300 text-transparent hover:border-indigo-500'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </td>

                    {/* Title & Notes */}
                    <td className="py-3 px-4">
                      <span className={`font-bold block ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </span>
                      {task.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                      )}
                      {task.notes && (
                        <div className="mt-1 inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px]">
                          <MessageSquare className="w-3 h-3" />
                          <span>{task.notes}</span>
                        </div>
                      )}
                    </td>

                    {/* Employee */}
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {task.employeeName || 'Assigned Employee'}
                    </td>

                    {/* Category & Phase */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[10px] block w-fit">
                        {task.category}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{task.phase}</span>
                    </td>

                    {/* Priority & Due Date */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        task.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : task.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {task.priority}
                      </span>
                      <div className="flex items-center space-x-1 mt-1 text-[11px] text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className={isOverdue(task.dueDate, task.status) ? 'text-rose-600 font-bold' : ''}>
                          {task.dueDate}
                        </span>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-4 text-slate-600 font-medium text-[11px]">
                      {task.assigneeRole}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setActiveNoteTaskId(task.id);
                          setNoteText(task.notes || '');
                        }}
                        title="Add/Edit Note"
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        title="Delete Task"
                        className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Notes Inline Modal */}
      {activeNoteTaskId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Task Notes & Updates</h3>
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Sent invite link; waiting for IT security token confirmation..."
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setActiveNoteTaskId(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveNote(activeNoteTaskId)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete HR Benefits Enrollment"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="General & HR">General & HR</option>
                    <option value="IT & Equipment">IT & Equipment</option>
                    <option value="Department Training">Department Training</option>
                    <option value="Team & Culture">Team & Culture</option>
                    <option value="Milestones">Milestones</option>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assignee Role
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="New Hire">New Hire</option>
                    <option value="IT Admin">IT Admin</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Direct Manager">Direct Manager</option>
                    <option value="Assigned Buddy">Assigned Buddy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );

  // Helper renderer for Kanban Card
  function renderTaskCard(task: ChecklistTask) {
    const overdue = isOverdue(task.dueDate, task.status);

    return (
      <div
        key={task.id}
        className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {task.employeeName || 'Assigned Employee'}
            </span>
            <h4 className={`text-xs font-bold leading-snug mt-1 ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
              {task.title}
            </h4>
          </div>

          <button
            onClick={() => handleStatusToggle(task)}
            title={`Toggle Status (Currently: ${task.status})`}
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
              task.status === 'Completed'
                ? 'bg-emerald-500 text-white'
                : task.status === 'In Progress'
                ? 'bg-amber-400 text-white'
                : 'border-2 border-slate-300 text-transparent hover:border-indigo-500'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {task.description && (
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {task.notes && (
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-start space-x-1.5">
            <MessageSquare className="w-3 h-3 text-indigo-500 mt-0.5 shrink-0" />
            <span className="italic">{task.notes}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <span className={`font-bold px-2 py-0.5 rounded-full ${
            task.priority === 'High'
              ? 'bg-rose-100 text-rose-800'
              : task.priority === 'Medium'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {task.priority}
          </span>

          <div className="flex items-center space-x-1 text-slate-400">
            <Calendar className="w-3 h-3" />
            <span className={overdue ? 'text-rose-600 font-bold' : ''}>{task.dueDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Owner: <strong className="text-slate-600 font-medium">{task.assigneeRole}</strong></span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                setActiveNoteTaskId(task.id);
                setNoteText(task.notes || '');
              }}
              title="Add Note"
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              title="Delete Task"
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    );
  }
};
