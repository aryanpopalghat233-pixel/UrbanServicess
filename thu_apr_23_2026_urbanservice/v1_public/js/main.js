const API_BASE = 'http://localhost:5000/api';

async function loadServices() {
  try {
    const response = await fetch(`${API_BASE}/services`);
    const services = await response.json();
    
    const grid = document.getElementById('servicesGrid');
    if (grid) {
      grid.innerHTML = services.map(service => `
        <div class="service-card">
          <div class="service-icon">${service.icon}</div>
          <h3>${service.name}</h3>
          <p>₹${service.price}</p>
          <button onclick="bookService('${service.name}', ${service.price})" class="btn btn-primary">Book Now</button>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading services:', error);
  }
}

function bookService(serviceName, price) {
  const token = localStorage.getItem('token');
  if (!token) {
    showLoginModal('user');
    return;
  }
  window.location.href = `book-service.html?service=${serviceName}&price=${price}`;
}

function goToServices() {
  window.location.href = 'services.html';
}

function goToLogin() {
  const token = localStorage.getItem('token');
  if (!token) {
    showLoginModal('user');
  } else {
    window.location.href = 'book-service.html';
  }
}

function showLoginModal(type) {
  const modal = document.getElementById('authModal');
  const form = document.getElementById('authForm');
  
  form.innerHTML = `
    <h2>Login as ${type}</h2>
    <form onsubmit="handleLogin(event, '${type}')">
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="email" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="password" required>
      </div>
      <button type="submit" class="btn btn-primary btn-lg">Login</button>
      <p>Don't have account? <a href="#" onclick="showSignupModal('${type}')">Signup</a></p>
    </form>
  `;
  
  modal.style.display = 'block';
}

function showSignupModal(type) {
  const modal = document.getElementById('authModal');
  const form = document.getElementById('authForm');
  
  form.innerHTML = `
    <h2>Signup as ${type}</h2>
    <form onsubmit="handleSignup(event, '${type}')">
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="name" required>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="email" required>
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="tel" id="phone" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="password" required>
      </div>
      <button type="submit" class="btn btn-primary btn-lg">Signup</button>
      <p>Already have account? <a href="#" onclick="showLoginModal('${type}')">Login</a></p>
    </form>
  `;
  
  modal.style.display = 'block';
}

function showWorkerSignup() {
  window.location.href = 'worker-apply.html';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('authModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

// Load services on page load
if (document.getElementById('servicesGrid')) {
  loadServices();
}