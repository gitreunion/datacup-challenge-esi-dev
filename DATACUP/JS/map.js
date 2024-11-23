// Initialiser la carte centrée sur la Réunion
const map = L.map('map').setView([-21.1151, 55.5364], 10);

// Ajouter une couche de tuiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Variable pour stocker les graphiques actifs
const activeCharts = {};

// Gérer le menu déroulant de la légende
const legendButton = document.getElementById('legend-button');
const legendMenu = document.getElementById('legend-menu');

legendButton.addEventListener('click', () => {
  legendMenu.classList.toggle('visible');
});

// Charger les données des stations via l'API
fetch('http://localhost:3000/stations')
  .then(response => response.json())
  .then(stations => {
    console.log('Données reçues depuis l\'API :', stations);

    // Attacher un événement pour afficher les marqueurs uniquement lorsque "Dioxyde de Soufre" est sélectionné
    document.querySelectorAll('#gas-list button').forEach(button => {
      button.addEventListener('click', () => {
        const selectedGas = button.textContent;
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

        // Ajouter les marqueurs pour les stations filtrées
        filteredStations.forEach(station => {
          if (station.lat && station.lng) {
            const popupContent = `
              <div>
                <h3>${station.name}</h3>
                <p>Latitude: ${station.lat}</p>
                <p>Longitude: ${station.lng}</p>
                <p>Concentration actuelle : ${station.concentration}</p>
              </div>
            `;

            const marker = L.marker([station.lng, station.lat])
              .addTo(map)
              .bindPopup(popupContent);

            // Charger les données pour le graphique au clic sur le marqueur
            marker.on('click', () => {
              // Mettre à jour les informations de la station dans le dashboard
              document.getElementById('station-name').textContent = station.name;
              document.getElementById('station-lat').textContent = `Latitude: ${station.lat}`;
              document.getElementById('station-lng').textContent = `Longitude: ${station.lng}`;
              document.getElementById('station-concentration').textContent = `Concentration actuelle: ${station.concentration}`;

              // Charger les données pour le graphique
              fetch(`http://localhost:3000/station-history?nom_station=${encodeURIComponent(station.name)}`)
                .then(response => response.json())
                .then(data => {
                  console.log(`Données historiques pour ${station.name} :`, data);
                  generateChart('dashboard-chart', data); // Générer le graphique dans le dashboard
                })
                .catch(error => console.error('Erreur lors du chargement des données du graphique :', error));
            });

            // Ajouter un écouteur d'événement pour afficher le popup lors du clic sur un élément de la légende
            document.getElementById('legend-item-1').addEventListener('click', () => {
              marker.openPopup();
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

  // Inverser les données pour que les timestamps les plus récents soient à droite
  const reversedData = data.reverse();
  // Inverser les données pour que les timestamps les plus récents soient à droite
  const labels = reversedData.map(entry => {
    // Créer un objet Date à partir de la date de l'entrée
    const date = new Date(entry.date);
  
    // Retirer 4 heures si le décalage a déjà été appliqué (double UTC+4)
    date.setHours(date.getHours() - 4);
  
    // Formater la date correctement en "jour/mois/année heure:minute"
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });
  
  const concentrations = data.map(entry => entry.concentration < 0 ? 0 : entry.concentration); // Remplacer les négatifs par 0

  // Créer le nouveau graphique
  activeCharts[canvasId] = new Chart(document.getElementById(canvasId).getContext('2d'), {
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
      maintainAspectRatio: false, // Permet au canvas de s'adapter à son conteneur
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 8, // Limite le nombre de ticks affichés
          },
          title: {
            display: true,
            text: 'Date et Heure'
          }
        },
        y: {
          // beginAtZero: true,
          min: 0, // Minimum de l'axe des Y
          max: 10, // Maximum de l'axe des Y
          ticks: {
              stepSize: 1 // Incréments entre les valeurs de l'axe
          },
          title: {
            display: true,
            text: 'Concentration'
          }
        }
      }
    }
  });
}

