<p align="center">
  <img src="./mepac-admin/public/images/logo.png" alt="MEPac Logo" width="140" />
</p>

<h1 align="center">MEPac — MEP Contracting & Field Workforce Management Platform</h1>

<p align="center">
  <em>Built for <strong>Focus MEP Solution</strong> · Engineered by <strong>RiverrTech</strong></em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Convex-1.42-FF6B35?style=flat-square" />
  <img src="https://img.shields.io/badge/Vite-8.1-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/PWA-Enabled-1E40AF?style=flat-square" />
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" />
</p>

---

MEPac is a full-stack, dual-application operations management platform for MEP (Mechanical, Electrical & Plumbing) contracting companies. It pairs a **web-based Admin Console** with an offline-capable **Field Progressive Web App**, both backed by a shared real-time **Convex Cloud** database.

| Application | Purpose | Port |
|---|---|---|
| **Admin Console** (`mepac-admin`) | Central operations dashboard for managers | `5173` |
| **Field PWA** (`mepac-pwa`) | Mobile app for technicians, foremen, supervisors, and designers | `5174` |
| **Convex Cloud** | Shared real-time serverless backend | Cloud |

---

## Documentation

| Document | Description |
|---|---|
| [01 — Overview](./docs/01-overview.md) | Project background, client, design philosophy, user roles, and team |
| [02 — Architecture](./docs/02-architecture.md) | System architecture, tech stack, data flow, and key design decisions |
| [03 — Database Schema](./docs/03-database-schema.md) | All Convex tables, fields, types, and indexes |
| [04 — Admin Console](./docs/04-admin-console.md) | Auth, RBAC, all modules, design system, and file structure |
| [05 — Field PWA](./docs/05-field-pwa.md) | Auth, role routing, features per role, GPS, PWA config, and file structure |
| [06 — Getting Started](./docs/06-getting-started.md) | Installation, environment variables, scripts, and deployment |

---

## Quick Start

```bash
git clone https://github.com/Ibnujaleel/MEPac.git
cd MEPac
npm install
npm run dev:convex   # Initialize Convex backend
npm run dev          # Start both apps
```

See [Getting Started](./docs/06-getting-started.md) for full setup instructions.

---

## License

**Proprietary Software** — Copyright © 2026 RiverrTech. All Rights Reserved.

Unauthorized copying, distribution, modification, or commercial use is strictly prohibited without prior written consent. See [LICENSE](./LICENSE) for complete terms.
