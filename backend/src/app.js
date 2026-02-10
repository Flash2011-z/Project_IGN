const express = require('express');
const pool = require('./config/db');

const app = express();

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


app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
