---
name: Management by Exception
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#444653'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#003d27'
  on-tertiary: '#ffffff'
  tertiary-container: '#00563a'
  on-tertiary-container: '#3fd298'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  danger: '#EF4444'
  text-primary: '#0F172A'
  text-secondary: '#475569'
  status-on-track-bg: '#D1FAE5'
  status-on-track-text: '#065F46'
  status-delayed-bg: '#FEF3C7'
  status-delayed-text: '#92400E'
  status-at-risk-bg: '#FEE2E2'
  status-at-risk-text: '#991B1B'
  status-disputed-bg: '#E0E7FF'
  status-disputed-text: '#3730A3'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  kpi-metric:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 32px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  table-data:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 250px
  sidebar-collapsed: 64px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  component-gap: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for MEP (Mechanical, Electrical, and Plumbing) contracting management, where operational oversight and real-time awareness are critical. The brand personality is **authoritative, precise, and utilitarian**, designed to reduce cognitive load for busy administrators and business owners.

The visual direction follows a **Corporate / Modern** aesthetic with a strong emphasis on **Management by Exception**. This means the UI remains quiet and neutral under normal conditions but uses strategic high-contrast signals to highlight disputes, proxy check-ins, or project delays.

Key principles include:
- **Clarity over density:** Generous whitespace and a clear information hierarchy to ensure KPIs are readable at a glance.
- **Auditability:** A "read-only" visual language for primary data, with distinct "Corrected" or "Disputed" visual treatments to maintain a clear audit trail.
- **Professional Utility:** A tool-first approach that avoids unnecessary decorative elements in favor of functional data visualization and clear status indicators.

## Colors

The palette is anchored by **Deep Blue (#1E40AF)** to convey stability and professional trust. **Amber (#F59E0B)** serves as the critical secondary color, used specifically for "Management by Exception" items—such as Proxy check-ins and pending disputes—that require administrator attention.

**Status Color Logic:**
- **Success/On Track:** Used for verified attendance and healthy project status.
- **Amber/Delayed:** Used for exceptions requiring review (Proxy/Disputed).
- **Danger/At Risk:** Used for missing data, silent sites, or critical delays.
- **Neutral/Slate:** The background and surface colors use a cool-toned slate palette to keep the interface feeling modern and clean.

Semantic colors for status badges use a "Soft Background / High Contrast Text" pairing to ensure legibility without overwhelming the user when viewing dense data tables.

## Typography

This design system uses a dual-font strategy. **IBM Plex Sans** is utilized for all high-level headings and KPI metrics to provide a structured, engineering-grade feel. **Inter** is used for all body text, UI labels, and data tables due to its exceptional legibility at small sizes.

For data-heavy views (Attendance Logs, Workforce Lists), `tabular figures` (tnum) must be enabled to ensure that numbers align vertically, making it easier for administrators to compare time logs and worker counts. Headings should utilize slightly tighter letter-spacing to maintain a professional, compact appearance.

## Layout & Spacing

The system employs a **fluid-to-fixed grid** model. On desktop, a fixed 250px sidebar persists on the left, while the main content area occupies the remaining width up to a 1440px max-width container.

**Layout Rhythm:**
- **Grid:** A 12-column grid is used for dashboard layouts. KPI cards typically span 3 columns (4 per row) on desktop and 6 columns (2 per row) on tablet.
- **Vertical Spacing:** A standard 8px base unit (4px, 8px, 16px, 24px, 32px, 48px, 64px) governs all margins and padding.
- **Table Density:** Data tables use a 48px row height to balance information density with touch-friendly targets and readability.

**Responsive Behavior:**
- **Tablet (768px - 1023px):** Sidebar collapses to an icon-only rail (64px).
- **Mobile (< 768px):** Sidebar moves to a bottom-navigation or hidden drawer; margins reduce to 16px; data tables enable horizontal scrolling with a sticky first column.

## Elevation & Depth

To maintain the "Management by Exception" ethos, the system uses a **low-contrast, tonal layering** approach rather than heavy shadows. This ensures that when a "Dispute" or "Alert" does appear, it is not lost in a sea of complex depths.

- **Surface Layer (Level 0):** The background uses Slate 50 (#F8FAFC) to provide a soft, non-glare canvas.
- **Card Layer (Level 1):** Primary UI elements (Cards, Tables) use a pure white background with a subtle 1px border (#E2E8F0) and a soft, diffused shadow (0 1px 3px 0 rgba(0, 0, 0, 0.1)).
- **Active/Hover State (Level 2):** On hover, cards lift slightly with a 2px vertical offset and a deepened shadow to indicate interactivity.
- **Modals & Flyouts (Level 3):** These use a more pronounced shadow (0 10px 15px -3px rgba(0, 0, 0, 0.1)) and a background backdrop blur to focus the user on the task at hand.

## Shapes

The design system utilizes a **Rounded (8px / 0.5rem)** shape language. This creates a professional yet approachable aesthetic that aligns with modern SaaS standards like shadcn/ui.

- **Standard Elements:** Buttons, Input Fields, and Cards use the base 8px radius.
- **Large Elements:** Featured "Site Pulse" cards and Modal containers use a 16px (1rem) radius.
- **Status Pills:** Status indicators and badges use a fully rounded "Pill" shape (9999px) to distinguish them from interactive buttons.
- **Interactive States:** Focus rings should follow the 8px radius with a 2px offset to maintain shape harmony.

## Components

### Buttons
- **Primary:** Solid Deep Blue (#1E40AF) with white text. 8px radius.
- **Secondary/Outline:** Deep Blue border and text with a transparent background.
- **Ghost:** No border or background; text only. Used for table row actions.

### Data Tables
- **Styling:** Sticky headers with a Slate 50 background. 1px bottom borders for rows.
- **Proxy Row Styling:** Rows involving proxy attendance receive a light Amber tint (#FEF3C7) to trigger immediate visual recognition.
- **Absent Row Styling:** Greyed-out text with 0.6 opacity to de-emphasize non-actionable data.

### KPI & Metric Cards
- **Structure:** Large IBM Plex Sans bold number at the top, followed by a label and a trend indicator.
- **Alert Variations:** Cards for "Disputes" or "Proxy Review" feature a 4px solid Amber left border to denote priority.

### Status Badges (Pills)
- Status badges must use the semantic color mapping defined in the Colors section.
- Indicators for "Corrected" attendance (e.g., a green dot with a checkmark) are used in the Monthly Calendar to show that an audit event occurred.

### Input Fields
- Clear, 8px rounded borders with Inter 14px text.
- Focused state uses a 2px Blue ring.
- Error states use a Red border (#EF4444) and a supporting error message below the field.

### Attendance Calendar
- A traditional 7-column grid. Each cell is a square containing the date.
- Indicators are small colored dots (Success, Danger, Amber, Grey).
- Selection state for a "Day" uses a subtle Blue outline.