export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  startDate: string;
  manager: string;
  mentor: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  hardware: string;
  status: 'Pre-boarding' | 'In Onboarding' | 'Onboarded' | 'Inactive';
  avatar?: string;
}

export type TaskCategory = 
  | 'General & HR'
  | 'IT & Equipment'
  | 'Department Training'
  | 'Team & Culture'
  | 'Milestones';

export type TaskPhase = 
  | 'Pre-boarding'
  | 'Day 1'
  | 'Week 1'
  | 'Day 30'
  | 'Day 60'
  | 'Day 90';

export type AssigneeRole = 
  | 'New Hire'
  | 'IT Admin'
  | 'HR Manager'
  | 'Direct Manager'
  | 'Assigned Buddy';

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface ChecklistTask {
  id: string;
  title: string;
  category: TaskCategory;
  phase: TaskPhase;
  assigneeRole: AssigneeRole;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  description?: string;
  notes?: string;
  completedAt?: string | null;
  checklistId?: string;
  employeeId?: string;
  employeeName?: string;
  department?: string;
  role?: string;
}

export interface Checklist {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  tasks: ChecklistTask[];
  status: 'Active' | 'Completed' | 'Archived';
}

export interface HistoryItem {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  startDate: string;
  completedDate: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  durationDays: number;
  status: string;
  notes: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeOnboarding: number;
  fullyOnboarded: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  overallCompletionRate: number;
  departmentStats: Record<string, { total: number; completed: number; employeeCount: number }>;
  recentActivity: AuditLog[];
}
