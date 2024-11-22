// Initialiser la carte centrée sur la Réunion
const map = L.map('map').setView([-21.1151, 55.5364], 10);

// Ajouter une couche de tuiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Variable pour stocker les graphiques actifs
const activeCharts = {};

// Charger les données des stations via l'API
fetch('http://localhost:3000/stations')
  .then(response => response.json())
  .then(stations => {
    console.log('Données reçues depuis l\'API :', stations);

    // Attacher un événement pour afficher les marqueurs uniquement lorsque "Dioxyde de Soufre" est sélectionné
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

        // Vérifier si le gaz sélectionné est "Dioxyde de Soufre"
        // if (selectedGas !== 'Dioxyde de Soufre') {
        //   console.log('Aucune action pour ce gaz.');
        //   return;
        // }

        // Filtrer les stations correspondant au gaz sélectionné
        const filteredStations = stations.filter(station => station.gas === selectedGas);
        console.log('Stations filtrées :', filteredStations);

        // if (filteredStations.length === 0) {
        //   console.log('Aucune station pour ce gaz.');
        // }

        // Ajouter les marqueurs pour les stations filtrées
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
              fetch(`http://localhost:3000/station-history?nom_station=${encodeURIComponent(station.name)}`)
                .then(response => response.json())
                .then(data => {
                  console.log(`Données historiques pour ${station.name} :`, data);
                  generateChart(chartId, data); // Générer le graphique
                })
                .catch(error => console.error('Erreur lors du chargement des données du graphique :', error));
            });
          }
        });
      });
    });
  })
  .catch(error => console.error('Erreur lors du chargement des stations :', error));

// Fonction pour générer le graphique
function generateChart(canvasId, data) {
  // Vérifier si un graphique existe déjà pour ce canvas
  if (activeCharts[canvasId]) {
    activeCharts[canvasId].destroy(); // Détruire l'ancien graphique
  }

  const ctx = document.getElementById(canvasId).getContext('2d');
  const labels = data.map(entry => entry.date);
  const concentrations = data.map(entry => entry.concentration);

  // Créer le nouveau graphique
  activeCharts[canvasId] = new Chart(ctx, {
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
}
