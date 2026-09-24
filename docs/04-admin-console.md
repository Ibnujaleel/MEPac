# MEPac — Admin Console

The Admin Console (`mepac-admin`) is the operations command centre for company executives and project managers. It is a React Single Page Application served at port `5173`.

---

## Authentication & Access Control

### Login Flow

The login page presents a progressive, three-step flow:

1. **Email step** — User enters their email. The app checks:
   - If the email is in `invitedAdmins` → shows "Set your password" (new admin)
   - Otherwise → shows standard password entry (returning admin)
2. **Password / Set Password step** — Convex Auth handles sign-in or sign-up.
3. **Invite consumption** — On first sign-up, `adminUsers.consumeInvite` is called immediately, deleting the invite record to prevent reuse.

### Role-Based Access Control (RBAC)

Two roles exist within the Admin Console:

| Role | Email | Capabilities |
|---|---|---|
| **Owner** | `admin@riverrtech.com` | Full access including admin user management (invite, revoke, remove) |
| **Admin** | Any other invited email | Full access to all operational modules; cannot manage other admin users |

RBAC is enforced at **two layers**:
- **UI layer**: Invite form and Remove/Revoke buttons are conditionally hidden.
- **Backend layer**: All sensitive mutations (`invite`, `revokeInvite`, `removeAdmin`) verify the caller's email against `admin@riverrtech.com` and throw a `ConvexError` if unauthorized.

### Invite Lifecycle

```
Owner sends invite
    → email inserted into invitedAdmins table

New admin visits login page
    → app queries checkIsInvited(email)
    → "Set Password" form presented

New admin submits password
    → Convex Auth creates user account
    → consumeInvite(email) called immediately
    → invite record deleted

If admin is later removed
    → user record deleted
    → invite is already gone — re-registration is impossible
```

---

## Modules

### Dashboard

- Live KPIs: active projects, on-site workforce count, today's attendance rate
- Quick navigation tiles to all major modules
- Recent activity feed

### Projects Hub

- List of all active and completed projects
- Create projects with: name, client, location name, GPS coordinates (via map picker), and site image
- Edit or archive (mark as completed) projects
- Reopen completed projects

### Project Detail

- Per-project deep-dive view
- Manage worker assignments for the project
- View project-specific attendance records, blueprints, and RFIs
- GPS geofence preview on an embedded map

### Workforce

- Global worker registry
- Add workers: name, role (Supervisor / Foreman / Technician / Designer), mobile number, admin-set PIN
- Edit worker details and PIN
- View default PIN and reset worker PIN to admin default
- Assign/unassign workers to projects

### Attendance Log

| Column | Description |
|---|---|
| Worker | Name and role |
| Project | Which site |
| Clock In / Clock Out | Timestamps |
| Type | Self · Proxy · Manual · Manual Override |
| Status | Verified · Pending Approval · On Site · Completed |

- Filter by date, project, and status
- Visual flag for Proxy records requiring review
- Monthly calendar view per worker

### Drawings (Blueprints)

- Per-project blueprint vault
- Categories: Electrical, Plumbing, HVAC, Fire Protection, Architectural, Other
- Upload new blueprints or new revisions to existing ones
- Maximum 3 revisions retained per blueprint (FIFO — oldest deleted automatically)
- Pin a specific revision as the current active version
- Version history with uploader name, role, timestamp, and revision notes

### RFIs & Disputes

- Unified ticket management for RFIs and Disputes
- Status lifecycle: `OPEN` → `IN PROGRESS` → `FLAGGED FOR ADMIN REVIEW` → `RESOLVED`
- Priority levels: High / Medium / Low
- Auto-generated reference codes (e.g. `RFI-001`)
- Filter by type, status, project, and priority

### Settings

- **Company Profile**: name, email, phone, address, logo
- **Shift Hours**: start time, end time, late buffer, auto-absent threshold
- **Work Week**: toggle individual days
- **Holidays**: add/remove holiday dates
- **GPS Enforcement**: enable/disable geofencing, set radius in metres
- **Alert Thresholds**: silent site alert, proxy reminder, dispute resolution SLA
- **Attendance Rules**: require photo, allow self clock-in, require reason for proxy/manual

### Admin Management (Owner Only)

- **Invite Administrator**: send invite by email (blocked if email already has an account or pending invite)
- **Pending Invites**: list of unaccepted invites with option to revoke
- **Active Administrators**: list with Owner/Admin role badges, option to remove (non-Owner only)

---

## Technical Details

### Routing

Hash-based SPA routing: `http://localhost:5173/#view=dashboard`

Navigation is handled by reading/writing `window.location.hash`. On logout, the hash is cleared to prevent the next user from landing on the previous user's last page.

### Convex Integration

```javascript
// Reading data (reactive — auto-updates when DB changes)
const projects = useQuery(api.projects.list);

// Writing data (transactional)
const createProject = useMutation(api.projects.create);
await createProject({ name, client, location });
```

### Design System

The entire Admin Console uses a **custom CSS design system** built with CSS custom properties (variables):

```css
:root {
  --accent-blue: #3b82f6;
  --accent-blue-bg: #1e3a5f22;
  --bg-base: #0f172a;
  --bg-surface: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --radius-md: 8px;
}
```

No CSS framework is used. All styles are authored in `src/index.css` (38KB+), providing full visual control and consistent theming across all components.

**Typography:**
- `IBM Plex Sans` — headings and KPI numbers
- `Inter` — body text, tables, labels

### File Structure

```
mepac-admin/
├── convex/              # Central Convex backend (shared with PWA)
│   ├── schema.js        # Database schema & table definitions
│   ├── auth.js          # Convex Auth configuration
│   ├── auth.config.js   # Auth provider setup
│   ├── http.js          # HTTP router for auth endpoints
│   ├── adminUsers.js    # Admin invite/RBAC lifecycle
│   ├── workers.js       # Workforce CRUD, login, session claims
│   ├── projects.js      # Project mutations & queries
│   ├── assignments.js   # Many-to-many project ↔ worker links
│   ├── checkIns.js      # Attendance: clock-in/out, proxy, manual
│   ├── blueprints.js    # Blueprint versioning & FIFO control
│   ├── rfis.js          # RFI/dispute ticket management
│   ├── notifications.js # Stakeholder notification generation
│   └── settings.js      # Company config singleton
├── src/
│   ├── App.jsx          # Hash-based SPA router
│   ├── main.jsx         # Entry: ConvexAuthProvider + ConvexProvider
│   ├── index.css        # Design system (38KB+)
│   ├── components/
│   │   ├── Layout/      # Sidebar, Topbar (with logged-in user info)
│   │   ├── modals/      # AddProjectModal, EditProjectModal, AddWorkerModal, etc.
│   │   ├── auth/        # SessionLockModal
│   │   ├── notifications/ # NotificationsPanel
│   │   ├── LocationPicker.jsx   # Leaflet map + click-to-place + geofence
│   │   └── GeofencePreviewMap.jsx # Read-only geofence radius display
│   └── views/
│       ├── LoginPage.jsx
│       ├── ManageUsers.jsx
│       ├── Dashboard.jsx
│       ├── ProjectsHub.jsx
│       ├── ProjectDetail.jsx
│       ├── Workforce.jsx
│       ├── AttendanceLog.jsx
│       ├── Drawings.jsx
│       ├── RFIs.jsx
│       └── Settings.jsx
├── public/images/       # Static assets (logo.png, map_placeholder.png)
├── vite.config.js       # Port 5173
└── vercel.json          # SPA rewrite rules
```
