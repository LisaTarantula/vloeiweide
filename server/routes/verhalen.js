const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM verhalen WHERE gepubliceerd=1 ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/alle', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM verhalen ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM verhalen WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Niet gevonden' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { titel, auteur, inhoud, samenvatting, foto_url, categorie, gepubliceerd } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO verhalen (titel,auteur,inhoud,samenvatting,foto_url,categorie,gepubliceerd) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [titel, auteur, inhoud, samenvatting || null, foto_url || null, categorie || 'verhaal', gepubliceerd !== undefined ? gepubliceerd : 1]
    );
    res.json({ id: rows[0].id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { titel, auteur, inhoud, samenvatting, foto_url, categorie, gepubliceerd } = req.body;
    await pool.query(
      'UPDATE verhalen SET titel=$1,auteur=$2,inhoud=$3,samenvatting=$4,foto_url=$5,categorie=$6,gepubliceerd=$7 WHERE id=$8',
      [titel, auteur, inhoud, samenvatting, foto_url, categorie, gepubliceerd, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM verhalen WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
