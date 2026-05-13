const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM publicaties ORDER BY jaar DESC NULLS LAST');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { titel, type, auteur, beschrijving, jaar, isbn, cover_url, koop_url } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO publicaties (titel,type,auteur,beschrijving,jaar,isbn,cover_url,koop_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [titel, type, auteur || null, beschrijving || null, jaar || null, isbn || null, cover_url || null, koop_url || null]
    );
    res.json({ id: rows[0].id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { titel, type, auteur, beschrijving, jaar, isbn, cover_url, koop_url } = req.body;
    await pool.query(
      'UPDATE publicaties SET titel=$1,type=$2,auteur=$3,beschrijving=$4,jaar=$5,isbn=$6,cover_url=$7,koop_url=$8 WHERE id=$9',
      [titel, type, auteur, beschrijving, jaar, isbn, cover_url, koop_url, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM publicaties WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
