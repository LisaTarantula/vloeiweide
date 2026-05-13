require('dotenv').config();

async function main() {
  const { pool, init } = require('./database');

  console.log('Verbinden met database...');
  await pool.query('SELECT 1');
  console.log('Verbonden.');

  // Wis alle tabellen als ze al bestaan
  console.log('Bestaande data wissen (indien aanwezig)...');
  await pool.query(`
    DROP TABLE IF EXISTS events, verhalen, archief, locaties, gastboek,
                         publicaties, herdenkingen, onderwijs CASCADE
  `);
  console.log('Oud schema verwijderd.');

  console.log('Tabellen aanmaken en historische data laden...');
  await init();

  await pool.end();
  console.log('Gereed!');
}

main().catch(e => { console.error('Fout:', e.message); process.exit(1); });
