const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM onderwijs ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { titel, type, beschrijving, doelgroep, download_url } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO onderwijs (titel,type,beschrijving,doelgroep,download_url) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [titel, type, beschrijving, doelgroep || null, download_url || null]
    );
    res.json({ id: rows[0].id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { titel, type, beschrijving, doelgroep, download_url } = req.body;
    await pool.query(
      'UPDATE onderwijs SET titel=$1,type=$2,beschrijving=$3,doelgroep=$4,download_url=$5 WHERE id=$6',
      [titel, type, beschrijving, doelgroep, download_url, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM onderwijs WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
