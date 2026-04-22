let map;
let workerMarker;
const socket = io();

function initTrackingMap() {
  map = L.map('map').setView([28.7041, 77.1025], 15);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // Listen for worker location updates
  socket.on('workerLocation', (data) => {
    if (workerMarker) {
      workerMarker.setLatLng([data.latitude, data.longitude]);
    } else {
      workerMarker = L.marker([data.latitude, data.longitude], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        })
      }).addTo(map).bindPopup('Worker Location');
    }
    
    map.setView([data.latitude, data.longitude], 15);
    document.getElementById('status').textContent = 'On the way';
  });

  // Get booking ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get('bookingId');
  
  if (bookingId) {
    loadBookingLocation(bookingId);
  }
}

async function loadBookingLocation(bookingId) {
  try {
    const response = await fetch(`${API_BASE}/workers/location/${bookingId}`);
    const location = await response.json();
    
    if (location) {
      document.getElementById('workerName').textContent = location.workerId?.name || 'Loading...';
      document.getElementById('eta').textContent = '15 mins';
    }
  } catch (error) {
    console.error('Error loading location:', error);
  }
}

window.addEventListener('load', initTrackingMap);