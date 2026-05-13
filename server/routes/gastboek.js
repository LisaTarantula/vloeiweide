const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id,naam,woonplaats,bericht,created_at FROM gastboek WHERE goedgekeurd=1 ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/alle', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM gastboek ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { naam, woonplaats, bericht, email } = req.body;
    if (!naam || !bericht) return res.status(400).json({ error: 'Naam en bericht zijn verplicht' });
    await pool.query(
      'INSERT INTO gastboek (naam,woonplaats,bericht,email) VALUES ($1,$2,$3,$4)',
      [naam, woonplaats || null, bericht, email || null]
    );
    res.json({ success: true, bericht: 'Uw bericht is ontvangen en wacht op goedkeuring.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id/goedkeuren', auth, async (req, res) => {
  try {
    await pool.query('UPDATE gastboek SET goedgekeurd=1 WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM gastboek WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
