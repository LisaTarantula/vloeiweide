const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM locaties ORDER BY naam ASC').all());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, (req, res) => {
  try {
    const { naam, beschrijving, lat, lng, categorie, foto_url } = req.body;
    const r = db.prepare(
      'INSERT INTO locaties (naam, beschrijving, lat, lng, categorie, foto_url) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(naam, beschrijving || null, lat, lng, categorie || 'locatie', foto_url || null);
    res.json({ id: Number(r.lastInsertRowid) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, (req, res) => {
  try {
    const { naam, beschrijving, lat, lng, categorie, foto_url } = req.body;
    db.prepare(
      'UPDATE locaties SET naam=?, beschrijving=?, lat=?, lng=?, categorie=?, foto_url=? WHERE id=?'
    ).run(naam, beschrijving, lat, lng, categorie, foto_url, req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, (req, res) => {
  try {
    db.prepare('DELETE FROM locaties WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
