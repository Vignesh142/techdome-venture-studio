const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

// Default initial seed data with enterprise business copy and realistic metrics
const initialSeed = {
  globals: {
    studio_name: "Techdome Venture Studio",
    hero_eyebrow: "VENTURE STUDIO · PRODUCT ENGINEERING FOUNDRY",
    hero_headline: "We Co-Found & Engineer High-Conviction Software Ventures.",
    hero_subline: "Techdome acts as your institutional technical co-founder — deploying capital, modern AI architecture, and dedicated engineering pods to launch generation-defining software companies from Day 0.",
    stats_clients_val: "40+",
    stats_clients_label: "Global Enterprise Clients",
    stats_delivered_val: "150+",
    stats_delivered_label: "Software & AI Systems Shipped",
    stats_capital_val: "$45M+",
    stats_capital_label: "Follow-on Capital Raised",
    stats_speed_val: "14 Days",
    stats_speed_label: "Rapid MVP Prototype Sprint",
    manifesto_headline: "ENGINEERING OVER PITCH DECKS",
    manifesto_quote: "We don't just advise — we build production code, train proprietary models, architect resilient cloud infrastructure, and co-own the technical risk.",
    contact_email: "partnerships@techdome.net.in",
    location: "Hyderabad, India · Global Remote Pods",
    studio_website: "https://techdome.net.in",
    updatedAt: new Date().toISOString()
  },
  services: [
    {
      id: 1,
      title: "Venture Co-Founding",
      slug: "venture-co-founding",
      tagline: "From Day-0 Idea to Seed & Series A",
      description: "We partner with visionary domain founders to provide full-stack technical leadership, initial seed capital, architecture, and go-to-market execution.",
      deliverables: ["Technical Architecture", "Full-Stack MVP", "Go-To-Market Engine", "Investor Network"],
      icon: "rocket",
      highlight: "High Conviction"
    },
    {
      id: 2,
      title: "Enterprise AI & Cloud Foundry",
      slug: "enterprise-ai-cloud",
      tagline: "Autonomous Agents, LLMs & Distributed Systems",
      description: "Custom AI pipeline development, private LLM fine-tuning, retrieval systems (RAG), and zero-trust cloud infrastructure engineered for enterprise compliance.",
      deliverables: ["Private LLM Deployment", "Autonomous Workflows", "Multi-Tenant Architecture", "SOC2 / HIPAA Compliance"],
      icon: "cpu",
      highlight: "Enterprise Scale"
    },
    {
      id: 3,
      title: "Dedicated Engineering Pods",
      slug: "dedicated-engineering-pods",
      tagline: "High-Velocity Embedded Product Teams",
      description: "Scale your roadmap with elite dedicated pods of senior engineers, product designers, and QA leads fully integrated into your sprint cycles.",
      deliverables: ["Fractional CTO / Lead", "Senior Full-Stack Engineers", "Continuous Delivery", "Agile Sprints"],
      icon: "users",
      highlight: "Immediate Scale"
    },
    {
      id: 4,
      title: "Rapid 14-Day MVP Discovery",
      slug: "rapid-mvp-discovery",
      tagline: "De-Risk Market Thesis Before Full Build",
      description: "A fast-paced sprint to validate customer demand, prototype UX flows, test feasibility, and create an investable proof-of-concept.",
      deliverables: ["Clickable Prototype", "Technical Roadmap", "Unit Economics Model", "Architecture Blueprint"],
      icon: "zap",
      highlight: "2-Week Sprint"
    }
  ],
  engagement_models: [
    {
      id: 1,
      title: "Venture Co-Founding",
      badge: "Equity & Shared Risk",
      timeline: "Day 0 → Series A",
      description: "For visionary domain founders seeking an institutional technical co-founder from Day 0.",
      features: [
        "Sweat equity co-building & technical leadership",
        "Day-0 system architecture & production MVP",
        "Seed capital support & cap table formation",
        "Investor network access & Series A readiness"
      ],
      cta: "Pitch Your Venture",
      featured: true
    },
    {
      id: 2,
      title: "Rapid 14-Day MVP Sprint",
      badge: "Fixed Timeline & Scope",
      timeline: "14-Day Sprint",
      description: "De-risk your product thesis with a clickable prototype, unit economics model, and feasibility blueprint in 2 weeks.",
      features: [
        "14-day rapid delivery guarantee",
        "Interactive clickable prototype & UX flows",
        "Technical architecture & cloud feasibility",
        "Unit economics & investor pitch deck artifact"
      ],
      cta: "Book 14-Day Sprint",
      featured: false
    },
    {
      id: 3,
      title: "Enterprise AI & Cloud Foundry",
      badge: "Milestone Sprints",
      timeline: "1 – 3 Months",
      description: "Deploy custom private LLMs, autonomous agent pipelines, and zero-trust cloud foundations.",
      features: [
        "Custom private LLM & agent orchestration",
        "Multi-cloud zero-trust infrastructure",
        "SOC2 / HIPAA standard compliance architecture",
        "Full IP & source code ownership transfer"
      ],
      cta: "Deploy AI Foundry",
      featured: false
    },
    {
      id: 4,
      title: "Dedicated Engineering Pods",
      badge: "Monthly Retainer",
      timeline: "Quarterly Rolling",
      description: "For scaling companies needing elite senior full-stack engineers and fractional technical leadership.",
      features: [
        "Senior engineering pods (2-8 developers)",
        "Direct integration into existing sprint cycles",
        "Fractional CTO / Lead Architect oversight",
        "Flexible 3-month rolling agreements"
      ],
      cta: "Hire an Engineering Pod",
      featured: false
    }
  ],
  ventures: [
    {
      id: 1,
      name: "Kiteflow AI",
      slug: "kiteflow-ai",
      tagline: "Autonomous Cloud Security & Compliance Engine",
      one_liner: "Continuous multi-cloud posture management, AI-driven remediation, and real-time threat intelligence for enterprise infrastructure.",
      stage: "Launched",
      year: "2024",
      metrics: "$3.2M Seed Raised · 85+ Enterprise Clients",
      founders: "Karan S. (Founder) & Techdome Foundry",
      website_url: "https://kiteflow.ai",
      image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      image_symbol: "shield",
      accent_pattern: "mesh",
      tech_stack: ["TypeScript", "Python", "AWS", "PyTorch", "Kubernetes"],
      description: "Kiteflow AI was co-incubated inside Techdome Venture Studio to solve cloud misconfiguration vulnerability at machine speed. By training custom reinforcement learning models on multi-cloud telemetry, Kiteflow detects anomalous infrastructure drift and initiates automated, cryptographically verified remediation in under 300 milliseconds.",
      published: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "OmniGraph",
      slug: "omnigraph",
      tagline: "Distributed Vector Intelligence for Logistics",
      one_liner: "Dynamic topological routing, predictive supply chain intelligence, and real-time freight optimization across international transport corridors.",
      stage: "Building",
      year: "2024",
      metrics: "Live Pilot with 4 Tier-1 Carriers",
      founders: "Vikram R. (Industry Lead) & Techdome Labs",
      website_url: "https://omnigraph.io",
      image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      image_symbol: "network",
      accent_pattern: "rings",
      tech_stack: ["Go", "Rust", "PostgreSQL", "Neo4j", "Kafka"],
      description: "OmniGraph combines real-time geospatial graphs with deep predictive analytics to solve multi-modal freight disruptions before they propagate. Co-founded with logistics veterans, the platform models over 2.4 million daily transit events with millisecond route re-computation.",
      published: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "PulseScale Telemetry",
      slug: "pulsescale-telemetry",
      tagline: "Sub-Millisecond High-Frequency Edge Compute",
      one_liner: "Distributed streaming analytics and edge telemetry processing for mission-critical industrial manufacturing and robotics.",
      stage: "Launched",
      year: "2023",
      metrics: "Acquired by Global Industrial IoT Conglomerate",
      founders: "Techdome Studio Venture Pod",
      website_url: "https://pulsescale.tech",
      image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      image_symbol: "activity",
      accent_pattern: "dots",
      tech_stack: ["C++", "Rust", "WebAssembly", "ClickHouse", "MQTT"],
      description: "PulseScale was engineered from Day-0 as a high-throughput edge daemon designed for embedded hardware environments. The venture reached full operational scale in 11 months before being acquired by a leading global manufacturing automation group.",
      published: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      name: "TensorPay",
      slug: "tensorpay",
      tagline: "Programmable B2B Treasury & Escrow Settlement",
      one_liner: "Instant multi-currency ledger reconciliation, programmatic smart escrows, and automated cross-border treasury management.",
      stage: "Building",
      year: "2024",
      metrics: "$12M Simulated Transaction Volume",
      founders: "Ananya M. (FinTech Lead) & Techdome",
      website_url: "https://tensorpay.financial",
      image_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      image_symbol: "cpu",
      accent_pattern: "mesh",
      tech_stack: ["TypeScript", "Solidity", "Node.js", "Redis", "Docker"],
      description: "TensorPay bridges traditional fiat banking rails with instant programmable escrow logic. Designed for global trade platforms, it reduces transaction reconciliation latency from 72 hours down to 4 seconds while ensuring institutional bank compliance.",
      published: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 5,
      name: "Aetheria Bio",
      slug: "aetheria-bio",
      tagline: "Generative Molecular Design & Protein Simulation",
      one_liner: "Deep learning transformer models accelerating small-molecule candidate screening for oncology therapeutic discoveries.",
      stage: "Building",
      year: "2024",
      metrics: "Pre-Seed Validation with 2 Biotech Labs",
      founders: "Dr. Siddharth N. & Techdome AI Core",
      website_url: "https://aetheriabio.ai",
      image_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
      image_symbol: "database",
      accent_pattern: "dots",
      tech_stack: ["Python", "PyTorch", "CUDA", "Next.js", "FastAPI"],
      description: "Aetheria Bio leverages customized 3D generative diffusion models to simulate binding affinities between small molecules and target protein pockets. The platform reduces initial in-silico screening duration from months to hours.",
      published: true,
      updatedAt: new Date().toISOString()
    }
  ],
  inquiries: [
    {
      id: 1,
      name: "Rahul Verma",
      email: "rahul@healthbridge.io",
      company: "HealthBridge AI",
      project_type: "Venture Co-Founding",
      budget_range: "$50k - $150k",
      timeline: "Immediate (Within 30 Days)",
      message: "Looking for an institutional technical co-founder to build our clinical workflow automation platform. We have initial LOIs from 4 hospital chains in Hyderabad.",
      status: "New",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 2,
      name: "Jennifer Chen",
      email: "j.chen@apexlogistics.com",
      company: "Apex Global Freight",
      project_type: "Enterprise AI & Cloud",
      budget_range: "$50k - $150k",
      timeline: "1 - 3 Months",
      message: "Need dedicated engineering pod to build an autonomous agent pipeline for cross-border customs document verification.",
      status: "Contacted",
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    }
  ]
};

// Database persistence helpers
function readDb() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
      return initialSeed;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.ventures || !parsed.globals) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
      return initialSeed;
    }
    if (!parsed.engagement_models) {
      parsed.engagement_models = initialSeed.engagement_models;
      saveDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('[CMS DB] Read error, resetting to initial seed:', err.message);
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
    return initialSeed;
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[CMS DB] Write error:', err.message);
    return false;
  }
}

// Globals
function getGlobals() {
  const db = readDb();
  return db.globals || initialSeed.globals;
}

function updateGlobals(data) {
  const db = readDb();
  db.globals = {
    ...db.globals,
    ...data,
    updatedAt: new Date().toISOString()
  };
  saveDb(db);
  return db.globals;
}

// Services
function getServices() {
  const db = readDb();
  return db.services || initialSeed.services;
}

function updateService(id, data) {
  const db = readDb();
  const services = db.services || [];
  const index = services.findIndex(s => s.id === parseInt(id, 10));
  if (index === -1) return null;
  services[index] = { ...services[index], ...data };
  db.services = services;
  saveDb(db);
  return services[index];
}

// Engagement Models
function getEngagementModels() {
  const db = readDb();
  return db.engagement_models || initialSeed.engagement_models;
}

function updateEngagementModel(id, data) {
  const db = readDb();
  const models = db.engagement_models || [];
  const index = models.findIndex(m => m.id === parseInt(id, 10));
  if (index === -1) return null;
  models[index] = { ...models[index], ...data };
  db.engagement_models = models;
  saveDb(db);
  return models[index];
}

// Ventures
function getVentures(stageFilter, includeDrafts = false) {
  const db = readDb();
  let ventures = db.ventures || [];
  
  if (!includeDrafts) {
    ventures = ventures.filter(v => v.published !== false);
  }
  
  if (stageFilter && stageFilter !== 'All') {
    ventures = ventures.filter(v => v.stage.toLowerCase() === stageFilter.toLowerCase());
  }
  
  return ventures;
}

function getVentureById(id) {
  const db = readDb();
  const ventures = db.ventures || [];
  return ventures.find(v => v.id === parseInt(id, 10)) || null;
}

function getVentureBySlug(slug) {
  const db = readDb();
  const ventures = db.ventures || [];
  return ventures.find(v => v.slug.toLowerCase() === slug.toLowerCase()) || null;
}

function createVenture(data) {
  const db = readDb();
  const ventures = db.ventures || [];
  
  let slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'untitled-venture');
  
  const existingSlug = ventures.some(v => v.slug === slug);
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  let techStack = [];
  if (Array.isArray(data.tech_stack)) {
    techStack = data.tech_stack;
  } else if (typeof data.tech_stack === 'string') {
    techStack = data.tech_stack.split(',').map(s => s.trim()).filter(Boolean);
  }

  const newVenture = {
    id: ventures.length > 0 ? Math.max(...ventures.map(v => v.id)) + 1 : 1,
    name: data.name || 'Untitled Venture',
    slug: slug,
    tagline: data.tagline || 'Studio Incubation',
    one_liner: data.one_liner || 'High-conviction venture incubated inside Techdome Foundry.',
    stage: data.stage || 'Building',
    year: data.year || new Date().getFullYear().toString(),
    metrics: data.metrics || 'Pre-Seed Stage',
    founders: data.founders || 'Techdome Venture Studio',
    website_url: data.website_url || 'https://techdome.net.in',
    image_url: data.image_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    image_symbol: data.image_symbol || 'shield',
    accent_pattern: data.accent_pattern || 'mesh',
    tech_stack: techStack.length > 0 ? techStack : ['TypeScript', 'Python', 'AWS'],
    description: data.description || 'Detailed investment thesis and production architecture engineered by Techdome.',
    published: data.published !== undefined ? data.published : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  ventures.push(newVenture);
  db.ventures = ventures;
  saveDb(db);
  return newVenture;
}

function updateVenture(id, data) {
  const db = readDb();
  const ventures = db.ventures || [];
  const index = ventures.findIndex(v => v.id === parseInt(id, 10));
  
  if (index === -1) return null;

  const current = ventures[index];
  
  let techStack = current.tech_stack || [];
  if (Array.isArray(data.tech_stack)) {
    techStack = data.tech_stack;
  } else if (typeof data.tech_stack === 'string') {
    techStack = data.tech_stack.split(',').map(s => s.trim()).filter(Boolean);
  }

  ventures[index] = {
    ...current,
    ...data,
    tech_stack: techStack,
    id: current.id,
    updatedAt: new Date().toISOString()
  };

  db.ventures = ventures;
  saveDb(db);
  return ventures[index];
}

function deleteVenture(id) {
  const db = readDb();
  const ventures = db.ventures || [];
  const filtered = ventures.filter(v => v.id !== parseInt(id, 10));
  
  if (filtered.length === ventures.length) return false;

  db.ventures = filtered;
  saveDb(db);
  return true;
}

// Inquiries & CRM
function getInquiries(statusFilter) {
  const db = readDb();
  const inquiries = db.inquiries || [];
  if (statusFilter && statusFilter !== 'All') {
    return inquiries.filter(i => i.status.toLowerCase() === statusFilter.toLowerCase());
  }
  return inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function createInquiry(data) {
  const db = readDb();
  const inquiries = db.inquiries || [];

  const newInquiry = {
    id: inquiries.length > 0 ? Math.max(...inquiries.map(i => i.id)) + 1 : 1,
    name: data.name || 'Anonymous Lead',
    email: data.email || '',
    company: data.company || 'Not Specified',
    project_type: data.project_type || 'Venture Co-Founding',
    budget_range: data.budget_range || '$25k - $50k',
    timeline: data.timeline || '1 - 3 Months',
    message: data.message || '',
    status: 'New',
    createdAt: new Date().toISOString()
  };

  inquiries.push(newInquiry);
  db.inquiries = inquiries;
  saveDb(db);
  return newInquiry;
}

function updateInquiryStatus(id, status, notes) {
  const db = readDb();
  const inquiries = db.inquiries || [];
  const index = inquiries.findIndex(i => i.id === parseInt(id, 10));
  
  if (index === -1) return null;

  inquiries[index] = {
    ...inquiries[index],
    status: status || inquiries[index].status,
    notes: notes !== undefined ? notes : inquiries[index].notes,
    updatedAt: new Date().toISOString()
  };

  db.inquiries = inquiries;
  saveDb(db);
  return inquiries[index];
}

function deleteInquiry(id) {
  const db = readDb();
  const inquiries = db.inquiries || [];
  const filtered = inquiries.filter(i => i.id !== parseInt(id, 10));
  
  if (filtered.length === inquiries.length) return false;

  db.inquiries = filtered;
  saveDb(db);
  return true;
}

function resetToDefault() {
  saveDb(initialSeed);
  return initialSeed;
}

module.exports = {
  getGlobals,
  updateGlobals,
  getServices,
  updateService,
  getEngagementModels,
  updateEngagementModel,
  getVentures,
  getVentureById,
  getVentureBySlug,
  createVenture,
  updateVenture,
  deleteVenture,
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
  resetToDefault,
  initialSeed
};
