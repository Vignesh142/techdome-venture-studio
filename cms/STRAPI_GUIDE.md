# 🚀 Techdome Headless CMS & Strapi Architecture Guide

This guide provides complete technical answers and architecture blueprints for **Techdome Venture Studio's Headless CMS layer**.

---

## 🏆 1. Why Strapi Over Other Headless CMS Choices?

When asked by Rahul Joshi (CEO) or technical interviewers: **"Why Strapi?"**, here is the structured, architectural rationale:

| Dimension | **Strapi (Our Choice)** | **Sanity / Contentful** | **WordPress / Monolithic** |
|---|---|---|---|
| **Data Ownership & Privacy** | **100% Self-Hosted & Open Source** (Zero vendor lock-in). Data stays inside Techdome's VPC/AWS. | Hosted on third-party cloud. Data leaves your cloud perimeter. | Monolithic SQL tightly coupled with PHP UI. |
| **Pricing & Cost Structure** | **$0 / Unlimited API Calls & Seats**. Scales with your own server compute. | $300–$1,000+/mo as team size and API calls grow (Per-seat pricing). | Free but expensive plugin bloat and heavy maintenance. |
| **API Flexibility** | Auto-generates **both REST and GraphQL** endpoints with OpenAPI/Swagger docs out of the box. | Proprietary query languages (GROQ) or REST. | REST endpoints wrapped around legacy post types. |
| **Draft & Publish Engine** | Native **Draft / Published lifecycle** with granular RBAC (Role-Based Access Control). | Paid add-on tier on some cloud providers. | Basic draft status without API token isolation. |
| **Developer Extensibility** | Pure **Node.js / TypeScript**. Custom controllers, lifecycle hooks, cron jobs, and database migrations. | Proprietary cloud schema configs. | PHP / Custom themes. |
| **AWS & Cloud Compatibility** | Runs anywhere via Docker on **AWS ECS / EKS, Railway, Render, or EC2 + RDS PostgreSQL**. | Cloud SaaS only. | Traditional LAMP stack. |

---

## ⚡ 2. Universal API Compatibility in Techdome Frontend

The frontend (`frontend/src/api/cmsClient.ts`) contains a **Universal Headless CMS Normalizer**. It seamlessly handles:
- **Local Techdome CMS Engine** (default on `http://localhost:1337`)
- **Strapi v4 & v5** (Self-hosted or Strapi Cloud with Bearer token authentication)
- **Directus**

### To point the frontend to a live Strapi instance:
1. Create a `.env` in `frontend/`:
```env
VITE_CMS_URL=https://your-strapi-app.com
VITE_CMS_TOKEN=your_strapi_api_token_here
```
2. The frontend will automatically unwrap Strapi's `{ data: [{ id, attributes }] }` structure and render without code changes!

---

## 📦 3. Pre-Configured Strapi Schemas

All Strapi Collection and Single Types are ready to import in `cms/strapi-schema/`:

1. **Ventures Collection** (`cms/strapi-schema/ventures.json`):
   - `name` (String, Required)
   - `slug` (UID, Auto-generated from name)
   - `tagline` (String)
   - `one_liner` (String, Required)
   - `stage` (Enumeration: `Building` | `Launched` | `Exited`)
   - `year` (String)
   - `metrics` (String)
   - `founders` (String)
   - `website_url` (String)
   - `image_url` (String)
   - `image_symbol` (String: `shield` | `network` | `activity` | `cpu` | `database`)
   - `tech_stack` (JSON array: `["TypeScript", "Python", "AWS"]`)
   - `description` (Text / RichText)

2. **Global Settings Single Type** (`cms/strapi-schema/globals.json`):
   - Hero headlines, category eyebrow, subline narrative, and 4 core business metrics.

3. **Practice Areas Collection** (`cms/strapi-schema/services.json`):
   - Title, slug, tagline, description, deliverables JSON, and highlight tags.

4. **Engagement Models Collection** (`cms/strapi-schema/engagement-models.json`):
   - Title, badge, timeline, description, features JSON, CTA label, and featured flag.

5. **Client Inquiries Collection** (`cms/strapi-schema/inquiries.json`):
   - Lead capture from the `#contact` discovery consultation form.

---

## ☁️ 4. Production Deployment Architecture (AWS)

```
[ Frontend (Vercel / AWS CloudFront + S3) ]
                     │
                     ▼ HTTPS (REST / JSON)
[ AWS Application Load Balancer ]
                     │
                     ▼
[ AWS ECS / Fargate Container (Strapi / Node CMS) ]
         │                               │
         ▼                               ▼
[ AWS RDS (PostgreSQL 16) ]     [ AWS S3 Bucket (Media) ]
```
