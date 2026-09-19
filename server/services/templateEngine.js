/**
 * Rule-based Automated Checklist Generator
 * Generates custom tasks based on Employee Department, Role, and Provisioning needs.
 */

function generateChecklistForEmployee(employee) {
  const { id: employeeId, name, department, role, hardware, startDate } = employee;

  const baseDate = startDate ? new Date(startDate) : new Date();

  // Helper to format due dates relative to start date
  const addDays = (days) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const tasks = [];
  let taskCounter = 1;

  const createTask = (title, category, phase, assigneeRole, priority, daysOffset, description) => {
    tasks.push({
      id: `task-${Date.now()}-${taskCounter++}`,
      title,
      category, // "General & HR", "IT & Equipment", "Department Training", "Team & Culture", "Milestones"
      phase, // "Pre-boarding", "Day 1", "Week 1", "Day 30", "Day 60", "Day 90"
      assigneeRole, // "New Hire", "IT Admin", "HR Manager", "Direct Manager", "Assigned Buddy"
      priority, // "High", "Medium", "Low"
      status: "Pending", // "Pending", "In Progress", "Completed"
      dueDate: addDays(daysOffset),
      description: description || "",
      notes: "",
      completedAt: null
    });
  };

  // 1. PRE-BOARDING & HARDWARE
  createTask(
    `Ship & configure ${hardware || 'Work Laptop'} with MDM profile`,
    "IT & Equipment",
    "Pre-boarding",
    "IT Admin",
    "High",
    -2,
    `Ensure device is imaged with security software and dispatched to ${name}.`
  );
  createTask(
    "Setup corporate email & Google Workspace / Microsoft 365 account",
    "IT & Equipment",
    "Pre-boarding",
    "IT Admin",
    "High",
    -1,
    "Create mailbox, alias, and add to company-wide distribution groups."
  );
  createTask(
    "Send Welcome Kit and first-day logistics email",
    "General & HR",
    "Pre-boarding",
    "HR Manager",
    "Medium",
    -1,
    "Send reporting time, calendar invites, and welcome message."
  );

  // 2. DAY 1: WELCOME & ESSENTIAL SETUP
  createTask(
    "Complete identity verification, tax forms & NDA signing",
    "General & HR",
    "Day 1",
    "New Hire",
    "High",
    0,
    "Submit signed handbook acknowledgement and tax withholding documents."
  );
  createTask(
    "Set up Password Manager (1Password) and 2-Factor Authentication (2FA)",
    "IT & Equipment",
    "Day 1",
    "New Hire",
    "High",
    0,
    "Enforce hardware security key or authenticator app across all services."
  );
  createTask(
    "Company Welcome Orientation & Culture Overview session",
    "Team & Culture",
    "Day 1",
    "HR Manager",
    "Medium",
    0,
    "Attend live orientation webinar covering mission, values, and benefits."
  );
  createTask(
    "Day 1 Welcome Lunch or virtual coffee with Assigned Buddy",
    "Team & Culture",
    "Day 1",
    "Assigned Buddy",
    "Low",
    0,
    "Break the ice, answer immediate logistics questions, and introduce office tools."
  );

  // 3. WEEK 1: INTEGRATION & ROLE SETUP
  createTask(
    "Manager 1-on-1: Review 30-60-90 Day Expectations and KPIs",
    "Milestones",
    "Week 1",
    "Direct Manager",
    "High",
    3,
    "Discuss role scorecard, team objectives, and immediate learning curve."
  );
  createTask(
    "Join team Slack/Teams channels and calendar sync",
    "Team & Culture",
    "Week 1",
    "New Hire",
    "Low",
    2,
    "Introduce yourself in the #intros channel with a brief bio and fun fact."
  );
  createTask(
    "Complete Cybersecurity and Data Privacy compliance training",
    "General & HR",
    "Week 1",
    "New Hire",
    "Medium",
    5,
    "Mandatory annual compliance module on phishing, GDPR, and data protection."
  );

  // 4. DEPARTMENT-SPECIFIC TASKS
  const dept = (department || "").toLowerCase();

  if (dept.includes("eng") || dept.includes("tech") || dept.includes("software")) {
    createTask(
      "Provision GitHub / GitLab organization access and SSH keys",
      "Department Training",
      "Day 1",
      "IT Admin",
      "High",
      0,
      "Grant member access to main code repositories and CI/CD pipelines."
    );
    createTask(
      "Clone primary repositories and verify local development environment",
      "Department Training",
      "Week 1",
      "New Hire",
      "High",
      2,
      "Run Docker containers, build codebase, and execute test suite successfully."
    );
    createTask(
      "High-level System Architecture & Tech Stack deep dive with Tech Lead",
      "Department Training",
      "Week 1",
      "Assigned Buddy",
      "Medium",
      4,
      "Walkthrough of microservices, database schemas, and deploy workflows."
    );
    createTask(
      "Submit first 'Good First Issue' Pull Request and get code reviewed",
      "Department Training",
      "Week 1",
      "New Hire",
      "Medium",
      6,
      "Complete end-to-end PR lifecycle including review, CI checks, and merge."
    );
  } else if (dept.includes("sale") || dept.includes("business")) {
    createTask(
      "CRM & Sales Stack Provisioning (Salesforce, HubSpot, Gong)",
      "Department Training",
      "Day 1",
      "IT Admin",
      "High",
      0,
      "Setup user profile, permissions, and VoIP telephony."
    );
    createTask(
      "Product Demo Mastery & Competitor Battlecards review",
      "Department Training",
      "Week 1",
      "New Hire",
      "High",
      4,
      "Study pricing tiers, key differentiators, and target customer personas."
    );
    createTask(
      "Shadow 3 live sales calls with Senior Account Executive",
      "Department Training",
      "Week 1",
      "Assigned Buddy",
      "Medium",
      5,
      "Take notes on objection handling, discovery questions, and next steps."
    );
    createTask(
      "Deliver mock pitch & demo certification to Sales Manager",
      "Department Training",
      "Day 30",
      "New Hire",
      "High",
      20,
      "Pass internal demo certification before engaging inbound prospect pipeline."
    );
  } else if (dept.includes("market") || dept.includes("growth")) {
    createTask(
      "Brand Guidelines & Marketing Asset Library access (Figma, Canva)",
      "Department Training",
      "Day 1",
      "Assigned Buddy",
      "Medium",
      1,
      "Review official typography, logo usage, color palettes, and tone of voice."
    );
    createTask(
      "Analytics & Ad Platforms access (Google Analytics 4, Meta Ads, Search Console)",
      "Department Training",
      "Week 1",
      "IT Admin",
      "High",
      2,
      "Access web telemetry, dashboard tracking, and campaign metrics."
    );
    createTask(
      "Review Content & Campaign Strategy for the upcoming quarter",
      "Department Training",
      "Week 1",
      "Direct Manager",
      "Medium",
      4,
      "Understand active campaigns, target channels, and marketing OKRs."
    );
  } else if (dept.includes("design") || dept.includes("creative")) {
    createTask(
      "Figma Enterprise Seat & Design System libraries onboarding",
      "Department Training",
      "Day 1",
      "IT Admin",
      "High",
      0,
      "Join design organization, install design tokens plugin, and link fonts."
    );
    createTask(
      "Design System Component Audit & UX Guidelines walkthrough",
      "Department Training",
      "Week 1",
      "Assigned Buddy",
      "Medium",
      3,
      "Review existing component library, patterns, and accessibility standards."
    );
    createTask(
      "Participate in first weekly Design Critique session",
      "Department Training",
      "Week 1",
      "New Hire",
      "Low",
      5,
      "Present active explorations and provide constructive peer feedback."
    );
  } else if (dept.includes("hr") || dept.includes("people")) {
    createTask(
      "HRIS, Payroll & ATS admin configuration",
      "Department Training",
      "Day 1",
      "IT Admin",
      "High",
      0,
      "Grant administrative rights to applicant tracker and employee records."
    );
    createTask(
      "Review Company Policies, Benefits Enrollment, and Leave structure",
      "Department Training",
      "Week 1",
      "New Hire",
      "Medium",
      3,
      "Ensure full understanding of employee benefits, healthcare, and PTO rules."
    );
  } else {
    // General Operations / Product / Finance
    createTask(
      "Tooling & SaaS license provisioning (Notion, Asana/Jira, Google Drive)",
      "Department Training",
      "Day 1",
      "IT Admin",
      "High",
      0,
      "Grant access to standard team workspaces and documentation repository."
    );
    createTask(
      "Department standard operating procedures (SOP) review",
      "Department Training",
      "Week 1",
      "Assigned Buddy",
      "Medium",
      3,
      "Read through core process workflows and documentation."
    );
  }

  // 5. 30 - 60 - 90 DAY CHECKPOINTS
  createTask(
    "30-Day Check-in & Early Ramp Feedback Discussion",
    "Milestones",
    "Day 30",
    "Direct Manager",
    "High",
    30,
    "Evaluate onboarding progress, eliminate blockers, and review early wins."
  );
  createTask(
    "60-Day Independence Review & Project Milestones Assessment",
    "Milestones",
    "Day 60",
    "Direct Manager",
    "Medium",
    60,
    "Review independently owned projects and cross-functional team feedback."
  );
  createTask(
    "90-Day Full Integration & Probation Completion Review",
    "Milestones",
    "Day 90",
    "HR Manager",
    "High",
    90,
    "Formal onboarding conclusion, probation sign-off, and future career pathing."
  );

  return tasks;
}

module.exports = {
  generateChecklistForEmployee
};
