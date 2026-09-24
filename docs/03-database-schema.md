# MEPac — Database Schema

All data lives in a single Convex deployment shared by both the Admin Console and the Field PWA. The schema is defined in `mepac-admin/convex/schema.js`.

---

## Entity Relationship Overview

```
projects ──< projectAssignments >── workers
    │                                  │
    └──< checkIns                      └──< checkIns
    │                                  │
    └──< blueprints                    └── currentSessionId (single-device lock)
         └──< blueprintRevisions
    │
    └──< rfis

users (admin accounts — managed by Convex Auth)
invitedAdmins (pending email invites)
notifications (global + worker-targeted)
settings (company config singleton)
```

---

## Tables

### `workers`

Global workforce registry. Shared lookup table for both Admin and PWA.

| Field | Type | Description |
|---|---|---|
| `workerCode` | `string?` | Optional display code |
| `firstName` | `string` | — |
| `lastName` | `string` | — |
| `role` | `"Supervisor" \| "Foreman" \| "Technician" \| "Designer"` | Determines PWA route access |
| `mobile` | `string` | Used for login lookup only; never returned to frontend |
| `adminPin` | `string?` | Admin-set default PIN; shown in Admin Console for reset reference |
| `pin` | `string?` | Worker's own PIN; never returned to frontend |
| `pinIsDefault` | `boolean?` | `true` if worker has not yet changed their PIN |
| `isActive` | `boolean` | Soft-enable/disable without deletion |
| `currentSessionId` | `string?` | Active device session token (single-device enforcement) |
| `lastSessionAt` | `number?` | Timestamp of last session claim |
| `lastDeviceName` | `string?` | Browser/device identifier |

---

### `projects`

Each row represents one construction project/site.

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Project name |
| `client` | `string` | Client company name |
| `location` | `string` | Human-readable location label |
| `latitude` | `float64?` | GPS latitude for geofencing |
| `longitude` | `float64?` | GPS longitude for geofencing |
| `imageStorageId` | `id(_storage)?` | Convex Storage reference for site image |
| `isCompleted` | `boolean` | Archived flag |

---

### `projectAssignments`

Many-to-many join table between projects and workers.

| Field | Type | Description |
|---|---|---|
| `projectId` | `id(projects)` | — |
| `workerId` | `id(workers)` | — |

**Indexes:** `by_project`, `by_worker`, `by_project_and_worker`

---

### `checkIns`

One row per attendance event (clock-in or clock-in/out pair).

| Field | Type | Description |
|---|---|---|
| `projectId` | `id(projects)` | Site of attendance |
| `workerId` | `id(workers)` | Worker being tracked |
| `checkInTime` | `number` | Unix timestamp (ms) |
| `checkOutTime` | `number?` | Unix timestamp (ms), set on clock-out |
| `type` | `"Self" \| "Proxy" \| "Manual" \| "Manual Override"` | How the check-in was recorded |
| `status` | `"Verified" \| "Pending Approval" \| "On Site" \| "Completed"` | Admin verification state |

**Indexes:** `by_project`, `by_worker`, `by_project_and_date`

---

### `blueprints`

One row per drawing/document within a project.

| Field | Type | Description |
|---|---|---|
| `projectId` | `id(projects)` | Owning project |
| `name` | `string` | Drawing title |
| `currentVersion` | `number` | Active version number |
| `pinnedAt` | `number?` | Timestamp when version was pinned |
| `category` | `string?` | e.g. `"Electrical"`, `"Plumbing"`, `"HVAC"`, `"Fire Protection"`, `"Architectural"`, `"Other"` |
| `discipline` | `string?` | Sub-discipline label |
| `description` | `string?` | Drawing description |

**Index:** `by_project`

---

### `blueprintRevisions`

Version history for each blueprint. Max 3 revisions retained (FIFO deletion).

| Field | Type | Description |
|---|---|---|
| `blueprintId` | `id(blueprints)` | Parent blueprint |
| `version` | `number` | Revision number (1, 2, 3…) |
| `fileStorageId` | `id(_storage)` | Convex Storage file reference |
| `uploadedAt` | `number` | Unix timestamp |
| `uploadedBy` | `string?` | Uploader display name |
| `uploadedByRole` | `string?` | Uploader's role |
| `workerId` | `id(workers)?` | If uploaded by a field worker |
| `notes` | `string?` | Revision comment |
| `fileName` | `string?` | Original filename |
| `fileSize` | `string?` | Human-readable size |

**Indexes:** `by_blueprint`, `by_blueprint_and_version`

---

### `notifications`

Global and worker-targeted in-app notifications.

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Short notification heading |
| `desc` | `string` | Full notification body |
| `createdAt` | `number` | Unix timestamp |
| `isRead` | `boolean` | Read state |
| `recipientWorkerId` | `id(workers)?` | If targeted at a specific worker; `undefined` = global |
| `role` | `string?` | Role-targeted broadcast |
| `type` | `string?` | Notification category tag |

**Index:** `by_created`

---

### `settings`

Company configuration singleton. Only one row expected.

| Field | Type | Description |
|---|---|---|
| `companyName` | `string` | — |
| `companyEmail` | `string` | — |
| `companyPhone` | `string` | — |
| `companyAddress` | `string` | — |
| `logoStorageId` | `id(_storage)?` | Company logo in Convex Storage |
| `shiftStart` | `string` | e.g. `"08:00"` |
| `shiftEnd` | `string` | e.g. `"17:00"` |
| `lateBuffer` | `string` | Minutes after shift start before marking late |
| `autoAbsent` | `string` | Minutes threshold for auto-absent marking |
| `workWeek` | `object` | Boolean flags for M/T/W/T1/F/S1/S2 |
| `holidays` | `array` | `{ name: string, date: string }[]` |
| `enforceGps` | `boolean` | Whether GPS geofence is enforced on clock-in |
| `geofenceRadius` | `number` | Radius in metres |
| `silentAlert` | `string` | Hours threshold for silent-site alerts |
| `proxyReminder` | `string` | Hours threshold for proxy check-in reminders |
| `disputeResolution` | `string` | Hours SLA for dispute resolution |
| `requirePhoto` | `boolean` | Whether photo capture is required on clock-in |
| `allowSelfClockIn` | `boolean` | Whether workers can self-clock without foreman |
| `requireReason` | `boolean` | Whether a reason is required for proxy/manual check-ins |

---

### `invitedAdmins`

Pending email invitations for new admin accounts.

| Field | Type | Description |
|---|---|---|
| `email` | `string` | Invited email address |
| `invitedAt` | `number` | Unix timestamp of invite |

**Index:** `by_email`

> Invites are consumed (deleted) the moment the new admin completes their first login. This prevents deleted admins from re-registering.

---

### `rfis`

RFIs (Requests for Information) and Disputes — unified ticket system.

| Field | Type | Description |
|---|---|---|
| `type` | `"rfi" \| "dispute"` | Ticket type |
| `projectId` | `id(projects)?` | Associated project |
| `projectName` | `string` | Denormalized project name snapshot |
| `workerId` | `id(workers)?` | Worker involved (for disputes) |
| `workerName` | `string?` | Denormalized name snapshot |
| `workerRole` | `string?` | Denormalized role snapshot |
| `createdByWorkerId` | `id(workers)?` | Who created the ticket |
| `createdByName` | `string` | Creator display name |
| `createdByRole` | `string` | Creator role |
| `title` | `string` | Ticket title |
| `details` | `string` | Full description |
| `status` | `"OPEN" \| "IN PROGRESS" \| "FLAGGED FOR ADMIN REVIEW" \| "RESOLVED"` | Lifecycle state |
| `priority` | `"High" \| "Medium" \| "Low"` | — |
| `createdAt` | `number` | Unix timestamp |
| `updatedAt` | `number` | Unix timestamp of last status change |
| `rfiCode` | `string` | Human-readable reference code (e.g. `RFI-001`) |

**Indexes:** `by_project`, `by_worker`, `by_type`, `by_created`

---

### Auth Tables (`authTables`)

Injected by `@convex-dev/auth` — not manually defined. Includes:
- `users` — Admin accounts (email, hashed password)
- `authAccounts` — OAuth/provider account links
- `authSessions` — Active login sessions
- `authVerificationCodes` — Email verification tokens
