const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM archief ORDER BY jaar DESC NULLS LAST, created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM archief WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Niet gevonden' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { titel, type, beschrijving, url, embed_url, thumbnail_url, jaar, bron } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO archief (titel,type,beschrijving,url,embed_url,thumbnail_url,jaar,bron) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [titel, type, beschrijving || null, url || null, embed_url || null, thumbnail_url || null, jaar || null, bron || null]
    );
    res.json({ id: rows[0].id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { titel, type, beschrijving, url, embed_url, thumbnail_url, jaar, bron } = req.body;
    await pool.query(
      'UPDATE archief SET titel=$1,type=$2,beschrijving=$3,url=$4,embed_url=$5,thumbnail_url=$6,jaar=$7,bron=$8 WHERE id=$9',
      [titel, type, beschrijving, url, embed_url, thumbnail_url, jaar, bron, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM archief WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
