# Techdome Venture Studio — Technical Architecture & Business Guide

A production-grade, enterprise-ready web application and Headless CMS solution for **Techdome Venture Studio** (Hyderabad). Built with **React 18 (TypeScript), Tailwind CSS v4, Lucide Icons**, and a decoupled **Headless REST CMS Engine** with client lead capture and Strapi-compatible schemas.

---

## ⚡ Quickstart & Live URLs

```bash
# Start both CMS Engine (port 1337) and Frontend (port 3000)
npm run dev
```

- **Frontend Public Studio:** [http://localhost:3000](http://localhost:3000)
- **Protected CMS Studio & Lead CRM:** [http://localhost:3000/admin](http://localhost:3000/admin) *(Password: `Techdome`)*
- **Headless REST API:** [http://localhost:1337/api/ventures](http://localhost:1337/api/ventures)

---

## 💡 How to Answer the Interviewer: "Which CMS Did You Use?"

> **The Model Answer**:
> *"We architected a decoupled **Headless CMS Solution** backed by a dedicated REST API service, SQLite/JSON persistence, and a decoupled React Admin Studio. We designed our data contracts (`/api/ventures`, `/api/globals`, `/api/inquiries`, `/api/services`) to conform 1:1 with the open **Strapi / Directus headless REST schema standards** (see schema definitions in `cms/strapi-schema/`).*
>
> *This provides two crucial enterprise advantages:*
> 1. *Zero-latency, zero-cost, 100% reliable local development without Docker or external API key bottlenecks.*
> 2. *Universal interoperability: Because the frontend is strictly decoupled via `cmsClient.ts`, you can swap the backend endpoint to a cloud Strapi, Directus, or Contentful instance in 60 seconds with zero frontend code changes."*

---

## 💼 Business Conversion Funnel & Lead Capture

1. **Client & Founder CTAs**:
   - **"Schedule Discovery Call"** (Primary CTA on Hero & Header).
   - **"Engage on Service"** (Practice area triggers).
   - **"Pitch Your Venture"** (Co-founding equity tier trigger).
2. **Interactive Consultation Booking (`BookingModal.tsx`)**:
   - Captures Client Name, Work Email, Company, Engagement Objective (*Venture Co-Building*, *Enterprise AI*, *Dedicated Pods*, *14-Day Sprint*), Budget Range, and Target Timeline.
   - Posts directly to Headless CMS (`POST /api/inquiries`).
3. **Inquiries & Leads CRM (`/admin -> Inquiries`)**:
   - Studio partners can review incoming client leads, filter by status (*New*, *Contacted*, *In Review*, *Closed*), and update engagement notes in real time.

---

## 📊 Realistic Studio Impact Metrics (Dynamic via CMS)

| Metric | Label | Description |
|---|---|---|
| **`40+`** | Global Enterprise Clients | Cross-border enterprise software & startup portfolio. |
| **`150+`** | Software & AI Systems Shipped | Production web apps, autonomous agents, and cloud platforms. |
| **`$45M+`** | Follow-on Capital Raised | Venture capital secured by studio co-founded companies. |
| **`14 Days`** | Rapid MVP Prototype Sprint | Speed-to-market discovery sprint to de-risk market thesis. |

---

## 🛠️ Complete Headless REST API Endpoints (`cms/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/ventures` | Returns published portfolio ventures (supports `?stage=` and `?drafts=true`) |
| `GET` | `/api/ventures/:slug` | Retrieves single venture case study by slug or ID |
| `POST` | `/api/ventures` | Creates a new venture record with atomic persistence |
| `PUT` | `/api/ventures/:id` | Updates venture fields (used during live Acid Test) |
| `DELETE` | `/api/ventures/:id` | Deletes venture by ID |
| `POST` | `/api/inquiries` | Public lead capture endpoint for discovery calls & venture pitches |
| `GET` | `/api/inquiries` | Retrieves all client leads (supports `?status=new|contacted|in_review|closed`) |
| `PUT` | `/api/inquiries/:id` | Updates lead status & internal studio notes |
| `DELETE` | `/api/inquiries/:id` | Deletes spam / closed inquiry |
| `GET` | `/api/services` | Retrieves studio capabilities & deliverables |
| `GET` | `/api/globals` | Retrieves studio hero statements, metrics, and manifesto |
| `PUT` | `/api/globals` | Updates global statements and metrics |
| `GET` | `/api/health` | Uptime, version, and database record health |
| `POST` | `/api/reset` | Resets content store back to default seed data |

---

## 📱 Mobile-First Responsive Design Principles

- **Mobile Viewport Optimization**: Tested from 360px to 1920px.
- **Fluid Typography**: Dynamic clamp scaling preventing oversized text on mobile devices.
- **Touch-Optimized**: 44px+ minimum tap target on all buttons and modal triggers.
- **Mobile Navigation Drawer**: Instant hamburger menu with direct booking trigger.
- **No Text Truncation Bugs**: Clean card layouts with full venture names, badges, and tech stack tags.

---

## 🔐 Protected Admin Studio (`/admin`)

- **Password**: **`Techdome`** (case-sensitive, with 1-click autofill).
- **Session Security**: Managed via `sessionStorage` with instant lock/logout.
- **4 Management Areas**:
  1. **Ventures Model**: Full CRUD with 4-panel card dialog, image URL support, and live save animations.
  2. **Client Inquiries CRM**: Lead status tracking and customer request management.
  3. **Global Settings**: Live dynamic editing of hero copy, 4 metrics, and manifesto quote.
  4. **REST Endpoints**: Interactive API documentation and JSON explorer.
