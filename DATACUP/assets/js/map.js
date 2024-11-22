// Initialiser la carte centrée sur la Réunion
const map = L.map('map').setView([-21.1151, 55.5364], 10);

// Ajouter une couche de tuiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Exemple de stations (données statiques pour le moment)
const stations = [
  {
    name: "Lislet Geoffroy",
    lat: -20.889822,
    lng: 55.469112,
    gas: "Dioxyde de soufre"
  },
  {
    name: "Paradis",
    lat: -21.312786,
    lng: 55.47407,
    gas: "Monoxyde d'azote"
  },
  {
    name: "Joinville",
    lat: -20.884575,
    lng: 55.453907,
    gas: "Particules PM10"
  },
  {
    name: "Le Port",
    lat: -20.941,
    lng: 55.286,
    gas: "Ozone (O3)"
  }
];

// Afficher toutes les stations au chargement
stations.forEach(station => {
  L.marker([station.lat, station.lng])
    .addTo(map)
    .bindPopup(`<strong>${station.name}</strong><br>Gaz : ${station.gas}`);
});

// Fonction pour filtrer et afficher uniquement les stations d'un gaz spécifique
function filterStationsByGas(selectedGas) {
  // Supprimer tous les marqueurs actuels
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Ajouter uniquement les stations correspondant au gaz sélectionné
  stations
    .filter(station => station.gas === selectedGas)
    .forEach(station => {
      L.marker([station.lat, station.lng])
        .addTo(map)
        .bindPopup(`<strong>${station.name}</strong><br>Gaz : ${station.gas}`);
    });
}

// Ajouter des événements au clic sur les éléments de la liste des gaz
document.querySelectorAll('#gas-list li').forEach(item => {
  item.addEventListener('click', () => {
    const selectedGas = item.textContent;
    filterStationsByGas(selectedGas);
  });
});
