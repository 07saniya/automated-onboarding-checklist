# OnboardFlow - Automated Onboarding Checklist Application

A modern, responsive full-stack web application designed for People Operations, HR, and Engineering Managers to automate and track the employee onboarding journey from Day 1 to Day 90.

---

## 🧭 Navigation Structure

```text
🏠 Dashboard
│
├── 👤 Add Employee
│
├── 📋 Generate Checklist
│
├── ✅ Task Management
│
└── 🕒 Checklist History
```

---

## 🌟 Key Features

### 1. 🏠 Dashboard
- **Executive Metrics**: Total employees, active onboarding count, tasks pending vs. completed, and overall completion rate (%).
- **Active Pipeline**: Visual progress cards for each new hire showing completion percentages, designated mentors/buddies, hardware choices, and current stage.
- **Department Breakdown**: Progress bars comparing onboarding ramp-up across Engineering, Design, Sales, and HR.
- **Activity Feed**: Real-time event log tracking task completions, employee additions, and checklist creations.

### 2. 👤 Add Employee
- **Streamlined Registration**: Form with full validation for Name, Email, Department, Role, Start Date, Manager, Peer Buddy, Work Mode (Remote/Hybrid/On-site), and Hardware (e.g. MacBook Pro M3, ThinkPad, Dell XPS).
- **Auto-Generate Option**: One-click checkbox to automatically synthesize and assign a role-specific onboarding checklist upon submission.
- **Searchable Directory**: Quick table with search by name/role, department filter, and direct actions to jump to tasks or remove records.

### 3. 📋 Generate Checklist
- **Rule-Based Engine**: Generates specialized onboarding tasks dynamically based on the employee's department and hardware:
  - **Engineering**: GitHub organization invitations, SSH keys, AWS IAM roles, repository cloning, Docker setup, and first PR.
  - **Sales**: CRM provisioning (Salesforce/HubSpot), product demo shadowing, pitch practice, and battlecards.
  - **Design**: Figma Enterprise team licenses, Design System component review, and design critique sessions.
  - **HR / People Ops**: HRIS & payroll admin setup, company policies, and benefits enrollment.
  - **Universal**: NDA signing, 1Password & 2FA setup, welcome orientation, buddy coffee chat, and 30-60-90 day milestones.
- **Customization**: Ability to add custom tasks with due dates, assignees, and priorities before saving.

### 4. ✅ Task Management
- **Dual Visual Modes**:
  - **Kanban Board**: Drag/click cards between *To Do (Pending)*, *In Progress*, and *Completed*.
  - **Categorized Table View**: Compact, sortable view for bulk review.
- **Filters**: Filter by Employee, Category, Priority (High/Medium/Low), or Search query.
- **Interactive Check-off**: One-click toggle that records completion timestamps and triggers celebratory confetti when tasks or checklists are completed.
- **Notes Thread**: Add custom progress notes or blockers to any task.

### 5. 🕒 Checklist History & Compliance
- **Audit Archive**: Complete record of graduated employees with total days taken and completion rates.
- **CSV Export**: Single-click export of compliance records (`/api/history/export/csv`) for HR audits.
- **Printable Certificate**: Formatted compliance report with sign-off fields ready for browser printing or PDF saving.
- **System Audit Trail**: Immutable timestamped ledger of all actions performed in the application.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher (tested with Node v22)
- **npm**: v9 or higher

### Quick Start (Single Command)

From the project root:

```bash
# Start both backend and frontend together
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000`

---

## 📂 Project Architecture

```text
d:/Automated onboarding checklist/
├── package.json              # Root package running both services via concurrently
├── README.md                 # Project documentation and guide
│
├── server/                   # Beginner-friendly Node.js / Express backend
│   ├── index.js              # REST API routes & server setup
│   ├── package.json          # Backend dependencies (express, cors)
│   ├── services/
│   │   └── templateEngine.js # Rule-based automated task generator
│   └── data/
│       ├── db.js             # File-based JSON database manager
│       └── db.json           # Persistent database file (auto-seeded)
│
└── client/                   # Modern React + Vite + TypeScript frontend
    ├── vite.config.ts        # Vite config with Tailwind & /api proxy
    ├── index.html            # Entry HTML
    ├── package.json          # Client dependencies (React, Lucide, Confetti)
    └── src/
        ├── App.tsx           # Main application shell with tab state
        ├── index.css         # Tailwind styles & theme variables
        ├── types/            # TypeScript interfaces (Employee, Task, etc.)
        ├── services/api.ts   # Backend API client
        └── components/
            ├── Navbar.tsx            # Header with status pills & quick actions
            ├── Sidebar.tsx           # 5-section navigation sidebar
            ├── Dashboard.tsx         # 🏠 Dashboard module
            ├── AddEmployee.tsx       # 👤 Add Employee module
            ├── GenerateChecklist.tsx # 📋 Generate Checklist module
            ├── TaskManagement.tsx    # ✅ Task Management module
            └── ChecklistHistory.tsx  # 🕒 Checklist History module
```

---

## 🛠️ REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Retrieve real-time dashboard KPI metrics |
| `GET` | `/api/employees` | List all employees |
| `POST` | `/api/employees` | Register new employee (with optional auto-checklist) |
| `DELETE`| `/api/employees/:id` | Remove employee and associated checklists |
| `GET` | `/api/checklists` | List all checklists |
| `POST` | `/api/checklists/preview` | Preview rule-synthesized checklist |
| `POST` | `/api/checklists/save` | Save/update checklist with custom tasks |
| `GET` | `/api/tasks` | Get tasks with multi-filter query parameters |
| `PATCH`| `/api/tasks/:id` | Update task status, notes, or assignee |
| `POST` | `/api/tasks/employee/:id`| Add custom task to an employee |
| `DELETE`| `/api/tasks/:id` | Delete a task |
| `GET` | `/api/history` | Get historical completed records and audit log |
| `GET` | `/api/history/export/csv` | Download history as a CSV file |
| `POST` | `/api/reset` | Reset data back to clean demo seed |
