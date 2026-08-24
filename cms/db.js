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
      icon: "rocket"
    },
    {
      id: 2,
      title: "Enterprise AI & Cloud Foundry",
      slug: "enterprise-ai-cloud",
      tagline: "Autonomous Agents, LLMs & Distributed Systems",
      description: "Custom AI pipeline development, private LLM fine-tuning, retrieval systems (RAG), and zero-trust cloud infrastructure engineered for enterprise compliance.",
      deliverables: ["Private LLM Deployment", "Autonomous Workflows", "Multi-Tenant Architecture", "SOC2 / HIPAA Compliance"],
      icon: "cpu"
    },
    {
      id: 3,
      title: "Dedicated Engineering Pods",
      slug: "dedicated-engineering-pods",
      tagline: "High-Velocity Embedded Product Teams",
      description: "Scale your roadmap with elite dedicated pods of senior engineers, product designers, and QA leads fully integrated into your sprint cycles.",
      deliverables: ["Fractional CTO / Lead", "Senior Full-Stack Engineers", "Continuous Delivery", "Agile Sprints"],
      icon: "users"
    },
    {
      id: 4,
      title: "Rapid 14-Day MVP Discovery",
      slug: "rapid-mvp-discovery",
      tagline: "De-Risk Market Thesis Before Full Build",
      description: "A fast-paced sprint to validate customer demand, prototype UX flows, test feasibility, and create an investable proof-of-concept.",
      deliverables: ["Clickable Prototype", "Technical Roadmap", "Unit Economics Model", "Architecture Blueprint"],
      icon: "zap"
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
      name: "Synapse Core",
      slug: "synapse-core",
      tagline: "Enterprise Neuro-Symbolic Agent Framework",
      one_liner: "Deterministic execution sandboxes for generative AI agents operating in regulated banking, fintech, and healthcare environments.",
      stage: "Building",
      year: "2025",
      metrics: "Pre-Seed Incubation · Phase 01 Prototype",
      founders: "Ananya P. & Techdome Studio",
      website_url: "https://synapse.techdome.net.in",
      image_url: "",
      image_symbol: "cpu",
      accent_pattern: "matrix",
      tech_stack: ["Python", "FastAPI", "PostgreSQL", "Llama-3", "Docker"],
      description: "Synapse Core bridges unstructured LLM reasoning with deterministic finite state machines, ensuring autonomous enterprise agents never execute hallucinated financial trades or out-of-policy medical workflows.",
      published: true,
      updatedAt: new Date().toISOString()
    }
  ],
  inquiries: [
    {
      id: 1,
      name: "Siddharth Mehta",
      email: "siddharth@fintechventure.com",
      company: "Nexus Capital / Stealth FinTech",
      project_type: "Venture Co-Founding",
      budget_range: "$50k - $150k",
      timeline: "Immediate (Within 30 Days)",
      message: "We are looking for an institutional technical co-founder to build an automated wealth management platform with AI-driven tax harvesting. Interested in discussing equity co-building.",
      status: "New",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 2,
      name: "Rachel Dupont",
      email: "rachel.dupont@logitech-global.io",
      company: "Logitech Global Systems",
      project_type: "Dedicated Engineering Pod",
      budget_range: "$150k+",
      timeline: "1 - 3 Months",
      message: "Need a dedicated senior engineering pod (1 Tech Lead, 3 Full-Stack Engineers) to modernize our real-time warehouse orchestration microservices.",
      status: "Contacted",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ]
};

// Initialize DB file if it doesn't exist
function initDb() {
  if (!fs.existsSync(DATA_FILE)) {
    saveDb(initialSeed);
  }
}

function readDb() {
  try {
    initDb();
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[CMS DB Error] Failed to read database, restoring initial seed:', err);
    saveDb(initialSeed);
    return initialSeed;
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[CMS DB Error] Failed to write database:', err);
    return false;
  }
}

// ====================
// GLOBALS OPERATIONS
// ====================
function getGlobals() {
  const db = readDb();
  return db.globals || initialSeed.globals;
}

function updateGlobals(updates) {
  const db = readDb();
  db.globals = {
    ...db.globals,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveDb(db);
  return db.globals;
}

// ====================
// SERVICES OPERATIONS
// ====================
function getServices() {
  const db = readDb();
  return db.services || initialSeed.services;
}

// ====================
// VENTURES OPERATIONS
// ====================
function getVentures(includeDrafts = false) {
  const db = readDb();
  const ventures = db.ventures || [];
  if (includeDrafts) {
    return ventures;
  }
  return ventures.filter(v => v.published !== false);
}

function getVentureById(id) {
  const db = readDb();
  return (db.ventures || []).find(v => v.id === parseInt(id, 10));
}

function getVentureBySlug(slug, includeDrafts = false) {
  const db = readDb();
  const venture = (db.ventures || []).find(v => v.slug.toLowerCase() === slug.toLowerCase());
  if (!venture) return null;
  if (!includeDrafts && venture.published === false) return null;
  return venture;
}

function createVenture(data) {
  const db = readDb();
  const ventures = db.ventures || [];
  
  let slug = data.slug;
  if (!slug) {
    slug = (data.name || 'untitled')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Ensure unique slug
  let uniqueSlug = slug;
  let counter = 1;
  while (ventures.some(v => v.slug.toLowerCase() === uniqueSlug.toLowerCase())) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  const validStages = ['Building', 'Launched', 'Exited'];
  const stage = validStages.includes(data.stage) ? data.stage : 'Building';

  const newVenture = {
    id: ventures.length > 0 ? Math.max(...ventures.map(v => v.id)) + 1 : 1,
    name: data.name || 'Untitled Venture',
    slug: uniqueSlug,
    tagline: data.tagline || '',
    one_liner: data.one_liner || '',
    stage: stage,
    year: data.year || new Date().getFullYear().toString(),
    metrics: data.metrics || '',
    founders: data.founders || 'Techdome Venture Studio',
    website_url: data.website_url || 'https://techdome.net.in',
    image_url: data.image_url || '',
    image_symbol: data.image_symbol || 'shield',
    accent_pattern: data.accent_pattern || 'mesh',
    tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack : (data.tech_stack ? data.tech_stack.split(',').map(s => s.trim()) : ['TypeScript', 'Node.js', 'React']),
    description: data.description || '',
    published: data.published !== false,
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
  
  if (index === -1) {
    return null;
  }

  const current = ventures[index];
  
  if (data.stage) {
    const validStages = ['Building', 'Launched', 'Exited'];
    if (!validStages.includes(data.stage)) {
      data.stage = current.stage;
    }
  }

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
  
  if (filtered.length === ventures.length) {
    return false;
  }

  db.ventures = filtered;
  saveDb(db);
  return true;
}

// ====================
// INQUIRIES & CRM
// ====================
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

// Reset seed
function resetToDefault() {
  saveDb(initialSeed);
  return initialSeed;
}

module.exports = {
  getGlobals,
  updateGlobals,
  getServices,
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
