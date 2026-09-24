# MEPac — Getting Started

## Prerequisites

- **Node.js** ≥ 18 — [nodejs.org](https://nodejs.org/)
- **npm** ≥ 9
- **Convex account** — [convex.dev](https://convex.dev/) (free tier works for development)

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ibnujaleel/MEPac.git
cd MEPac

# 2. Install all workspace dependencies (both apps)
npm install

# 3. Initialize the Convex backend (follow CLI prompts to log in and link/create a project)
npm run dev:convex

# 4. Start both applications concurrently
npm run dev
```

After running `npm run dev`:
- **Admin Console**: [http://localhost:5173](http://localhost:5173)
- **Field PWA**: [http://localhost:5174](http://localhost:5174)

---

## Environment Variables

Both apps require a Convex deployment URL in their `.env.local` files. These are created automatically by `npx convex dev`, but you can also create them manually.

### `mepac-admin/.env.local`

```env
VITE_CONVEX_URL=https://<your-project>.convex.cloud
VITE_CONVEX_SITE_URL=https://<your-project>.convex.site
```

### `mepac-pwa/.env.local`

```env
VITE_CONVEX_URL=https://<your-project>.convex.cloud
VITE_CONVEX_SITE_URL=https://<your-project>.convex.site
```

> **Note**: `.env.local` files are git-ignored and will never be committed.

---

## First-Time Setup

### Owner Account

The Owner account (`admin@riverrtech.com`) must be created first via the Convex dashboard or by signing up directly on the login page. This account has elevated privileges:
- Invite new administrators by email
- Revoke pending invitations
- Remove existing admin accounts

All other admin accounts are created via the invite flow — the Owner sends an email invite, and the recipient sets their own password on first login.

### Worker Accounts

Workers are created through the Admin Console's **Workforce** module:
1. Add worker with name, role, mobile number, and optional PIN
2. If no PIN is set, the last 6 digits of the mobile number become the default PIN
3. The worker logs in via the Field PWA using their mobile number + PIN
4. On first login, they are prompted to set a personal PIN

---

## Available Scripts

All commands run from the workspace root (`MEPac/`):

| Command | Description |
|---|---|
| `npm run dev` | Start both Admin Console and Field PWA concurrently |
| `npm run dev:admin` | Start Admin Console only → `http://localhost:5173` |
| `npm run dev:pwa` | Start Field PWA only → `http://localhost:5174` |
| `npm run dev:convex` | Start Convex backend dev watcher (schema push + function reload) |
| `npm run build` | Production builds for both applications |
| `npm run build:admin` | Production build for Admin Console only |
| `npm run build:pwa` | Production build for Field PWA (includes service worker generation) |
| `npm run lint` | Run Oxlint across both packages |

---

## Deployment

Both apps are deployed to **Vercel** as SPAs. Each has a `vercel.json` that rewrites all routes to `index.html`, allowing client-side routing to handle navigation:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The Convex backend is deployed separately via:

```bash
npx convex deploy
```
