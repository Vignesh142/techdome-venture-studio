const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// Default initial seed data with square graphics and studio data
const initialSeed = {
  globals: {
    studio_name: "Techdome Venture Studio",
    hero_eyebrow: "VENTURE STUDIO · HYDERABAD",
    hero_headline: "We co-found and engineer high-conviction software ventures.",
    hero_subline: "Techdome acts as an institutional co-founder — deploying capital, modern technical architecture, and go-to-market acceleration from Day 0.",
    stats_metric_1_val: "6",
    stats_metric_1_label: "Incubated Ventures",
    stats_metric_2_val: "$30M+",
    stats_metric_2_label: "Follow-on Raised",
    stats_metric_3_val: "100%",
    stats_metric_3_label: "Zero-to-One Delivery",
    manifesto_headline: "Engineering Over Pitch Decks",
    manifesto_quote: "We don't just advise — we write production code, design scalable infrastructure, and architect resilient software that survives the market.",
    contact_email: "contact@techdome.net.in",
    location: "Hyderabad, India",
    studio_website: "https://techdome.net.in",
    updatedAt: new Date().toISOString()
  },
  ventures: [
    {
      id: 1,
      name: "Kiteflow AI",
      slug: "kiteflow-ai",
      tagline: "Autonomous Cloud Security & Compliance",
      one_liner: "Continuous compliance and audit readiness engine for SOC2, ISO27001, and HIPAA in fintech startups.",
      stage: "Launched",
      year: "2024",
      metrics: "$2.4M Seed · 140+ Customers",
      founders: "Karan Singhania & Techdome Studio",
      website_url: "https://kiteflow.techdome.net.in",
      image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      image_symbol: "shield",
      accent_pattern: "mesh",
      description: "Kiteflow AI removes the friction of enterprise security audits by automating evidence collection, cloud posture management, and vendor risk assessments. Built with Techdome's enterprise security framework, Kiteflow monitors AWS, GCP, and Azure environments in real-time, cutting compliance timelines from months to hours.\n\nThe platform combines deterministic policy evaluation with contextual LLM reasoning to identify configuration drifts and generate audit-ready documentation automatically.",
      published: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "OmniGraph",
      slug: "omnigraph",
      tagline: "Vector-Graph Hybrid Engine",
      one_liner: "Real-time hybrid graph database for enterprise multi-agent reasoning and retrieval-augmented workflows.",
      stage: "Building",
      year: "2025",
      metrics: "Private Alpha · 12 Design Partners",
      founders: "Dr. Ananya Rao & Techdome Labs",
      website_url: "https://omnigraph.techdome.net.in",
      image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      image_symbol: "network",
      accent_pattern: "dots",
      description: "OmniGraph bridges high-dimensional embedding search with structural graph relationships. Designed for autonomous AI agents requiring deep multi-hop reasoning, OmniGraph maintains continuous contextual awareness across distributed enterprise databases.\n\nCurrently in stealth incubation at Techdome Studio, OmniGraph powers real-time knowledge synthesis for legal, medical, and financial services institutions.",
      published: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "PulseScale Telemetry",
      slug: "pulsescale-telemetry",
      tagline: "Edge Observability & Latency Tracing",
      one_liner: "Developer-first telemetry platform providing sub-millisecond distributed tracing for edge functions.",
      stage: "Exited",
      year: "2023",
      metrics: "Acquired by CloudScale · $18M",
      founders: "Vikram Mehta & Techdome Studio",
      website_url: "https://pulsescale.techdome.net.in",
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      image_symbol: "activity",
      accent_pattern: "waves",
      description: "PulseScale was conceived and engineered inside Techdome to solve edge observability bottlenecks for serverless applications. With a lightweight eBPF-based collector and intelligent sampling algorithms, PulseScale provided unprecedented visibility into distributed edge runtimes.\n\nFollowing rapid adoption across 50,000+ developers, PulseScale was successfully acquired by CloudScale Inc. in late 2024.",
      published: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      name: "Synapse Core",
      slug: "synapse-core",
      tagline: "Zero-Knowledge Hardware Accelerator",
      one_liner: "High-throughput cryptographic compute engine accelerating ZK-proof generation for institutional DeFi protocols.",
      stage: "Building",
      year: "2025",
      metrics: "Pre-Seed · $1.8M Committed",
      founders: "Rohan Deshmukh & Techdome Studio",
      website_url: "https://synapse.techdome.net.in",
      image_url: "",
      image_symbol: "cpu",
      accent_pattern: "mesh",
      description: "Synapse Core is a next-generation zero-knowledge hardware acceleration framework. Engineered in collaboration with leading cryptography researchers, Synapse Core compiles complex arithmetic circuits into optimized FPGA and GPU kernels, reducing proof verification latency by 40x.\n\nIncubated in Techdome's systems lab, Synapse is currently deployed with Tier-1 institutional liquidity providers.",
      published: true,
      updatedAt: new Date().toISOString()
    }
  ]
};

function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
  }
}

function readDB() {
  initDB();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file, returning initial seed:', err);
    return initialSeed;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to database file:', err);
    return false;
  }
}

const db = {
  getGlobals: () => {
    const data = readDB();
    return data.globals || initialSeed.globals;
  },

  updateGlobals: (newGlobals) => {
    const data = readDB();
    data.globals = {
      ...data.globals,
      ...newGlobals,
      updatedAt: new Date().toISOString()
    };
    writeDB(data);
    return data.globals;
  },

  getVentures: (includeDrafts = false) => {
    const data = readDB();
    const ventures = data.ventures || [];
    if (includeDrafts) {
      return ventures;
    }
    return ventures.filter(v => v.published !== false);
  },

  getVentureBySlug: (slug, includeDrafts = false) => {
    const data = readDB();
    const ventures = data.ventures || [];
    return ventures.find(v => v.slug === slug && (includeDrafts || v.published !== false));
  },

  getVentureById: (id) => {
    const data = readDB();
    const ventures = data.ventures || [];
    return ventures.find(v => v.id === parseInt(id, 10));
  },

  createVenture: (ventureData) => {
    const data = readDB();
    const ventures = data.ventures || [];
    const newId = ventures.length > 0 ? Math.max(...ventures.map(v => v.id)) + 1 : 1;
    const slug = ventureData.slug || ventureData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newVenture = {
      id: newId,
      name: ventureData.name || "Untitled Venture",
      slug: slug,
      tagline: ventureData.tagline || "Venture Studio Product",
      one_liner: ventureData.one_liner || "",
      stage: ['Building', 'Launched', 'Exited'].includes(ventureData.stage) ? ventureData.stage : 'Building',
      year: ventureData.year || new Date().getFullYear().toString(),
      metrics: ventureData.metrics || "",
      founders: ventureData.founders || "Techdome Venture Studio",
      website_url: ventureData.website_url || "https://techdome.net.in",
      image_url: ventureData.image_url || "",
      image_symbol: ventureData.image_symbol || "shield",
      accent_pattern: ventureData.accent_pattern || "mesh",
      description: ventureData.description || "",
      published: ventureData.published !== undefined ? Boolean(ventureData.published) : true,
      updatedAt: new Date().toISOString()
    };

    ventures.push(newVenture);
    data.ventures = ventures;
    writeDB(data);
    return newVenture;
  },

  updateVenture: (id, updateData) => {
    const data = readDB();
    const ventures = data.ventures || [];
    const index = ventures.findIndex(v => v.id === parseInt(id, 10));
    
    if (index === -1) {
      return null;
    }

    const current = ventures[index];
    const updated = {
      ...current,
      ...updateData,
      id: current.id,
      updatedAt: new Date().toISOString()
    };

    if (updateData.stage && ['Building', 'Launched', 'Exited'].includes(updateData.stage)) {
      updated.stage = updateData.stage;
    }

    ventures[index] = updated;
    data.ventures = ventures;
    writeDB(data);
    return updated;
  },

  deleteVenture: (id) => {
    const data = readDB();
    const ventures = data.ventures || [];
    const index = ventures.findIndex(v => v.id === parseInt(id, 10));
    if (index === -1) return false;
    
    ventures.splice(index, 1);
    data.ventures = ventures;
    writeDB(data);
    return true;
  },

  resetToDefault: () => {
    writeDB(initialSeed);
    return initialSeed;
  }
};

initDB();

module.exports = db;
