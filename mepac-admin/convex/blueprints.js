import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Queries ─────────────────────────────────────────────────────

// Get all blueprints for a project (with latest revision URL)
export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const blueprints = await ctx.db
      .query("blueprints")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Enrich with the latest revision file URL
    const enriched = await Promise.all(
      blueprints.map(async (bp) => {
        const latestRevision = await ctx.db
          .query("blueprintRevisions")
          .withIndex("by_blueprint_and_version", (q) =>
            q.eq("blueprintId", bp._id).eq("version", bp.currentVersion)
          )
          .first();

        let fileUrl = null;
        if (latestRevision?.fileStorageId) {
          fileUrl = await ctx.storage.getUrl(latestRevision.fileStorageId);
        }

        return {
          ...bp,
          fileUrl,
          latestRevision: latestRevision || null,
        };
      })
    );

    return enriched;
  },
});

// Get all revisions for a specific blueprint
export const getRevisions = query({
  args: { blueprintId: v.id("blueprints") },
  handler: async (ctx, args) => {
    const revisions = await ctx.db
      .query("blueprintRevisions")
      .withIndex("by_blueprint", (q) => q.eq("blueprintId", args.blueprintId))
      .collect();

    // Enrich with file URLs
    const enriched = await Promise.all(
      revisions.map(async (rev) => {
        let fileUrl = null;
        if (rev.fileStorageId) {
          fileUrl = await ctx.storage.getUrl(rev.fileStorageId);
        }
        return { ...rev, fileUrl };
      })
    );

    // Sort by version descending (newest first)
    return enriched.sort((a, b) => b.version - a.version);
  },
});

// ── Mutations ───────────────────────────────────────────────────

// Create a new blueprint with its first revision
export const create = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    fileStorageId: v.id("_storage"),
    uploadedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const blueprintId = await ctx.db.insert("blueprints", {
      projectId: args.projectId,
      name: args.name,
      currentVersion: 1,
    });

    await ctx.db.insert("blueprintRevisions", {
      blueprintId,
      version: 1,
      fileStorageId: args.fileStorageId,
      uploadedAt: Date.now(),
      uploadedBy: args.uploadedBy,
    });

    return blueprintId;
  },
});

// Upload a new revision for an existing blueprint
export const uploadRevision = mutation({
  args: {
    blueprintId: v.id("blueprints"),
    fileStorageId: v.id("_storage"),
    uploadedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const blueprint = await ctx.db.get(args.blueprintId);
    if (!blueprint) throw new Error("Blueprint not found");

    const newVersion = blueprint.currentVersion + 1;

    // Update the blueprint's current version
    await ctx.db.patch(args.blueprintId, { currentVersion: newVersion });

    // Create the new revision
    await ctx.db.insert("blueprintRevisions", {
      blueprintId: args.blueprintId,
      version: newVersion,
      fileStorageId: args.fileStorageId,
      uploadedAt: Date.now(),
      uploadedBy: args.uploadedBy,
    });

    return newVersion;
  },
});

// Generate an upload URL for Convex File Storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
