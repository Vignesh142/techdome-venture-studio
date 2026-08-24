const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 1337;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend from localhost:3000, 5173, Vercel, etc.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[CMS ${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ====================
// REST API ENDPOINTS
// ====================

// 1. Health Check
app.get('/api/health', (req, res) => {
  const ventures = db.getVentures(true);
  const inquiries = db.getInquiries();
  res.json({
    status: 'ok',
    service: 'Techdome Headless CMS Engine',
    version: '3.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    records: {
      venturesCount: ventures.length,
      publishedCount: ventures.filter(v => v.published !== false).length,
      inquiriesCount: inquiries.length,
      newInquiriesCount: inquiries.filter(i => i.status === 'New').length
    }
  });
});

// 2. Global Studio Settings
app.get('/api/globals', (req, res) => {
  try {
    const globals = db.getGlobals();
    res.json({
      success: true,
      data: globals
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/globals', (req, res) => {
  try {
    const updated = db.updateGlobals(req.body);
    res.json({
      success: true,
      message: 'Global settings updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Studio Services / Capabilities
app.get('/api/services', (req, res) => {
  try {
    const services = db.getServices();
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/services/:id', (req, res) => {
  try {
    const updated = db.updateService(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: `Service ${req.params.id} not found` });
    }
    res.json({ success: true, message: 'Service updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Engagement Models (Pricing & Partnership Structures)
app.get('/api/engagement-models', (req, res) => {
  try {
    const models = db.getEngagementModels();
    res.json({
      success: true,
      data: models
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/engagement-models/:id', (req, res) => {
  try {
    const updated = db.updateEngagementModel(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: `Model ${req.params.id} not found` });
    }
    res.json({ success: true, message: 'Engagement model updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Ventures Endpoints
app.get('/api/ventures', (req, res) => {
  try {
    const includeDrafts = req.query.drafts === 'true';
    const stageFilter = req.query.stage;
    let ventures = db.getVentures(stageFilter, includeDrafts);

    res.json({
      success: true,
      count: ventures.length,
      data: ventures
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/ventures/:slugOrId', (req, res) => {
  try {
    const param = req.params.slugOrId;
    const includeDrafts = req.query.drafts === 'true';
    
    let venture = null;
    if (/^\d+$/.test(param)) {
      venture = db.getVentureById(param);
    } else {
      venture = db.getVentureBySlug(param, includeDrafts);
    }

    if (!venture) {
      return res.status(404).json({
        success: false,
        error: `Venture not found with identifier '${param}'`
      });
    }

    res.json({
      success: true,
      data: venture
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/ventures', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Venture name is required' });
    }

    const created = db.createVenture(req.body);
    res.status(201).json({
      success: true,
      message: 'Venture created successfully',
      data: created
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/ventures/:id', (req, res) => {
  try {
    const id = req.params.id;
    const updated = db.updateVenture(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Venture with id ${id} not found`
      });
    }

    res.json({
      success: true,
      message: 'Venture updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/ventures/:id', (req, res) => {
  try {
    const id = req.params.id;
    const success = db.deleteVenture(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: `Venture with id ${id} not found`
      });
    }

    res.json({
      success: true,
      message: `Venture ${id} deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Inquiries & Client Leads Endpoints (CRM)
app.get('/api/inquiries', (req, res) => {
  try {
    const statusFilter = req.query.status;
    const inquiries = db.getInquiries(statusFilter);
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/inquiries', (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const created = db.createInquiry(req.body);
    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully. A Techdome partner will reach out within 24 hours.',
      data: created
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/inquiries/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { status, notes } = req.body;
    const updated = db.updateInquiryStatus(id, status, notes);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Inquiry with id ${id} not found`
      });
    }

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/inquiries/:id', (req, res) => {
  try {
    const id = req.params.id;
    const success = db.deleteInquiry(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: `Inquiry with id ${id} not found`
      });
    }

    res.json({
      success: true,
      message: `Inquiry ${id} deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Reset DB to seed
app.post('/api/reset', (req, res) => {
  try {
    const seed = db.resetToDefault();
    res.json({
      success: true,
      message: 'Database content reset to default seed',
      data: seed
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Catch-all
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Export app for Vercel serverless functions
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🚀 Techdome Headless CMS Engine Running`);
    console.log(`  📡 REST API:    http://localhost:${PORT}/api`);
    console.log(`  🎛️  Admin Studio: http://localhost:3000/admin`);
    console.log(`======================================================\n`);
  });
}
