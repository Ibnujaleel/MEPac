# MEPac — Platform Overview

<p align="center">
  <img src="../mepac-admin/public/images/logo.png" alt="MEPac Logo" width="120" />
</p>

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

## What is MEPac?

**MEPac** (MEP Access & Control) is a full-stack, dual-application operations management platform purpose-built for MEP (Mechanical, Electrical & Plumbing) contracting companies.

It pairs a comprehensive **Admin Web Console** with an offline-capable, mobile-first **Field Progressive Web Application (PWA)**, both driven by a shared reactive **Convex Cloud** backend.

| Application | Purpose | Default Port |
|---|---|---|
| **Admin Console** (`mepac-admin`) | Central operations dashboard for project managers and executives | `5173` |
| **Field PWA** (`mepac-pwa`) | Mobile-first app for technicians, foremen, supervisors, and designers on-site | `5174` |
| **Convex Cloud** | Shared real-time serverless backend with reactive database subscriptions | Cloud |

---

## The Client: Focus MEP Solution

**Focus MEP Solution** is an electrical engineering and MEP contracting company managing multiple concurrent construction sites across varying geographies.

Before MEPac, the company faced a persistent, revenue-impacting operational challenge:

> **"How do we prove — with irrefutable evidence — that our field supervisors and technicians are physically present at assigned construction sites?"**

In the MEP contracting industry, accountability is not optional. Clients demand proof of attendance. Projects span environments with unreliable cellular connectivity, no Wi-Fi access, and extreme conditions. Paper-based sign-in sheets were easily forged. Phone-call check-ins were unverifiable.

---

## Design Philosophy

MEPac follows a **Management by Exception** principle:

> The interface stays clean and unobtrusive during normal operations, but immediately surfaces GPS verification failures, proxy attendance anomalies, blueprint revision conflicts, and unresolved RFIs — so managers act on what matters instead of hunting for problems.

---

## Core Solutions

| Problem | MEPac Solution |
|---|---|
| No proof of physical presence | GPS-geofenced clock-in captures lat/lng/accuracy/timestamp at every attendance action |
| No connectivity in the field | Offline-first PWA shell cached via Workbox service workers — data syncs when connectivity returns |
| Workers clocking in for absentees | Foreman proxy check-in requires explicit reason selection and is flagged in the Admin Console for verification |
| Session sharing between devices | Single-device session enforcement — Convex subscription detects conflicts and presents a blocking reclaim modal |
| End-of-day management delays | Real-time Admin Console dashboards — problems surface as they happen |

---

## User Roles & Access Matrix

| Role | Application | Home Route | Key Capabilities |
|---|---|---|---|
| **Owner** | Admin Console | Dashboard | Full platform control, admin user lifecycle management |
| **Admin** | Admin Console | Dashboard | Project, workforce, attendance, RFI and drawing management |
| **Supervisor** | Field PWA | `/supervisor/home` | Multi-project oversight, RFI/dispute creation, site status |
| **Foreman** | Field PWA | `/foreman/home` | Crew attendance, proxy check-ins, daily task management |
| **Technician** | Field PWA | `/technician/home` | GPS clock-in/out, job details, personal attendance calendar |
| **Designer** | Field PWA | `/designer/projects` | Blueprint upload/revision, discipline filtering, version history |

---

## Team — RiverrTech

| Member | Role | Ownership |
|---|---|---|
| **Alfaaz Abdul Jaleel Kuruniyan** | Product Manager & Integration Lead | Client discovery, requirement engineering, architecture, frontend-backend integration |
| **Joel Benoy** | Backend & Admin Console Lead | Convex schema, serverless mutations/queries, Admin Console UI and business logic |
| **Mohammad Afsal M** | Frontend PWA Developer | React components, PWA configuration, TailwindCSS design, mobile UI/UX |
| **Amal Vinayan** | Deployment & Optimization Specialist | Performance tuning, Convex integration testing, production deployment pipelines |
