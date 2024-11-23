const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());

// Configurer la connexion à MariaDB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'db_user', // Remplacez par votre utilisateur MariaDB
  password: 'esiroi974', // Remplacez par votre mot de passe
  database: 'pollution_db'
});

// Endpoint pour récupérer les données des stations
app.get('/stations', (req, res) => {
  const query = `
    SELECT p1.nom_station AS name, p1.x AS lat, p1.y AS lng, p1.pollutant AS gas, p1.concentration, p1.timestamp, p1.typologie
    FROM pollution_data p1
    INNER JOIN (
      SELECT nom_station, MAX(timestamp) AS latest
      FROM pollution_data
      GROUP BY nom_station
    ) p2 ON p1.nom_station = p2.nom_station AND p1.timestamp = p2.latest
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur SQL :', err);
      // res.status(500).send('Erreur lors de la récupération des données.');
    } else {
      // console.log('Données récupérées :', results); // Debug
      res.json(results);
    }
  });
});

app.get('/station-history', (req, res) => {
  const stationName = req.query.nom_station; // Nom de la station passé en paramètre
  const query = `
    SELECT concentration, DATE(timestamp) AS date
    FROM pollution_data
    WHERE nom_station = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 3 DAY)
    ORDER BY timestamp DESC
  `;
  db.query(query, [stationName], (err, results) => {
    if (err) {
      console.error('Erreur SQL :', err);
      res.status(500).send('Erreur lors de la récupération des données.');
    } else {
      res.json(results);
    }
  });
});


// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
