import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Queries ─────────────────────────────────────────────────────

export const list = query({
  args: {
    type: v.optional(v.union(v.literal("rfi"), v.literal("dispute"))),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("rfis");

    if (args.type) {
      q = q.withIndex("by_type", (idx) => idx.eq("type", args.type));
    } else {
      q = q.withIndex("by_created");
    }

    const items = await q.order("desc").collect();

    if (args.projectId) {
      return items.filter((item) => item.projectId === args.projectId);
    }

    return items;
  },
});

// ── Mutations ───────────────────────────────────────────────────

export const createDispute = mutation({
  args: {
    projectId: v.optional(v.id("projects")),
    projectName: v.string(),
    workerId: v.optional(v.id("workers")),
    workerName: v.string(),
    workerRole: v.optional(v.string()),
    createdByWorkerId: v.optional(v.id("workers")),
    createdByName: v.string(),
    createdByRole: v.string(),
    reason: v.string(),
    priority: v.optional(
      v.union(v.literal("High"), v.literal("Medium"), v.literal("Low"))
    ),
  },
  handler: async (ctx, args) => {
    const randomCode = Math.floor(100 + Math.random() * 900);
    const rfiCode = `DSP-2026-${randomCode}`;
    const now = Date.now();

    const title = `Attendance Dispute: ${args.workerName}`;

    // 1. Insert into RFIs & Disputes table
    const disputeId = await ctx.db.insert("rfis", {
      type: "dispute",
      projectId: args.projectId,
      projectName: args.projectName,
      workerId: args.workerId,
      workerName: args.workerName,
      workerRole: args.workerRole || "Technician",
      createdByWorkerId: args.createdByWorkerId,
      createdByName: args.createdByName,
      createdByRole: args.createdByRole,
      title,
      details: args.reason,
      status: "FLAGGED FOR ADMIN REVIEW",
      priority: args.priority || "High",
      createdAt: now,
      updatedAt: now,
      rfiCode,
    });

    // 2. Insert into Notifications for Admin Console
    await ctx.db.insert("notifications", {
      title: `Attendance Dispute: ${args.workerName} (${args.projectName})`,
      desc: `${args.createdByName} (${args.createdByRole}): ${args.reason}`,
      createdAt: now,
      isRead: false,
    });

    return { success: true, disputeId, rfiCode };
  },
});

export const createRfi = mutation({
  args: {
    projectId: v.optional(v.id("projects")),
    projectName: v.string(),
    workerId: v.optional(v.id("workers")),
    workerName: v.optional(v.string()),
    workerRole: v.optional(v.string()),
    createdByWorkerId: v.optional(v.id("workers")),
    createdByName: v.string(),
    createdByRole: v.string(),
    title: v.string(),
    details: v.string(),
    priority: v.optional(
      v.union(v.literal("High"), v.literal("Medium"), v.literal("Low"))
    ),
  },
  handler: async (ctx, args) => {
    const randomCode = Math.floor(100 + Math.random() * 900);
    const rfiCode = `RFI-2026-${randomCode}`;
    const now = Date.now();

    const rfiId = await ctx.db.insert("rfis", {
      type: "rfi",
      projectId: args.projectId,
      projectName: args.projectName,
      workerId: args.workerId,
      workerName: args.workerName,
      workerRole: args.workerRole,
      createdByWorkerId: args.createdByWorkerId,
      createdByName: args.createdByName,
      createdByRole: args.createdByRole,
      title: args.title,
      details: args.details,
      status: "OPEN",
      priority: args.priority || "High",
      createdAt: now,
      updatedAt: now,
      rfiCode,
    });

    await ctx.db.insert("notifications", {
      title: `New RFI: ${args.title} (${args.projectName})`,
      desc: `${args.createdByName}: ${args.details}`,
      createdAt: now,
      isRead: false,
    });

    return { success: true, rfiId, rfiCode };
  },
});

export const updateStatus = mutation({
  args: {
    rfiId: v.id("rfis"),
    status: v.union(
      v.literal("OPEN"),
      v.literal("IN PROGRESS"),
      v.literal("FLAGGED FOR ADMIN REVIEW"),
      v.literal("RESOLVED")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.rfiId);
    if (!existing) throw new Error("RFI or Dispute not found");

    await ctx.db.patch(args.rfiId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const remove = mutation({
  args: {
    rfiId: v.id("rfis"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.rfiId);
    return { success: true };
  },
});
