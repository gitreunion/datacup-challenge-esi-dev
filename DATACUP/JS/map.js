// Initialiser la carte centrée sur la Réunion
const map = L.map('map').setView([-21.1151, 55.5364], 10);
// Ajouter une couche de tuiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


//Dashboard




// Charger les données des stations via l'API
fetch('http://localhost:3000/stations')
  .then(response => response.json())
  .then(stations => {
    console.log('Données reçues depuis l\'API :', stations);

    // Attacher des événements pour chaque gaz
    document.querySelectorAll('#gas-list li').forEach(item => {
      item.addEventListener('click', () => {
        const selectedGas = item.textContent.trim();
        console.log('Gaz sélectionné :', selectedGas);

        // Supprimer les marqueurs existants
        map.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        // Ajouter les marqueurs pour le gaz sélectionné
        const filteredStations = stations.filter(station => station.gas === selectedGas);
        console.log('Stations filtrées :', filteredStations);

        if (filteredStations.length === 0) {
          console.log('Aucune station pour ce gaz.');
        }

        filteredStations.forEach(station => {
          if (station.lat && station.lng) {
            const popupContent = `
            <div>
              <h3>Station Information</h3>
              <p>Latitude: ${station.lat}</p>
              <p>Longitude: ${station.lng}</p>
              <p>Valeur: ${station.concentration}</p>
              <div id="chart-${station.id}"></div>
            </div>
          `;
            console.log(station.lat , station)
            L.marker([station.lng , station.lat])
              .addTo(map)
              .bindPopup(popupContent);
            // L.marker([-21.15, 55.5]).addTo(map).bindPopup('Test Marker')

          }
        });
      });
    });
  })
  .catch(error => console.error('Erreur lors du chargement des stations :', error));