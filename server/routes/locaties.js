const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM locaties ORDER BY naam ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { naam, beschrijving, lat, lng, categorie, foto_url } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO locaties (naam,beschrijving,lat,lng,categorie,foto_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [naam, beschrijving || null, lat, lng, categorie || 'locatie', foto_url || null]
    );
    res.json({ id: rows[0].id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { naam, beschrijving, lat, lng, categorie, foto_url } = req.body;
    await pool.query(
      'UPDATE locaties SET naam=$1,beschrijving=$2,lat=$3,lng=$4,categorie=$5,foto_url=$6 WHERE id=$7',
      [naam, beschrijving, lat, lng, categorie, foto_url, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM locaties WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
