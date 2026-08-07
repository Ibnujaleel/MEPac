import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ── Global Workforce ──────────────────────────────────────────
  workers: defineTable({
    workerCode: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(
      v.literal("Supervisor"),
      v.literal("Foreman"),
      v.literal("Technician")
    ),
    mobile: v.string(), // Validated in mutations: digits only, exactly 10
    pin: v.optional(v.string()),
    isActive: v.boolean(),
  }),

  // ── Projects ──────────────────────────────────────────────────
  projects: defineTable({
    name: v.string(),
    client: v.string(),
    location: v.string(), // Human-readable (e.g. "Mumbai, MH")
    latitude: v.optional(v.float64()),
    longitude: v.optional(v.float64()),
    imageStorageId: v.optional(v.id("_storage")), // Convex File Storage
    isCompleted: v.boolean(),
  }),

  // ── Project ↔ Worker Assignment (many-to-many) ────────────────
  projectAssignments: defineTable({
    projectId: v.id("projects"),
    workerId: v.id("workers"),
  })
    .index("by_project", ["projectId"])
    .index("by_worker", ["workerId"])
    .index("by_project_and_worker", ["projectId", "workerId"]),

  // ── Daily Check-ins ───────────────────────────────────────────
  checkIns: defineTable({
    projectId: v.id("projects"),
    workerId: v.id("workers"),
    checkInTime: v.number(), // Unix timestamp
    checkOutTime: v.optional(v.number()), // Unix timestamp — defaults to 4:00 PM if not set
    type: v.union(v.literal("Self"), v.literal("Proxy")),
    status: v.union(v.literal("Verified"), v.literal("Pending Approval")),
  })
    .index("by_project", ["projectId"])
    .index("by_worker", ["workerId"])
    .index("by_project_and_date", ["projectId", "checkInTime"]),

  // ── Blueprints / Drawings ─────────────────────────────────────
  blueprints: defineTable({
    projectId: v.id("projects"),
    name: v.string(), // e.g. "Electrical Layout - Floor 1"
    currentVersion: v.number(), // Latest version number
    pinnedAt: v.optional(v.number()), // Timestamp set when user manually pins as "Latest"
  }).index("by_project", ["projectId"]),

  // ── Blueprint Revisions (version history) ─────────────────────
  blueprintRevisions: defineTable({
    blueprintId: v.id("blueprints"),
    version: v.number(),
    fileStorageId: v.id("_storage"), // Convex File Storage
    uploadedAt: v.number(), // Unix timestamp
    uploadedBy: v.optional(v.string()), // Name (optional until auth is added)
  })
    .index("by_blueprint", ["blueprintId"])
    .index("by_blueprint_and_version", ["blueprintId", "version"]),

  // ── Notifications (Global) ────────────────────────────────────
  notifications: defineTable({
    title: v.string(),
    desc: v.string(),
    createdAt: v.number(), // Unix timestamp
    isRead: v.boolean(),
  }).index("by_created", ["createdAt"]),

  // ── Settings (Singleton) ──────────────────────────────────────
  settings: defineTable({
    // Company Profile
    companyName: v.string(),
    companyEmail: v.string(),
    companyPhone: v.string(),
    companyAddress: v.string(),
    logoStorageId: v.optional(v.id("_storage")),

    // Working Hours
    shiftStart: v.string(),
    shiftEnd: v.string(),
    lateBuffer: v.string(),
    autoAbsent: v.string(),

    // Work Week (Mon-Sun)
    workWeek: v.object({
      M: v.boolean(),
      T: v.boolean(),
      W: v.boolean(),
      T1: v.boolean(),
      F: v.boolean(),
      S1: v.boolean(),
      S2: v.boolean(),
    }),

    // Holidays array
    holidays: v.array(v.object({
      name: v.string(),
      date: v.string(), // "DD/MM" format
    })),

    // Geofence
    enforceGps: v.boolean(),
    geofenceRadius: v.number(),

    // Alert Thresholds
    silentAlert: v.string(),
    proxyReminder: v.string(),
    disputeResolution: v.string(),

    // Attendance Rules
    requirePhoto: v.boolean(),
    allowSelfClockIn: v.boolean(),
    requireReason: v.boolean(),
  }),
});
