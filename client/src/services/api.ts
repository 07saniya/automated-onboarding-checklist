import { Employee, Checklist, ChecklistTask, HistoryItem, DashboardStats, AuditLog } from '../types';

const API_BASE = 'https://onboarding-api-07saniya.vercel.app/api';

export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/stats`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to load stats');
  return data.data;
}

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE}/employees`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to load employees');
  return data.data;
}

export async function createEmployee(payload: Partial<Employee> & { autoGenerateChecklist?: boolean }): Promise<{ employee: Employee; checklist?: Checklist }> {
  const res = await fetch(`${API_BASE}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to create employee');
  return data.data;
}

export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/employees/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to delete employee');
}

export async function fetchChecklists(): Promise<Checklist[]> {
  const res = await fetch(`${API_BASE}/checklists`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to load checklists');
  return data.data;
}

export async function fetchEmployeeChecklist(empId: string): Promise<Checklist> {
  const res = await fetch(`${API_BASE}/checklists/employee/${empId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to load checklist');
  return data.data;
}

export async function previewChecklist(params: {
  employeeId?: string;
  department: string;
  role: string;
  name?: string;
  hardware?: string;
  startDate?: string;
}): Promise<{ employee: Partial<Employee>; tasks: ChecklistTask[] }> {
  const res = await fetch(`${API_BASE}/checklists/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to preview checklist');
  return data.data;
}

export async function saveChecklist(employeeId: string, tasks: ChecklistTask[]): Promise<Checklist> {
  const res = await fetch(`${API_BASE}/checklists/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, tasks })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to save checklist');
  return data.data;
}

export async function fetchTasks(filters?: {
  employeeId?: string;
  status?: string;
  priority?: string;
  category?: string;
}): Promise<ChecklistTask[]> {
  const params = new URLSearchParams();
  if (filters?.employeeId) params.append('employeeId', filters.employeeId);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);
  if (filters?.category) params.append('category', filters.category);

  const res = await fetch(`${API_BASE}/tasks?${params.toString()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to load tasks');
  return data.data;
}

export async function updateTask(
  taskId: string,
  update: Partial<ChecklistTask>
): Promise<ChecklistTask> {
  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update task');
    }

    return data.data;
  } catch (error: any) {
    console.error('Update task error:', error);
    throw new Error(error.message || 'Failed to update task');
  }
}

export async function addTask(employeeId: string, taskData: Partial<ChecklistTask>): Promise<ChecklistTask> {
  const res = await fetch(`${API_BASE}/tasks/employee/${employeeId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to add task');
  return data.data;
}

export async function deleteTask(taskId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to delete task');
}

export async function fetchHistory(): Promise<{ history: HistoryItem[]; auditLog: AuditLog[] }> {
  const res = await fetch(`${API_BASE}/history`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to load history');
  return data.data;
}

export async function archiveChecklist(employeeId: string, notes?: string): Promise<HistoryItem> {
  const res = await fetch(`${API_BASE}/history/archive/${employeeId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to archive checklist');
  return data.data;
}

export async function resetDatabase(): Promise<void> {
  const res = await fetch(`${API_BASE}/reset`, {
    method: 'POST'
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to reset database');
}
