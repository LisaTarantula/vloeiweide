const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM archief ORDER BY jaar DESC, created_at DESC').all());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM archief WHERE id=?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Niet gevonden' });
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, (req, res) => {
  try {
    const { titel, type, beschrijving, url, embed_url, thumbnail_url, jaar, bron } = req.body;
    const r = db.prepare(
      'INSERT INTO archief (titel, type, beschrijving, url, embed_url, thumbnail_url, jaar, bron) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(titel, type, beschrijving || null, url || null, embed_url || null, thumbnail_url || null, jaar || null, bron || null);
    res.json({ id: Number(r.lastInsertRowid) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, (req, res) => {
  try {
    const { titel, type, beschrijving, url, embed_url, thumbnail_url, jaar, bron } = req.body;
    db.prepare(
      'UPDATE archief SET titel=?, type=?, beschrijving=?, url=?, embed_url=?, thumbnail_url=?, jaar=?, bron=? WHERE id=?'
    ).run(titel, type, beschrijving, url, embed_url, thumbnail_url, jaar, bron, req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, (req, res) => {
  try {
    db.prepare('DELETE FROM archief WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
