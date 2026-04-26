require('dotenv').config();

const express = require("express");
const app = express();
const db = require('./config/db');

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Start");
});

app.get('/test-db', (req, res) => {
  db.query('SELECT NOW() as time', (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// test DB connection
db.query('SELECT 1', (err) => {
    if (err) {
        console.error('❌ DB error:', err);
        process.exit(1);
    } else {
        console.log('✅ Connected to MySQL!');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
});