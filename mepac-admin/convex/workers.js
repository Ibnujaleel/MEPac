import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
      ...w,
      displayId: w.workerCode || "W-000",
      pin: w.pin || "123456",
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
      ...worker,
      displayId: worker.workerCode || "W-000",
      pin: worker.pin || "123456",
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
    pin: v.optional(v.string()),
    workerCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate mobile: digits only, exactly 10
    if (!/^\d{10}$/.test(args.mobile)) {
      throw new Error("Mobile must be exactly 10 digits");
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
      pin: args.pin || "123456",
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
    pin: v.optional(v.string()),
    workerCode: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { workerId, ...updates } = args;

    // Validate mobile if provided
    if (updates.mobile && !/^\d{10}$/.test(updates.mobile)) {
      throw new Error("Mobile must be exactly 10 digits");
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
    const worker = await ctx.db.get(args.workerId);
    if (!worker) throw new Error("Worker not found");
    await ctx.db.patch(args.workerId, { isActive: !worker.isActive });
  },
});

export const remove = mutation({
  args: { workerId: v.id("workers") },
  handler: async (ctx, args) => {
    // Delete worker assignments first
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
