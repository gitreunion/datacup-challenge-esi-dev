require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stationRoutes = require('./routes/stations');

const app = express();

app.get('/', (req, res) => {
  res.send('Serveur actif');
});

app.get('/api', (req, res) => {
  res.send('API active');
});


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', stationRoutes);

// Démarrer le serveur
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
