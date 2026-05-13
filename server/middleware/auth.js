const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Niet geautoriseerd' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'vloeiweide_geheim');
    next();
  } catch {
    res.status(401).json({ error: 'Ongeldig of verlopen token' });
  }
};
