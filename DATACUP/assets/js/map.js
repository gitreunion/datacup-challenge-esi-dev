// Initialiser la carte centrée sur la Réunion
const map = L.map('map').setView([-21.1151, 55.5364], 10);

// Ajouter une couche de tuiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fonction pour charger les stations dynamiquement depuis le backend
async function loadStations() {
  try {
    // Appel à l'API pour récupérer les données
    const response = await fetch('http://localhost:5001/api/pollution_data');
    const stations = await response.json();

    // Ajouter les stations sur la carte
    stations.forEach(station => {
      L.marker([station.lat, station.lng])
        .addTo(map)
        .bindPopup(`
          <strong>${station.name}</strong><br>
          Gaz : ${station.gaz}<br>
          Concentration : ${station.concentration} µg/m³<br>
          Date : ${new Date(station.timestamp).toLocaleString()}
        `);
    });
  } catch (err) {
    console.error('Erreur lors du chargement des stations :', err);
  }
}

// Charger les stations au chargement de la carte
loadStations();
