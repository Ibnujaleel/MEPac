import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ── Auth helpers ─────────────────────────────────────────────────

async function requireAdminAuth(ctx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

// Helper: verify a worker's active PIN given their workerId.
// Used by worker-facing mutations in checkIns.js.
export async function verifyWorkerPin(db, workerId, pin) {
  const worker = await db.get(workerId);
  if (!worker || !worker.isActive) throw new Error("Invalid credentials");
  if (worker.pin !== pin) throw new Error("Invalid credentials");
  return worker;
}

// Helper to compute initials from first and last name
export function getInitials(firstName, lastName) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase();
}

// ── Queries ─────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const workers = await ctx.db.query("workers").collect();
    return workers.map((w) => ({
      _id: w._id,
      _creationTime: w._creationTime,
      workerCode: w.workerCode || "W-000",
      displayId: w.workerCode || "W-000",
      firstName: w.firstName,
      lastName: w.lastName,
      role: w.role,
      mobile: w.mobile,  // admin needs to see mobile in the dashboard
      adminPin: w.adminPin,       // admin needs this to reset/communicate default PIN
      pinIsDefault: w.pinIsDefault, // flag: worker has not changed their PIN
      isActive: w.isActive,
      initials: getInitials(w.firstName, w.lastName),
      name: `${w.firstName} ${w.lastName}`,
    }));
  },
});

export const get = query({
  args: { workerId: v.id("workers") },
  handler: async (ctx, args) => {
    const worker = await ctx.db.get(args.workerId);
    if (!worker) return null;
    return {
      _id: worker._id,
      _creationTime: worker._creationTime,
      workerCode: worker.workerCode || "W-000",
      displayId: worker.workerCode || "W-000",
      firstName: worker.firstName,
      lastName: worker.lastName,
      role: worker.role,
      mobile: worker.mobile,  // admin needs to see mobile in the dashboard
      adminPin: worker.adminPin,
      pinIsDefault: worker.pinIsDefault,
      isActive: worker.isActive,
      initials: getInitials(worker.firstName, worker.lastName),
      name: `${worker.firstName} ${worker.lastName}`,
    };
  },
});

// ── Mutations ───────────────────────────────────────────────────

export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(
      v.literal("Supervisor"),
      v.literal("Foreman"),
      v.literal("Technician")
    ),
    mobile: v.string(),
    adminPin: v.string(),
    workerCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);

    // Validate mobile: digits only, exactly 10
    if (!/^\d{10}$/.test(args.mobile)) {
      throw new Error("Mobile must be exactly 10 digits");
    }

    // Validate adminPin: digits only, 4-8 characters
    if (!/^\d{4,8}$/.test(args.adminPin)) {
      throw new Error("PIN must be 4–8 digits");
    }

    let workerCode = args.workerCode;
    if (!workerCode) {
      const existing = await ctx.db.query("workers").collect();
      const count = existing.filter((w) => w.role === args.role).length;
      const prefix = args.role === "Supervisor" ? "SUP" : args.role === "Foreman" ? "FOR" : "TEC";
      workerCode = `${prefix}-${String(count + 1).padStart(3, "0")}`;
    }

    return await ctx.db.insert("workers", {
      firstName: args.firstName,
      lastName: args.lastName,
      role: args.role,
      mobile: args.mobile,
      adminPin: args.adminPin,
      pin: args.adminPin,        // worker's active PIN starts as adminPin
      pinIsDefault: true,        // worker must change on first login
      workerCode,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    workerId: v.id("workers"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("Supervisor"),
        v.literal("Foreman"),
        v.literal("Technician")
      )
    ),
    mobile: v.optional(v.string()),
    adminPin: v.optional(v.string()),
    workerCode: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);

    const { workerId, ...updates } = args;

    if (updates.mobile && !/^\d{10}$/.test(updates.mobile)) {
      throw new Error("Mobile must be exactly 10 digits");
    }

    if (updates.adminPin && !/^\d{4,8}$/.test(updates.adminPin)) {
      throw new Error("PIN must be 4–8 digits");
    }

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(workerId, cleanUpdates);
  },
});

export const toggleStatus = mutation({
  args: { workerId: v.id("workers") },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);
    const worker = await ctx.db.get(args.workerId);
    if (!worker) throw new Error("Worker not found");
    await ctx.db.patch(args.workerId, { isActive: !worker.isActive });
  },
});

export const remove = mutation({
  args: { workerId: v.id("workers") },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);
    const assignments = await ctx.db
      .query("projectAssignments")
      .withIndex("by_worker", (q) => q.eq("workerId", args.workerId))
      .collect();
    for (const a of assignments) {
      await ctx.db.delete(a._id);
    }
    await ctx.db.delete(args.workerId);
  },
});

/**
 * Reset a worker's PIN back to their adminPin.
 * Sets pinIsDefault = true so the worker is forced to change it on next login.
 */
export const resetPin = mutation({
  args: { workerId: v.id("workers") },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);
    const worker = await ctx.db.get(args.workerId);
    if (!worker) throw new Error("Worker not found");
    await ctx.db.patch(args.workerId, {
      pin: worker.adminPin,
      pinIsDefault: true,
    });
  },
});
