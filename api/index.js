// Vercel Serverless Function Handler
// Mounts Techdome Headless REST CMS Express Engine on Vercel at /api/*
const app = require('../cms/server');

module.exports = (req, res) => {
  return app(req, res);
};
