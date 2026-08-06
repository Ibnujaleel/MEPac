import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getInitials } from "./workers";

// ── Queries ─────────────────────────────────────────────────────

// Get today's check-ins for a project
export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    const allCheckIns = await ctx.db
      .query("checkIns")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const todayCheckIns = allCheckIns.filter(
      (c) => c.checkInTime >= startOfDay
    );

    // Enrich with worker info
    const enriched = await Promise.all(
      todayCheckIns.map(async (checkIn) => {
        const worker = await ctx.db.get(checkIn.workerId);
        if (!worker) return null;
        return {
          ...checkIn,
          name: `${worker.firstName} ${worker.lastName}`,
          initials: getInitials(worker.firstName, worker.lastName),
        };
      })
    );

    return enriched.filter(Boolean);
  },
});

// ── Mutations ───────────────────────────────────────────────────

export const checkIn = mutation({
  args: {
    projectId: v.id("projects"),
    workerId: v.id("workers"),
    type: v.union(v.literal("Self"), v.literal("Proxy")),
    status: v.optional(
      v.union(v.literal("Verified"), v.literal("Pending Approval"))
    ),
  },
  handler: async (ctx, args) => {
    // Auto-set status: Self = Verified, Proxy = Pending Approval
    const status =
      args.status || (args.type === "Self" ? "Verified" : "Pending Approval");

    return await ctx.db.insert("checkIns", {
      projectId: args.projectId,
      workerId: args.workerId,
      checkInTime: Date.now(),
      type: args.type,
      status,
    });
  },
});

export const checkOut = mutation({
  args: {
    checkInId: v.id("checkIns"),
    checkOutTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Default checkout time: 4:00 PM of the check-in day
    let checkOutTime = args.checkOutTime;

    if (!checkOutTime) {
      const checkIn = await ctx.db.get(args.checkInId);
      if (!checkIn) throw new Error("Check-in not found");

      const checkInDate = new Date(checkIn.checkInTime);
      const default4PM = new Date(
        checkInDate.getFullYear(),
        checkInDate.getMonth(),
        checkInDate.getDate(),
        16, // 4 PM
        0,
        0
      ).getTime();
      checkOutTime = default4PM;
    }

    await ctx.db.patch(args.checkInId, { checkOutTime });
  },
});

export const approveProxy = mutation({
  args: { checkInId: v.id("checkIns") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.checkInId, { status: "Verified" });
  },
});
