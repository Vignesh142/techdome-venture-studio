# Techdome Venture Studio — Technical Architecture & Study Guide

A production-grade, minimal editorial web application built for the **Techdome Venture Studio** live technical assessment. The application features a **TypeScript React frontend**, an **in-app protected CMS Studio (`/admin`)**, and a **lightweight, sub-millisecond Headless REST API backend**.

---

## ⚡ Quickstart & Local Runner

### 1. Installation
```bash
# From repository root
npm install
cd cms && npm install
cd ../frontend && npm install
cd ..
```

### 2. Start Dev Servers Concurrently
```bash
npm run dev
```
- **Public Studio Website:** [http://localhost:3000](http://localhost:3000)
- **Protected CMS Studio:** [http://localhost:3000/admin](http://localhost:3000/admin) *(Password: `Techdome`)*
- **Headless REST API:** [http://localhost:1337/api/ventures](http://localhost:1337/api/ventures)

---

## 🏛️ System Architecture Overview

```
Techdome Venture Studio
├── cms/ (Headless REST Engine · Port 1337)
│   ├── server.js          # Express.js REST API Server (CORS, JSON parser, routes)
│   ├── db.js              # Persistence engine with CRUD & stage enum validation
│   ├── data.json          # Atomic SQLite-like JSON data store
│   └── public/            # Fallback static admin portal (admin.html, admin.css)
│
└── frontend/ (Vite + React 18 + TypeScript · Port 3000)
    ├── src/
    │   ├── api/
    │   │   └── cmsClient.ts       # Typed API client with custom CmsApiError catching
    │   ├── types/
    │   │   └── index.ts           # Strict TypeScript contracts (Venture, GlobalSettings)
    │   ├── components/
    │   │   ├── Header.tsx         # Universal glass navbar with live CMS health indicator
    │   │   ├── Hero.tsx           # Dynamic CMS-driven hero statements & 3 traction cards
    │   │   ├── FeaturedCarousel.tsx # Hardware-accelerated smooth slide showcase
    │   │   ├── StageFilterBar.tsx # Monochrome stage filter tabs with count chips
    │   │   ├── VentureCard.tsx    # 3D tilt hover elevation card with image/symbol
    │   │   ├── StageBadge.tsx     # Building, Launched, and Exited stage badges
    │   │   ├── StageTracker.tsx   # 3-phase venture lifecycle pipeline monitor
    │   │   ├── StudioPillars.tsx  # Operating model capabilities (How We Build)
    │   │   ├── VentureVisual.tsx  # Real image renderer + Generative SVG blueprint fallback
    │   │   ├── CmsErrorBanner.tsx # Offline error boundary with reconnect diagnostics
    │   │   └── Footer.tsx         # Studio metadata & REST endpoint explorer links
    │   ├── pages/
    │   │   ├── HomePage.tsx       # Main index aggregating hero, carousel, grid & pillars
    │   │   ├── VentureDetailPage.tsx # Slug-routed deep thesis reader (/ventures/:slug)
    │   │   └── AdminPage.tsx      # Full-height sidebar CMS Studio with password guard
    │   ├── App.tsx                # History API client router & root layout
    │   └── index.css              # Tailwind CSS v4 design tokens, scrollbars, & utilities
    └── index.html                 # SEO tags, Plus Jakarta Sans & JetBrains Mono fonts
```

---

## 🎨 Global CSS & Design System Architecture

### 1. Editorial Black & White Duality Palette
The design uses an **editorial magazine duality** inspired by *Linear, Apple, Stripe Press, and Vercel*:
- **Background Canvas (`--bg-body`)**: `#FAFAFA` — clean, bright off-white studio surface.
- **Primary Typography (`--text-primary`)**: `#0A0A0A` — deep obsidian black for high-contrast legibility.
- **Card Surfaces (`--bg-surface`)**: `#FFFFFF` with `#E5E5E5` hairline borders and subtle shadow elevations.
- **Secondary Slate (`--text-secondary`)**: `#525252` and `#737373` for subtitles and metadata.
- **Interactive Inversions**: Selected filter pills, primary buttons, and admin badges use solid `#000000` with white text.

### 2. Modern Typography Hierarchy
- **Display Font (`font-display`)**: `Plus Jakarta Sans` — bold, commanding headlines (`text-4xl` to `text-8xl`) with tight letter-spacing (`-0.03em`).
- **Sans Font (`font-sans`)**: `Inter` — ultra-legible body paragraphs and editorial descriptions.
- **Monospace Font (`font-mono`)**: `JetBrains Mono` / `Fira Code` — technical identifiers, route tags (`/ventures/:slug`), traction chips, and stage pills.

### 3. Micro-Animations & Hardware Acceleration
- **3D Card Hover Tilt**: `hover:-translate-y-2 hover:rotate-[0.6deg] hover:shadow-xl` creates subtle tactile elevation when hovering over cards.
- **Hardware-Accelerated Carousel Slide**: The `FeaturedCarousel` uses `duration-500 ease-out animate-in fade-in slide-in-from-right-8` for silky smooth transitions.
- **Real Image & SVG Blueprint Fallback**: `VentureVisual` renders high-res enterprise tech imagery; if no image is supplied (e.g. *Synapse Core*), it seamlessly renders an animated concentric SVG telemetry blueprint with rotating radar rings.

---

## 🛠️ Headless REST API Endpoints (`cms/`)

| Method | Endpoint | Description | Request / Response Payload |
|---|---|---|---|
| `GET` | `/api/ventures` | Returns list of all published ventures (supports `?stage=Building` & `?drafts=true`) | `ApiResponse<Venture[]>` |
| `GET` | `/api/ventures/:slug` | Retrieves single venture by slug identifier or integer ID | `ApiResponse<Venture>` |
| `POST` | `/api/ventures` | Creates a new venture record with atomic persistence | `Body: Partial<Venture>` |
| `PUT` | `/api/ventures/:id` | Updates venture fields (used during live Acid Test) | `Body: Partial<Venture>` |
| `DELETE` | `/api/ventures/:id` | Deletes venture by ID | `ApiResponse<{ message: string }>` |
| `GET` | `/api/globals` | Retrieves studio hero headline, metrics, and manifesto | `ApiResponse<GlobalSettings>` |
| `PUT` | `/api/globals` | Updates global studio statements and traction metrics | `Body: Partial<GlobalSettings>` |
| `GET` | `/api/health` | Service uptime, version, and database record count | `ApiHealthResponse` |
| `POST` | `/api/reset` | Resets content store back to default seed data | `ApiResponse<SeedData>` |

---

## 🔐 Protected Admin Studio (`/admin`)

- **Route Guard**: Visiting `/admin` renders a dedicated **Security Login Screen**.
- **Access Password**: **`Techdome`** (case-sensitive, with 1-click autofill helper for demos).
- **Session Management**: Authenticated state is safely stored in `sessionStorage` (`techdome_admin_auth`).
- **Sidebar & Layout**: Full-height sidebar (`h-screen overflow-hidden`) with mobile hamburger drawer.
- **4-Panel Modal Structure**:
  1. `01 / Core Identity & Routing`: Name, Auto-slug generator, Stage enum, Tagline.
  2. `02 / Studio Positioning & Traction`: One-liner, Capital metrics, Year, Founders, Website URL.
  3. `03 / Visual Media & Emblems`: Real Image URL input + fallback emblem selector.
  4. `04 / Editorial Market Thesis & Live Publishing`: Multi-paragraph description + Draft toggle.
- **Loading Animations**: Animated `Loader2` spinner on submit -> instant checkmark `Saved!` transition.

---

## 🧪 The Acid Test — Live Demonstration Script

When presenting to interviewers, follow this exact sequence:

1. **Open the Homepage**: Navigate to [http://localhost:3000](http://localhost:3000). Show the **Featured Carousel**, the **Portfolio Index**, the **Stage Pipeline Tracker**, and the **Studio Methodology Quote**.
2. **Access CMS Studio**: Click **"CMS Studio"** in the top navigation (or visit [http://localhost:3000/admin](http://localhost:3000/admin)).
3. **Login**: Enter **`Techdome`** and click **Unlock CMS Studio**.
4. **Edit a Venture**: In the Ventures table, click **Edit** on **Kiteflow AI**.
5. **Modify Content**:
   - Change the Name to **"Kiteflow Autonomous AI"**.
   - Change the One-liner or Traction Metric.
   - Click **Save Venture** (observe the live spinner and toast confirmation).
6. **Verify Round-Trip Sync**: Click **"Exit to Public Site"** — the updated name is immediately reflected across the Featured Carousel, Portfolio Grid, Stage Tracker, and Detail Page (`/ventures/kiteflow-ai`).

---

## 💡 Interview Probes & Answers Cheatsheet

### Q1: "Why did you build a local headless REST CMS instead of using Strapi or Contentful?"
> **Answer**: "We opted for a dedicated local SQLite/REST engine because it guarantees sub-millisecond local latency, zero external cloud rate-limiting or network token failures during live evaluation, zero-config instant startup, and fully typed REST endpoints mapped 1:1 to Techdome's domain model without the heavy native build dependencies of monolithic CMS packages."

### Q2: "What happens if the CMS server crashes or is unreachable?"
> **Answer**: "All network calls are wrapped in `cmsClient.ts` with custom `CmsApiError` handling. When the server is offline, the frontend catches the network exception gracefully, retains previously cached state where available, and renders the `CmsErrorBanner` component offering clear offline diagnostics and an interactive 'Retry Connection' button without crashing the React tree."

### Q3: "Where does draft content live in your data model?"
> **Answer**: "Every `Venture` record contains a boolean `published` property. The public REST API (`GET /api/ventures`) defaults to filtering out drafts (`published !== false`). When studio editors need to review unreleased ventures, passing `?drafts=true` or accessing `/admin` displays drafts with distinct visual status pills."

### Q4: "How does the styling system work across light and dark elements?"
> **Answer**: "We built an editorial duality design system using Tailwind CSS v4 tokens in `src/index.css`. The base canvas is an off-white `#FAFAFA` with deep `#0A0A0A` typography for high editorial contrast, combined with solid black buttons, glassmorphic navbars, and interactive square visual cards that support real images with automatic fallback to high-tech generative SVG telemetry blueprints."

### Q5: "What did you deliberately skip, and why?"
> **Answer**: "To deliver a production-ready, fully typed vertical slice within the allotted time, we prioritized the complete round-trip CMS synchronization, slug-based routing, dynamic globals (hero headlines & metrics), responsive mobile navigation, and minimal editorial design over complex rich-text WYSIWYG editors and multi-tenant OAuth role hierarchies."
