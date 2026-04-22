let map;
let userLocation = { lat: 28.7041, lng: 77.1025 }; // Default: Delhi

function initMap() {
  map = L.map('map').setView([userLocation.lat, userLocation.lng], 15);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // Get user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      userLocation.lat = position.coords.latitude;
      userLocation.lng = position.coords.longitude;
      map.setView([userLocation.lat, userLocation.lng], 15);
      
      L.marker([userLocation.lat, userLocation.lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        })
      }).addTo(map).bindPopup('Your Location');
    });
  }
}

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const service = urlParams.get('service') || document.getElementById('service').value;
  const price = parseFloat(urlParams.get('price')) || 299;

  const booking = {
    service,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    address: document.getElementById('address').value,
    latitude: userLocation.lat,
    longitude: userLocation.lng,
    amount: price
  };

  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(booking)
    });

    if (response.ok) {
      const data = await response.json();
      alert('Booking confirmed!');
      window.location.href = `track-worker.html?bookingId=${data._id}`;
    } else {
      alert('Booking failed');
    }
  } catch (error) {
    console.error('Booking error:', error);
    alert('Error creating booking');
  }
});

// Set minimum date to today
document.getElementById('date').min = new Date().toISOString().split('T')[0];

// Get service from URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('service')) {
  document.getElementById('service').value = urlParams.get('service');
  document.getElementById('amount').textContent = urlParams.get('price') || '299';
}

// Initialize map when page loads
window.addEventListener('load', initMap);