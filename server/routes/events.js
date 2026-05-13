const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM events ORDER BY datum ASC').all());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Niet gevonden' });
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, (req, res) => {
  try {
    const { datum, titel, beschrijving, categorie, foto_url } = req.body;
    const r = db.prepare(
      'INSERT INTO events (datum, titel, beschrijving, categorie, foto_url) VALUES (?, ?, ?, ?, ?)'
    ).run(datum, titel, beschrijving, categorie || 'algemeen', foto_url || null);
    res.json({ id: Number(r.lastInsertRowid) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, (req, res) => {
  try {
    const { datum, titel, beschrijving, categorie, foto_url } = req.body;
    db.prepare(
      'UPDATE events SET datum=?, titel=?, beschrijving=?, categorie=?, foto_url=? WHERE id=?'
    ).run(datum, titel, beschrijving, categorie, foto_url, req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, (req, res) => {
  try {
    db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
