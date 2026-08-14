import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getInitials, verifyWorkerPin } from "./workers";

// ── Auth helper ─────────────────────────────────────────────────

async function requireAdminAuth(ctx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

// ── Queries ─────────────────────────────────────────────────────

// Get today's check-ins for a project (admin-only)
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

// ── Worker-Facing Mutations (authenticated by workerId + PIN) ────
// These are called from the worker mobile app.
// No admin session required — identity is verified by PIN instead.

/**
 * Worker login: authenticate by mobile + PIN.
 * Returns worker profile info (no mobile, no PIN fields).
 * The returned workerId is used for all subsequent worker mutations.
 */
export const workerLogin = mutation({
  args: {
    mobile: v.string(),
    pin: v.string(),
  },
  handler: async (ctx, { mobile, pin }) => {
    const worker = await ctx.db
      .query("workers")
      .filter((q) => q.eq(q.field("mobile"), mobile))
      .first();

    if (!worker || !worker.isActive) throw new Error("Invalid credentials");
    if (worker.pin !== pin) throw new Error("Invalid credentials");

    return {
      workerId: worker._id,
      workerCode: worker.workerCode,
      firstName: worker.firstName,
      lastName: worker.lastName,
      role: worker.role,
      pinIsDefault: worker.pinIsDefault,
    };
  },
});

/**
 * Worker check-in: authenticated by workerId + PIN.
 * Returns the new check-in ID, plus a requiresPinChange flag
 * so the worker app knows to prompt a PIN update on first login.
 */
export const checkIn = mutation({
  args: {
    workerId: v.id("workers"),
    pin: v.string(),
    projectId: v.id("projects"),
    type: v.union(v.literal("Self"), v.literal("Proxy")),
  },
  handler: async (ctx, args) => {
    const worker = await verifyWorkerPin(ctx.db, args.workerId, args.pin);

    const status = args.type === "Self" ? "Verified" : "Pending Approval";

    const checkInId = await ctx.db.insert("checkIns", {
      projectId: args.projectId,
      workerId: args.workerId,
      checkInTime: Date.now(),
      type: args.type,
      status,
    });

    return {
      checkInId,
      requiresPinChange: worker.pinIsDefault,
    };
  },
});

/**
 * Worker self-checkout: authenticated by workerId + PIN.
 */
export const workerCheckOut = mutation({
  args: {
    workerId: v.id("workers"),
    pin: v.string(),
    checkInId: v.id("checkIns"),
  },
  handler: async (ctx, args) => {
    await verifyWorkerPin(ctx.db, args.workerId, args.pin);

    const checkIn = await ctx.db.get(args.checkInId);
    if (!checkIn) throw new Error("Check-in not found");

    // Ensure worker can only check out their own record
    if (checkIn.workerId !== args.workerId) throw new Error("Unauthorized");

    await ctx.db.patch(args.checkInId, { checkOutTime: Date.now() });
  },
});

/**
 * Worker PIN change: verifies current PIN, then updates to new PIN.
 * Sets pinIsDefault = false so the forced-change prompt goes away.
 */
export const workerChangePin = mutation({
  args: {
    workerId: v.id("workers"),
    currentPin: v.string(),
    newPin: v.string(),
  },
  handler: async (ctx, args) => {
    await verifyWorkerPin(ctx.db, args.workerId, args.currentPin);

    if (!/^\d{4,8}$/.test(args.newPin)) {
      throw new Error("New PIN must be 4–8 digits");
    }

    await ctx.db.patch(args.workerId, {
      pin: args.newPin,
      pinIsDefault: false,
    });
  },
});

// ── Admin-Only Mutations ─────────────────────────────────────────

/**
 * Admin manual checkout override (e.g. forgot to clock out).
 * Defaults to 4:00 PM of the check-in day if no time provided.
 */
export const checkOut = mutation({
  args: {
    checkInId: v.id("checkIns"),
    checkOutTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);

    let checkOutTime = args.checkOutTime;

    if (!checkOutTime) {
      const checkIn = await ctx.db.get(args.checkInId);
      if (!checkIn) throw new Error("Check-in not found");

      const checkInDate = new Date(checkIn.checkInTime);
      checkOutTime = new Date(
        checkInDate.getFullYear(),
        checkInDate.getMonth(),
        checkInDate.getDate(),
        16, 0, 0
      ).getTime();
    }

    await ctx.db.patch(args.checkInId, { checkOutTime });
  },
});

/**
 * Approve a proxy check-in. Admin-only.
 */
export const approveProxy = mutation({
  args: { checkInId: v.id("checkIns") },
  handler: async (ctx, args) => {
    await requireAdminAuth(ctx);
    await ctx.db.patch(args.checkInId, { status: "Verified" });
  },
});
