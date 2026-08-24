const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 1337;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend from localhost:3000, 5173, etc.
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

// Serve Admin UI static files
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Redirect root to /admin or API info
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// ====================
// REST API ENDPOINTS
// ====================

// 1. Health Check
app.get('/api/health', (req, res) => {
  const ventures = db.getVentures(true);
  res.json({
    status: 'ok',
    service: 'Techdome Headless CMS Engine',
    version: '2.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    records: {
      venturesCount: ventures.length,
      publishedCount: ventures.filter(v => v.published !== false).length
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

// 3. Ventures Endpoints
app.get('/api/ventures', (req, res) => {
  try {
    const includeDrafts = req.query.drafts === 'true';
    const stageFilter = req.query.stage;
    let ventures = db.getVentures(includeDrafts);

    if (stageFilter && stageFilter !== 'All') {
      ventures = ventures.filter(v => v.stage.toLowerCase() === stageFilter.toLowerCase());
    }

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
    const { name, tagline, one_liner, stage, description } = req.body;
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

// 4. Reset seed endpoint
app.post('/api/reset', (req, res) => {
  try {
    const resetData = db.resetToDefault();
    res.json({
      success: true,
      message: 'Database reset to default seed state',
      data: resetData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  🚀 Techdome Headless CMS Engine Running`);
  console.log(`  📡 REST API:    http://localhost:${PORT}/api`);
  console.log(`  🎛️  Admin Studio: http://localhost:${PORT}/admin`);
  console.log(`======================================================\n`);
});
