const express = require('express');
const cors = require('cors'); 
const pool = require('./config/db');

const app = express();
app.use(cors());  // 👈 ADD THIS

app.use(express.json());

app.get('/', (req, res) => {
    res.send('GameZone API is running');
});


app.get('/games-with-publisher', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                g.game_id,
                g.title,
                g.release_year,
                p.publisher_name
            FROM game g
            JOIN publisher p ON g.publisher_id = p.publisher_id
        `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/games/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        g.game_id AS id,
        g.title,
        g.subtitle,
        g.avg_score AS score,
        g.release_year AS year,
        g.description,
        g.cover_url,
        g.accent_color,
        ARRAY_AGG(DISTINCT genre.genre_name) AS genres,
        ARRAY_AGG(DISTINCT platform.platform_name) AS platforms
      FROM game g
      LEFT JOIN game_genre gg ON g.game_id = gg.game_id
      LEFT JOIN genre ON gg.genre_id = genre.genre_id
      LEFT JOIN game_platform gp ON g.game_id = gp.game_id
      LEFT JOIN platform ON gp.platform_id = platform.platform_id
      WHERE g.game_id = $1
      GROUP BY g.game_id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});




app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/games', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
  g.game_id AS id,
  g.title,
  g.subtitle,
  g.avg_score AS score,
  g.release_year AS year,
  g.description,
  g.cover_url AS cover,
  g.accent_color AS accent,
  ARRAY_AGG(DISTINCT genre.genre_name) AS genres,
  ARRAY_AGG(DISTINCT platform.platform_name) AS platforms

      FROM game g
      LEFT JOIN game_genre gg ON g.game_id = gg.game_id
      LEFT JOIN genre ON gg.genre_id = genre.genre_id
      LEFT JOIN game_platform gp ON g.game_id = gp.game_id
      LEFT JOIN platform ON gp.platform_id = platform.platform_id
      GROUP BY g.game_id
    `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});



module.exports = app;
