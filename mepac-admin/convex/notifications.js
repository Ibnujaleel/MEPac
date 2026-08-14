import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

async function requireAdminAuth(ctx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

// ── Queries ─────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

// ── Mutations ───────────────────────────────────────────────────

export const create = mutation({
  args: {
    title: v.string(),
    desc: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);
    return await ctx.db.insert("notifications", {
      ...args,
      createdAt: Date.now(),
      isRead: false,
    });
  },
});

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);
    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

export const remove = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);
    await ctx.db.delete(args.notificationId);
  },
});
