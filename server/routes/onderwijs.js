const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM onderwijs ORDER BY created_at DESC').all());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, (req, res) => {
  try {
    const { titel, type, beschrijving, doelgroep, download_url } = req.body;
    const r = db.prepare(
      'INSERT INTO onderwijs (titel, type, beschrijving, doelgroep, download_url) VALUES (?, ?, ?, ?, ?)'
    ).run(titel, type, beschrijving, doelgroep || null, download_url || null);
    res.json({ id: Number(r.lastInsertRowid) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, (req, res) => {
  try {
    const { titel, type, beschrijving, doelgroep, download_url } = req.body;
    db.prepare(
      'UPDATE onderwijs SET titel=?, type=?, beschrijving=?, doelgroep=?, download_url=? WHERE id=?'
    ).run(titel, type, beschrijving, doelgroep, download_url, req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, (req, res) => {
  try {
    db.prepare('DELETE FROM onderwijs WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
