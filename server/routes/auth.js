const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { wachtwoord } = req.body;
  const correct = process.env.ADMIN_PASSWORD || 'admin123';
  const secret = process.env.JWT_SECRET || 'vloeiweide_geheim';
  if (wachtwoord !== correct) {
    return res.status(401).json({ error: 'Onjuist wachtwoord' });
  }
  const token = jwt.sign({ rol: 'beheerder' }, secret, { expiresIn: '24h' });
  res.json({ token });
});

module.exports = router;
