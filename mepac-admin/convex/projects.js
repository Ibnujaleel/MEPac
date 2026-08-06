import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Queries ─────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();

    // Enrich each project with assignment counts and today's check-in count
    const enriched = await Promise.all(
      projects.map(async (project) => {
        const assignments = await ctx.db
          .query("projectAssignments")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect();

        // Get today's check-ins
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const checkIns = await ctx.db
          .query("checkIns")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect();
        const todayCheckIns = checkIns.filter((c) => c.checkInTime >= startOfDay);

        // Get project image URL if stored
        let imageUrl = null;
        if (project.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(project.imageStorageId);
        }

        return {
          ...project,
          imageUrl,
          totalAssigned: assignments.length,
          employeesPresent: todayCheckIns.length,
        };
      })
    );

    return enriched;
  },
});

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;

    let imageUrl = null;
    if (project.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(project.imageStorageId);
    }

    const assignments = await ctx.db
      .query("projectAssignments")
      .withIndex("by_project", (q) => q.eq("projectId", project._id))
      .collect();

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const checkIns = await ctx.db
      .query("checkIns")
      .withIndex("by_project", (q) => q.eq("projectId", project._id))
      .collect();
    const todayCheckIns = checkIns.filter((c) => c.checkInTime >= startOfDay);

    return {
      ...project,
      imageUrl,
      totalAssigned: assignments.length,
      employeesPresent: todayCheckIns.length,
    };
  },
});

// ── Mutations ───────────────────────────────────────────────────

export const create = mutation({
  args: {
    name: v.string(),
    client: v.string(),
    location: v.string(),
    latitude: v.optional(v.float64()),
    longitude: v.optional(v.float64()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", {
      ...args,
      isCompleted: false,
    });
  },
});

export const update = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    client: v.optional(v.string()),
    location: v.optional(v.string()),
    latitude: v.optional(v.float64()),
    longitude: v.optional(v.float64()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(projectId, cleanUpdates);
  },
});

export const toggleComplete = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");
    await ctx.db.patch(args.projectId, { isCompleted: !project.isCompleted });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
