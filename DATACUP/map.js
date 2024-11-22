// Initialiser la carte centrée sur la Réunion
const map = L.map('map').setView([-21.1151, 55.5364], 10);

// Ajouter une couche de tuiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Charger les données des stations via l'API
// Charger les données des stations via l'API
fetch('http://localhost:3000/stations')
  .then(response => response.json())
  .then(stations => {
    console.log('Données reçues depuis l\'API :', stations);

    document.querySelectorAll('#gas-list li').forEach(item => {
      item.addEventListener('click', () => {
        const selectedGas = item.textContent;
        console.log('Gaz sélectionné :', selectedGas);

        // Supprimer tous les marqueurs existants de la carte
        map.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        // Filtrer les stations correspondant au gaz sélectionné
        const filteredStations = stations.filter(station => station.gas === selectedGas);
        console.log('Stations filtrées :', filteredStations);

        filteredStations.forEach(station => {
          if (station.lat && station.lng) {
            const chartId = `chart-${station.id}`;

            const popupContent = `
              <div>
                <h3>${station.name}</h3>
                <p>Latitude: ${station.lat}</p>
                <p>Longitude: ${station.lng}</p>
                <p>Concentration actuelle : ${station.concentration}</p>
                <canvas id="${chartId}" width="400" height="200"></canvas>
              </div>
            `;

            const marker = L.marker([station.lng, station.lat])
              .addTo(map)
              .bindPopup(popupContent);

            // Charger les données pour le graphique au clic sur le marqueur
            marker.on('popupopen', () => {
              setTimeout(() => { // Assure que le DOM est prêt
                const canvas = document.getElementById(chartId);
                if (!canvas) {
                  console.error(`Canvas introuvable pour l'ID ${chartId}`);
                  return;
                }

                fetch(`http://localhost:3000/station-history?nom_station=${encodeURIComponent(station.name)}`)
                  .then(response => response.json())
                  .then(data => {
                    console.log(`Données historiques pour ${station.name} :`, data);
                    generateChart(chartId, data); // Générer le graphique
                  })
                  .catch(error => console.error('Erreur lors du chargement des données du graphique :', error));
              }, 10);
            });
          }
        });
      });
    });
  })
  .catch(error => console.error('Erreur lors du chargement des stations :', error));

// Fonction pour générer le graphique
function generateChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  
  // Supprime l'ancien graphique s'il existe
  if (canvas.chartInstance) {
    canvas.chartInstance.destroy();
  }

  // Prépare le contexte du canvas
  const ctx = canvas.getContext('2d');
  
  // Extraire les labels et les données
  const labels = data.map(entry => entry.date);
  const concentrations = data.map(entry => entry.concentration);

  // Crée un nouveau graphique
  const newChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Concentration',
        data: concentrations,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Attache l'instance du graphique au canvas pour une gestion future
  canvas.chartInstance = newChart;
}