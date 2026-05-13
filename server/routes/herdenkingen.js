const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM herdenkingen ORDER BY datum ASC').all());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, (req, res) => {
  try {
    const { titel, datum, beschrijving, locatie, foto_url, jaarlijks } = req.body;
    const r = db.prepare(
      'INSERT INTO herdenkingen (titel, datum, beschrijving, locatie, foto_url, jaarlijks) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(titel, datum, beschrijving || null, locatie || null, foto_url || null, jaarlijks ? 1 : 0);
    res.json({ id: Number(r.lastInsertRowid) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, (req, res) => {
  try {
    const { titel, datum, beschrijving, locatie, foto_url, jaarlijks } = req.body;
    db.prepare(
      'UPDATE herdenkingen SET titel=?, datum=?, beschrijving=?, locatie=?, foto_url=?, jaarlijks=? WHERE id=?'
    ).run(titel, datum, beschrijving, locatie, foto_url, jaarlijks ? 1 : 0, req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, (req, res) => {
  try {
    db.prepare('DELETE FROM herdenkingen WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
