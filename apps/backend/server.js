const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-service',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'microservices',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'backend-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json([
      { id: 1, name: 'Sample Data 1', timestamp: result.rows[0].current_time },
      { id: 2, name: 'Sample Data 2', timestamp: result.rows[0].current_time },
      { id: 3, name: 'Sample Data 3', timestamp: result.rows[0].current_time }
    ]);
  } catch (error) {
    res.json([
      { id: 1, name: 'Sample Data 1', note: 'Database not connected' },
      { id: 2, name: 'Sample Data 2', note: 'Database not connected' }
    ]);
  }
});

app.get('/api/metrics', async (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(port, () => {
  console.log(`Backend API listening on port ${port}`);
});
