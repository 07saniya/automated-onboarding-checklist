const fs = require('fs');
const path = require('path');
const { generateChecklistForEmployee } = require('../services/templateEngine');

const DB_FILE = path.join(__dirname, 'db.json');

// Default Seed Data
function getSeedData() {
  const seedEmployees = [
    {
      id: "emp-101",
      name: "Elena Rostova",
      email: "elena.rostova@acme.corp",
      department: "Engineering",
      role: "Senior Full-Stack Engineer",
      startDate: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], // 6 days ago
      manager: "Alex Mercer (VP Eng)",
      mentor: "Devin Zhao (Staff Eng)",
      workMode: "Hybrid",
      hardware: "MacBook Pro 16\" M3 Max",
      status: "In Onboarding",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "emp-102",
      name: "Marcus Vance",
      email: "marcus.vance@acme.corp",
      department: "Design",
      role: "Lead Product Designer",
      startDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], // 3 days ago
      manager: "Sophia Lin (Design Director)",
      mentor: "Chloe Bennett (Senior UX)",
      workMode: "Remote",
      hardware: "MacBook Pro 14\" M3 Pro",
      status: "In Onboarding",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "emp-103",
      name: "Priya Sharma",
      email: "priya.sharma@acme.corp",
      department: "Sales",
      role: "Account Executive (Enterprise)",
      startDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // yesterday
      manager: "Jordan Ross (Head of Sales)",
      mentor: "Carlos Gomez (Senior AE)",
      workMode: "On-site",
      hardware: "Dell XPS 15",
      status: "In Onboarding",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "emp-104",
      name: "David Kim",
      email: "david.kim@acme.corp",
      department: "Human Resources",
      role: "Talent Acquisition Specialist",
      startDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // starting in 3 days
      manager: "Hannah Abbott (People Ops Lead)",
      mentor: "Rachel Green (HR BP)",
      workMode: "Hybrid",
      hardware: "ThinkPad X1 Carbon",
      status: "Pre-boarding",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  ];

  // Generate checklists for seed employees
  const checklists = [];
  const history = [
    {
      id: "hist-001",
      employeeId: "emp-archive-01",
      employeeName: "Sarah Jenkins",
      role: "Staff DevOps Engineer",
      department: "Engineering",
      startDate: "2026-06-01",
      completedDate: "2026-08-28",
      totalTasks: 16,
      completedTasks: 16,
      completionRate: 100,
      durationDays: 88,
      status: "Fully Completed",
      notes: "Exceptional ramp-up. Completed early on-call shadow rotation ahead of schedule."
    },
    {
      id: "hist-002",
      employeeId: "emp-archive-02",
      employeeName: "Liam O'Connor",
      role: "Marketing Growth Manager",
      department: "Marketing",
      startDate: "2026-05-15",
      completedDate: "2026-08-10",
      totalTasks: 15,
      completedTasks: 15,
      completionRate: 100,
      durationDays: 87,
      status: "Fully Completed",
      notes: "Successfully launched Q3 product acquisition campaign during month 2."
    }
  ];

  seedEmployees.forEach((emp, index) => {
    const generatedTasks = generateChecklistForEmployee(emp);
    
    // Partially complete some tasks for realism
    if (index === 0) {
      // Elena: 60% complete (Day 1 & Pre-boarding done)
      generatedTasks.forEach((t) => {
        if (t.phase === "Pre-boarding" || t.phase === "Day 1") {
          t.status = "Completed";
          t.completedAt = new Date(Date.now() - 4 * 86400000).toISOString();
        } else if (t.phase === "Week 1") {
          t.status = "In Progress";
        }
      });
    } else if (index === 1) {
      // Marcus: 35% complete
      generatedTasks.forEach((t) => {
        if (t.phase === "Pre-boarding") {
          t.status = "Completed";
          t.completedAt = new Date(Date.now() - 2 * 86400000).toISOString();
        } else if (t.phase === "Day 1" && t.assigneeRole === "New Hire") {
          t.status = "Completed";
          t.completedAt = new Date(Date.now() - 1 * 86400000).toISOString();
        }
      });
    } else if (index === 2) {
      // Priya: 15% complete
      generatedTasks.forEach((t) => {
        if (t.phase === "Pre-boarding" && t.category === "IT & Equipment") {
          t.status = "Completed";
          t.completedAt = new Date(Date.now() - 1 * 86400000).toISOString();
        }
      });
    }

    checklists.push({
      id: `chk-${emp.id}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      role: emp.role,
      createdAt: emp.startDate,
      updatedAt: new Date().toISOString(),
      tasks: generatedTasks,
      status: "Active"
    });
  });

  const auditLog = [
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 5000000).toISOString(),
      action: "TASK_COMPLETED",
      details: "Elena Rostova completed 'Set up Password Manager (1Password) and 2-Factor Authentication'"
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 15000000).toISOString(),
      action: "CHECKLIST_GENERATED",
      details: "Automated checklist generated for Priya Sharma (Sales)"
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 28000000).toISOString(),
      action: "EMPLOYEE_ADDED",
      details: "David Kim registered in Human Resources department"
    }
  ];

  return {
    employees: seedEmployees,
    checklists,
    history,
    auditLog
  };
}

// Read database
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const seed = getSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db.json, returning fallback seed:", err);
    return getSeedData();
  }
}

// Write database
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Error writing db.json:", err);
    return false;
  }
}

// Operations
const db = {
  // Employees
  getEmployees: () => {
    return readDb().employees;
  },
  getEmployeeById: (id) => {
    return readDb().employees.find(e => e.id === id);
  },
  addEmployee: (employee) => {
    const data = readDb();
    const newEmp = {
      ...employee,
      id: employee.id || `emp-${Date.now()}`,
      status: employee.status || "Pre-boarding"
    };
    data.employees.unshift(newEmp);

    data.auditLog.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "EMPLOYEE_ADDED",
      details: `${newEmp.name} added as ${newEmp.role} in ${newEmp.department}`
    });

    writeDb(data);
    return newEmp;
  },
  updateEmployee: (id, update) => {
    const data = readDb();
    const idx = data.employees.findIndex(e => e.id === id);
    if (idx !== -1) {
      data.employees[idx] = { ...data.employees[idx], ...update };
      writeDb(data);
      return data.employees[idx];
    }
    return null;
  },
  deleteEmployee: (id) => {
    const data = readDb();
    const emp = data.employees.find(e => e.id === id);
    data.employees = data.employees.filter(e => e.id !== id);
    data.checklists = data.checklists.filter(c => c.employeeId !== id);
    if (emp) {
      data.auditLog.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: "EMPLOYEE_DELETED",
        details: `${emp.name} was removed`
      });
    }
    writeDb(data);
    return true;
  },

  // Checklists
  getChecklists: () => {
    return readDb().checklists;
  },
  getChecklistByEmployeeId: (empId) => {
    return readDb().checklists.find(c => c.employeeId === empId);
  },
  createChecklist: (checklist) => {
    const data = readDb();
    // remove existing if any
    data.checklists = data.checklists.filter(c => c.employeeId !== checklist.employeeId);
    data.checklists.unshift(checklist);

    data.auditLog.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "CHECKLIST_GENERATED",
      details: `Generated checklist for ${checklist.employeeName} (${checklist.tasks.length} tasks)`
    });

    writeDb(data);
    return checklist;
  },

  // Tasks
  getAllTasks: () => {
    const data = readDb();
    const allTasks = [];
    data.checklists.forEach(cl => {
      cl.tasks.forEach(t => {
        allTasks.push({
          ...t,
          checklistId: cl.id,
          employeeId: cl.employeeId,
          employeeName: cl.employeeName,
          department: cl.department,
          role: cl.role
        });
      });
    });
    return allTasks;
  },
  updateTask: (taskId, update) => {
    const data = readDb();
    let updatedTask = null;
    let targetEmployee = "";
    let targetChecklist = null;

    for (const cl of data.checklists) {
      const taskIndex = cl.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        cl.tasks[taskIndex] = {
          ...cl.tasks[taskIndex],
          ...update,
          completedAt: update.status === "Completed" ? (cl.tasks[taskIndex].completedAt || new Date().toISOString()) : (update.status ? null : cl.tasks[taskIndex].completedAt)
        };
        updatedTask = cl.tasks[taskIndex];
        targetEmployee = cl.employeeName;
        targetChecklist = cl;
        cl.updatedAt = new Date().toISOString();
        break;
      }
    }

    if (updatedTask) {
      // Check if all tasks in targetChecklist are completed
      if (targetChecklist) {
        const total = targetChecklist.tasks.length;
        const completed = targetChecklist.tasks.filter(t => t.status === "Completed").length;
        if (total > 0 && total === completed && targetChecklist.status !== "Completed") {
          targetChecklist.status = "Completed";
          
          // Also archive to history!
          const historyEntry = {
            id: `hist-${Date.now()}`,
            employeeId: targetChecklist.employeeId,
            employeeName: targetChecklist.employeeName,
            role: targetChecklist.role,
            department: targetChecklist.department,
            startDate: targetChecklist.createdAt,
            completedDate: new Date().toISOString().split('T')[0],
            totalTasks: total,
            completedTasks: completed,
            completionRate: 100,
            durationDays: Math.max(1, Math.round((new Date() - new Date(targetChecklist.createdAt)) / 86400000)),
            status: "Fully Completed",
            notes: "All onboarding checklist tasks successfully completed and verified."
          };
          data.history.unshift(historyEntry);

          // Update employee status
          const emp = data.employees.find(e => e.id === targetChecklist.employeeId);
          if (emp) emp.status = "Onboarded";
        }
      }

      data.auditLog.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: "TASK_UPDATED",
        details: `Task '${updatedTask.title}' for ${targetEmployee} set to ${updatedTask.status}`
      });

      writeDb(data);
    }

    return updatedTask;
  },
  addTask: (employeeId, taskData) => {
    const data = readDb();
    const cl = data.checklists.find(c => c.employeeId === employeeId);
    if (!cl) return null;

    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title || "Custom Task",
      category: taskData.category || "General & HR",
      phase: taskData.phase || "Day 1",
      assigneeRole: taskData.assigneeRole || "New Hire",
      priority: taskData.priority || "Medium",
      status: "Pending",
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      description: taskData.description || "",
      notes: "",
      completedAt: null
    };

    cl.tasks.push(newTask);
    cl.updatedAt = new Date().toISOString();
    writeDb(data);
    return newTask;
  },
  deleteTask: (taskId) => {
    const data = readDb();
    let found = false;
    for (const cl of data.checklists) {
      const idx = cl.tasks.findIndex(t => t.id === taskId);
      if (idx !== -1) {
        cl.tasks.splice(idx, 1);
        cl.updatedAt = new Date().toISOString();
        found = true;
        break;
      }
    }
    if (found) writeDb(data);
    return found;
  },

  // History & Audit
  getHistory: () => {
    return readDb().history;
  },
  addHistoryItem: (item) => {
    const data = readDb();
    const newItem = {
      ...item,
      id: item.id || `hist-${Date.now()}`,
      completedDate: item.completedDate || new Date().toISOString().split('T')[0]
    };
    data.history.unshift(newItem);
    writeDb(data);
    return newItem;
  },
  getAuditLog: () => {
    return readDb().auditLog;
  },

  // Stats
  getStats: () => {
    const data = readDb();
    const employees = data.employees;
    const activeChecklists = data.checklists.filter(c => c.status === "Active");
    
    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    let inProgressTasks = 0;
    let overdueTasks = 0;
    const today = new Date().toISOString().split('T')[0];

    const departmentStats = {};

    activeChecklists.forEach(cl => {
      cl.tasks.forEach(t => {
        totalTasks++;
        if (t.status === "Completed") completedTasks++;
        else if (t.status === "In Progress") inProgressTasks++;
        else pendingTasks++;

        if (t.status !== "Completed" && t.dueDate && t.dueDate < today) {
          overdueTasks++;
        }

        // Dept stats
        const dept = cl.department || "General";
        if (!departmentStats[dept]) {
          departmentStats[dept] = { total: 0, completed: 0, employeeCount: 0 };
        }
        departmentStats[dept].total++;
        if (t.status === "Completed") departmentStats[dept].completed++;
      });
    });

    employees.forEach(emp => {
      const dept = emp.department || "General";
      if (!departmentStats[dept]) {
        departmentStats[dept] = { total: 0, completed: 0, employeeCount: 0 };
      }
      departmentStats[dept].employeeCount++;
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalEmployees: employees.length,
      activeOnboarding: employees.filter(e => e.status !== "Onboarded").length,
      fullyOnboarded: employees.filter(e => e.status === "Onboarded").length + data.history.length,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      overallCompletionRate: completionRate,
      departmentStats,
      recentActivity: data.auditLog.slice(0, 10)
    };
  },

  // Reset to initial seed
  resetData: () => {
    const seed = getSeedData();
    writeDb(seed);
    return seed;
  }
};

module.exports = db;
