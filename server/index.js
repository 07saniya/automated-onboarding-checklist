const express = require('express');
const cors = require('cors');
const db = require('./data/db');
const { generateChecklistForEmployee } = require('./services/templateEngine');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Log incoming requests for clarity
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// 1. DASHBOARD & STATS
// ==========================================
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. EMPLOYEES CRUD
// ==========================================
app.get('/api/employees', (req, res) => {
  try {
    const employees = db.getEmployees();
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/employees', (req, res) => {
  try {
    const { name, email, department, role, startDate, manager, mentor, workMode, hardware, autoGenerateChecklist } = req.body;

    if (!name || !department || !role) {
      return res.status(400).json({ success: false, error: "Name, Department, and Role are required." });
    }

    const newEmp = db.addEmployee({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@acme.corp`,
      department,
      role,
      startDate: startDate || new Date().toISOString().split('T')[0],
      manager: manager || "Unassigned",
      mentor: mentor || "Unassigned",
      workMode: workMode || "Hybrid",
      hardware: hardware || "Standard Laptop",
      status: "In Onboarding",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    let checklist = null;
    if (autoGenerateChecklist !== false) {
      // Auto-generate checklist immediately
      const tasks = generateChecklistForEmployee(newEmp);
      checklist = db.createChecklist({
        id: `chk-${newEmp.id}`,
        employeeId: newEmp.id,
        employeeName: newEmp.name,
        department: newEmp.department,
        role: newEmp.role,
        createdAt: newEmp.startDate,
        updatedAt: new Date().toISOString(),
        tasks,
        status: "Active"
      });
    }

    res.status(201).json({ success: true, data: { employee: newEmp, checklist } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/employees/:id', (req, res) => {
  try {
    const updated = db.updateEmployee(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Employee not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  try {
    db.deleteEmployee(req.params.id);
    res.json({ success: true, message: "Employee and associated checklists deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. GENERATE CHECKLIST (RULES ENGINE)
// ==========================================
app.get('/api/checklists', (req, res) => {
  try {
    const checklists = db.getChecklists();
    res.json({ success: true, data: checklists });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/checklists/employee/:empId', (req, res) => {
  try {
    const checklist = db.getChecklistByEmployeeId(req.params.empId);
    if (!checklist) {
      return res.status(404).json({ success: false, error: "No checklist found for this employee" });
    }
    res.json({ success: true, data: checklist });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Preview rule-based checklist without saving
app.post('/api/checklists/preview', (req, res) => {
  try {
    const { employeeId, department, role, name, hardware, startDate } = req.body;
    let employee = null;

    if (employeeId) {
      employee = db.getEmployeeById(employeeId);
    }
    if (!employee) {
      employee = {
        id: employeeId || "preview-emp",
        name: name || "New Employee",
        department: department || "Engineering",
        role: role || "Software Engineer",
        hardware: hardware || "Standard Laptop",
        startDate: startDate || new Date().toISOString().split('T')[0]
      };
    }

    const tasks = generateChecklistForEmployee(employee);
    res.json({ success: true, data: { employee, tasks } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save or re-generate checklist
app.post('/api/checklists/save', (req, res) => {
  try {
    const { employeeId, tasks } = req.body;
    const employee = db.getEmployeeById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const taskList = tasks && tasks.length > 0 ? tasks : generateChecklistForEmployee(employee);

    const checklist = db.createChecklist({
      id: `chk-${employee.id}`,
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      role: employee.role,
      createdAt: employee.startDate,
      updatedAt: new Date().toISOString(),
      tasks: taskList,
      status: "Active"
    });

    res.json({ success: true, data: checklist });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. TASK MANAGEMENT
// ==========================================
app.get('/api/tasks', (req, res) => {
  try {
    const { employeeId, status, priority, category } = req.query;
    let tasks = db.getAllTasks();

    if (employeeId) tasks = tasks.filter(t => t.employeeId === employeeId);
    if (status) tasks = tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
    if (priority) tasks = tasks.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    if (category) tasks = tasks.filter(t => t.category.toLowerCase() === category.toLowerCase());

    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/tasks/:id', (req, res) => {
  try {
    const updated = db.updateTask(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/tasks/employee/:empId', (req, res) => {
  try {
    const newTask = db.addTask(req.params.empId, req.body);
    if (!newTask) {
      return res.status(404).json({ success: false, error: "Employee checklist not found" });
    }
    res.status(201).json({ success: true, data: newTask });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const deleted = db.deleteTask(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Task not found" });
    res.json({ success: true, message: "Task removed" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 5. CHECKLIST HISTORY & AUDIT LOG
// ==========================================
app.get('/api/history', (req, res) => {
  try {
    const history = db.getHistory();
    const auditLog = db.getAuditLog();
    res.json({ success: true, data: { history, auditLog } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/history/archive/:empId', (req, res) => {
  try {
    const { empId } = req.params;
    const cl = db.getChecklistByEmployeeId(empId);
    if (!cl) return res.status(404).json({ success: false, error: "Checklist not found" });

    const total = cl.tasks.length;
    const completed = cl.tasks.filter(t => t.status === "Completed").length;

    const historyItem = db.addHistoryItem({
      employeeId: cl.employeeId,
      employeeName: cl.employeeName,
      role: cl.role,
      department: cl.department,
      startDate: cl.createdAt,
      completedDate: new Date().toISOString().split('T')[0],
      totalTasks: total,
      completedTasks: completed,
      completionRate: Math.round((completed / total) * 100),
      durationDays: Math.max(1, Math.round((new Date() - new Date(cl.createdAt)) / 86400000)),
      status: completed === total ? "Fully Completed" : "Archived / Partial",
      notes: req.body.notes || "Archived from active checklists."
    });

    // Mark checklist as Archived
    cl.status = "Archived";

    res.json({ success: true, data: historyItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/history/export/csv', (req, res) => {
  try {
    const history = db.getHistory();
    const headers = "ID,Employee Name,Role,Department,Start Date,Completed Date,Total Tasks,Completed Tasks,Rate %,Duration (Days),Status\n";
    const rows = history.map(h => 
      `"${h.id}","${h.employeeName}","${h.role}","${h.department}","${h.startDate}","${h.completedDate}",${h.totalTasks},${h.completedTasks},${h.completionRate}%,${h.durationDays},"${h.status}"`
    ).join("\n");

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="onboarding-history.csv"');
    res.send(headers + rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Demo reset endpoint
app.post('/api/reset', (req, res) => {
  try {
    const seed = db.resetData();
    res.json({ success: true, message: "Database reset to initial demo data", data: seed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Automated Onboarding Checklist API Server running`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`=================================================`);
});
