// Wis alle tabellen en laad de voorbeelddata opnieuw
// Gebruik: node reset-seed.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function reset() {
  console.log('Tabellen wissen...');
  await pool.query(`
    TRUNCATE events, verhalen, archief, locaties, gastboek,
             publicaties, herdenkingen, onderwijs
    RESTART IDENTITY CASCADE
  `);
  console.log('Klaar. Server opnieuw starten om seed data te laden...');
  await pool.end();
}

reset().catch(e => { console.error(e); process.exit(1); });
