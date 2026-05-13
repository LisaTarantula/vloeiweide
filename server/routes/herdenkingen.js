const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM herdenkingen ORDER BY datum ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { titel, datum, beschrijving, locatie, foto_url, jaarlijks } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO herdenkingen (titel,datum,beschrijving,locatie,foto_url,jaarlijks) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [titel, datum, beschrijving || null, locatie || null, foto_url || null, jaarlijks ? 1 : 0]
    );
    res.json({ id: rows[0].id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { titel, datum, beschrijving, locatie, foto_url, jaarlijks } = req.body;
    await pool.query(
      'UPDATE herdenkingen SET titel=$1,datum=$2,beschrijving=$3,locatie=$4,foto_url=$5,jaarlijks=$6 WHERE id=$7',
      [titel, datum, beschrijving, locatie, foto_url, jaarlijks ? 1 : 0, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM herdenkingen WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
