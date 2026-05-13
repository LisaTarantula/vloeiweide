const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM publicaties ORDER BY jaar DESC').all());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, (req, res) => {
  try {
    const { titel, type, auteur, beschrijving, jaar, isbn, cover_url, koop_url } = req.body;
    const r = db.prepare(
      'INSERT INTO publicaties (titel, type, auteur, beschrijving, jaar, isbn, cover_url, koop_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(titel, type, auteur || null, beschrijving || null, jaar || null, isbn || null, cover_url || null, koop_url || null);
    res.json({ id: Number(r.lastInsertRowid) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, (req, res) => {
  try {
    const { titel, type, auteur, beschrijving, jaar, isbn, cover_url, koop_url } = req.body;
    db.prepare(
      'UPDATE publicaties SET titel=?, type=?, auteur=?, beschrijving=?, jaar=?, isbn=?, cover_url=?, koop_url=? WHERE id=?'
    ).run(titel, type, auteur, beschrijving, jaar, isbn, cover_url, koop_url, req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, (req, res) => {
  try {
    db.prepare('DELETE FROM publicaties WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
