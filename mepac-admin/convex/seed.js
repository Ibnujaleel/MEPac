import { mutation } from "./_generated/server";

// ── Seed all tables with demo data ──────────────────────────────

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingWorkers = await ctx.db.query("workers").first();
    if (existingWorkers) {
      throw new Error("Database already has data. Run resetAll first to clear.");
    }

    // ── Workers ───────────────────────────────────────────────
    const workers = [
      { firstName: "Michael", lastName: "Adams", role: "Technician", mobile: "9876543210", isActive: true },
      { firstName: "Sarah", lastName: "Jenkins", role: "Supervisor", mobile: "9876543211", isActive: true },
      { firstName: "Robert", lastName: "Jones", role: "Foreman", mobile: "9876543212", isActive: true },
      { firstName: "David", lastName: "Rodriguez", role: "Foreman", mobile: "9876543213", isActive: true },
      { firstName: "Alex", lastName: "Lee", role: "Technician", mobile: "9876543214", isActive: true },
      { firstName: "Maria", lastName: "Garcia", role: "Supervisor", mobile: "9876543215", isActive: true },
      { firstName: "James", lastName: "Brown", role: "Technician", mobile: "9876543216", isActive: true },
      { firstName: "Lisa", lastName: "Taylor", role: "Foreman", mobile: "9876543217", isActive: true },
      { firstName: "Kevin", lastName: "White", role: "Supervisor", mobile: "9876543218", isActive: true },
      { firstName: "Chris", lastName: "Parker", role: "Supervisor", mobile: "9876543219", isActive: true },
      { firstName: "Emily", lastName: "Moore", role: "Technician", mobile: "9876543220", isActive: true },
      { firstName: "Richard", lastName: "Nelson", role: "Foreman", mobile: "9876543221", isActive: true },
      { firstName: "Anita", lastName: "Patel", role: "Technician", mobile: "9876543222", isActive: true },
      { firstName: "Vikram", lastName: "Kumar", role: "Supervisor", mobile: "9876543223", isActive: true },
      { firstName: "Priya", lastName: "Nair", role: "Foreman", mobile: "9876543224", isActive: true },
      { firstName: "Suresh", lastName: "Krishnan", role: "Technician", mobile: "9876543225", isActive: true },
      { firstName: "Deepa", lastName: "Menon", role: "Technician", mobile: "9876543226", isActive: true },
      { firstName: "Rahul", lastName: "Sharma", role: "Foreman", mobile: "9876543227", isActive: true },
    ];

    const workerIds = [];
    for (const worker of workers) {
      const id = await ctx.db.insert("workers", worker);
      workerIds.push(id);
    }

    // ── Projects ──────────────────────────────────────────────
    const projectsData = [
      {
        name: "Grand Tower MEP",
        client: "Aaryan Patel",
        location: "Mumbai, MH",
        latitude: 19.076,
        longitude: 72.8777,
        isCompleted: false,
        assignedWorkerIndices: [0, 1, 2], // Michael, Sarah, Robert
      },
      {
        name: "Mall Extension",
        client: "Rajesh Sharma",
        location: "Delhi, NCR",
        latitude: 28.6139,
        longitude: 77.209,
        isCompleted: false,
        assignedWorkerIndices: [3, 4, 5], // David, Alex, Maria
      },
      {
        name: "City Center Mall",
        client: "Modern Builders Inc.",
        location: "Bangalore, KA",
        latitude: 12.9716,
        longitude: 77.5946,
        isCompleted: true,
        assignedWorkerIndices: [6, 7, 8], // James, Lisa, Kevin
      },
      {
        name: "Sunrise Apartments",
        client: "Sunrise Devs",
        location: "Pune, MH",
        latitude: 18.5204,
        longitude: 73.8567,
        isCompleted: false,
        assignedWorkerIndices: [9, 10, 11], // Chris, Emily, Richard
      },
    ];

    const projectIds = [];
    for (const { assignedWorkerIndices, ...projectData } of projectsData) {
      const projectId = await ctx.db.insert("projects", projectData);
      projectIds.push(projectId);

      // Create assignments
      for (const workerIndex of assignedWorkerIndices) {
        await ctx.db.insert("projectAssignments", {
          projectId,
          workerId: workerIds[workerIndex],
        });
      }
    }

    // ── Check-ins (today's demo data) ─────────────────────────
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const checkInsData = [
      // Grand Tower MEP
      { projectIndex: 0, workerIndex: 0, hourOffset: 6, minuteOffset: 55, type: "Self", status: "Verified" },
      { projectIndex: 0, workerIndex: 1, hourOffset: 7, minuteOffset: 15, type: "Proxy", status: "Pending Approval" },
      { projectIndex: 0, workerIndex: 2, hourOffset: 7, minuteOffset: 22, type: "Self", status: "Verified" },
      // Mall Extension
      { projectIndex: 1, workerIndex: 3, hourOffset: 7, minuteOffset: 1, type: "Self", status: "Verified" },
      { projectIndex: 1, workerIndex: 4, hourOffset: 7, minuteOffset: 12, type: "Self", status: "Verified" },
      { projectIndex: 1, workerIndex: 5, hourOffset: 7, minuteOffset: 45, type: "Proxy", status: "Verified" },
    ];

    for (const ci of checkInsData) {
      const checkInTime = new Date(today);
      checkInTime.setHours(ci.hourOffset, ci.minuteOffset, 0, 0);

      await ctx.db.insert("checkIns", {
        projectId: projectIds[ci.projectIndex],
        workerId: workerIds[ci.workerIndex],
        checkInTime: checkInTime.getTime(),
        type: ci.type,
        status: ci.status,
      });
    }

    // ── Blueprints ────────────────────────────────────────────
    // Note: No file storage IDs for seed data — these are placeholders
    // Real files would be uploaded via the UI

    // ── Notifications ─────────────────────────────────────────
    const notificationsData = [
      { title: "Proxy Check-in Alert", desc: "Sarah Jenkins was checked in via proxy at Grand Tower MEP. Supervisor approval required.", isRead: false },
      { title: "Blueprint Updated", desc: "Electrical Layout - Floor 1 has been revised to v3 by admin.", isRead: false },
      { title: "Silent Site Alert", desc: "No check-ins recorded at Mall Extension this morning.", isRead: true },
    ];

    for (let i = 0; i < notificationsData.length; i++) {
      await ctx.db.insert("notifications", {
        ...notificationsData[i],
        createdAt: Date.now() - (i * 3600000), // Stagger by 1 hour each
      });
    }

    return {
      workersCreated: workerIds.length,
      projectsCreated: projectIds.length,
      message: "Database seeded successfully!",
    };
  },
});

// ── Reset all tables (clear everything) ─────────────────────────

export const resetAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "workers",
      "projects",
      "projectAssignments",
      "checkIns",
      "blueprints",
      "blueprintRevisions",
      "notifications",
    ];

    let totalDeleted = 0;

    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
        totalDeleted++;
      }
    }

    return {
      totalDeleted,
      message: "All tables cleared successfully!",
    };
  },
});
