const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM verhalen WHERE gepubliceerd=1 ORDER BY created_at DESC').all());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/alle', auth, (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM verhalen ORDER BY created_at DESC').all());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM verhalen WHERE id=?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Niet gevonden' });
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, (req, res) => {
  try {
    const { titel, auteur, inhoud, samenvatting, foto_url, categorie, gepubliceerd } = req.body;
    const r = db.prepare(
      'INSERT INTO verhalen (titel, auteur, inhoud, samenvatting, foto_url, categorie, gepubliceerd) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(titel, auteur, inhoud, samenvatting || null, foto_url || null, categorie || 'verhaal', gepubliceerd !== undefined ? gepubliceerd : 1);
    res.json({ id: Number(r.lastInsertRowid) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, (req, res) => {
  try {
    const { titel, auteur, inhoud, samenvatting, foto_url, categorie, gepubliceerd } = req.body;
    db.prepare(
      'UPDATE verhalen SET titel=?, auteur=?, inhoud=?, samenvatting=?, foto_url=?, categorie=?, gepubliceerd=? WHERE id=?'
    ).run(titel, auteur, inhoud, samenvatting, foto_url, categorie, gepubliceerd, req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, (req, res) => {
  try {
    db.prepare('DELETE FROM verhalen WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
