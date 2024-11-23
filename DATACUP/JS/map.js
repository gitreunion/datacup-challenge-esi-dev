// Initialiser la carte centrée sur la Réunion
const map = L.map('map').setView([-21.1151, 55.5364], 10);

// Ajouter une couche de tuiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Variable pour stocker les graphiques actifs
const activeCharts = {};

// Gérer le formulaire "S'inscrire"
const signUpButton = document.getElementById('sign-up-button');
const signUpModal = document.getElementById('sign-up-modal');
const closeModalButton = document.getElementById('close-modal');

// Ouvrir le formulaire d'inscription
signUpButton.addEventListener('click', () => {
  signUpModal.classList.add('visible');
});

// Fermer le formulaire d'inscription
closeModalButton.addEventListener('click', () => {
  signUpModal.classList.remove('visible');
});

// Soumettre le formulaire
const signUpForm = document.getElementById('sign-up-form');
signUpForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Empêcher le rechargement de la page
  const formData = new FormData(signUpForm);
  const name = formData.get('name');
  const email = formData.get('email');

  console.log(`Nom: ${name}, Email: ${email}`);
  alert(`Merci pour votre inscription, ${name} !`);

  // Fermer le modal après la soumission
  signUpModal.classList.remove('visible');
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
            const marker = L.marker([station.lng, station.lat])
              .addTo(map)
              // .bindPopup(popupContent);

            // Charger les données pour le graphique au clic sur le marqueur
            marker.on('click', () => {
              // Mettre à jour les informations de la station dans le dashboard
              document.getElementById('station-name').textContent = station.name;
              // document.getElementById('station-lat').textContent = `Latitude: ${station.lat}`;
              // document.getElementById('station-lng').textContent = `Longitude: ${station.lng}`;
              document.getElementById('station-typologie').textContent = `Typologie: ${station.typologie}`;
              document.getElementById('station-concentration').textContent = `Concentration actuelle: ${station.concentration}`;
              document.getElementById('station-S1').textContent = `Seuil d'information : ${station.S1}`;
              document.getElementById('station-S2').textContent = `Seuil de danger: ${station.S2}`;
              // Charger les données pour le graphique
              fetch(`http://localhost:3000/station-history?nom_station=${encodeURIComponent(station.name)}`)
                .then(response => response.json())
                .then(data => {
                  console.log(`Données historiques pour ${station.name} :`, data);
                  generateChart('dashboard-chart', data); // Générer le graphique dans le dashboard
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

  // Inverser les données pour que les timestamps les plus récents soient à droite
  const reversedData = data.reverse();
  const labels = reversedData.map(entry => {
    const date = new Date(entry.date);
    date.setHours(date.getHours() - 4); // Ajuster le décalage horaire si nécessaire
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  const concentrations = data.map(entry => entry.concentration < 0 ? 0 : entry.concentration); // Remplacer les négatifs par 0
  const maxConcentration = Math.max(...concentrations);
  const yMax = maxConcentration > 10 ? maxConcentration : 10;

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
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 8
          },
          title: {
            display: true,
            text: 'Date et Heure'
          }
        },
        y: {
          min: 0,
          max: yMax + 0.1 * yMax,
          ticks: {
            stepSize: yMax > 10 ? Math.ceil(yMax / 10) : 1
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
