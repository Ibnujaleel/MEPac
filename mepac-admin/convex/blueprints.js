import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

async function requireAdminAuth(ctx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

// ── Queries ─────────────────────────────────────────────────────

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const blueprints = await ctx.db.query("blueprints").collect();

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

        return { ...bp, fileUrl, latestRevision: latestRevision || null };
      })
    );

    return enriched.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const blueprints = await ctx.db
      .query("blueprints")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

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

        return { ...bp, fileUrl, latestRevision: latestRevision || null };
      })
    );

    return enriched.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const getRevisions = query({
  args: { blueprintId: v.id("blueprints") },
  handler: async (ctx, args) => {
    const revisions = await ctx.db
      .query("blueprintRevisions")
      .withIndex("by_blueprint", (q) => q.eq("blueprintId", args.blueprintId))
      .collect();

    const enriched = await Promise.all(
      revisions.map(async (rev) => {
        let fileUrl = null;
        if (rev.fileStorageId) {
          fileUrl = await ctx.storage.getUrl(rev.fileStorageId);
        }
        return { ...rev, fileUrl };
      })
    );

    return enriched.sort((a, b) => b.version - a.version);
  },
});

// ── Mutations (Admin-protected) ──────────────────────────────────

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    fileStorageId: v.id("_storage"),
    uploadedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);

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

export const uploadRevision = mutation({
  args: {
    blueprintId: v.id("blueprints"),
    fileStorageId: v.id("_storage"),
    uploadedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);

    const blueprint = await ctx.db.get(args.blueprintId);
    if (!blueprint) throw new Error("Blueprint not found");

    const newVersion = blueprint.currentVersion + 1;
    await ctx.db.patch(args.blueprintId, { currentVersion: newVersion });

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

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminAuth(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const setAsLatest = mutation({
  args: { blueprintId: v.id("blueprints") },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);
    await ctx.db.patch(args.blueprintId, { pinnedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { blueprintId: v.id("blueprints") },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);

    const revisions = await ctx.db
      .query("blueprintRevisions")
      .withIndex("by_blueprint", (q) => q.eq("blueprintId", args.blueprintId))
      .collect();

    for (const rev of revisions) {
      try {
        if (rev.fileStorageId) await ctx.storage.delete(rev.fileStorageId);
      } catch (_) {
        // File may already be removed
      }
      await ctx.db.delete(rev._id);
    }

    await ctx.db.delete(args.blueprintId);
  },
});
