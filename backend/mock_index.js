require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/project_ign'
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM users LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

const port = process.env.PORT || 4000;
const server = app.listen(port, () => console.log(`Server listening on ${port}`));

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down...`);
  try {
    server.close(async (err) => {
      if (err) {
        console.error('Error closing server', err);
        process.exit(1);
      }
      try {
        await pool.end();
        console.log('Postgres pool has ended');
        process.exit(0);
      } catch (e) {
        console.error('Error ending Postgres pool', e);
        process.exit(1);
      }
    });
    // Force exit if shutdown takes too long
    setTimeout(() => {
      console.error('Shutdown timeout, forcing exit');
      process.exit(1);
    }, 10000);
  } catch (e) {
    console.error('Failed during shutdown', e);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
