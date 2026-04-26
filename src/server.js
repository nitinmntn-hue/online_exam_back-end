require('dotenv').config();

const express = require("express");
const app = express();
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Start");
});

app.get('/test-db', async (req, res) => {
    console.log("API HIT");

    try {
        const [rows] = await db.query('SELECT 1');
        console.log("DB RESPONSE");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("DB Error");
    }
});

// ✅ Start server immediately
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// ✅ Async DB check (no callbacks)
(async () => {
    try {
        await db.query('SELECT 1');
        console.log('✅ Connected to MySQL!');
    } catch (err) {
        console.error('❌ DB error:', err);
    }
})();