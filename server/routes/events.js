const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM events ORDER BY datum ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM events WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Niet gevonden' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { datum, titel, beschrijving, categorie, foto_url } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO events (datum,titel,beschrijving,categorie,foto_url) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [datum, titel, beschrijving, categorie || 'algemeen', foto_url || null]
    );
    res.json({ id: rows[0].id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { datum, titel, beschrijving, categorie, foto_url } = req.body;
    await pool.query(
      'UPDATE events SET datum=$1,titel=$2,beschrijving=$3,categorie=$4,foto_url=$5 WHERE id=$6',
      [datum, titel, beschrijving, categorie, foto_url, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
