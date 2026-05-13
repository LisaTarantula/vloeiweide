require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { init } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/verhalen', require('./routes/verhalen'));
app.use('/api/archief', require('./routes/archief'));
app.use('/api/locaties', require('./routes/locaties'));
app.use('/api/gastboek', require('./routes/gastboek'));
app.use('/api/publicaties', require('./routes/publicaties'));
app.use('/api/herdenkingen', require('./routes/herdenkingen'));
app.use('/api/onderwijs', require('./routes/onderwijs'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));

app.listen(PORT, () => {
  console.log(`Vloeiweide server draait op poort ${PORT}`);
  init()
    .then(() => console.log('Database gereed.'))
    .catch(err => { console.error('Database fout:', err.message); process.exit(1); });
});
