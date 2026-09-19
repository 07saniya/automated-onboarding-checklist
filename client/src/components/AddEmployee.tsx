import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Trash2, 
  Laptop, 
  CheckCircle, 
  Calendar, 
  Briefcase, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { Employee } from '../types';

interface AddEmployeeProps {
  employees: Employee[];
  onAddEmployee: (employeeData: any) => Promise<void>;
  onDeleteEmployee: (id: string) => Promise<void>;
  onNavigateTab: (tab: string, employeeId?: string) => void;
}

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Sales',
  'Marketing',
  'Human Resources',
  'Finance & Operations'
];

const ROLE_SUGGESTIONS: Record<string, string[]> = {
  'Engineering': ['Senior Frontend Engineer', 'Backend Software Engineer', 'DevOps & Cloud Engineer', 'QA Automation Engineer'],
  'Design': ['Lead Product Designer', 'UI/UX Designer', 'Brand Designer', 'UX Researcher'],
  'Sales': ['Enterprise Account Executive', 'Sales Development Rep (SDR)', 'Customer Success Manager', 'Solutions Architect'],
  'Marketing': ['Growth Marketing Manager', 'Content Marketing Specialist', 'SEO & Performance Lead', 'Social Media Strategist'],
  'Human Resources': ['People Operations Partner', 'Technical Recruiter', 'Talent Acquisition Specialist', 'HR Generalist'],
  'Finance & Operations': ['Financial Analyst', 'Operations Coordinator', 'Procurement Specialist', 'Accountant']
};

const HARDWARE_OPTIONS = [
  'MacBook Pro 16" M3 Max (36GB RAM)',
  'MacBook Pro 14" M3 Pro (18GB RAM)',
  'ThinkPad X1 Carbon Gen 11 (32GB RAM)',
  'Dell XPS 15 OLED (32GB RAM)',
  'Custom Developer Workstation'
];

export const AddEmployee: React.FC<AddEmployeeProps> = ({
  employees,
  onAddEmployee,
  onDeleteEmployee,
  onNavigateTab
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('Backend Software Engineer');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [manager, setManager] = useState('');
  const [mentor, setMentor] = useState('');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [hardware, setHardware] = useState(HARDWARE_OPTIONS[0]);
  const [autoGenerateChecklist, setAutoGenerateChecklist] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-fill email proposal when typing name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!email || email.endsWith('@acme.corp')) {
      const slug = val.toLowerCase().trim().replace(/[^a-z0-9]/g, '.');
      setEmail(slug ? `${slug}@acme.corp` : '');
    }
  };

  const handleDepartmentChange = (dept: string) => {
    setDepartment(dept);
    const suggestions = ROLE_SUGGESTIONS[dept];
    if (suggestions && suggestions.length > 0) {
      setRole(suggestions[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddEmployee({
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@acme.corp`,
        department,
        role: role.trim(),
        startDate,
        manager: manager.trim() || 'Alex Mercer',
        mentor: mentor.trim() || 'Assigned Team Buddy',
        workMode,
        hardware,
        autoGenerateChecklist
      });

      setSuccessMessage(`Successfully registered ${name}! ${autoGenerateChecklist ? 'Checklist automatically created.' : ''}`);
      setName('');
      setEmail('');
      setManager('');
      setMentor('');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Error creating employee: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter employee directory
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDeptFilter === 'All' || emp.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <UserPlus className="w-4 h-4" />
          <span>New Hire Provisioning</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Register New Employee</h1>
        <p className="text-sm text-slate-600">
          Enter new hire profile details. The system automatically provisions customized onboarding checklists tailored to their role.
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-3 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Add Employee Form */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maya.lin@acme.corp"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Role / Job Title */}
            <div>
              <label htmlFor="role" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Job Title / Role <span className="text-rose-500">*</span>
              </label>
              <input
                id="role"
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
              />
              
              {/* Quick suggestions for active department */}
              {ROLE_SUGGESTIONS[department] && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ROLE_SUGGESTIONS[department].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setRole(suggestion)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] text-slate-600 transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="startDate"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
              />
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Remote', 'Hybrid', 'On-site'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setWorkMode(mode)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      workMode === mode
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Manager */}
            <div>
              <label htmlFor="manager" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Reporting Manager
              </label>
              <input
                id="manager"
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="e.g. Alex Mercer (VP Eng)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
              />
            </div>

            {/* Mentor / Buddy */}
            <div>
              <label htmlFor="mentor" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Assigned Peer Buddy
              </label>
              <input
                id="mentor"
                type="text"
                value={mentor}
                onChange={(e) => setMentor(e.target.value)}
                placeholder="e.g. Devin Zhao (Staff Eng)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
              />
            </div>

            {/* Hardware / Laptop Choice */}
            <div className="sm:col-span-2">
              <label htmlFor="hardware" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Hardware & Provisioning Selection
              </label>
              <select
                id="hardware"
                value={hardware}
                onChange={(e) => setHardware(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
              >
                {HARDWARE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Automated Checklist Toggle Banner */}
          <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-start space-x-3">
            <input
              id="autoGen"
              type="checkbox"
              checked={autoGenerateChecklist}
              onChange={(e) => setAutoGenerateChecklist(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="autoGen" className="text-xs text-indigo-950 cursor-pointer">
              <span className="font-bold block">Automatically generate customized onboarding checklist</span>
              <span className="text-indigo-700/90 text-[11px] block mt-0.5">
                Will auto-provision pre-boarding tasks, IT hardware setup, {department}-specific training modules, and 30-60-90 day milestones.
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Employee'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Existing Employee Directory */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Current Employee Directory</h2>
            <p className="text-xs text-slate-500">Overview of all active and onboarding team members ({filteredEmployees.length})</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44 sm:w-56"
              />
            </div>

            <div className="flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Directory List / Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Department & Role</th>
                <th className="py-3 px-3">Start Date</th>
                <th className="py-3 px-3">Reporting & Buddy</th>
                <th className="py-3 px-3">Hardware</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Name & Avatar */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`}
                        alt={emp.name}
                        className="w-9 h-9 rounded-xl object-cover bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{emp.name}</span>
                        <span className="text-slate-400 text-[11px] block">{emp.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Dept & Role */}
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block">{emp.role}</span>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[10px]">
                      {emp.department}
                    </span>
                  </td>

                  {/* Start Date */}
                  <td className="py-3 px-3 text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{emp.startDate}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{emp.workMode}</span>
                  </td>

                  {/* Manager & Buddy */}
                  <td className="py-3 px-3 text-slate-600">
                    <div className="text-[11px]">
                      <span className="text-slate-400">Mgr:</span> <span className="font-medium text-slate-700">{emp.manager}</span>
                    </div>
                    <div className="text-[11px] mt-0.5">
                      <span className="text-slate-400">Buddy:</span> <span className="font-medium text-slate-700">{emp.mentor}</span>
                    </div>
                  </td>

                  {/* Hardware */}
                  <td className="py-3 px-3 text-slate-600">
                    <div className="flex items-center space-x-1.5 max-w-[180px] truncate" title={emp.hardware}>
                      <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.hardware}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => onNavigateTab('task-management', emp.id)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors cursor-pointer inline-flex items-center space-x-1"
                    >
                      <span>Tasks</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteEmployee(emp.id)}
                      title="Remove employee"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer inline-flex"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No employees matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
