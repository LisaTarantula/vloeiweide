const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    res.json(db.prepare('SELECT id, naam, woonplaats, bericht, created_at FROM gastboek WHERE goedgekeurd=1 ORDER BY created_at DESC').all());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/alle', auth, (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM gastboek ORDER BY created_at DESC').all());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
  try {
    const { naam, woonplaats, bericht, email } = req.body;
    if (!naam || !bericht) return res.status(400).json({ error: 'Naam en bericht zijn verplicht' });
    db.prepare(
      'INSERT INTO gastboek (naam, woonplaats, bericht, email) VALUES (?, ?, ?, ?)'
    ).run(naam, woonplaats ?? null, bericht, email ?? null);
    res.json({ success: true, bericht: 'Uw bericht is ontvangen en wacht op goedkeuring.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id/goedkeuren', auth, (req, res) => {
  try {
    db.prepare('UPDATE gastboek SET goedgekeurd=1 WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, (req, res) => {
  try {
    db.prepare('DELETE FROM gastboek WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
