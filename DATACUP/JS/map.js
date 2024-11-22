// Initialiser la carte
const map = L.map('map').setView([-21.1151, 55.5364], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Simuler les points de données
const points = [
  { name: 'Lislet Geoffroy', lat: -20.889, lng: 55.469, status: '😊' },
  { name: 'Volcan', lat: -21.2, lng: 55.5, status: '😑' },
  { name: 'Bourg-Murat', lat: -21.3, lng: 55.6, status: '😡' },
];

// Ajouter des marqueurs sur la carte
points.forEach(point => {
  L.marker([point.lat, point.lng])
    .addTo(map)
    .bindPopup(`${point.name}<br>Status: ${point.status}`);
});

// Ajouter les points dans la liste
const pointsList = document.getElementById('points-list');
points.forEach(point => {
  const item = document.createElement('li');
  item.className = 'point-item';
  item.textContent = point.name;
  pointsList.appendChild(item);
});

// Gérer le menu déroulant de la légende
const legendButton = document.getElementById('legend-button');
const legendMenu = document.getElementById('legend-menu');

legendButton.addEventListener('click', () => {
  legendMenu.classList.toggle('visible');
});

// Gérer le dashboard
const dashboard = document.getElementById('dashboard');
pointsList.addEventListener('click', event => {
  const selectedPoint = points.find(p => p.name === event.target.textContent);
  if (selectedPoint) {
    document.getElementById('station-name').textContent = selectedPoint.name;
    document.getElementById('station-status').textContent = `Status: ${selectedPoint.status}`;
    dashboard.classList.add('visible');
  }
});
