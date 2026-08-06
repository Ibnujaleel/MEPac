import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getInitials } from "./workers";

// ── Queries ─────────────────────────────────────────────────────

// Get all workers assigned to a project (enriched with name/initials)
export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("projectAssignments")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const workers = await Promise.all(
      assignments.map(async (a) => {
        const worker = await ctx.db.get(a.workerId);
        if (!worker) return null;
        return {
          ...worker,
          assignmentId: a._id,
          initials: getInitials(worker.firstName, worker.lastName),
          name: `${worker.firstName} ${worker.lastName}`,
        };
      })
    );

    return workers.filter(Boolean);
  },
});

// Get all projects a worker is assigned to
export const getByWorker = query({
  args: { workerId: v.id("workers") },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("projectAssignments")
      .withIndex("by_worker", (q) => q.eq("workerId", args.workerId))
      .collect();

    const projects = await Promise.all(
      assignments.map(async (a) => {
        return await ctx.db.get(a.projectId);
      })
    );

    return projects.filter(Boolean);
  },
});

// ── Mutations ───────────────────────────────────────────────────

export const assign = mutation({
  args: {
    projectId: v.id("projects"),
    workerId: v.id("workers"),
  },
  handler: async (ctx, args) => {
    // Check if already assigned
    const existing = await ctx.db
      .query("projectAssignments")
      .withIndex("by_project_and_worker", (q) =>
        q.eq("projectId", args.projectId).eq("workerId", args.workerId)
      )
      .first();

    if (existing) {
      throw new Error("Worker is already assigned to this project");
    }

    return await ctx.db.insert("projectAssignments", {
      projectId: args.projectId,
      workerId: args.workerId,
    });
  },
});

export const remove = mutation({
  args: {
    projectId: v.id("projects"),
    workerId: v.id("workers"),
  },
  handler: async (ctx, args) => {
    const assignment = await ctx.db
      .query("projectAssignments")
      .withIndex("by_project_and_worker", (q) =>
        q.eq("projectId", args.projectId).eq("workerId", args.workerId)
      )
      .first();

    if (!assignment) {
      throw new Error("Worker is not assigned to this project");
    }

    await ctx.db.delete(assignment._id);
  },
});
