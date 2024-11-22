const express = require('express');
const router = express.Router();
const pool = require('../db');

// Route pour récupérer les données des stations avec du dioxyde de soufre
router.get('/pollution_data', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT 
        nom_station AS name, 
        x AS lng, 
        y AS lat, 
        pollutant AS gaz, 
        concentration, 
        timestamp 
      FROM pollution_data 
      WHERE pollutant = 'Dioxyde de soufre'
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
